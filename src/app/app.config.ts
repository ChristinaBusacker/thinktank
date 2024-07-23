import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngxs/store';
import { LocalizationState } from './core/state/localization/localization.state';
import { CMSState } from './core/state/cms/cms.state';
import { SearchState } from './core/state/search/cms.state';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideStore(
    [LocalizationState, CMSState, SearchState],
  )]
};
