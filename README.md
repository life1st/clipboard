# Clipboard Web

一个现代化的 Web 应用，使用 React + TypeScript + Vite 构建。

## 🚀 特性

- ⚡ 快速开发体验 - 使用 Vite 构建工具
- 🔧 TypeScript 支持 - 完整的类型安全
- 🎨 现代化 UI 设计 - 响应式布局和美观的界面
- 📱 移动端友好 - 支持各种设备尺寸
- 🎯 简洁的代码结构 - 易于理解和维护
- 🌐 GitHub Gist API 集成 - 完整的 CRUD 操作
- 🔐 Token 管理 - 安全的身份验证
- 🛡️ 错误处理 - 完善的错误处理机制
- 🧭 路由系统 - 使用 React Router 的多页面应用
- 📋 剪贴板管理 - 本地存储和 Gist 同步
- ⚡ 代码拆分 - 使用 dynamic import 实现按需加载

## 🛠️ 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + 响应式设计
- **代码质量**: ESLint
- **包管理器**: pnpm
- **Node.js**: 22+
- **路由**: React Router 7
- **状态管理**: Zustand
- **代码拆分**: React.lazy + Suspense

## 📦 安装和运行

### 前置要求
- Node.js 22.0.0 或更高版本
- pnpm 包管理器

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
pnpm build
```

### 预览生产版本
```bash
pnpm preview
```

### 代码检查
```bash
pnpm lint
```

## 🏗️ 项目结构

```
clipboard-web/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── App.tsx      # 主应用组件
│   ├── App.css      # 应用样式
│   ├── main.tsx     # 应用入口
│   ├── index.css    # 全局样式
│   ├── components/  # 组件
│   │   ├── navigation.tsx    # 导航组件
│   │   ├── async-route.tsx    # 异步路由组件
│   │   └── page-loading-fallback.tsx # 页面加载组件
│   ├── pages/       # 页面组件
│   │   ├── clipboard-list.tsx # 剪贴板列表（首页）
│   │   └── settings.tsx  # 设置页面（包含 Gist 配置）
│   ├── request/     # API 请求模块
│       ├── index.ts # 模块入口
│       ├── axios.ts # Axios 配置
│       ├── gist.ts  # Gist API 方法
│       ├── types.ts # 类型定义
│       └── config.ts# 配置文件
│   ├── store/       # 状态管理
│   │   ├── index.ts # Store 入口
│   │   ├── types.ts # 类型定义
│   │   ├── clipboard-store.ts # 剪贴板状态
│   │   └── settings-store.ts  # 设置状态（包含 Gist 配置）
│   ├── utils/       # 工具函数
│   │   └── page-preloader.ts  # 页面预加载工具
│   └── components/  # 组件
│       ├── Navigation.tsx    # 导航组件
│       ├── AsyncRoute.tsx    # 异步路由组件
│       └── PageLoadingFallback.tsx # 页面加载组件
├── index.html       # HTML 模板
├── package.json     # 项目配置
├── tsconfig.json    # TypeScript 配置
├── vite.config.ts   # Vite 配置
├── README.md        # 项目说明
└── GITHUB_API_USAGE.md # GitHub API 使用说明
```

## 🎨 自定义

你可以通过修改以下文件来自定义应用：

- `src/App.tsx` - 修改应用逻辑和组件
- `src/App.css` - 自定义应用样式
- `src/index.css` - 修改全局样式
- `vite.config.ts` - 配置构建选项

## 📱 响应式设计

应用支持各种设备尺寸：
- 桌面端 (≥768px)
- 移动端 (<768px)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License 