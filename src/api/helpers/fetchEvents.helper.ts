import express from 'express';
import { Events } from '../../core/interfaces/cms.interfaces';
import { querySize } from '../constants/querySize.constant';
import { eventsQuery } from '../querys/events.query';
import { fetchHygraphData } from './fetchHygraphData.helper';
import { preferCacheEntries } from './nodeCache.helper';

export async function fetchEvents(req: express.Request) {
  const loc = req.headers['locales'] || 'de';
  const locales = loc === 'de' ? ['de', 'en'] : ['en', 'de'];
  const variables = { locales: locales, size: querySize, skip: 0 };
  const cache = req.app.get('cache');

  return await preferCacheEntries<Events>(cache, `${loc}_events`, async () => {
    const response = await fetchHygraphData<Events>(eventsQuery, variables);
    return response.data['events'];
  });
}
