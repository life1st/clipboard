# 设计文档 (DESIGN_DOCS)

## 公共组件标准结构

### 1. 组件文件结构

每个公共组件应包含以下文件：
```
src/components/
├── component-name.tsx          # 组件实现
└── src/styles/components/
    └── _component-name.scss    # 组件样式
```

### 2. 组件实现标准

#### 2.1 基础结构
```typescript
import React, { forwardRef } from 'react';

export interface ComponentNameProps {
  // 属性定义
}

const ComponentName = forwardRef<HTMLElementType, ComponentNameProps>(({
  // 属性解构
}, ref) => {
  // 组件逻辑
  
  return (
    // JSX 结构
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

#### 2.2 属性接口标准
- 使用 `export interface` 导出类型
- 属性名使用 camelCase
- 可选属性使用 `?`
- 提供合理的默认值
- 支持 `className` 和 `ref` 传递

#### 2.3 尺寸系统
所有支持尺寸的组件应使用统一的尺寸定义：
```typescript
size?: 'sm' | 'md' | 'lg';
```

**尺寸规格**：

| 尺寸 | padding | min-height | font-size | 响应式 padding | 响应式 min-height |
|------|---------|------------|-----------|----------------|-------------------|
| `sm` | 4px 8px | 32px | 12px | 6px 8px | 36px |
| `md` | 6px 12px | 40px | 14px | 8px 12px | 44px |
| `lg` | 8px 16px | 48px | 16px | 10px 16px | 52px |

**说明**：
- 基础尺寸适用于桌面端（≥768px）
- 响应式尺寸适用于移动端（<768px）
- 所有尺寸使用 px 单位，确保跨设备一致性
- Button 和 Input 组件完全共享相同的尺寸系统

#### 2.4 设计系统配置

**间距系统**：
```scss
$spacing-xs: 2px;   // 2px
$spacing-sm: 6px;   // 6px
$spacing-md: 12px;  // 12px
$spacing-lg: 16px;  // 16px
$spacing-xl: 24px;  // 24px
$spacing-xxl: 32px; // 32px
```

**圆角系统**：
```scss
$border-radius-sm: 4px;   // 4px
$border-radius-md: 6px;   // 6px
$border-radius-lg: 8px;   // 8px
$border-radius-xl: 12px;  // 12px
```

**字体系统**：
```scss
$font-size-base: 14px;    // 14px
$font-size-sm: 12px;      // 12px
$font-size-lg: 16px;      // 16px
$font-size-xl: 18px;      // 18px
```

**断点系统**：
```scss
$breakpoint-mobile: 0;     // 移动设备
$breakpoint-desktop: 768px; // PC 设备
```

**响应式混入**：
```scss
@include respond-to('mobile') { /* 移动端样式 */ }
@include respond-to('desktop') { /* 桌面端样式 */ }
```

### 3. 样式文件标准

#### 3.1 基础样式结构
```scss
// =============================================================================
// ComponentName 组件样式
// =============================================================================

.component-name {
  // 基础样式
  
  // 尺寸变体
  &--sm { /* sm 尺寸样式 */ }
  &--md { /* md 尺寸样式 */ }
  &--lg { /* lg 尺寸样式 */ }
  
  // 状态变体
  &--disabled { /* 禁用状态 */ }
  &--loading { /* 加载状态 */ }
  
  // 响应式设计
  @media (max-width: 640px) { /* 移动端适配 */ }
}
```

#### 3.2 样式原则
- 使用 BEM 命名规范
- 支持尺寸变体 (`--sm`, `--md`, `--lg`)
- 支持状态变体 (`--disabled`, `--loading`, `--error` 等)
- 响应式设计支持（移动端 <768px，桌面端 ≥768px）
- 使用 CSS 变量和 SCSS 变量保持一致性
- 所有尺寸使用 px 单位，避免 rem 计算差异

### 4. 已实现的公共组件

#### 4.1 组件概览表

| 组件名称 | 文件路径 | 样式文件 | 主要特性 | 尺寸支持 | 状态支持 | 技术特点 |
|----------|----------|----------|----------|----------|----------|----------|
| Button | `src/components/button.tsx` | `src/styles/components/_button.scss` | variant、size、loading、disabled | sm、md、lg | disabled、loading | 支持 4 种变体、悬停动画、加载状态 |
| Input | `src/components/input.tsx` | `src/styles/components/_input.scss` | type、size、disabled、readOnly | sm、md、lg | disabled、readOnly、error、success、warning | 支持多种输入类型、状态样式、响应式设计 |
| Modal | `src/components/modal.tsx` | `src/styles/components/_modal.scss` | 标题、内容、关闭按钮、遮罩点击 | 响应式设计 | 打开/关闭 | 支持自定义宽度、遮罩点击关闭、键盘导航 |
| Toast | `src/components/toast.tsx` | `src/styles/components/_toast.scss` | 类型、消息、自动消失、动画 | 自适应 | success、error、warning、info | 支持 4 种类型、自动消失、动画效果 |
| QRCode | `src/components/qr-code.tsx` | `src/styles/components/_qr-code.scss` | 自定义尺寸、占位符、错误处理 | 可配置 | 加载、错误 | 支持自定义尺寸、错误边界、占位符显示 |

#### 4.2 Toast 组件类型对比

| 类型 | 颜色主题 | 图标 | 用途 |
|------|----------|------|------|
| success | 绿色 | ✓ | 成功提示 |
| error | 红色 | ✗ | 错误提示 |
| warning | 橙色 | ⚠ | 警告提示 |
| info | 蓝色 | ℹ | 信息提示 |

### 5. 组件使用规范

#### 5.1 导入方式
```typescript
import ComponentName from '../components/component-name';
```

#### 5.2 样式引入
在主样式文件中引入：
```scss
@import 'components/component-name';
```

#### 5.3 类型导出
```typescript
export type { ComponentNameProps } from '../components/component-name';
```

### 6. 开发规范

#### 6.1 新增组件
1. 创建组件实现文件
2. 创建样式文件
3. 在主样式文件中引入
4. 更新此文档

#### 6.2 组件修改
1. 保持向后兼容
2. 更新类型定义
3. 更新样式文件
4. 更新此文档

#### 6.3 测试要求
- 组件能正常编译
- 样式正确加载
- 响应式设计正常
- 无障碍访问支持

### 7. 设计原则

- **一致性**: 所有组件使用统一的尺寸系统和设计语言
- **可复用性**: 组件应支持多种配置和状态
- **可访问性**: 支持键盘导航和屏幕阅读器
- **响应式**: 在不同设备上都有良好的显示效果
- **性能**: 使用 React.memo 和 useCallback 优化渲染性能

### 8. 更新日志

#### 2024年最新更新
- **尺寸系统重构**: 将所有 rem 单位替换为 px 单位，确保跨设备一致性
- **断点系统简化**: 简化为移动端（<768px）和桌面端（≥768px）两个断点
- **变量系统优化**: 使用 CSS 变量替代 SCSS maps，提升性能和兼容性
- **响应式设计**: 为所有尺寸变体添加移动端适配
- **设计文档同步**: 更新文档以反映最新的设计系统实现

#### 技术改进
- 消除对 `map-get` 函数的依赖
- 统一 Button 和 Input 组件的尺寸系统
- 优化样式文件结构，减少重复代码
- 提升样式系统的可维护性和扩展性 