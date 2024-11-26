import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ContactFormBody } from '../../../core/interfaces/contactForm.interfaces';
import { environment } from '../../../environments/environment';
import { LocalizationState } from '../state/localization/localization.state';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = environment.baseUrl + '/api/contact';

  constructor(private store: Store) {}

  async send(body: ContactFormBody) {
    try {
      const lang = this.store.selectSnapshot(LocalizationState.getLanguage);
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          locales: lang,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
