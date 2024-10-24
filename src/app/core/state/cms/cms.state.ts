import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CMSObject } from '../../../../core/interfaces/cms.interfaces';
import {
  ResetCMSObjects,
  SetEvents,
  SetObjects,
  SetPosts,
  SetTrainings,
} from './cms.actions';

export interface CMSStateModel {
  events: CMSObject[];
  posts: CMSObject[];
  trainings: CMSObject[];
  objects: CMSObject[];
  hasMoreEvents: boolean;
  hasMoreTrainings: boolean;
  hasMoreObjects: boolean;
  hasMorePosts: boolean;
  eventsPage?: number;
  objectsPage?: number;
  postsPage?: number;
  trainingsPage?: number;
}

const defaults = {
  events: [],
  posts: [],
  objects: [],
  trainings: [],
  hasMoreEvents: true,
  hasMoreTrainings: true,
  hasMoreObjects: true,
  hasMorePosts: true,
  eventsPage: undefined,
  objectsPage: undefined,
  postsPage: undefined,
  trainingsPage: undefined,
};

@Injectable()
@State<CMSStateModel>({
  name: 'cms',
  defaults: defaults,
})
export class CMSState {
  @Selector()
  static getEvents(state: CMSStateModel): CMSObject[] {
    return state.events;
  }

  @Selector()
  static getPosts(state: CMSStateModel): CMSObject[] {
    return state.posts;
  }

  @Selector()
  static getObjects(state: CMSStateModel): CMSObject[] {
    return state.objects;
  }

  @Selector()
  static getTrainings(state: CMSStateModel): CMSObject[] {
    return state.trainings;
  }

  @Selector()
  static getCurrentPages(state: CMSStateModel): {
    [key: string]: number | undefined;
  } {
    return {
      events: state.eventsPage,
      objects: state.objectsPage,
      trainings: state.trainingsPage,
      posts: state.postsPage,
    };
  }

  @Selector()
  static getPaginationInfo(state: CMSStateModel): { [key: string]: boolean } {
    return {
      all: state.hasMoreObjects,
      news: state.hasMorePosts,
      events: state.hasMoreEvents,
      posts: state.hasMorePosts,
    };
  }

  @Action(SetEvents)
  setEvents(ctx: StateContext<CMSStateModel>, action: SetEvents) {
    const state = ctx.getState();
    if (!action.events) {
      console.log('empty event');
      return;
    }
    ctx.patchState({
      events: [...state.events, ...action.events.data],
      hasMoreEvents: action.events.hasMorePages,
      eventsPage: action.events.page,
    });
  }

  @Action(SetObjects)
  setObjects(ctx: StateContext<CMSStateModel>, action: SetObjects) {
    const state = ctx.getState();
    ctx.patchState({
      objects: [...state.objects, ...action.objects.data],
      hasMoreObjects: action.objects.hasMorePages,
      objectsPage: action.objects.page,
    });
  }

  @Action(SetTrainings)
  setTrainings(ctx: StateContext<CMSStateModel>, action: SetTrainings) {
    const state = ctx.getState();
    ctx.patchState({
      trainings: [...state.trainings, ...action.trainings.data],
      hasMoreTrainings: action.trainings.hasMorePages,
      trainingsPage: action.trainings.page,
    });
  }

  @Action(SetPosts)
  setPosts(ctx: StateContext<CMSStateModel>, action: SetPosts) {
    const state = ctx.getState();
    ctx.patchState({
      posts: [...state.posts, ...action.posts.data],
      hasMorePosts: action.posts.hasMorePages,
      postsPage: action.posts.page,
    });
  }

  @Action(ResetCMSObjects)
  reset(ctx: StateContext<CMSStateModel>, action: ResetCMSObjects) {
    ctx.patchState(defaults);
  }
}
