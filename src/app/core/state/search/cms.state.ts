import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Events, Posts, Post, CMSObject, CMSSearchResult } from '../../../../core/interfaces/cms.interfaces';
import { SetSearchResults } from './cms.actions';


export interface SearchStateModel {
    results?: CMSSearchResult[];
}

@State<SearchStateModel>({
    name: 'search',
    defaults: {
        results: undefined
    }
})
export class SearchState {
    @Selector()
    static getSearchResults(state: SearchStateModel): CMSObject[] | undefined {
        return state.results;
    }

    @Action(SetSearchResults)
    setEvents(ctx: StateContext<SearchStateModel>, action: SetSearchResults) {
        ctx.patchState({
            results: action.results
        });
    }

}
