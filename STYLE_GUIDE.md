# 样式开发规范 (Style Guide)

## 🚫 禁止事项

### 1. **绝对不要在 React 组件中导入 SCSS 文件**

```tsx
// ❌ 错误做法
import React from 'react';
import './button.scss';  // 禁止！

const Button = () => {
  return <button className="btn">点击</button>;
};

export default Button;
```

```tsx
// ✅ 正确做法
import React from 'react';
// 不需要导入 SCSS 文件

const Button = () => {
  return <button className="btn">点击</button>;
};

export default Button;
```

### 2. **为什么不能这样做？**

- **Sass 模块依赖**：组件中的 `@use` 规则无法正确解析
- **构建失败**：会导致 Sass 编译错误
- **路径问题**：相对路径在组件上下文中无法正确解析
- **架构混乱**：破坏统一的样式管理架构

## ✅ 正确的样式管理方式

### 1. **样式文件结构**
```
src/styles/
├── _variables.scss      # 设计系统变量
├── _mixins.scss         # 设计系统 mixin
├── main.scss            # 主样式文件（统一导入所有样式）
├── components/          # 组件样式
│   ├── _button.scss
│   ├── _input.scss
│   └── ...
└── pages/               # 页面样式
    ├── _clipboard-list.scss
    └── _settings.scss
```

### 2. **添加新组件的步骤**

#### **步骤 1：创建样式文件**
```scss
// src/styles/components/_new-component.scss
@use '../variables' as *;
@use '../mixins' as *;

.new-component {
  // 组件样式
}
```

#### **步骤 2：在 main.scss 中导入**
```scss
// src/styles/main.scss
@use 'components/new-component';  // 添加这一行
```

#### **步骤 3：在 React 组件中使用**
```tsx
// src/components/NewComponent.tsx
import React from 'react';

const NewComponent = () => {
  return <div className="new-component">内容</div>;
};

export default NewComponent;
```

## 🔧 工具和检查

### 1. **ESLint 规则**
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "*.scss",
          "*.sass",
          "*.css"
        ]
      }
    ]
  }
}
```

### 2. **Pre-commit Hook**
```bash
#!/bin/sh
# .git/hooks/pre-commit

# 检查是否有组件导入了 SCSS 文件
if git diff --cached --name-only | xargs grep -l "import.*\.scss"; then
  echo "❌ 检测到组件中导入了 SCSS 文件！"
  echo "请查看 STYLE_GUIDE.md 了解正确的做法"
  exit 1
fi
```

### 3. **VSCode 设置**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "files.associations": {
    "*.scss": "scss"
  }
}
```

## 📚 学习资源

### 1. **Sass 官方文档**
- [@use 规则](https://sass-lang.com/documentation/at-rules/use/)
- [模块系统](https://sass-lang.com/guide#modules)

### 2. **项目架构说明**
- 查看 `DESIGN_DOCS.md` 了解设计系统
- 查看 `src/styles/main.scss` 了解样式导入结构

## 🚨 常见错误和解决方案

### 错误 1：组件中导入 SCSS
```tsx
// ❌ 错误
import './styles.scss';

// ✅ 解决：删除这行导入
```

### 错误 2：样式文件路径错误
```scss
// ❌ 错误
@use '../../variables' as *;

// ✅ 正确
@use '../variables' as *;
```

### 错误 3：忘记在 main.scss 中导入
```scss
// ❌ 忘记添加
// @use 'components/new-component';

// ✅ 记得添加
@use 'components/new-component';
```

## 📝 检查清单

在提交代码前，请确认：

- [ ] 没有在 React 组件中导入 SCSS 文件
- [ ] 新样式文件已在 main.scss 中导入
- [ ] 样式文件使用了正确的 @use 语法
- [ ] 变量和 mixin 引用路径正确
- [ ] 样式类名遵循 BEM 命名规范

## 🆘 遇到问题？

1. **查看控制台错误**：Sass 编译错误会显示具体问题
2. **检查 main.scss**：确保样式文件已正确导入
3. **查看 STYLE_GUIDE.md**：了解正确的开发流程
4. **询问团队成员**：不要猜测，直接询问

---

**记住：样式管理是项目架构的重要组成部分，遵循规范可以避免很多问题！** 