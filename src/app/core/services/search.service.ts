import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocalizationState } from '../state/localization/localization.state';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = environment.baseUrl + '/api/cms';

  constructor(private store: Store) {

  }


  search(query: string, option: string) {
    const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
    fetch(`${this.baseUrl}/search`, {
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
