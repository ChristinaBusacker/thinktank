import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { CmsService } from '../services/cms.service';
import { CMSState } from '../state/cms/cms.state';

export const objectsResolver: ResolveFn<Object> = async (route, state) => {
  const objects = inject(Store).selectSnapshot(CMSState.getObjects);
  if (objects.length < 1) {
    return await inject(CmsService).fetchObjects();
  }

  return objects;
};
