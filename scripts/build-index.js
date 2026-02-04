import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sharp;
try {
  // Try to import sharp dynamically
  sharp = (await import('sharp')).default;
} catch (e) {
  console.warn('Sharp not found, thumbnails will not be generated. Please run `npm install -D sharp`');
}

const imagesDir = path.join(__dirname, '../public/images');
const thumbnailsDir = path.join(__dirname, '../public/images/thumbnails');
const outputFile = path.join(__dirname, '../public/images.json');

// 支持的图片扩展名
const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

async function generate() {
  try {
    // 优先检查缩略图目录，如果没有原始图片，使用缩略图作为数据源
    let sourceDir = imagesDir;
    let useThumbnailsOnly = false;
    
    // 检查原始图片目录是否存在且有图片
    let hasOriginalImages = false;
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      hasOriginalImages = files.some(file => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext) && !file.startsWith('.');
      });
    }
    
    // 如果没有原始图片，但有缩略图，则使用缩略图
    if (!hasOriginalImages && fs.existsSync(thumbnailsDir)) {
      console.log('No original images found, using thumbnails as source.');
      sourceDir = thumbnailsDir;
      useThumbnailsOnly = true;
    } else if (!fs.existsSync(imagesDir)) {
      console.log('Images directory not found, creating empty index.');
      fs.writeFileSync(outputFile, JSON.stringify([]));
      process.exit(0);
    }

    // Create thumbnails directory
    if (sharp && !fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext) && !file.startsWith('.'); // Ignore hidden files
    });

    const imageData = [];

    for (const file of images) {
      const filePath = path.join(sourceDir, file);
      const stats = fs.statSync(filePath);
      
      let thumbUrl = null;
      let originalUrl = null;

      if (useThumbnailsOnly) {
        // 如果只使用缩略图，缩略图就是原图
        // 从缩略图文件名提取原始文件名 (去掉 thumb_ 前缀)
        const originalName = file.replace(/^thumb_/, '');
        originalUrl = `/images/thumbnails/${file}`;
        thumbUrl = `/images/thumbnails/${file}`;
      } else {
        // 正常模式：有原始图片
        originalUrl = `/images/${file}`;

        // Generate thumbnail
        if (sharp) {
          const thumbName = `thumb_${file}`;
          const thumbPath = path.join(thumbnailsDir, thumbName);
          
          // Only generate if not exists
          if (!fs.existsSync(thumbPath)) {
            try {
              await sharp(filePath)
                .resize(300, 300, { fit: 'inside' }) // Resize to max 300x300
                .jpeg({ quality: 60 }) // Low quality for thumbnail
                .toFile(thumbPath);
              console.log(`Generated thumbnail for ${file}`);
            } catch (err) {
              console.error(`Failed to generate thumbnail for ${file}:`, err.message);
            }
          }
          
          if (fs.existsSync(thumbPath)) {
            thumbUrl = `/images/thumbnails/${thumbName}`;
          }
        }
      }

      // 从文件名中提取原始名称（去掉 thumb_ 前缀和扩展名）
      const displayName = file.replace(/^thumb_/, '').replace(/\.[^/.]+$/, "");

      imageData.push({
        name: displayName,
        url: originalUrl,
        thumbnail: thumbUrl,
        uploadedAt: stats.mtime.toISOString()
      });
    }

    fs.writeFileSync(outputFile, JSON.stringify(imageData, null, 2));
    console.log(`Generated index for ${images.length} images.`);
  } catch (err) {
    console.error('Error generating image index:', err);
    process.exit(1);
  }
}

generate();
