import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, '../public/music');
const coversDir = path.join(__dirname, '../public/music/covers');
const hlsDir = path.join(__dirname, '../public/music/hls');
const lyricsDir = path.join(__dirname, '../public/music/lyrics');
const outputFile = path.join(__dirname, '../public/music.json');

async function generate() {
  try {
    if (!fs.existsSync(hlsDir)) {
        console.log('HLS directory not found.');
        fs.writeFileSync(outputFile, JSON.stringify([]));
        return;
    }

    const musicData = [];
    const hlsFolders = fs.readdirSync(hlsDir).filter(f => fs.statSync(path.join(hlsDir, f)).isDirectory());

    console.log(`Found ${hlsFolders.length} HLS albums/tracks.`);

    for (const folder of hlsFolders) {
      // The folder name is the "safe name" (e.g. "Artist_-_Title")
      // We need to find the ID. 
      // Strategy: Scan lyrics directory for a file that decodes to something matching this folder?
      // Or simply iterate lyrics directory and see which one matches?
      
      // Better strategy: We can't easily know the original extension from the HLS folder name.
      // However, we can try to find a matching lyrics file.
      // The lyrics files are named BASE64(filename.ext).lrc
      
      let id = null;
      let originalFilename = folder; // Fallback
      let extension = '';

      if (fs.existsSync(lyricsDir)) {
          const lyricsFiles = fs.readdirSync(lyricsDir);
          for (const lrc of lyricsFiles) {
              if (lrc.endsWith('.lrc')) {
                  const base64Name = lrc.replace('.lrc', '');
                  try {
                      const decoded = Buffer.from(base64Name, 'base64').toString('utf8');
                      // Check if decoded filename starts with the folder name (ignoring extension)
                      // The folder name was created by: name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '')
                      // Let's assume the folder name IS the sanitized filename without extension.
                      
                      const decodedBase = path.basename(decoded, path.extname(decoded));
                      // We need to sanitize the decoded base to compare with folder
                      const sanitizedDecoded = decodedBase.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '');
                      
                      if (sanitizedDecoded === folder) {
                          id = base64Name;
                          originalFilename = decoded;
                          extension = path.extname(decoded);
                          break;
                      }
                  } catch (e) {}
              }
          }
      }

      // If no lyrics found, generate a fake ID based on folder name (might break lyrics sync if later added)
      if (!id) {
          id = Buffer.from(folder).toString('base64');
      }

      // Parse Metadata from Filename (Artist - Title)
      // Format usually: Artist_-_Title or Artist-Title
      let artist = 'Unknown Artist';
      let title = folder.replace(/_/g, ' ');
      
      // Try to split by - 
      // The folder name often preserves the structure "Artist_-_Title"
      const parts = folder.split(/_-_|-/);
      if (parts.length >= 2) {
          artist = parts[0].replace(/_/g, ' ').trim();
          title = parts.slice(1).join('-').replace(/_/g, ' ').trim();
      }

      // Check for cover
      // Covers are usually named: safeName_cover.jpg or .png
      let cover = null;
      const jpgCover = path.join(coversDir, `${folder}_cover.jpg`);
      const pngCover = path.join(coversDir, `${folder}_cover.png`);
      
      if (fs.existsSync(jpgCover)) {
          cover = `${folder}_cover.jpg`;
      } else if (fs.existsSync(pngCover)) {
          cover = `${folder}_cover.png`;
      } else {
          // Fallback: check for any image starting with folder name
          if (fs.existsSync(coversDir)) {
             const allCovers = fs.readdirSync(coversDir);
             const match = allCovers.find(c => c.startsWith(folder));
             if (match) cover = match;
          }
      }

      musicData.push({
        id: id,
        filename: originalFilename,
        url: `/music/hls/${encodeURIComponent(folder)}/${encodeURIComponent(folder)}.m3u8`,
        originalUrl: null, // Source file missing
        isHls: true,
        title: title,
        artist: artist,
        album: 'Unknown Album',
        duration: 0, // Cannot determine without source or parsing m3u8
        cover: cover ? `/music/covers/${encodeURIComponent(cover)}` : null,
        uploadedAt: new Date().toISOString()
      });
    }

    fs.writeFileSync(outputFile, JSON.stringify(musicData, null, 2));
    console.log(`Generated index for ${musicData.length} tracks from HLS.`);
  } catch (err) {
    console.error('Error generating music index:', err);
    process.exit(1);
  }
}

generate();
