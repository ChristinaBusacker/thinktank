import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Training } from '../../../core/interfaces/cms.interfaces';
import { ApplicationService } from '../services/application.service';
import { CmsService } from '../services/cms.service';

export const postResolver: ResolveFn<Object> = async (route, state) => {
  const app = inject(ApplicationService);
  const url = route.paramMap.get('trainingUrl');
  let training: Training | undefined = undefined;

  if (url) {
    training = await inject(CmsService).fetchEvent(url);

    if (training) {
      return training;
    }
  }

  const lang = route.paramMap.get('lang');
  app.navigate([lang, 'not-found']);
  return false;
};
