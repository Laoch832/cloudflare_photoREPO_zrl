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
    if (!fs.existsSync(imagesDir)) {
      console.log('Images directory not found, creating empty index.');
      fs.writeFileSync(outputFile, JSON.stringify([]));
      process.exit(0);
    }

    // Create thumbnails directory
    if (sharp && !fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    const files = fs.readdirSync(imagesDir);
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext) && !file.startsWith('.'); // Ignore hidden files
    });

    const imageData = [];

    for (const file of images) {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      
      let thumbUrl = null;

      // Generate thumbnail
      if (sharp) {
        const thumbName = `thumb_${path.parse(file).name}.webp`;
        const thumbPath = path.join(thumbnailsDir, thumbName);
        
        // Only generate if not exists
        if (!fs.existsSync(thumbPath)) {
          try {
            await sharp(filePath)
              .resize(400, 400, { fit: 'inside', withoutEnlargement: true }) // slightly larger but WebP is efficient
              .webp({ quality: 70 }) // WebP format
              .toFile(thumbPath);
            console.log(`Generated WebP thumbnail for ${file}`);
          } catch (err) {
            console.error(`Failed to generate thumbnail for ${file}:`, err.message);
          }
        }
        
        if (fs.existsSync(thumbPath)) {
          thumbUrl = `/images/thumbnails/${thumbName}`;
        }
      }

      imageData.push({
        name: file,
        url: `/images/${file}`,
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