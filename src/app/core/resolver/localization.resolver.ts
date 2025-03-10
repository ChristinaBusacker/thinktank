import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CmsService } from '../services/cms.service';

export const localizationResolver: ResolveFn<Object> = async (route, state) => {
  return await inject(CmsService).getLocalizations();
};
