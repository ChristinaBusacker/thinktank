import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Event } from '../../../core/interfaces/cms.interfaces';
import { ApplicationService } from '../services/application.service';
import { CmsService } from '../services/cms.service';

export const postResolver: ResolveFn<Object> = async (route, state) => {
  const app = inject(ApplicationService);
  const url = route.paramMap.get('eventUrl');
  let event: Event | undefined = undefined;

  if (url) {
    event = await inject(CmsService).fetchEvent(url);

    if (event) {
      return event;
    }
  }

  const lang = route.paramMap.get('lang');
  app.navigate([lang, 'not-found']);
  return false;
};
