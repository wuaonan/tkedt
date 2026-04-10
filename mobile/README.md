# TKEDT Mobile

基于 React Native + Expo 的 C 端刷题 App 外壳，面向 iOS 与 Android 双端。

## 当前包含

- Expo + TypeScript 项目骨架
- React Navigation 底部导航 + 练习页堆栈
- 5 个核心页面
  - 首页
  - 章节练习
  - 模拟考试
  - 错题本
  - 我的
- 单题练习页
- 直接接入仓库根目录中的 `jxedt_questions.json`
- 基于 `ui-ux-pro-max` 生成的移动端设计系统

## 设计方向

- 面向 C 端用户
- 清晰、可信、轻量
- 深色文本 + 金色强调
- 微交互优先，避免复杂动画和花哨营销感

## 推荐运行方式

```bash
cd mobile
npm install
npm run start
```

## 后续建议

1. 接入本地持久化，记录错题和收藏
2. 增加真实模考流程与倒计时
3. 接入 Figma 设计稿并做组件对齐
4. 扩展科目四题库与用户系统
