# 🤝 贡献指南

感谢你对 shipdaily.dev 项目的兴趣！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告和修复 Bug
- ✨ 提出新功能建议
- 📝 改进文档
- 🎨 UI/UX 改进
- 🧪 添加测试
- 🔧 性能优化

## 📋 开始之前

在开始贡献之前，请确保：

1. 阅读了项目的 [README.md](README.md) 
2. 了解项目的目标和定位
3. 检查 [Issues](https://github.com/wangrunlin/shipdaily.dev/issues) 确保你的想法还没有被讨论过

## 🚀 开发流程

### 1. 环境搭建

确保你的开发环境满足以下要求：

- Node.js 18.0 或更高版本
- npm 或 yarn
- Git

### 2. Fork 和 Clone

1. Fork 本仓库到你的 GitHub 账户
2. Clone 你的 fork 到本地：

```bash
git clone https://github.com/YOUR_USERNAME/shipdaily.dev.git
cd shipdaily.dev
```

3. 添加上游仓库：

```bash
git remote add upstream https://github.com/wangrunlin/shipdaily.dev.git
```

### 3. 创建分支

为你的功能或修复创建一个新分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名建议：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更改
- `style/` - 样式更改
- `refactor/` - 代码重构
- `perf/` - 性能优化

### 4. 本地开发

安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

### 5. 代码规范

请遵循以下代码规范：

- 使用 TypeScript 编写代码
- 遵循现有的代码风格和结构
- 为新功能添加适当的注释
- 确保代码在不同浏览器中正常工作

### 6. 提交代码

提交信息请遵循以下格式：

```
type(scope): description

[optional body]

[optional footer]
```

类型（type）：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 样式更改（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建工具或辅助工具的更改

示例：
```
feat(api): add GitHub API rate limiting

Add rate limiting to prevent API quota exhaustion
```

### 7. 推送和 Pull Request

1. 推送你的分支：

```bash
git push origin feature/your-feature-name
```

2. 在 GitHub 上创建 Pull Request：
   - 填写清晰的 PR 标题和描述
   - 解释你的更改内容和原因
   - 如果相关，请链接到相应的 Issue

## 🐛 报告问题

### Bug 报告

如果你发现了 Bug，请创建一个 Issue 并包含以下信息：

- **问题描述**: 清楚描述遇到的问题
- **复现步骤**: 详细的步骤说明
- **预期行为**: 你期望的正确行为
- **实际行为**: 实际发生的情况
- **环境信息**: 
  - 操作系统
  - 浏览器版本
  - Node.js 版本（如果相关）
- **截图**: 如果有助于理解问题

### 功能请求

如果你有新功能的想法，请创建一个 Issue 并包含：

- **功能描述**: 详细说明建议的功能
- **使用场景**: 解释为什么这个功能有用
- **可能的实现**: 如果有想法，可以简单描述实现方案
- **优先级**: 说明这个功能的重要程度

## 📝 文档贡献

文档改进也是重要的贡献！你可以：

- 修正错别字和语法错误
- 改进现有文档的清晰度
- 添加缺失的文档
- 翻译文档

## 🎨 设计贡献

如果你对 UI/UX 有想法：

- 可以提交设计建议的 Issue
- 包含设计稿或原型
- 解释设计改进的理由

## ✅ 代码审查

所有 Pull Request 都会经过代码审查：

- 保持耐心，审查可能需要一些时间
- 积极响应反馈，进行必要的修改
- 如果有不明白的地方，随时提问

## 🏷️ Issue 标签

我们使用以下标签来组织 Issues：

- `bug` - 确认的 Bug
- `enhancement` - 功能改进
- `good first issue` - 适合新贡献者的问题  
- `help wanted` - 需要帮助的问题
- `question` - 问题讨论
- `documentation` - 文档相关
- `wontfix` - 不会修复的问题

## 📞 获取帮助

如果你在贡献过程中遇到问题：

- 查看现有的 Issues 和 Pull Requests
- 创建一个 Discussion 或 Issue 询问
- 通过 Twitter [@wangrunlin_](https://twitter.com/wangrunlin_) 联系

## 🎉 致谢

感谢每一位贡献者！你的参与让这个项目变得更好。

所有贡献者都会在 README 中得到认可。

---

再次感谢你对 shipdaily.dev 的贡献！🚢