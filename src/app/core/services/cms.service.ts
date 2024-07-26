import { Injectable, makeStateKey } from '@angular/core';
import { Events, Post, Posts, Event, Localizations } from '../../../core/interfaces/cms.interfaces';
import { Store } from '@ngxs/store';
import { LocalizationState } from '../state/localization/localization.state';
import { SetEvents, SetPosts } from '../state/cms/cms.actions';
import { environment } from '../../../environments/environment';
import { TransferStateService } from './transfer-state.service';
import { SetLocalizations } from '../state/localization/localization.actions';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  private baseUrl = environment.baseUrl + '/api/cms';

  private eventKey = makeStateKey<Events>("event");
  private postsKey = makeStateKey<Posts>("posts");
  private localizationsKey = makeStateKey<Localizations>("localizations");

  constructor(private store: Store, private tfs: TransferStateService) { }

  async fetchEvents(): Promise<Events> {
    try {
      const events = await this.tfs.preferTransferState<Events>(this.eventKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
        const response = await fetch(`${this.baseUrl}/event`, {
          headers: {
            locales: lang
          }
        })
        const responseData = (await response.json()) as Events;

        return responseData
      })

      this.store.dispatch(new SetEvents(events))

      return events

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
      const posts = await this.tfs.preferTransferState<Posts>(this.postsKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
        const response = await fetch(`${this.baseUrl}/post`, {
          headers: {
            locales: lang
          }
        })
        const responseData = (await response.json()) as Posts;


        return responseData;
      })

      this.store.dispatch(new SetPosts(posts))

      return posts

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

  async getLocalizations() {
    try {
      console.log('resolv locs')

      const localizations = await this.tfs.preferTransferState<Localizations>(this.localizationsKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
        const response = await fetch(`${this.baseUrl}/localizations`, {
          headers: {
            locales: lang
          }
        })
        const responseData = (await response.json()) as Localizations;
        console.log(responseData)
        return responseData;
      })


      this.store.dispatch(new SetLocalizations(localizations))

      return localizations

    } catch (error: any) {
      throw new Error(`Error on fetching localizations: ${error.message}`);
    }
  }

}
