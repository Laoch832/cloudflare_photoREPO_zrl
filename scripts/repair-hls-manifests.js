import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

// Some previously generated HLS playlists have EXTINF/TARGETDURATION=0 even
// though their .ts segments contain full songs. HLS players reject these.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/music/hls');

function segmentDuration(filename) {
  if (!ffmpegPath) return null;
  const result = spawnSync(ffmpegPath, ['-hide_banner', '-i', filename], {
    encoding: 'utf8',
    timeout: 15000,
    maxBuffer: 1024 * 1024,
  });
  const match = (result.stderr || '').match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const duration = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  return Number.isFinite(duration) && duration > 1 ? duration : null;
}

function fixPlaylist(filename) {
  const directory = path.dirname(filename);
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split(/\r?\n/);
  let maxDuration = 0;
  let changed = false;

  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].startsWith('#EXTINF:')) continue;
    const segment = lines[i + 1].trim();
    if (!segment || segment.startsWith('#') || /^(?:https?:)?\/\//i.test(segment)) continue;
    const fullPath = path.resolve(directory, segment.split('?')[0]);
    if (!fullPath.startsWith(directory + path.sep) || !fs.existsSync(fullPath)) continue;

    const previousDuration = Number(lines[i].slice(8).split(',')[0]);
    let duration = previousDuration > 1 ? previousDuration : segmentDuration(fullPath);
    if (!duration) continue;
    maxDuration = Math.max(maxDuration, duration);
    if (previousDuration <= 1 || !Number.isFinite(previousDuration)) {
      lines[i] = '#EXTINF:' + duration.toFixed(3) + ',';
      changed = true;
    }
  }

  if (maxDuration <= 0) {
    console.warn('[HLS] Cannot determine duration for ' + filename);
    return false;
  }
  const targetDuration = Math.max(1, Math.ceil(maxDuration));
  const targetIndex = lines.findIndex(line => line.startsWith('#EXT-X-TARGETDURATION:'));
  if (targetIndex >= 0) {
    if (lines[targetIndex] !== '#EXT-X-TARGETDURATION:' + targetDuration) {
      lines[targetIndex] = '#EXT-X-TARGETDURATION:' + targetDuration;
      changed = true;
    }
  } else {
    lines.splice(1, 0, '#EXT-X-TARGETDURATION:' + targetDuration);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filename, lines.join('\n'));
    console.log('[HLS] Fixed ' + filename + ' (' + targetDuration + 's)');
  }
  return true;
}

if (fs.existsSync(root)) {
  let checked = 0;
  let valid = 0;
  for (const directory of fs.readdirSync(root, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    const dirPath = path.join(root, directory.name);
    for (const name of fs.readdirSync(dirPath).filter(name => name.endsWith('.m3u8'))) {
      checked++;
      if (fixPlaylist(path.join(dirPath, name))) valid++;
    }
  }
  console.log('[HLS] Validated ' + valid + '/' + checked + ' playlists');
} else {
  console.log('[HLS] No music directory found, skipping');
}
