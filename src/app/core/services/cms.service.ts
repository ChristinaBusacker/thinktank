import { Injectable } from '@angular/core';
import { Events, Post, Posts, Event } from '../../../core/interfaces/cms.interfaces';
import { Store } from '@ngxs/store';
import { LocalizationState } from '../state/localization/localization.state';
import { SetEvents, SetPosts } from '../state/cms/cms.actions';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  private baseUrl = 'http://localhost:4000/api/cms';

  constructor(private store: Store) { }

  async fetchEvents(): Promise<Events> {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}/event`, {
        headers: {
          locales: lang
        }
      })

      const responseData = (await response.json()) as Events;
      this.store.dispatch(new SetEvents(responseData))

      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchEvent(url: string) {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}/event/${url}`, {
        headers: {
          locales: lang
        }
      })

      const responseData = (await response.json()) as Event;
      return responseData;

    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchPosts(): Promise<Posts> {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}/post`, {
        headers: {
          locales: lang
        }
      })
      const responseData = (await response.json()) as Posts;
      this.store.dispatch(new SetPosts(responseData))

      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchPost(url: string) {
    const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
    try {
      const response = await fetch(`${this.baseUrl}/post/${url}`, {
        headers: {
          locales: lang
        }
      })
      const responseData = (await response.json()) as Post;
      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching post: ${error.message}`);
    }
  }
}
