import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('❌ 获取当前分支失败:', error.message);
    return null;
  }
}

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

function updatePackageVersion() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const versionType = process.argv[2] || 'patch';
    const newVersion = incrementVersion(currentVersion, versionType);
    
    packageJson.version = newVersion;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`📦 版本号已更新: ${currentVersion} → ${newVersion}`);
    
    // 将 package.json 添加到 git staging area
    execSync('git add package.json', { stdio: 'inherit' });
    
    return newVersion;
  } catch (error) {
    console.error('❌ 更新版本失败:', error.message);
    process.exit(1);
  }
}

function main() {
  const currentBranch = getCurrentBranch();
  
  if (!currentBranch) {
    console.error('❌ 无法获取当前分支信息');
    process.exit(1);
  }
  
  console.log(`🌿 当前分支: ${currentBranch}`);
  
  if (currentBranch !== 'main') {
    console.log('ℹ️  非 main 分支，跳过版本更新');
    process.exit(0);
  }
  
  console.log('🚀 检测到 main 分支，开始更新版本号...');
  updatePackageVersion();
  console.log('✅ 版本更新完成');
}

main();