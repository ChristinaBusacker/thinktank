import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import apiRouter from './src/api/api';
import cors from 'cors'
import NodeCache from 'node-cache';
import { preferCacheEntries } from './src/api/helpers/nodeCache.helper';
import { fetchHygraphData } from './src/api/helpers/fetchHygraphData.helper';

interface CMSSitemapHelper {
  events: {
    url: string
  },
  pages: {
    url: string
  },
  posts: {
    url: string
  }
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const cache = new NodeCache();
  server.set('cache', cache)

  var corsOptions = {
    origin: '*',
  }

  server.use(cors(corsOptions))
  server.use(express.json());

  server.use('/api', apiRouter);

  server.get('/sitemap.xml', async (req, res) => {
    const sitemap = await generateSitemap(req);
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));



  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

async function generateSitemap(req: express.Request): Promise<string> {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  {
    const response = await fetchHygraphData<any>(
      `query CMSSitemap {
      events {
        url
      }
      pages {
        url
      }
      posts {
        url
      }
    }`, {})

    const routes = [
      { loc: '', changefreq: 'weekly', priority: 1 },
      { loc: 'blog', changefreq: 'weekly', priority: 0.4 },
      { loc: 'events', changefreq: 'weekly', priority: 0.4 }
    ];

    for (const page of response.data['pages']) {
      routes.push({ loc: page.url, changefreq: 'monthly', priority: 0.2 })
    }


    for (const event of response.data['events']) {
      routes.push({ loc: `events/${event.url}`, changefreq: 'monthly', priority: 0.8 })
    }


    for (const post of response.data['posts']) {
      routes.push({ loc: `blog/${post.url}`, changefreq: 'monthly', priority: 0.8 })
    }



    const urls = routes.map(route => `
    <url>
      <loc>${baseUrl}/${route.loc}</loc>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  }

}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
