import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Page } from '../../../core/interfaces/cms.interfaces';
import { ApplicationService } from '../services/application.service';
import { CmsService } from '../services/cms.service';

export const pageResolver: ResolveFn<Object> = async (route, state) => {
  const app = inject(ApplicationService);
  const url = route.paramMap.get('page');
  let page: Page | undefined = undefined;

  if (url) {
    page = await inject(CmsService).fetchPage(url);

    if (page) {
      return page;
    }
  }

  const lang = route.paramMap.get('lang');
  app.navigate([lang, 'not-found']);
  return false;
};
