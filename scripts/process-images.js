import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持外部目录
const EXTERNAL_IMAGES_DIR = process.env.EXTERNAL_IMAGES_DIR || '/lhcos-data/zrl-app/images';
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');

// 决定使用哪个目录
let imagesDir = PUBLIC_IMAGES_DIR;
if (fs.existsSync(EXTERNAL_IMAGES_DIR)) {
    console.log(`Using external images directory: ${EXTERNAL_IMAGES_DIR}`);
    imagesDir = EXTERNAL_IMAGES_DIR;
}

const THUMBNAILS_DIR = path.join(imagesDir, 'thumbnails');

// 确保缩略图目录存在
if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 检查是否安装了 sharp
let sharp;
try {
    sharp = (await import('sharp')).default;
} catch (e) {
    console.warn('Sharp not found, trying ImageMagick...');
}

// 使用 ImageMagick 生成缩略图
function generateThumbnailWithIM(inputPath, outputPath, width = 400) {
    return new Promise((resolve, reject) => {
        const convert = spawn('convert', [
            inputPath,
            '-resize', `${width}x${width}>`,
            '-quality', '85',
            outputPath
        ], { stdio: 'pipe' });
        
        let stderr = '';
        convert.stderr.on('data', data => stderr += data);
        convert.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`ImageMagick exited with code ${code}: ${stderr}`));
        });
        convert.on('error', reject);
    });
}

// 生成缩略图
async function generateThumbnail(inputPath, outputPath) {
    const filename = path.basename(inputPath);
    
    // 如果已存在，跳过
    if (fs.existsSync(outputPath)) {
        console.log(`  [SKIP] Thumbnail already exists: ${filename}`);
        return;
    }
    
    console.log(`  [GENERATE] Creating thumbnail: ${filename}`);
    
    try {
        if (sharp) {
            // 使用 sharp
            await sharp(inputPath)
                .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toFile(outputPath);
        } else {
            // 使用 ImageMagick
            await generateThumbnailWithIM(inputPath, outputPath);
        }
        console.log(`  [DONE] Thumbnail created: ${outputPath}`);
    } catch (error) {
        console.error(`  [ERROR] Failed to create thumbnail: ${error.message}`);
    }
}

// 主函数
async function main() {
    console.log('=== Image Processing ===');
    console.log(`Images directory: ${imagesDir}`);
    
    // 扫描图片文件
    const files = fs.readdirSync(imagesDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext) && !file.startsWith('.');
    });
    
    console.log(`\nFound ${files.length} image file(s)`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(imagesDir, file);
        const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${file}`);
        
        console.log(`\n[${i + 1}/${files.length}] Processing: ${file}`);
        await generateThumbnail(filePath, thumbnailPath);
    }
    
    console.log('\n=== Image Processing Complete ===');
}

main().catch(console.error);
