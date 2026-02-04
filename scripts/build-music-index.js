import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持从外部目录读取（Docker 部署时使用）
const EXTERNAL_MUSIC_DIR = process.env.EXTERNAL_MUSIC_DIR || '/lhcos-data/zrl-app/music';
const PUBLIC_MUSIC_DIR = path.join(__dirname, '../public/music');
const outputFile = path.join(__dirname, '../public/music.json');

async function generate() {
  try {
    // 决定使用哪个目录作为源
    let musicDir = PUBLIC_MUSIC_DIR;
    
    // 如果外部目录存在，优先使用外部目录
    if (fs.existsSync(EXTERNAL_MUSIC_DIR)) {
      console.log(`Using external music directory: ${EXTERNAL_MUSIC_DIR}`);
      musicDir = EXTERNAL_MUSIC_DIR;
    }
    
    const hlsDir = path.join(musicDir, 'hls');
    const coversDir = path.join(musicDir, 'covers');
    const lyricsDir = path.join(musicDir, 'lyrics');
    
    if (!fs.existsSync(hlsDir)) {
        console.log('HLS directory not found.');
        fs.writeFileSync(outputFile, JSON.stringify([]));
        return;
    }

    const musicData = [];
    const hlsFolders = fs.readdirSync(hlsDir).filter(f => fs.statSync(path.join(hlsDir, f)).isDirectory());

    console.log(`Found ${hlsFolders.length} HLS albums/tracks.`);

    for (const folder of hlsFolders) {
      let id = null;
      let originalFilename = folder;
      let extension = '';

      if (fs.existsSync(lyricsDir)) {
          const lyricsFiles = fs.readdirSync(lyricsDir);
          for (const lrc of lyricsFiles) {
              if (lrc.endsWith('.lrc')) {
                  const base64Name = lrc.replace('.lrc', '');
                  try {
                      const decoded = Buffer.from(base64Name, 'base64').toString('utf8');
                      const decodedBase = path.basename(decoded, path.extname(decoded));
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

      if (!id) {
          id = Buffer.from(folder).toString('base64');
      }

      let artist = 'Unknown Artist';
      let title = folder.replace(/_/g, ' ');
      
      const parts = folder.split(/_-_|-/);
      if (parts.length >= 2) {
          artist = parts[0].replace(/_/g, ' ').trim();
          title = parts.slice(1).join('-').replace(/_/g, ' ').trim();
      }

      let cover = null;
      const jpgCover = path.join(coversDir, `${folder}_cover.jpg`);
      const pngCover = path.join(coversDir, `${folder}_cover.png`);
      
      if (fs.existsSync(jpgCover)) {
          cover = `${folder}_cover.jpg`;
      } else if (fs.existsSync(pngCover)) {
          cover = `${folder}_cover.png`;
      } else {
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
        originalUrl: null,
        isHls: true,
        title: title,
        artist: artist,
        album: 'Unknown Album',
        duration: 0,
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
