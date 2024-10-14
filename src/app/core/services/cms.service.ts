import { Injectable, makeStateKey } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  Event,
  Events,
  Localizations,
  Page,
  Post,
  Posts,
  Training,
  Trainings,
} from '../../../core/interfaces/cms.interfaces';
import { environment } from '../../../environments/environment';
import { SetEvents, SetPosts, SetTrainings } from '../state/cms/cms.actions';
import { SetLocalizations } from '../state/localization/localization.actions';
import { LocalizationState } from '../state/localization/localization.state';
import { TransferStateService } from './transfer-state.service';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private baseUrl = environment.baseUrl + '/api/cms';

  private eventKey = makeStateKey<Events>('event');
  private trainingsKey = makeStateKey<Trainings>('trainings');
  private postsKey = makeStateKey<Posts>('posts');
  private localizationsKey = makeStateKey<Localizations>('localizations');
  private pageKey = makeStateKey<Page>('page');

  constructor(private store: Store, private tfs: TransferStateService) {}

  async fetchTrainings(): Promise<Trainings> {
    try {
      const trainings = await this.tfs.preferTransferState<Trainings>(
        this.trainingsKey,
        async () => {
          const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
          const response = await fetch(`${this.baseUrl}/training`, {
            headers: {
              locales: lang,
            },
          });
          const responseData = (await response.json()) as Trainings;

          return responseData;
        }
      );

      this.store.dispatch(new SetTrainings(trainings));

      return trainings;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchTraining(url: string) {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}/training/${url}`, {
        headers: {
          locales: lang,
        },
      });

      const responseData = (await response.json()) as Training;
      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchEvents(): Promise<Events> {
    try {
      const events = await this.tfs.preferTransferState<Events>(
        this.eventKey,
        async () => {
          const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
          const response = await fetch(`${this.baseUrl}/event`, {
            headers: {
              locales: lang,
            },
          });
          const responseData = (await response.json()) as Events;

          return responseData;
        }
      );

      this.store.dispatch(new SetEvents(events));

      return events;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchEvent(url: string) {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}/event/${url}`, {
        headers: {
          locales: lang,
        },
      });

      const responseData = (await response.json()) as Event;
      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchPosts(): Promise<Posts> {
    try {
      const posts = await this.tfs.preferTransferState<Posts>(
        this.postsKey,
        async () => {
          const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
          const response = await fetch(`${this.baseUrl}/post`, {
            headers: {
              locales: lang,
            },
          });
          const responseData = (await response.json()) as Posts;

          return responseData;
        }
      );

      this.store.dispatch(new SetPosts(posts));

      return posts;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchPost(url: string) {
    const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
    try {
      const response = await fetch(`${this.baseUrl}/post/${url}`, {
        headers: {
          locales: lang,
        },
      });
      const responseData = (await response.json()) as Post;
      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching post: ${error.message}`);
    }
  }

  async fetchPage(url: string): Promise<Page | undefined> {
    try {
      const page = await this.tfs.preferTransferState<Page | undefined>(
        this.pageKey,
        async () => {
          const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
          const response = await fetch(`${this.baseUrl}/page/${url}`, {
            headers: {
              locales: lang,
            },
          });

          if (response.status > 300) {
            return undefined;
          }

          const responseData = (await response.json()) as Page;
          return responseData;
        }
      );

      return page;
    } catch (error: any) {
      throw new Error(`Error on fetching post: ${error.message}`);
    }
  }

  async getLocalizations() {
    try {
      const localizations = await this.tfs.preferTransferState<Localizations>(
        this.localizationsKey,
        async () => {
          const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
          const response = await fetch(`${this.baseUrl}/localizations`, {
            headers: {
              locales: lang,
            },
          });
          const responseData = (await response.json()) as Localizations;
          return responseData;
        }
      );

      this.store.dispatch(new SetLocalizations(localizations));

      return localizations;
    } catch (error: any) {
      throw new Error(`Error on fetching localizations: ${error.message}`);
    }
  }
}
