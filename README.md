# Clipboard Web

一个现代化的剪贴板同步应用，支持 GitHub Gist 同步和端到端加密。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
├── pages/              # 页面组件
├── styles/             # 样式文件
│   ├── _variables.scss # 设计系统变量
│   ├── _mixins.scss    # 设计系统 mixin
│   ├── main.scss       # 主样式文件
│   ├── components/     # 组件样式
│   └── pages/          # 页面样式
├── store/              # 状态管理
├── utils/              # 工具函数
└── request/            # API 请求
```

## 🎨 样式开发规范

### ⚠️ 重要提醒

**绝对不要在 React 组件中导入样式文件！**

```tsx
// ❌ 错误做法
import './button.scss';  // 禁止！

// ✅ 正确做法
// 不需要导入样式文件，直接使用 className
```

### 📖 详细规范

请查看 [STYLE_GUIDE.md](./STYLE_GUIDE.md) 了解完整的样式开发规范。

### 🔧 开发工具

- **ESLint**: 自动检查样式导入错误
- **Pre-commit Hook**: 提交前自动检查
- **VSCode 配置**: 提供开发时的帮助

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式系统**: Sass (使用 @use 模块系统)
- **状态管理**: Zustand
- **路由**: React Router DOM
- **HTTP 客户端**: Axios
- **加密**: CryptoJS
- **二维码**: QRCode

## 📚 文档

- [设计文档](./DESIGN_DOCS.md) - 组件设计系统和规范
- [样式开发规范](./STYLE_GUIDE.md) - 详细的样式开发指南
- [API 文档](./API_DOCS.md) - API 接口说明

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发前必读

- 查看 [STYLE_GUIDE.md](./STYLE_GUIDE.md) 了解样式开发规范
- 查看 [DESIGN_DOCS.md](./DESIGN_DOCS.md) 了解设计系统
- 确保遵循项目的代码规范

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🆘 遇到问题？

1. 查看相关文档
2. 检查 ESLint 错误提示
3. 查看控制台编译错误
4. 询问团队成员

---

**记住：遵循开发规范可以避免很多问题，让开发更顺畅！** 🚀 