import type { APIRoute } from 'astro';

const pages = [
  {
    url: '',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'about',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'community',
    changefreq: 'daily',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'me',
    changefreq: 'daily',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'contact',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

export const GET: APIRoute = () => {
  const baseUrl = 'https://shipdaily.dev';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};