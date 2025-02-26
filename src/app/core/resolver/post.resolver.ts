import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Post } from '../../../core/interfaces/cms.interfaces';
import { ApplicationService } from '../services/application.service';
import { CmsService } from '../services/cms.service';

export const postResolver: ResolveFn<Object> = async (route, state) => {
  const app = inject(ApplicationService);
  const url = route.paramMap.get('postUrl');
  let post: Post | undefined = undefined;

  if (url) {
    post = await inject(CmsService).fetchPost(url);

    if (post) {
      return post;
    }
  }

  const lang = route.paramMap.get('lang');
  app.navigate([lang, 'not-found']);
  return false;
};
