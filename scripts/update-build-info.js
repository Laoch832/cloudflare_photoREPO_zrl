const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取git提交哈希作为序列号
function getGitCommit() {
  try {
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    return commit;
  } catch (error) {
    console.error('Error getting git commit:', error);
    return 'DEV';
  }
}

// 更新构建信息
function updateBuildInfo() {
  const commit = getGitCommit();
  const buildTime = new Date().toISOString();
  const buildInfo = `${commit} - ${buildTime}`;
  
  // 读取index.html文件
  const indexPath = path.join(__dirname, '../public/index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // 更新构建信息
  indexContent = indexContent.replace(/<!-- BUILD_REF_START -->.*<!-- BUILD_REF_END -->/g, `<!-- BUILD_REF_START -->${buildInfo}<!-- BUILD_REF_END -->`);
  
  // 写入更新后的文件
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  
  console.log(`Updated build info to: ${buildInfo}`);
}

// 执行更新
updateBuildInfo();
