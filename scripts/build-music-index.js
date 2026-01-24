import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mm from 'music-metadata';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, '../assets-src/music');
const publicMusicDir = path.join(__dirname, '../public/music');
const coversDir = path.join(__dirname, '../public/music/covers');
const hlsDir = path.join(__dirname, '../public/music/hls');
const outputFile = path.join(__dirname, '../public/music.json');

// Supported formats
const extensions = ['.flac', '.mp3', '.wav', '.ogg'];

// Helper to convert to HLS
const convertToHls = (inputPath, outputDir, fileNameBase) => {
  return new Promise((resolve, reject) => {
    const outputPlaylist = path.join(outputDir, `${fileNameBase}.m3u8`);
    
    // Skip if already exists (basic caching)
    if (fs.existsSync(outputPlaylist)) {
      return resolve(outputPlaylist);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Transcoding ${fileNameBase} to HLS...`);
    
    ffmpeg(inputPath)
      .outputOptions([
        '-c:a aac',           // Use AAC for audio
        '-b:a 192k',          // 192k bitrate
        '-f hls',             // Format HLS
        '-hls_time 10',       // 10 second segments
        '-hls_list_size 0',   // Keep all segments in playlist
        '-hls_segment_filename', path.join(outputDir, `${fileNameBase}_%03d.ts`)
      ])
      .output(outputPlaylist)
      .on('end', () => {
        console.log(`Finished transcoding ${fileNameBase}`);
        resolve(outputPlaylist);
      })
      .on('error', (err) => {
        console.error(`Error transcoding ${fileNameBase}:`, err);
        reject(err);
      })
      .run();
  });
};

async function generate() {
  try {
    if (!fs.existsSync(musicDir)) {
      console.log('Music source directory not found, creating empty index.');
      fs.writeFileSync(outputFile, JSON.stringify([]));
      process.exit(0);
    }

    if (!fs.existsSync(publicMusicDir)) {
        fs.mkdirSync(publicMusicDir, { recursive: true });
    }

    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }
    
    if (!fs.existsSync(hlsDir)) {
        fs.mkdirSync(hlsDir, { recursive: true });
    }

    // Auto-rename files to be web-safe
    const rawFiles = fs.readdirSync(musicDir);
    for (const file of rawFiles) {
      if (file === 'covers' || file === 'hls') continue;
      // Replace spaces with underscores, remove special chars like ', (, )
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const safeName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '') + ext;
      
      if (file !== safeName) {
        try {
            fs.renameSync(path.join(musicDir, file), path.join(musicDir, safeName));
            console.log(`Renamed: "${file}" -> "${safeName}"`);
        } catch (e) {
            console.error(`Failed to rename ${file}:`, e);
        }
      }
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
      const fileNameBase = path.basename(file, path.extname(file));
      
      let metadata = {
        title: fileNameBase,
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
          const coverName = `${fileNameBase}_cover${coverExt}`;
          const coverPath = path.join(coversDir, coverName);

          // Write cover file if not exists
          if (!fs.existsSync(coverPath)) {
            fs.writeFileSync(coverPath, picture.data);
            console.log(`Extracted cover for ${file}`);
          }
          metadata.cover = coverName; 
        }
      } catch (err) {
        console.error(`Error parsing metadata for ${file}:`, err.message);
      }

      // Transcode to HLS
      try {
        // Create specific dir for this album/track to avoid clutter
        const trackHlsDir = path.join(hlsDir, fileNameBase);
        await convertToHls(filePath, trackHlsDir, fileNameBase);
        
        musicData.push({
          id: Buffer.from(file).toString('base64'),
          filename: file,
          url: `/music/hls/${encodeURIComponent(fileNameBase)}/${encodeURIComponent(fileNameBase)}.m3u8`,
          originalUrl: null, // Removed to speed up deployment (was: /music/${encodeURIComponent(file)})
          isHls: true,
          ...metadata,
          cover: metadata.cover ? `/music/covers/${encodeURIComponent(metadata.cover)}` : null,
          uploadedAt: stats.mtime.toISOString()
        });
      } catch (e) {
        console.error(`Skipping ${file} due to transcoding error:`, e);
      }
    }

    fs.writeFileSync(outputFile, JSON.stringify(musicData, null, 2));
    console.log(`Generated index for ${musicData.length} tracks.`);
  } catch (err) {
    console.error('Error generating music index:', err);
    process.exit(1);
  }
}

generate();