import {
  CMSObject,
  CMSObjectType,
  Events,
  Posts,
  Trainings,
} from '../interfaces/cms.interfaces';

export function mergeCMSObjects(
  events: Events = [],
  trainings: Trainings = [],
  posts: Posts = []
) {
  const objects: CMSObject[] = [
    ...events.map((event) => ({
      type: CMSObjectType.event,
      data: event,
    })),
    ...posts.map((post) => ({ type: CMSObjectType.post, data: post })),
    ...trainings.map((training) => ({
      type: CMSObjectType.training,
      data: training,
    })),
  ];

  return objects.sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime()
  );
}
