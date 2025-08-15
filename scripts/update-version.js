import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 更新版本号
console.log('📦 更新版本号...');
try {
  execSync('pnpm version minor', { stdio: 'inherit' });
  console.log('✅ 版本号更新完成');
} catch (error) {
  console.error('❌ 版本号更新失败:', error.message);
  process.exit(1);
}

// 读取 package.json 获取新版本号
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`📝 当前版本: ${version}`);

// 获取构建时间
const buildInfo = `${new Date().getTime()} ${new Date().getTimezoneOffset()}`

// 获取 git commit hash（如果可用）
let hash = 'development';
try {
  hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Git not available, using development as commit hash');
}

// 创建 version.json 内容
const versionData = {
  version,
  buildInfo,
  hash
};

// 写入 public/version.json
const versionJsonPath = path.join(__dirname, '../public/version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));

console.log(`🎉 版本更新流程完成！版本: ${version} (${hash})`); 