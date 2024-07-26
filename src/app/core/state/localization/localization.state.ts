import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLanguage, SetLocalizations } from './localization.actions';
import { Localizations } from '../../../../core/interfaces/cms.interfaces';

export interface LocalizationStateModel {
    language: 'de' | 'en';
    localizations: Localizations
}

@State<LocalizationStateModel>({
    name: 'localization',
    defaults: {
        language: 'de',
        localizations: {}
    }
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
            language: action.language
        });
    }

    @Action(SetLocalizations)
    setLocalizations(ctx: StateContext<LocalizationStateModel>, action: SetLocalizations) {
        ctx.patchState({
            localizations: action.localizations
        });
    }
}
