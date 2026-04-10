# tkedt

一个围绕驾考题库整理、产品需求梳理、原型设计与后续 App 开发的项目仓库。

## 项目内容

当前仓库包含 4 个核心部分：

- 题库数据
  - `jxedt_questions.json`
  - `jxedt_questions.csv`
- 题库抓取脚本
  - `scrape_jxedt_questions.py`
- 产品需求文档
  - `quiz-app-prd.md`
- 移动端原型
  - `prototype/index.html`
  - `prototype/styles.css`
- React Native App 外壳
  - `mobile/`

## 当前阶段

本项目目前已经完成：

1. 题库接口分析与数据抓取
2. 刷题 App 的 MVP 需求文档整理
3. 移动端原型页面搭建
4. React Native + Expo 的 iOS / Android 双端 App 外壳

下一步计划：

1. 将原型同步到 Figma
2. 基于 PRD 继续细化 UI 设计
3. 选择技术栈并开始 App 开发

## 文件说明

### 1. 题库数据

- `jxedt_questions.json`
  - 结构化题库数据，适合程序读取、导库、二次处理
- `jxedt_questions.csv`
  - 适合用 Excel、Sheets、数据库导入工具查看和处理

### 2. 抓取脚本

- `scrape_jxedt_questions.py`
  - 支持从页面提取真实题目 `data-id`
  - 再调用题目接口抓取完整题干、选项、答案、解析
  - 支持导出 JSON 和 CSV

示例：

```bash
python3 scrape_jxedt_questions.py \
  --mode page-ids \
  --start 1 \
  --end 1639 \
  --insecure \
  --cookie '你的cookie'
```

## 原型预览

原型文件位于：

- `prototype/index.html`
- `prototype/styles.css`

如果要本地预览，可以在 `prototype` 目录运行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://127.0.0.1:8000
```

## 移动端 App

React Native 项目位于：

- `mobile/`

当前已经包含：

- Expo + TypeScript 基础骨架
- React Navigation 底部导航
- 首页、章节、模考、错题本、我的 5 个核心页面
- 单题练习页
- 接入本仓库内已有题库 JSON

进入移动端项目：

```bash
cd mobile
npm install
npm run start
```

## 产品方向

当前刷题 App 的 MVP 主要包括：

- 首页
- 顺序练习
- 章节练习
- 模拟考试
- 错题本
- 学习记录

重点体验方向：

- 快速开始刷题
- 即时判题与解析
- 进度可视化
- 错题回练
- 模考结果反馈

## 后续开发建议

建议后续优先按下面顺序推进：

1. 清洗题库字段，确定数据库结构
2. 完成 Figma 设计稿
3. 选择技术栈
   - React Native + Expo
   - Flutter
4. 开发 MVP
5. 接入练习记录、错题本、模考逻辑

## 仓库地址

GitHub:

- https://github.com/wuaonan/tkedt
