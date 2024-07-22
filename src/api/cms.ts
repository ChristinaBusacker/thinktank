import express from 'express';

import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { eventQuery, eventsQuery } from './querys/events.query';
import { postQuery, postsQuery } from './querys/posts.query';
import { preferCacheEntries } from './helpers/nodeCache.helper';
import { Event, Events, Posts } from '../core/interfaces/cms.interfaces';


const cmsRouter = express.Router();

cmsRouter.get('/event', async (req, res) => {

    const locales = req.headers['locales'] === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };

    try {
        const data = await preferCacheEntries<Events>('events', async () => {
            const response = await fetchHygraphData<Events>(eventsQuery, variables)
            return response.data['events']
        })

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/event/:slug', async (req, res) => {

    const locales = req.headers['locales'] === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { url: req.params.slug, locales: locales };

    try {

        const events = await preferCacheEntries<Events>('events', async () => {
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

    const locales = req.headers['locales'] === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };


    try {
        const posts = await preferCacheEntries<Posts>('posts', async () => {
            const response = await fetchHygraphData<Posts>(postsQuery, variables)
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
    const locales = req.headers['locales'] === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { url: req.params.slug, locales: locales };

    try {
        const posts = await preferCacheEntries<Posts>('posts', async () => {
            const response = await fetchHygraphData<Posts>(postsQuery, variables)
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

export default cmsRouter;