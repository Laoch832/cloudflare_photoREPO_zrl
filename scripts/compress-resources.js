const fs = require('fs');
const path = require('path');
const htmlMinifier = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const Terser = require('terser');

// 配置路径
const PUBLIC_DIR = path.join(__dirname, '../public');
const HTML_FILE = path.join(PUBLIC_DIR, 'index.html');

// 压缩HTML函数
async function compressHTML() {
  try {
    const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
    const minifiedHTML = await htmlMinifier.minify(htmlContent, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true
    });
    
    fs.writeFileSync(HTML_FILE, minifiedHTML, 'utf8');
    console.log('HTML compressed successfully.');
  } catch (error) {
    console.error('Error compressing HTML:', error);
  }
}

// 执行压缩
try {
  compressHTML();
} catch (error) {
  console.error('Error in compress-resources.js:', error);
  process.exit(1);
}
