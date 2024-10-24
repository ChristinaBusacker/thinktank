import express from 'express';
import { Trainings } from '../../core/interfaces/cms.interfaces';
import { querySize } from '../constants/querySize.constant';
import { trainingsQuery } from '../querys/training.query';
import { fetchHygraphData } from './fetchHygraphData.helper';
import { preferCacheEntries } from './nodeCache.helper';

export async function fetchTrainings(req: express.Request) {
  const loc = req.headers['locales'] || 'de';
  const locales = loc === 'de' ? ['de', 'en'] : ['en', 'de'];
  const variables = { locales: locales, size: querySize, skip: 0 };
  const cache = req.app.get('cache');

  return await preferCacheEntries<Trainings>(
    cache,
    `${loc}_trainings`,
    async () => {
      const response = await fetchHygraphData<Trainings>(
        trainingsQuery,
        variables
      );
      return response.data['trainings'];
    }
  );
}
