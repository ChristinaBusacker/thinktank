import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLanguage } from './localization.actions';

export interface LocalizationStateModel {
    language: 'de' | 'en';
}

@State<LocalizationStateModel>({
    name: 'localization',
    defaults: {
        language: 'de'
    }
})
export class LocalizationState {
    @Selector()
    static getLanguage(state: LocalizationStateModel): 'de' | 'en' {
        return state.language;
    }

    @Action(SetLanguage)
    setLanguage(ctx: StateContext<LocalizationStateModel>, action: SetLanguage) {
        ctx.patchState({
            language: action.language
        });
    }
}
