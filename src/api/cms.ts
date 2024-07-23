import express from 'express';
import NodeCache from "node-cache";
import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { eventQuery, eventsQuery } from './querys/events.query';
import { postQuery, postsQuery } from './querys/posts.query';
import { preferCacheEntries } from './helpers/nodeCache.helper';
import { Event, Events, Posts } from '../core/interfaces/cms.interfaces';


const cmsRouter = express.Router();


const cache = new NodeCache();


cmsRouter.get('/event', async (req, res) => {
    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];

    const variables = { locales };

    try {
        const data = await preferCacheEntries<Events>(`${loc}_events`, async () => {
            const response = await fetchHygraphData<Events>(eventsQuery, variables)
            return response.data['events']
        })

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/event/:slug', async (req, res) => {

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { url: req.params.slug, locales: locales };

    try {

        const events = await preferCacheEntries<Events>(`${loc}_events`, async () => {
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

    const loc = req.headers['locales'] || 'de';
    const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };


    try {
        const posts = await preferCacheEntries<Events>(`${loc}_posts`, async () => {
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

    try {
        const posts = await preferCacheEntries<Events>(`${loc}_posts`, async () => {
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
    cache.flushAll();
    console.log('flushed cache entries')
    res.json({ success: true });
});



export default cmsRouter;