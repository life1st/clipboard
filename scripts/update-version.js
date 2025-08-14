import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

// 读取package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))
const appVersion = packageJson.version

// 获取构建时间
const buildTime = new Date().toISOString()

// 获取git commit hash（如果可用）
let commitHash = 'development'
try {
  const { execSync } = await import('child_process')
  commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
} catch (error) {
  console.warn('Git not available, using development as commit hash')
}

// 创建version.json内容
const versionData = {
  version: appVersion,
  buildTime: buildTime,
  commitHash: commitHash
}

// 写入public/version.json
const versionPath = resolve(__dirname, '../public/version.json')
writeFileSync(versionPath, JSON.stringify(versionData, null, 2))

console.log(`Version file updated: ${appVersion} (${commitHash})`) 