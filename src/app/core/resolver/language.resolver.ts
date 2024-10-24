import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { ResetCMSObjects } from '../state/cms/cms.actions';
import { SetLanguage } from '../state/localization/localization.actions';

export const languageResolver: ResolveFn<Object> = async (route, state) => {
  const store = inject(Store);
  const lang = route.paramMap.get('lang') || 'de';

  inject(Store).dispatch(new ResetCMSObjects());

  if (lang === 'de' || lang === 'en') {
    store.dispatch(new SetLanguage(lang));
  } else {
    store.dispatch(new SetLanguage('de'));
  }
};
