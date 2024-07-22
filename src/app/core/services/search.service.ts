import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocalizationState } from '../state/localization/localization.state';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = 'https://cmbu.app/api/search';

  constructor(private store: Store) {

  }


  search(query: string, option: string) {
    const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
    fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify({
        query, option
      }),
      headers: {
        'Content-Type': 'application/json',
        locales: lang
      }
    })
  }
}
