module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // 基础规则
  },
  overrides: [
    {
      // 只对组件文件应用样式导入限制
      files: ['src/**/*.tsx', 'src/**/*.ts'],
      excludedFiles: ['src/main.tsx'], // 排除主入口文件
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['*.scss', '*.sass', '*.css'],
                message: '❌ 禁止在组件中导入样式文件！请查看 STYLE_GUIDE.md 了解正确的做法。样式应该在 main.scss 中统一管理。'
              }
            ]
          }
        ]
      }
    }
  ]
} 