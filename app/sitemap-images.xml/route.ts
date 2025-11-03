import { posts } from '@/data/blog/posts';

function escapeXml(unsafe: any) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://voltris.com.br';
  const urls = posts.map(post => {
    const imageUrl = post.coverImage?.startsWith('http')
      ? post.coverImage
      : `${baseUrl}${post.coverImage}`;
    const title = escapeXml(post.title);
    const description = escapeXml(post.description || post.title);
    const slug = escapeXml(post.slug);
    const imageLoc = escapeXml(imageUrl);

    return `
      <url>
        <loc>${baseUrl}/blog/${slug}</loc>
        <image:image>
          <image:loc>${imageLoc}</image:loc>
          <image:title>${title}</image:title>
          <image:caption>${description}</image:caption>
        </image:image>
      </url>
    `;
  });

  const logoPngUrl = `${baseUrl}/logo.png`;
  const logoPngEntry = `
    <url>
      <loc>${baseUrl}/</loc>
      <image:image>
        <image:loc>${escapeXml(logoPngUrl)}</image:loc>
        <image:title>${escapeXml('Logo Principal VOLTRIS')}</image:title>
        <image:caption>${escapeXml('Logo principal da VOLTRIS para Google Snippet')}
        </image:caption>
      </image:image>
    </url>
  `;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${logoPngEntry}
      ${urls.join('\n')}
    </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  );
} 