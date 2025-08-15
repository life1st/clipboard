import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 package.json 获取当前版本号
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// 获取构建时间
const buildInfo = `${new Date().toISOString()} ${new Date().getTimezoneOffset()}`
console.log(`📝 构建时间: ${buildInfo}`);
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

console.log(`🎉 版本信息生成成功！版本: ${version} (${hash})`); 