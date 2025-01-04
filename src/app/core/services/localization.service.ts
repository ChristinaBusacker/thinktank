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
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  getFormattedDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    const language$: Observable<'de' | 'en'> = this.store.select(
      LocalizationState.getLanguage
    );

    return language$.pipe(map((language) => this.formatDate(date, language)));
  }
}
