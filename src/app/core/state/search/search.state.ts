import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  CMSObject,
  CMSSearchResult,
} from '../../../../core/interfaces/cms.interfaces';
import { SetHeaderState, SetSearchResults } from './search.actions';

export interface SearchStateModel {
  results?: CMSSearchResult[];
  headerOpen: boolean;
}

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: {
    results: undefined,
    headerOpen: false,
  },
})
export class SearchState {
  @Selector()
  static getSearchResults(state: SearchStateModel): CMSObject[] | undefined {
    return state.results;
  }

  @Selector()
  static getHeaderState(state: SearchStateModel): boolean {
    return state.headerOpen;
  }

  @Action(SetSearchResults)
  setEvents(ctx: StateContext<SearchStateModel>, action: SetSearchResults) {
    ctx.patchState({
      results: action.results,
    });
  }

  @Action(SetHeaderState)
  setHeaderState(ctx: StateContext<SearchStateModel>, action: SetHeaderState) {
    ctx.patchState({
      headerOpen: action.headerState,
    });
  }
}
