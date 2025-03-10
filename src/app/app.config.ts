import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';
import { routes } from './app.routes';
import { CMSState } from './core/state/cms/cms.state';
import { CookieState } from './core/state/cookie/cookie.state';
import { LocalizationState } from './core/state/localization/localization.state';
import { SearchState } from './core/state/search/search.state';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideClientHydration(),
    provideStore(
      [LocalizationState, CMSState, SearchState, CookieState],
      withNgxsReduxDevtoolsPlugin()
    ),
  ],
};

appConfig;
