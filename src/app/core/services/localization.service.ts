import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LocalizationState } from '../state/localization/localization.state';
import { Store } from '@ngxs/store';
import { Events } from '../../../core/interfaces/cms.interfaces';
import { CmsService } from './cms.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  language$: Observable<string> = inject(Store).select(LocalizationState.getLanguage);

  constructor(private cmsService: CmsService) {
    this.language$.subscribe(lang => {


      console.log('LANGUAGESERVICE: ' + lang)
    })


  }

}
