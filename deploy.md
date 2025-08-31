# 部署说明

## Vercel 部署

```bash
# 使用 Vercel 部署（推荐）
cp astro.config.mjs astro.config.vercel.mjs
vercel --prod
```

## Cloudflare Pages 部署（备选方案）

```bash
# 如果 Vercel 有问题，使用 Cloudflare Pages
cp astro.config.cloudflare.mjs astro.config.mjs
npm run build
# 然后通过 Cloudflare Pages dashboard 上传 dist 目录
```

## 当前配置

- 主配置：静态生成模式
- API 路由：使用静态数据预生成
- Vercel 适配器：已安装但注释掉
- Cloudflare 适配器：已安装，有备选配置文件

## 注意事项

- 当前项目已连接到 softie-ai/shipdaily.dev
- 静态模式下，API 路由会在构建时预生成
- 如需动态 API，需要启用相应适配器
