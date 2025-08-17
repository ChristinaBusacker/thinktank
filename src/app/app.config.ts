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
import { environment } from '../environments/environment';
import { provideServerRendering } from '@angular/platform-server';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

const stores = [LocalizationState, CMSState, SearchState, CookieState];

const storeProvider = environment.isProd
  ? provideStore(stores, withNgxsReduxDevtoolsPlugin())
  : provideStore(stores);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideClientHydration(),
    provideServerRendering(),
    storeProvider,
  ],
};

appConfig;
