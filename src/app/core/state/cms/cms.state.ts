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
import { AssetService } from '../../services/asset.service';

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
  constructor(private assetService: AssetService) {}

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
  async setEvents(ctx: StateContext<CMSStateModel>, action: SetEvents) {
    const state = ctx.getState();

    const uniqueData = action.events.data.filter(
      (entry) =>
        !state.events.find((event) => event.data.url === entry.data.url)
    );

    for (let i = 0; i < uniqueData.length; i++) {
      uniqueData[i].data.desktopImage.useImageUrl =
        await this.assetService.getOptimizedImageUrl(
          uniqueData[i].data.desktopImage
        );
      uniqueData[i].data.image.useImageUrl =
        await this.assetService.getOptimizedImageUrl(uniqueData[i].data.image);
    }

    ctx.patchState({
      events: [...state.events, ...uniqueData],
      hasMoreEvents: action.events.hasMorePages,
      eventsPage: action.events.page,
    });
  }

  @Action(SetObjects)
  async setObjects(ctx: StateContext<CMSStateModel>, action: SetObjects) {
    const state = ctx.getState();
    const uniqueData = action.objects.data.filter(
      (entry) =>
        !state.objects.find((objects) => objects.data.url === entry.data.url)
    );

    for (let i = 0; i < uniqueData.length; i++) {
      uniqueData[i].data.desktopImage.useImageUrl =
        await this.assetService.getOptimizedImageUrl(
          uniqueData[i].data.desktopImage
        );
      uniqueData[i].data.image.useImageUrl =
        await this.assetService.getOptimizedImageUrl(uniqueData[i].data.image);
    }

    ctx.patchState({
      objects: [...state.objects, ...uniqueData],
      hasMoreObjects: action.objects.hasMorePages,
      objectsPage: action.objects.page,
    });
  }

  @Action(SetTrainings)
  async setTrainings(ctx: StateContext<CMSStateModel>, action: SetTrainings) {
    const state = ctx.getState();
    const uniqueData = action.trainings.data.filter(
      (entry) =>
        !state.trainings.find(
          (trainings) => trainings.data.url === entry.data.url
        )
    );

    for (let i = 0; i < uniqueData.length; i++) {
      uniqueData[i].data.desktopImage.useImageUrl =
        await this.assetService.getOptimizedImageUrl(
          uniqueData[i].data.desktopImage
        );
      uniqueData[i].data.image.useImageUrl =
        await this.assetService.getOptimizedImageUrl(uniqueData[i].data.image);
    }

    ctx.patchState({
      trainings: [...state.trainings, ...uniqueData],
      hasMoreTrainings: action.trainings.hasMorePages,
      trainingsPage: action.trainings.page,
    });
  }

  @Action(SetPosts)
  async setPosts(ctx: StateContext<CMSStateModel>, action: SetPosts) {
    const state = ctx.getState();
    const uniqueData = action.posts.data.filter(
      (entry) => !state.posts.find((post) => post.data.url === entry.data.url)
    );

    for (let i = 0; i < uniqueData.length; i++) {
      uniqueData[i].data.desktopImage.useImageUrl =
        await this.assetService.getOptimizedImageUrl(
          uniqueData[i].data.desktopImage
        );
      uniqueData[i].data.image.useImageUrl =
        await this.assetService.getOptimizedImageUrl(uniqueData[i].data.image);
    }

    ctx.patchState({
      posts: [...state.posts, ...uniqueData],
      hasMorePosts: action.posts.hasMorePages,
      postsPage: action.posts.page,
    });
  }

  @Action(ResetCMSObjects)
  reset(ctx: StateContext<CMSStateModel>, action: ResetCMSObjects) {
    ctx.patchState(defaults);
  }
}
