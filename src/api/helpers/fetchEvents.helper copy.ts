import express from 'express';
import { fetchEvents } from './fetchEvents.helper';
import { fetchPosts } from './fetchPosts.helper';
import { fetchTrainings } from './fetchTrainings.helper';

export async function fetchObjects(req: express.Request) {
  const events = await fetchEvents(req);
  const posts = await fetchPosts(req);
  const trainings = await fetchTrainings(req);

  return { events, posts, trainings };
}
