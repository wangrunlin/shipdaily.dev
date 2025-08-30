# 🚢 shipdaily.dev

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01.svg)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 个人 Build in Public 展示网站 + 开发者每日 Ship 社区

**shipdaily.dev** 是一个展示每日编程挑战进展的网站，旨在激励开发者建立持续学习和创造的习惯。通过 Build in Public 的方式，记录并分享每日的编程进展。

🌐 **在线访问**: [https://shipdaily.dev](https://shipdaily.dev)

## ✨ 特性

- 📊 **实时进度追踪** - 通过 GitHub API 自动检测每日 commit 状态
- 🔥 **连击统计** - 展示连续编程天数和总体进度
- 📅 **日历视图** - 可视化展示最近的编程活动
- 🌟 **社区动态** - 展示 #shipdaily 社区成员的分享
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **极致性能** - 基于 Astro 的静态站点生成
- 🔍 **SEO 优化** - 完整的 meta 标签和结构化数据

## 🏗️ 技术栈

- **框架**: [Astro](https://astro.build/) - 现代静态站点生成器
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **语言**: TypeScript
- **API**: GitHub API (获取 commit 数据)
- **部署**: Vercel (推荐)

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- [Bun](https://bun.sh/) 1.0 或更高版本

### 本地开发

1. 克隆仓库

```bash
git clone https://github.com/wangrunlin/shipdaily.dev.git
cd shipdaily.dev
```

2. 安装依赖

```bash
bun install
```

3. 启动开发服务器

```bash
bun run dev
```

4. 打开浏览器访问 [http://localhost:4321](http://localhost:4321)

### 构建部署

```bash
# 构建生产版本
bun run build

# 预览构建结果
bun run preview
```

## 📁 项目结构

```bash
├── public/                 # 静态资源
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/         # 可重用组件 (待扩展)
│   ├── layouts/           # 页面布局
│   │   └── Layout.astro
│   ├── lib/               # 工具库
│   │   └── github.ts      # GitHub API 集成
│   ├── pages/             # 页面路由
│   │   ├── api/           # API 端点
│   │   │   └── stats.ts   # 获取统计数据
│   │   ├── index.astro    # 首页
│   │   ├── about.astro    # 关于页面
│   │   ├── community.astro # 社区动态
│   │   ├── me.astro       # 个人动态
│   │   ├── contact.astro  # 联系页面
│   │   └── sitemap.xml.ts # 站点地图
│   └── styles/
│       └── global.css     # 全局样式
├── docs/
│   └── PRD.md            # 产品需求文档
└── README.md
```

## 🔧 配置说明

### GitHub API 配置

项目通过 GitHub API 获取提交数据。默认监控的仓库配置在 `src/lib/github.ts` 中：

```typescript
private readonly username = 'wangrunlin';
private readonly repo = 'shipdaily-personal';
```

如需修改监控的用户和仓库，请更新这些配置。

### 环境变量 (可选)

虽然当前版本使用公共 API，但如需提高 API 限额，可以配置：

```bash
# .env.local
GITHUB_TOKEN=your_github_token_here
```

## 🎯 使用指南

### 开始你的 ShipDaily 挑战

1. **创建专用仓库** - 在 GitHub 创建一个 `shipdaily-personal` 或类似名称的仓库
2. **每日提交** - 确保每天至少有一次 commit
3. **分享进展** - 在社交媒体使用 #shipdaily 标签分享你的进展
4. **持续改进** - 记录学习过程，不断完善项目

### 自定义部署

如果你想部署自己的版本：

1. Fork 本仓库
2. 修改 `src/lib/github.ts` 中的用户名和仓库名
3. 更新 `astro.config.mjs` 中的 site URL
4. 部署到 Vercel、Netlify 或其他静态托管平台

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 问题报告

如果你发现了 bug 或有功能建议，请在 [Issues](https://github.com/wangrunlin/shipdaily.dev/issues) 页面创建新的问题。

## 📄 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Astro](https://astro.build/) - 出色的静态站点生成框架
- [Tailwind CSS](https://tailwindcss.com/) - 强大的 CSS 框架
- [GitHub API](https://docs.github.com/en/rest) - 提供数据支持
- 所有参与 #shipdaily 挑战的开发者们

## 📞 联系方式

- **作者**: wangrunlin
- **X/Twitter**: [@wangrunlin\_](https://x.com/wangrunlin_)
- **GitHub**: [@wangrunlin](https://github.com/wangrunlin)
- **网站**: [shipdaily.dev](https://shipdaily.dev)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！

🚢 **让我们一起每日 Ship，持续成长！** 🚀
