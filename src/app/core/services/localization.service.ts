import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LocalizationState } from '../state/localization/localization.state';
import { CmsService } from './cms.service';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  language$: Observable<string> = inject(Store).select(
    LocalizationState.getLanguage
  );

  constructor(private cmsService: CmsService, private store: Store) {
    this.language$.subscribe((lang) => {
      console.log('LANGUAGESERVICE: ' + lang);
    });
  }

  private formatDate(date: Date, language: 'de' | 'en'): string {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    };

    if (language === 'de') {
      return new Intl.DateTimeFormat('de-DE', options).format(date);
    } else if (language === 'en') {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  getFormattedDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    const language$: Observable<'de' | 'en'> = this.store.select(
      LocalizationState.getLanguage
    );

    return language$.pipe(map((language) => this.formatDate(date, language)));
  }
}
