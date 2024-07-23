import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocalizationState } from '../state/localization/localization.state';
import { environment } from '../../../environments/environment';
import { CMSSearchResult } from '../../../core/interfaces/cms.interfaces';
import { SetSearchResults } from '../state/search/cms.actions';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = environment.baseUrl + '/api/cms';

  constructor(private store: Store) { }

  async search(query: string, option: string) {
    const lang = this.store.selectSnapshot(LocalizationState.getLanguage);

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        body: JSON.stringify({
          query, option
        }),
        headers: {
          'Content-Type': 'application/json',
          locales: lang
        }
      })

      const data = await response.json() as Array<CMSSearchResult>

      if (data) {
        this.store.dispatch(new SetSearchResults(data))
      } else {
        this.store.dispatch(new SetSearchResults(undefined))
      }
    } catch (error) {
      console.log(error)
    }



  }
}
