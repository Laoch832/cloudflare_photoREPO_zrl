import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持从外部目录读取（Docker 部署时使用）
const EXTERNAL_IMAGES_DIR = process.env.EXTERNAL_IMAGES_DIR || '/lhcos-data/zrl-app/images';
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const outputFile = path.join(__dirname, '../public/images.json');

// 支持的图片扩展名
const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

async function generate() {
  try {
    // 决定使用哪个目录作为源
    let sourceDir = PUBLIC_IMAGES_DIR;
    
    // 如果外部目录存在且有图片，优先使用外部目录
    if (fs.existsSync(EXTERNAL_IMAGES_DIR)) {
      const externalFiles = fs.readdirSync(EXTERNAL_IMAGES_DIR);
      const hasExternalImages = externalFiles.some(file => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext) && !file.startsWith('.');
      });
      
      if (hasExternalImages) {
        console.log(`Using external images directory: ${EXTERNAL_IMAGES_DIR}`);
        sourceDir = EXTERNAL_IMAGES_DIR;
      }
    }
    
    // 如果都没有，创建空索引
    if (!fs.existsSync(sourceDir)) {
      console.log('Images directory not found, creating empty index.');
      fs.writeFileSync(outputFile, JSON.stringify([]));
      process.exit(0);
    }

    const files = fs.readdirSync(sourceDir);
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext) && !file.startsWith('.');
    });

    const imageData = [];

    for (const file of images) {
      const filePath = path.join(sourceDir, file);
      const stats = fs.statSync(filePath);
      
      // 从文件名中提取显示名称
      const displayName = file.replace(/\.[^/.]+$/, "");

      imageData.push({
        name: displayName,
        url: `/images/${file}`,
        thumbnail: `/images/${file}`,
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
