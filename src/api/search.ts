import express from 'express';

const searchRouter = express.Router();


import { Event, Events, Post, Posts } from '../core/interfaces/cms.interfaces';
import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { preferCacheEntries } from './helpers/nodeCache.helper';
import { eventsQuery } from './querys/events.query';
import { postsQuery } from './querys/posts.query';

searchRouter.post('*', async (req, res) => {
    const { query, option } = req.body;

    const locales = req.headers['locales'] === 'de' ? ["de", "en"] : ["en", "de"];
    const variables = { locales: locales };

    const events = await preferCacheEntries<Events>('events', async () => {
        const response = await fetchHygraphData<Events>(eventsQuery, variables);
        return response.data['events'];
    }) || [];

    const posts = await preferCacheEntries<Posts>('posts', async () => {
        const response = await fetchHygraphData<Posts>(postsQuery, variables);
        return response.data['posts'];
    }) || [];

    // Kombinieren der Daten basierend auf den Optionen
    let combinedData: Array<Event | Post> = [];
    if (option === 'all') {
        combinedData = [...events, ...posts];
    } else if (option === 'events') {
        combinedData = events;
    } else if (option === 'posts') {
        combinedData = posts;
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
        score: calculateScore(item, query)
    }));

    scoredData = scoredData.filter(data => data.score > 0)

    // Sortieren der Daten nach Score
    scoredData.sort((a, b) => b.score - a.score);

    res.json(scoredData);
});

export default searchRouter;
