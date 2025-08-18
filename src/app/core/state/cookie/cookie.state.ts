import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

export class SetCookieSettings {
  static readonly type = '[COOKIE] Set Settings';
  constructor(public settings: 'accepted' | 'rejected') {}
}
export interface CookieStateModel {
  settings?: 'accepted' | 'rejected';
}

@Injectable()
@State<CookieStateModel>({
  name: 'cookie',
  defaults: {
    settings: undefined,
  },
})
export class CookieState implements NgxsOnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @Selector()
  static getSettings(
    state: CookieStateModel
  ): 'accepted' | 'rejected' | undefined {
    return state.settings;
  }

  ngxsOnInit(ctx: StateContext<CookieStateModel>): void {
    if (isPlatformBrowser(this.platformId)) {
      const localStorageValue = localStorage.getItem('cookie');
      if (
        localStorageValue === 'accepted' ||
        localStorageValue === 'rejected'
      ) {
        ctx.patchState({
          settings: localStorageValue as 'accepted' | 'rejected',
        });
      }
    }
  }

  @Action(SetCookieSettings)
  setCookieSettings(
    ctx: StateContext<CookieStateModel>,
    action: SetCookieSettings
  ): void {
    ctx.patchState({
      settings: action.settings,
    });

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie', action.settings);
    }
  }
}
