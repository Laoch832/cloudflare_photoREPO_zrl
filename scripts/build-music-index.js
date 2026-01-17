import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mm from 'music-metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, '../public/music');
const coversDir = path.join(__dirname, '../public/music/covers');
const outputFile = path.join(__dirname, '../public/music.json');

// Supported formats (User specifically asked for FLAC, but good to support others too)
const extensions = ['.flac', '.mp3', '.wav', '.ogg'];

async function generate() {
  try {
    if (!fs.existsSync(musicDir)) {
      console.log('Music directory not found, creating empty index.');
      fs.writeFileSync(outputFile, JSON.stringify([]));
      process.exit(0);
    }

    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }

    const files = fs.readdirSync(musicDir);
    const musicFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext) && !file.startsWith('.');
    });

    const musicData = [];

    console.log(`Found ${musicFiles.length} music files.`);

    for (const file of musicFiles) {
      const filePath = path.join(musicDir, file);
      const stats = fs.statSync(filePath);
      
      let metadata = {
        title: path.basename(file, path.extname(file)),
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        duration: 0,
        cover: null
      };

      try {
        const tags = await mm.parseFile(filePath);
        const common = tags.common;
        const format = tags.format;

        if (common.title) metadata.title = common.title;
        if (common.artist) metadata.artist = common.artist;
        if (common.album) metadata.album = common.album;
        if (format.duration) metadata.duration = format.duration;

        // Extract Cover Art
        if (common.picture && common.picture.length > 0) {
          const picture = common.picture[0];
          const coverExt = picture.format === 'image/jpeg' ? '.jpg' : '.png';
          const coverName = `${path.basename(file, path.extname(file))}_cover${coverExt}`;
          const coverPath = path.join(coversDir, coverName);

          // Write cover file if not exists
          if (!fs.existsSync(coverPath)) {
            fs.writeFileSync(coverPath, picture.data);
            console.log(`Extracted cover for ${file}`);
          }
          metadata.cover = coverName; // Store filename only temporarily
        }
      } catch (err) {
        console.error(`Error parsing metadata for ${file}:`, err.message);
      }

      musicData.push({
        id: Buffer.from(file).toString('base64'), // Simple ID
        filename: file,
        url: `/music/${encodeURIComponent(file)}`,
        ...metadata,
        cover: metadata.cover ? `/music/covers/${encodeURIComponent(metadata.cover)}` : null,
        uploadedAt: stats.mtime.toISOString()
      });
    }

    fs.writeFileSync(outputFile, JSON.stringify(musicData, null, 2));
    console.log(`Generated index for ${musicData.length} tracks.`);
  } catch (err) {
    console.error('Error generating music index:', err);
    process.exit(1);
  }
}

generate();