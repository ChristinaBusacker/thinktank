import express from 'express';
import { Posts } from '../../core/interfaces/cms.interfaces';
import { querySize } from '../constants/querySize.constant';
import { postsQuery } from '../querys/posts.query';
import { fetchHygraphData } from './fetchHygraphData.helper';
import { preferCacheEntries } from './nodeCache.helper';

export async function fetchPosts(req: express.Request) {
  const loc = req.headers['locales'] || 'de';
  const locales = loc === 'de' ? ['de', 'en'] : ['en', 'de'];
  const variables = { locales: locales, size: querySize, skip: 0 };
  const cache = req.app.get('cache');

  return await preferCacheEntries<Posts>(cache, `${loc}_posts`, async () => {
    const response = await fetchHygraphData<Posts>(postsQuery, variables);
    return response.data['posts'];
  });
}
