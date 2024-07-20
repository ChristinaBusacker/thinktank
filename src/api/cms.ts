import express from 'express';

import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { eventQuery, eventsQuery } from './querys/events.query';
import { postQuery, postsQuery } from './querys/posts.query';


const cmsRouter = express.Router();

cmsRouter.get('/event', async (req, res) => {

    const locales = req.headers['locales'] || ["de", "en"]
    const variables = { locales: locales };

    try {
        const response = await fetchHygraphData(eventsQuery, variables)
        res.json(response.data.events);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/event/:slug', async (req, res) => {

    const locales = req.headers['locales'] || ["de", "en"]
    const variables = { url: req.params.slug, locales: locales };

    try {
        const response = await fetchHygraphData(eventQuery, variables);
        if (!response?.data.event) {
            res.status(404).json({ message: `could not find event with rhe url ${variables.url}` })
        } else {
            res.json(response.data.event);
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/post', async (req, res) => {

    const locales = req.headers['locales'] || ["de", "en"]
    const variables = { locales: locales };

    try {
        const response = await fetchHygraphData(postsQuery, variables);
        res.json(response.data.posts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

cmsRouter.get('/post/:slug', async (req, res) => {
    const locales = req.headers['locales'] || ["de", "en"]
    const variables = { url: req.params.slug, locales: locales };

    try {
        const response = await fetchHygraphData(postQuery, variables);

        if (!response?.data.post) {
            res.status(404).json({ message: `could not find post with rhe url ${variables.url}` })
        } else {
            res.json(response.data.post);
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default cmsRouter;