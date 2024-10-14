import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  CMSObject,
  CMSObjectType,
  Events,
  Posts,
  Trainings,
} from '../../../../core/interfaces/cms.interfaces';
import { SetEvents, SetPosts, SetTrainings } from './cms.actions';

export interface CMSStateModel {
  events: Events;
  posts: Posts;
  trainings: Trainings;
  objects: CMSObject[];
}

@Injectable()
@State<CMSStateModel>({
  name: 'cms',
  defaults: {
    events: [],
    posts: [],
    objects: [],
    trainings: [],
  },
})
export class CMSState {
  @Selector()
  static getEvents(state: CMSStateModel): Events {
    return state.events;
  }

  @Selector()
  static getPosts(state: CMSStateModel): Posts {
    return state.posts;
  }

  @Selector()
  static getObjects(state: CMSStateModel): CMSObject[] {
    return state.objects;
  }

  @Selector()
  static getTrainings(state: CMSStateModel): Trainings {
    return state.trainings;
  }

  @Action(SetEvents)
  setEvents(ctx: StateContext<CMSStateModel>, action: SetEvents) {
    ctx.patchState({
      events: action.events,
    });
    this.setObjects(ctx);
  }

  @Action(SetTrainings)
  setTrainings(ctx: StateContext<CMSStateModel>, action: SetTrainings) {
    ctx.patchState({
      trainings: action.trainings,
    });
    this.setObjects(ctx);
  }

  @Action(SetPosts)
  setPosts(ctx: StateContext<CMSStateModel>, action: SetPosts) {
    ctx.patchState({
      posts: action.posts,
    });
    this.setObjects(ctx);
  }

  private setObjects(ctx: StateContext<CMSStateModel>) {
    const state = ctx.getState();
    const objects = [
      ...state.events.map((event) => ({
        type: CMSObjectType.event,
        data: event,
      })),
      ...state.posts.map((post) => ({ type: CMSObjectType.post, data: post })),
      ...state.trainings.map((training) => ({
        type: CMSObjectType.training,
        data: training,
      })),
    ];
    ctx.patchState({
      objects: objects.sort(
        (a, b) =>
          new Date(b.data.createdAt).getTime() -
          new Date(a.data.createdAt).getTime()
      ),
    });
  }
}
