import { Injectable, makeStateKey } from '@angular/core';
import { Store } from '@ngxs/store';
import { PaginatedApiResponse } from '../../../core/interfaces/apiresponse.interface';
import {
  CMSObject,
  CMSObjectType,
  Event,
  Localizations,
  Page,
  Post,
  Training,
} from '../../../core/interfaces/cms.interfaces';
import { environment } from '../../../environments/environment';
import {
  SetEvents,
  SetObjects,
  SetPosts,
  SetTrainings,
} from '../state/cms/cms.actions';
import { CMSState } from '../state/cms/cms.state';
import { SetLocalizations } from '../state/localization/localization.actions';
import { LocalizationState } from '../state/localization/localization.state';
import { TransferStateService } from './transfer-state.service';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private baseUrl = environment.baseUrl + '/api/cms';
  private objectKey =
    makeStateKey<PaginatedApiResponse<CMSObject>>('objectKey');
  private eventKey = makeStateKey<PaginatedApiResponse<CMSObject>>('event');
  private trainingsKey =
    makeStateKey<PaginatedApiResponse<CMSObject>>('trainings');
  private postsKey = makeStateKey<PaginatedApiResponse<CMSObject>>('posts');
  private localizationsKey = makeStateKey<Localizations>('localizations');
  private pageKey = makeStateKey<Page>('page');

  constructor(private store: Store, private tfs: TransferStateService) {}

  async fetchTrainings(loadMore = false): Promise<CMSObject[]> {
    try {
      const trainingsResponse = await this.tfs.preferTransferState<
        PaginatedApiResponse<CMSObject>
      >(this.trainingsKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
        const currentPages = this.store.selectSnapshot(
          CMSState.getCurrentPages
        );
        let page = 0;
        if (typeof currentPages['trainings'] === 'number' && loadMore) {
          page = currentPages['trainings'] + 1;
        }

        const params = new URLSearchParams({ page: page + '' });
        const response = await fetch(
          `${this.baseUrl}/training?${params.toString()}`,
          {
            headers: {
              locales: lang,
            },
          }
        );
        const responseData =
          (await response.json()) as PaginatedApiResponse<CMSObject>;

        return responseData;
      });

      this.store.dispatch(new SetTrainings(trainingsResponse));

      return trainingsResponse.data;
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

      this.store.dispatch(
        new SetEvents({
          data: [{ type: CMSObjectType.training, data: responseData }],
          hasMorePages: true,

          page: -1,
        })
      );

      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchEvents(loadMore = false): Promise<CMSObject[]> {
    try {
      const eventsResponse = await this.tfs.preferTransferState<
        PaginatedApiResponse<CMSObject>
      >(this.eventKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);

        const currentPages = this.store.selectSnapshot(
          CMSState.getCurrentPages
        );
        let page = 0;
        if (typeof currentPages['events'] === 'number' && loadMore) {
          page = currentPages['events'] + 1;
        }

        const params = new URLSearchParams({ page: page + '' });
        const response = await fetch(
          `${this.baseUrl}/event?${params.toString()}`,
          {
            headers: {
              locales: lang,
            },
          }
        );
        const responseData =
          (await response.json()) as PaginatedApiResponse<CMSObject>;

        return responseData;
      });

      this.store.dispatch(new SetEvents(eventsResponse));

      return eventsResponse.data;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchObjects(loadMore = false): Promise<CMSObject[]> {
    try {
      const objects = await this.tfs.preferTransferState<
        PaginatedApiResponse<CMSObject>
      >(this.objectKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);

        const currentPages = this.store.selectSnapshot(
          CMSState.getCurrentPages
        );
        let page = 0;
        if (typeof currentPages['objects'] === 'number' && loadMore) {
          page = currentPages['objects'] + 1;
        }

        const params = new URLSearchParams({ page: page + '' });
        const response = await fetch(
          `${this.baseUrl}/objects?${params.toString()}`,
          {
            headers: {
              locales: lang,
            },
          }
        );
        const responseData =
          (await response.json()) as PaginatedApiResponse<CMSObject>;

        return responseData;
      });

      this.store.dispatch(new SetObjects(objects));

      return objects.data;
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

      this.store.dispatch(
        new SetEvents({
          data: [{ type: CMSObjectType.event, data: responseData }],
          hasMorePages: true,

          page: -1,
        })
      );
      return responseData;
    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchPosts(loadMore = false): Promise<CMSObject[]> {
    try {
      const posts = await this.tfs.preferTransferState<
        PaginatedApiResponse<CMSObject>
      >(this.postsKey, async () => {
        const lang = this.store.selectSnapshot(LocalizationState.getLanguage);

        const currentPages = this.store.selectSnapshot(
          CMSState.getCurrentPages
        );
        let page = 0;
        if (typeof currentPages['posts'] === 'number' && loadMore) {
          page = currentPages['posts'] + 1;
        }

        const params = new URLSearchParams({ page: page + '' });
        const response = await fetch(
          `${this.baseUrl}/post?${params.toString()}`,
          {
            headers: {
              locales: lang,
            },
          }
        );
        const responseData =
          (await response.json()) as PaginatedApiResponse<CMSObject>;

        return responseData;
      });

      this.store.dispatch(new SetPosts(posts));

      return posts.data;
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

      this.store.dispatch(
        new SetPosts({
          data: [{ type: CMSObjectType.post, data: responseData }],
          hasMorePages: true,

          page: -1,
        })
      );

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
