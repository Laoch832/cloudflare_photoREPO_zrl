import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.FILE_SERVER_PORT || 3001;

// 文件存储目录 - Docker 挂载点
const STORAGE_DIR = process.env.STORAGE_DIR || '/lhcos-data/zrl-app';

// 确保存储目录存在
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// CORS 配置
app.use(cors());
app.use(express.json());

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    // 添加时间戳避免重名
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB 限制
});

// 获取文件列表
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_DIR)
      .filter(filename => !filename.startsWith('.'))
      .map(filename => {
        const filePath = path.join(STORAGE_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          id: filename,
          name: filename.replace(/^\d+_/, ''), // 移除时间戳前缀
          originalName: filename,
          size: stats.size,
          created_at: stats.birthtime.toISOString(),
          updated_at: stats.mtime.toISOString(),
          metadata: {
            mimetype: getMimeType(filename)
          }
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 上传文件
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    res.json({ 
      success: true, 
      file: {
        id: req.file.filename,
        name: req.file.originalname,
        originalName: req.file.filename,
        size: req.file.size,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 下载文件
app.get('/api/files/download/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(STORAGE_DIR, filename);
    
    // 安全检查：确保文件在存储目录内
    if (!filePath.startsWith(STORAGE_DIR)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    res.download(filePath, filename.replace(/^\d+_/, ''));
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除文件
app.delete('/api/files/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(STORAGE_DIR, filename);
    
    // 安全检查
    if (!filePath.startsWith(STORAGE_DIR)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取存储使用情况
app.get('/api/files/stats', (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_DIR).filter(f => !f.startsWith('.'));
    let totalSize = 0;
    
    files.forEach(filename => {
      const stats = fs.statSync(path.join(STORAGE_DIR, filename));
      totalSize += stats.size;
    });
    
    res.json({
      success: true,
      stats: {
        fileCount: files.length,
        totalSize,
        maxSize: 15 * 1024 * 1024 * 1024 // 15GB
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 辅助函数：获取 MIME 类型
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
  console.log(`Storage directory: ${STORAGE_DIR}`);
});
