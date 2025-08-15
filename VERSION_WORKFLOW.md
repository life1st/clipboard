# 版本更新工作流程

## 工作流程概述

这个项目实现了一个两阶段的版本管理流程：

1. **本地提交阶段（Pre-commit）**：在 main 分支上提交时自动递增版本号
2. **构建部署阶段（Build）**：根据 package.json 生成完整的版本信息文件

## 第一阶段：Pre-commit 版本递增

### 触发条件
- 在 `main` 分支上执行 `git commit`
- 通过 husky pre-commit hook 自动触发

### 执行流程
1. 检查当前分支是否为 `main`
2. 如果是 `main` 分支，自动递增 `package.json` 中的版本号
3. 如果不是 `main` 分支，跳过版本更新
4. 将更新后的 `package.json` 添加到当前提交中

### 相关文件
- `.husky/pre-commit`：pre-commit hook 配置
- `scripts/increment-version.js`：版本递增脚本
- `package.json`：版本号存储位置

### 脚本功能
- **分支检测**：只在 main 分支执行
- **版本类型**：支持 patch（默认）、minor、major
- **自动暂存**：更新后自动将 package.json 添加到 git staging area

## 第二阶段：构建时版本文件生成

### 触发时机
- 手动执行构建命令
- CI/CD 系统中的自动构建

### 执行流程
1. 读取 `package.json` 中的版本号（本地更新的）
2. 获取当前构建时间
3. 获取当前 git commit hash
4. 生成 `public/version.json` 文件

### 相关文件
- `scripts/update-version.js`：构建时版本文件生成脚本
- `public/version.json`：最终的版本信息文件

### 版本文件结构
```json
{
  "version": "0.4.1",        // 来自 package.json（本地更新）
  "buildInfo": "2024-01-XX", // 构建时生成
  "hash": "abc1234"          // 构建时生成
}
```

## 使用说明

### 手动版本递增
```bash
# patch 版本（默认）
pnpm run version:increment

# minor 版本
pnpm run version:increment minor

# major 版本
pnpm run version:increment major
```

### 生成版本文件
```bash
pnpm run version:build
```

### 正常开发流程
1. 在 main 分支上进行开发
2. 执行 `git commit`，版本号会自动递增
3. 推送到远程仓库
4. CI/CD 系统自动构建并生成最终的版本文件

## 优势

1. **自动化**：无需手动管理版本号
2. **分支隔离**：只在 main 分支更新版本，避免功能分支冲突
3. **信息分离**：版本号在本地确定，构建信息在构建时生成
4. **灵活性**：支持不同类型的版本递增
5. **一致性**：确保每次主分支提交都有唯一的版本号