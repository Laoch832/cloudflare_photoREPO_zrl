import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持外部目录
const EXTERNAL_MUSIC_DIR = process.env.EXTERNAL_MUSIC_DIR || '/lhcos-data/zrl-app/music';
const PUBLIC_MUSIC_DIR = path.join(__dirname, '../public/music');

// 决定使用哪个目录
let musicDir = PUBLIC_MUSIC_DIR;
if (fs.existsSync(EXTERNAL_MUSIC_DIR)) {
    console.log(`Using external music directory: ${EXTERNAL_MUSIC_DIR}`);
    musicDir = EXTERNAL_MUSIC_DIR;
}

const HLS_DIR = path.join(musicDir, 'hls');
const COVERS_DIR = path.join(musicDir, 'covers');
const LYRICS_DIR = path.join(musicDir, 'lyrics');

// 确保目录存在
[HLS_DIR, COVERS_DIR, LYRICS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 支持的音频格式
const AUDIO_EXTENSIONS = ['.flac', '.mp3', '.wav', '.m4a', '.ogg'];

// 执行 ffmpeg 命令
function runFFmpeg(args) {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', args, { stdio: 'pipe' });
        let stderr = '';
        ffmpeg.stderr.on('data', data => stderr += data);
        ffmpeg.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
        });
        ffmpeg.on('error', reject);
    });
}

// 获取音频时长
async function getDuration(inputPath) {
    return new Promise((resolve, reject) => {
        const ffprobe = spawn('ffprobe', [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            inputPath
        ], { stdio: 'pipe' });
        
        let output = '';
        ffprobe.stdout.on('data', data => output += data);
        ffprobe.on('close', code => {
            if (code === 0) resolve(parseFloat(output.trim()));
            else resolve(0);
        });
    });
}

// 转换音频为 HLS
async function convertToHLS(inputPath, outputName) {
    const outputDir = path.join(HLS_DIR, outputName);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const m3u8Path = path.join(outputDir, `${outputName}.m3u8`);
    
    // 如果已存在，跳过
    if (fs.existsSync(m3u8Path)) {
        console.log(`  [SKIP] HLS already exists: ${outputName}`);
        return true;
    }
    
    console.log(`  [CONVERT] Creating HLS for: ${outputName}`);
    
    try {
        // 使用 ffmpeg 生成 HLS
        // 至少切3片，每片10秒
        await runFFmpeg([
            '-i', inputPath,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-f', 'hls',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-hls_segment_filename', path.join(outputDir, `${outputName}_%03d.ts`),
            m3u8Path
        ]);
        
        console.log(`  [DONE] HLS created: ${m3u8Path}`);
        return true;
    } catch (error) {
        console.error(`  [ERROR] Failed to convert: ${error.message}`);
        return false;
    }
}

// 从网易云获取歌词
function fetchLyrics(artist, title) {
    return new Promise((resolve) => {
        const searchWord = `${title} ${artist.split('/')[0].split(',')[0].trim()}`;
        const searchUrl = `https://api.vkeys.cn/v2/music/netease?word=${encodeURIComponent(searchWord)}`;
        
        const req = https.get(searchUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.code === 200 && result.data && result.data.length > 0) {
                        const songId = result.data[0].id;
                        // 获取歌词
                        const lyricUrl = `https://api.vkeys.cn/v2/music/netease/lyric?id=${songId}`;
                        https.get(lyricUrl, (lyricRes) => {
                            let lyricData = '';
                            lyricRes.on('data', chunk => lyricData += chunk);
                            lyricRes.on('end', () => {
                                try {
                                    const lyricResult = JSON.parse(lyricData);
                                    if (lyricResult.code === 200 && lyricResult.data && lyricResult.data.lrc) {
                                        resolve(lyricResult.data.lrc);
                                    } else {
                                        resolve(null);
                                    }
                                } catch (e) {
                                    resolve(null);
                                }
                            });
                        }).on('error', () => resolve(null));
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        });
        
        req.on('error', () => resolve(null));
        req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    });
}

// 保存歌词
async function saveLyrics(artist, title, filename) {
    const safeName = filename.replace(/\.[^/.]+$/, '');
    const lyricPath = path.join(LYRICS_DIR, `${safeName}.lrc`);
    
    if (fs.existsSync(lyricPath)) {
        console.log(`  [SKIP] Lyrics already exists: ${safeName}`);
        return;
    }
    
    console.log(`  [FETCH] Searching lyrics for: ${title} - ${artist}`);
    const lyrics = await fetchLyrics(artist, title);
    
    if (lyrics) {
        fs.writeFileSync(lyricPath, lyrics);
        console.log(`  [DONE] Lyrics saved: ${lyricPath}`);
    } else {
        console.log(`  [WARN] No lyrics found`);
    }
}

// 解析文件名获取艺术家和标题
function parseMetadata(filename) {
    // 格式: Artist_-_Title.flac 或 Artist - Title.flac
    const baseName = filename.replace(/\.[^/.]+$/, '');
    
    let artist = 'Unknown Artist';
    let title = baseName;
    
    // 尝试匹配 "_-_" 或 " - "
    const match = baseName.match(/^(.+?)_+_-_(.+)$/);
    if (match) {
        artist = match[1].replace(/_/g, ' ').trim();
        title = match[2].replace(/_/g, ' ').trim();
    } else {
        const match2 = baseName.match(/^(.+?)\s+-\s+(.+)$/);
        if (match2) {
            artist = match2[1].trim();
            title = match2[2].trim();
        }
    }
    
    return { artist, title };
}

// 主函数
async function main() {
    console.log('=== Music Processing ===');
    console.log(`Music directory: ${musicDir}`);
    
    // 扫描音频文件
    const files = fs.readdirSync(musicDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return AUDIO_EXTENSIONS.includes(ext) && !file.startsWith('.');
    });
    
    console.log(`\nFound ${files.length} audio file(s)`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(musicDir, file);
        const { artist, title } = parseMetadata(file);
        
        // 生成安全文件名（用于HLS目录）
        const safeName = file.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_');
        
        console.log(`\n[${i + 1}/${files.length}] Processing: ${file}`);
        console.log(`  Artist: ${artist}, Title: ${title}`);
        
        // 1. 转换为 HLS
        await convertToHLS(filePath, safeName);
        
        // 2. 获取歌词（添加延迟避免API限制）
        if (i < files.length - 1) {
            await saveLyrics(artist, title, file);
            console.log('  [WAIT] Sleeping 2s...');
            await new Promise(r => setTimeout(r, 2000));
        } else {
            await saveLyrics(artist, title, file);
        }
    }
    
    console.log('\n=== Music Processing Complete ===');
}

main().catch(console.error);
