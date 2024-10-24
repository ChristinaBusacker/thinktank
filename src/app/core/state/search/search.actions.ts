import { CMSSearchResult } from '../../../../core/interfaces/cms.interfaces';

export class SetSearchResults {
  static readonly type = '[Search] Set Results';
  constructor(public results: CMSSearchResult[] | undefined) {}
}

export class SetHeaderState {
  static readonly type = '[Search] Set HeaderState';
  constructor(public headerState: boolean) {}
}
