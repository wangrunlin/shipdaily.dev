# 🚢 shipdaily.dev - 产品需求文档 (PRD)

## 📋 项目概述

**产品名称**: shipdaily.dev  
**产品定位**: 个人 Build in Public 展示网站 + 开发者每日 Ship 社区  
**核心用户**: 想要建立每日编程习惯的开发者  
**主要目标**: 展示 X `@wangrunlin_`, GitHub `wangrulin` 的每日 Ship 进度，激励社区参与

## 🎯 产品目标

### 短期目标 (1-3 个月)

- 展示个人每日 Ship 进度
- 获得开发者社区关注
- 建立 shipdaily 品牌认知

### 长期目标 (6-12 个月)

- 成为开发者习惯养成的知名平台
- 通过 AdSense 和知识付费变现
- 建立付费社群

## 👥 目标用户

**主要用户**:

- 想要建立编程习惯的开发者
- 对 Build in Public 感兴趣的创业者
- 寻找灵感和动力的程序员

**用户场景**:

- 想看别人是如何坚持每日编程的
- 寻找项目灵感和动力
- 想要加入每日 Ship 挑战

## 🔧 核心功能

### MVP 版本 (第一版)

#### 1. 首页 - 个人进度展示

**数据来源**: GitHub API 检测 `shipdaily-personal` 仓库

- ✅/❌ 今日是否有 commit
- 🔥 连续 Ship 天数
- 📊 本月完成天数
- 📈 总计 Ship 天数
- 📅 最近 7 天的打卡日历视图

#### 2. 项目说明页面

- 什么是 ShipDaily 挑战
- 为什么每日 Ship 很重要
- 如何开始你的 Ship 之旅
- `@wangrunlin_` 的个人故事和目标

#### 3. 社区页面

**3.1 全社区动态** (`/community`)

- 显示 Twitter #shipdaily hashtag 的实时帖子
- 按时间排序
- 帖子预览 + 点击跳转到 Twitter

**3.2 个人动态** (`/me`)

- 只显示 `@wangrunlin_` 的 #shipdaily 相关推文
- 作为个人 Ship 日志的补充展示

#### 4. 基础页面

- 关于页面：项目背景、个人介绍
- 联系页面：社交媒体链接

### 技术实现

#### 前端架构

```text
推荐技术栈: Astro + Tailwind CSS
- Astro: 优秀的SEO、快速加载
- Tailwind: 快速样式开发
- 静态生成: 降低服务器成本
```

#### 数据获取

```javascript
// GitHub API 检测commit
GET /repos/wangrunlin/shipdaily-personal/commits?since=TODAY

// Twitter API (或第三方API) 获取hashtag
GET /search/tweets?q=%23shipdaily
```

#### 部署方案

- Vercel/Netlify 免费部署
- 自动部署，每次 push 自动更新
- 自定义域名 shipdaily.dev

## 📱 页面结构

### 首页设计要点

```text
Header: Logo + 导航
Hero Section:
  - 当前进度大数字展示
  - 今日状态 ✅/❌
  - 简单的CTA ("Join the Challenge")

Progress Section:
  - 连续天数
  - 月度进度条
  - 最近7天日历

About Section:
  - 简短的项目介绍
  - 链接到详细说明页

Footer: 社交媒体链接
```

## 🚀 开发优先级

### Phase 1 (Week 1)

- [x] 基础页面结构和设计
- [x] GitHub API 集成，检测每日 commit
- [x] 基础数据展示（连续天数、总天数）

### Phase 2 (Week 2)

- [x] Twitter hashtag 集成
- [x] 社区页面开发
- [x] 响应式设计优化

### Phase 3 (Week 3-4)

- [x] SEO 优化（meta 标签、sitemap 等）
- [x] 性能优化
- [x] 数据分析集成（Google Analytics）

### Phase 4 (未来)

- [ ] 用户注册功能
- [ ] 个人 dashboard
- [ ] 排行榜功能
- [ ] 变现功能集成

## 📊 成功指标

**技术指标**:

- 页面加载速度 < 2 秒
- Google PageSpeed Score > 90
- 移动端友好

**业务指标**:

- 月访问用户数
- Twitter hashtag 使用增长
- 社区参与度

## 🎨 设计原则

- **极简主义**: 专注核心功能，避免功能过载
- **数据驱动**: 突出数字和进度，给人成就感
- **社区友好**: 鼓励互动和分享
- **移动优先**: 保证手机浏览体验
