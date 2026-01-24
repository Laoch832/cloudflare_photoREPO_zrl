import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_JSON_PATH = path.join(__dirname, '../public/music.json');
const LYRICS_DIR = path.join(__dirname, '../public/music/lyrics');

// Ensure lyrics directory exists
if (!fs.existsSync(LYRICS_DIR)) {
    fs.mkdirSync(LYRICS_DIR, { recursive: true });
}

// Helper to make HTTP GET request
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error('JSON Parse Error:', e.message);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (err) => {
            console.error('Request Error:', err.message);
            resolve(null);
        });
        
        req.setTimeout(15000, () => {
            req.destroy();
            console.error('Request Timeout');
            resolve(null);
        });
    });
}

// Sleep function to avoid rate limiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    if (!fs.existsSync(MUSIC_JSON_PATH)) {
        console.error('music.json not found!');
        return;
    }

    const musicData = JSON.parse(fs.readFileSync(MUSIC_JSON_PATH, 'utf-8'));
    console.log(`Found ${musicData.length} tracks.`);
    
    let processedCount = 0;

    for (const track of musicData) {
        const lyricPath = path.join(LYRICS_DIR, `${track.id}.lrc`);
        
        // 1. Check if lyrics already exist
        if (fs.existsSync(lyricPath)) {
            console.log(`[SKIP] Lyrics for "${track.title}" already exists.`);
            continue;
        }

        console.log(`\n[SEARCH] Searching for "${track.title}" by ${track.artist}...`);
        
        try {
            // 2. Search for the song ID
            // Clean title for better search (remove extra info like "ft.", "Remix", etc. if needed, but strict first)
            // Splitting artist to take only the first one usually helps with search accuracy
            const mainArtist = track.artist.split('/')[0].split(',')[0].trim();
            const searchWord = `${track.title} ${mainArtist}`; 
            const searchUrl = `https://api.vkeys.cn/v2/music/netease?word=${encodeURIComponent(searchWord)}`;
            
            const searchResult = await fetchUrl(searchUrl);
            await sleep(1500); // Wait to be polite

            if (searchResult && searchResult.code === 200 && searchResult.data && searchResult.data.length > 0) {
                 const firstMatch = searchResult.data[0];
                 const neteaseId = firstMatch.id;
                 console.log(`[FOUND] Matched: "${firstMatch.song}" - ${firstMatch.singer} (ID: ${neteaseId})`);
                 
                 // 3. Fetch lyrics
                 const lyricUrl = `https://api.vkeys.cn/v2/music/netease/lyric?id=${neteaseId}`;
                 const lyricResult = await fetchUrl(lyricUrl);
                 
                 if (lyricResult && lyricResult.code === 200 && lyricResult.data && lyricResult.data.lrc) {
                     // Check if lrc is a string or object (API sometimes varies, but user example showed string in data.lrc?)
                     // User example: "data": { "lrc": "[00:00.00]..." }
                     const lrcContent = lyricResult.data.lrc;
                     if (lrcContent && typeof lrcContent === 'string' && lrcContent.length > 0) {
                         fs.writeFileSync(lyricPath, lrcContent);
                         console.log(`[SAVED] Lyrics saved to ${track.id}.lrc`);
                         processedCount++;
                     } else {
                         console.log(`[WARN] Empty lyrics for ID ${neteaseId}`);
                     }
                 } else {
                     console.log(`[WARN] No lyrics found in response for ID ${neteaseId}.`);
                 }
            } else {
                console.log(`[WARN] Song not found: "${searchWord}"`);
            }

        } catch (error) {
            console.error(`[ERROR] Failed to process "${track.title}":`, error.message);
        }
        
        // 4. Sleep to avoid 429 Too Many Requests
        // User explicitly warned about this
        console.log('[WAIT] Sleeping 3s...');
        await sleep(3000); 
    }
    
    console.log(`\nAll done! Processed ${processedCount} new lyrics.`);
}

main();
