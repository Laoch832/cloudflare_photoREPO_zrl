import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudflare limits (25 MiB)
const MAX_SIZE_BYTES = 25 * 1024 * 1024;
const DIST_DIR = path.resolve(__dirname, '../dist');

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function cleanDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            cleanDirectory(filePath);
        } else {
            if (stat.size > MAX_SIZE_BYTES) {
                console.log(`🗑️  Deleting oversized file: ${file} (${formatBytes(stat.size)})`);
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error(`❌ Failed to delete ${file}:`, err);
                }
            }
        }
    }
}

console.log('🧹 Cleaning oversized files from dist...');
cleanDirectory(DIST_DIR);
console.log('✅ Cleanup complete.');
