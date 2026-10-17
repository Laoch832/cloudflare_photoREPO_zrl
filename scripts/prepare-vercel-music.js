import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

// Vercel serves ordinary MP3 files more reliably on mobile browsers than
// the legacy HLS bundles (many of which contain broken EXTINF timestamps).
// Generate transcodes only in Vercel builds; leave Git and Cloudflare inputs intact.
if (!process.env.VERCEL) {
  console.log('[MP3] Non-Vercel build; preserving original audio URLs');
} else {
  if (!ffmpegPath) throw new Error('[MP3] ffmpeg-static binary missing');
  const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
  const musicJson = path.join(publicDir, 'music.json');
  const mp3Dir = path.join(publicDir, 'music', 'mp3');
  const tracks = JSON.parse(fs.readFileSync(musicJson, 'utf8'));
  if (tracks.length === 0) throw new Error('[MP3] Track index is empty');
  fs.mkdirSync(mp3Dir, { recursive: true });

  function checkDuration(filename) {
    const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', filename], {
      encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024,
    });
    const match = (probe.stderr || '').match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (!match) return 0;
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  }

  for (let index = 0; index < tracks.length; index++) {
    const track = tracks[index];
    const url = track.url;
    if (!url || !url.endsWith('.m3u8')) {
      throw new Error('[MP3] Unexpected track URL: ' + url);
    }
    const playlistPath = path.resolve(publicDir, decodeURIComponent(url.slice(1)));
    if (!playlistPath.startsWith(publicDir + path.sep)) throw new Error('Invalid audio path');
    const directory = path.dirname(playlistPath);
    const playlistText = fs.readFileSync(playlistPath, 'utf8');
    const segments = playlistText.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => path.resolve(directory, line.split('?')[0]));

    if (segments.length === 0 || segments.some(file => !file.startsWith(directory + path.sep) || !fs.existsSync(file))) {
      throw new Error('[MP3] Missing audio segments for ' + track.title);
    }
    const base = path.basename(directory).replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_');
    const destination = path.join(mp3Dir, base + '.mp3');
    // All current tracks have one segment. Concatenate TS packets when a
    // future HLS export contains more than one segment.
    const joined = segments.length > 1 ? path.join(mp3Dir, base + '.tmp.ts') : null;
    const source = joined || segments[0];
    try {
      if (joined) fs.writeFileSync(joined, Buffer.concat(segments.map(s => fs.readFileSync(s))));
      const conversion = spawnSync(ffmpegPath, [
        '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
        '-fflags', '+genpts',
        '-analyzeduration', '10000000', '-probesize', '10000000',
        '-i', source,
        '-map', '0:a:0', '-vn',
        '-af', 'asetpts=N/SR/TB',
        '-c:a', 'libmp3lame', '-b:a', '160k', '-ar', '44100', '-ac', '2',
        '-id3v2_version', '3',
        destination
      ], {
        encoding: 'utf8', timeout: 90000, maxBuffer: 2 * 1024 * 1024,
      });
      if (conversion.status !== 0) {
        throw new Error((conversion.stderr || conversion.error?.message || 'Unknown ffmpeg failure').slice(-800));
      }
      const bytes = fs.statSync(destination).size;
      const duration = checkDuration(destination);
      if (bytes < 250000 || duration < 25) {
        throw new Error('Transcoded MP3 too short: ' + bytes + ' bytes, ' + duration + ' seconds');
      }
      track.url = '/music/mp3/' + encodeURIComponent(base) + '.mp3';
      track.originalUrl = track.url;
      track.isHls = false;
      track.duration = Math.round(duration * 100) / 100;
      console.log('[MP3] ' + (index + 1) + '/' + tracks.length + ': ' + track.title + ' (' + duration.toFixed(1) + 's)');
    } finally {
      if (joined && fs.existsSync(joined)) fs.rmSync(joined);
    }
  }
  fs.writeFileSync(musicJson, JSON.stringify(tracks, null, 2) + '\n');
  console.log('[MP3] Converted and verified all ' + tracks.length + ' songs');
}
