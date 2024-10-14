import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  CMSObject,
  CMSSearchResult,
} from '../../../../core/interfaces/cms.interfaces';
import { SetSearchResults } from './search.actions';

export interface SearchStateModel {
  results?: CMSSearchResult[];
}

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: {
    results: undefined,
  },
})
export class SearchState {
  @Selector()
  static getSearchResults(state: SearchStateModel): CMSObject[] | undefined {
    return state.results;
  }

  @Action(SetSearchResults)
  setEvents(ctx: StateContext<SearchStateModel>, action: SetSearchResults) {
    ctx.patchState({
      results: action.results,
    });
  }
}
