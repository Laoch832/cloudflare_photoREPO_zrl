const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const outputFile = path.join(__dirname, '../public/images.json');

// 支持的图片扩展名
const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

try {
  if (!fs.existsSync(imagesDir)) {
    console.log('Images directory not found, creating empty index.');
    fs.writeFileSync(outputFile, JSON.stringify([]));
    process.exit(0);
  }

  const files = fs.readdirSync(imagesDir);
  const images = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return extensions.includes(ext);
  });

  const imageData = images.map(file => ({
    name: file,
    url: `/images/${file}`,
    uploadedAt: fs.statSync(path.join(imagesDir, file)).mtime.toISOString()
  }));

  fs.writeFileSync(outputFile, JSON.stringify(imageData, null, 2));
  console.log(`Generated index for ${images.length} images.`);
} catch (err) {
  console.error('Error generating image index:', err);
  process.exit(1);
}
