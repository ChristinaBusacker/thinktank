import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

// Action für das Setzen der Cookie-Einstellungen
export class SetCookieSettings {
  static readonly type = '[COOKIE] Set Settings';
  constructor(public settings: 'accepted' | 'rejected') {}
}

// State-Modell für Cookie-Einstellungen
export interface CookieStateModel {
  settings?: 'accepted' | 'rejected';
}

@Injectable()
@State<CookieStateModel>({
  name: 'cookie',
  defaults: {
    settings: undefined, // Standardwert ist undefined
  },
})
export class CookieState implements NgxsOnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // Selector für den aktuellen Cookie-Status
  @Selector()
  static getSettings(
    state: CookieStateModel
  ): 'accepted' | 'rejected' | undefined {
    return state.settings;
  }

  // Initialisierung des States beim Laden der Anwendung
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

  // Action für das Setzen der Cookie-Einstellungen
  @Action(SetCookieSettings)
  setCookieSettings(
    ctx: StateContext<CookieStateModel>,
    action: SetCookieSettings
  ): void {
    // Den neuen Wert im State speichern
    ctx.patchState({
      settings: action.settings,
    });

    // Nur im Browser im localStorage speichern
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie', action.settings);
    }
  }
}
