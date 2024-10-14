import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Localizations } from '../../../../core/interfaces/cms.interfaces';
import { SetLanguage, SetLocalizations } from './localization.actions';

export interface LocalizationStateModel {
  language: 'de' | 'en';
  localizations: Localizations;
}

@Injectable()
@State<LocalizationStateModel>({
  name: 'localization',
  defaults: {
    language: 'de',
    localizations: {},
  },
})
export class LocalizationState {
  @Selector()
  static getLanguage(state: LocalizationStateModel): 'de' | 'en' {
    return state.language;
  }

  @Selector()
  static getLocalizations(state: LocalizationStateModel): Localizations {
    return state.localizations;
  }

  @Action(SetLanguage)
  setLanguage(ctx: StateContext<LocalizationStateModel>, action: SetLanguage) {
    ctx.patchState({
      language: action.language,
    });
  }

  @Action(SetLocalizations)
  setLocalizations(
    ctx: StateContext<LocalizationStateModel>,
    action: SetLocalizations
  ) {
    ctx.patchState({
      localizations: action.localizations,
    });
  }
}
