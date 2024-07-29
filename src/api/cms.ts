import express from 'express';
import NodeCache from "node-cache";
import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { eventQuery, eventsQuery } from './querys/events.query';
import { postQuery, postsQuery } from './querys/posts.query';
import { preferCacheEntries } from './helpers/nodeCache.helper';
import { CMSObject, CMSObjectType, Event, Events, Localizations, Post, Posts } from '../core/interfaces/cms.interfaces';
import { localizationQuery } from './querys/localization.query';


const cmsRouter = express.Router();

cmsRouter.get('/event', async (req, res) => {
    const cache = req.app.get('cache');

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];

    const variables = { locales };

    try {
        const data = await preferCacheEntries<Events>(cache, `${loc}_events`, async () => {
            const response = await fetchHygraphData<Events>(eventsQuery, variables)
            return response.data['events']
        })

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/event/:slug', async (req, res) => {
    const cache = req.app.get('cache');

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { url: req.params.slug, locales: locales };

    try {

        const events = await preferCacheEntries<Events>(cache, `${loc}_events`, async () => {
            const response = await fetchHygraphData<Events>(eventsQuery, variables)
            return response.data['events']
        })

        const event = events?.find((event: Event) => event.url === variables.url)

        if (!event) {
            res.status(404).json({ message: `could not find event with rhe url ${variables.url}` })
        } else {
            res.json(event);
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/post', async (req, res) => {
    const cache = req.app.get('cache');

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };


    try {
        const posts = await preferCacheEntries<Events>(cache, `${loc}_posts`, async () => {
            const response = await fetchHygraphData<Events>(postsQuery, variables)
            return response.data['posts']
        })

        if (posts) {
            res.json(posts);
        } else {
            res.json([])
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/post/:slug', async (req, res) => {
    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { url: req.params.slug, locales: locales };
    const cache = req.app.get('cache');

    try {
        const posts = await preferCacheEntries<Events>(cache, `${loc}_posts`, async () => {
            const response = await fetchHygraphData<Events>(postsQuery, variables)
            return response.data['posts']
        })
        const post = posts?.find(post => post.url === variables.url);

        if (!post) {
            res.status(404).json({ message: `could not find post with rhe url ${variables.url}` })
        } else {
            res.json(post);
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/clearcache', async (req, res) => {
    const cache = req.app.get('cache');

    cache.keys().forEach(key => {
        console.log(`delete cache for ${key}`)
        cache.del(key)
    });
    console.log(cache.getStats())

    cache.flushAll();

    console.log('flushed cache entries', cache.get('de_events'))
    res.json({ success: true, ...cache.getStats() });
});

cmsRouter.post('/search', async (req, res) => {
    const cache = req.app.get('cache');

    const { query, option } = req.body;

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };

    const events = await preferCacheEntries<Events>(cache, `${loc}_events`, async () => {
        const response = await fetchHygraphData<Events>(eventsQuery, variables);
        return response.data['events'];
    }) || [];

    const posts = await preferCacheEntries<Posts>(cache, `${loc}_posts`, async () => {
        const response = await fetchHygraphData<Posts>(postsQuery, variables);
        return response.data['posts'];
    }) || [];

    // Kombinieren der Daten basierend auf den Optionen
    let combinedData: Array<CMSObject> = [];
    if (option === 'all') {

        combinedData = [
            ...events.map(event => ({ type: CMSObjectType.event, data: event })),
            ...posts.map(post => ({ type: CMSObjectType.post, data: post }))];
    } else if (option === 'events') {
        combinedData = events.map(event => ({ type: CMSObjectType.event, data: event }));
    } else if (option === 'posts') {
        combinedData = posts.map(post => ({ type: CMSObjectType.post, data: post }));
    }

    // Funktion zur Berechnung des Scores
    function calculateScore(item, query) {
        let score = 0;
        const queryLower = query.toLowerCase();

        if (item.title.toLowerCase().includes(queryLower)) {
            score += 10;
        }
        if (item.subtitle && item.subtitle.toLowerCase().includes(queryLower)) {
            score += 5;
        }
        if (item.text && item.text.html.toLowerCase().includes(queryLower)) {
            score += 1;
        }

        return score;
    }


    let scoredData = combinedData.map(item => ({
        ...item,
        score: calculateScore(item.data, query)
    }));

    scoredData = scoredData.filter(data => data.score > 0)

    // Sortieren der Daten nach Score
    scoredData.sort((a, b) => b.score - a.score);

    res.json(scoredData);
});

cmsRouter.get('/localizations', async (req, res) => {
    const cache = req.app.get('cache');
    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };
    try {
        const locs = await preferCacheEntries<Localizations>(cache, `${loc}_localization`, async () => {
            const response = await fetchHygraphData<Array<{ key: string, value: string }>>(localizationQuery, variables)

            const localizations: Localizations = {}

            if (response.data['localizations']) {
                response.data['localizations'].forEach(local => localizations[local.key] = local.value)
            }

            return localizations
        })


        if (locs) {
            res.json(locs);
        } else {
            res.json([])
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


export default cmsRouter;