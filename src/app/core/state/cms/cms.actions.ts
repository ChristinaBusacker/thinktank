import { PaginatedApiResponse } from '../../../../core/interfaces/apiresponse.interface';
import { CMSObject } from '../../../../core/interfaces/cms.interfaces';

export class SetEvents {
  static readonly type = '[CMS] Set Events';
  constructor(public events: PaginatedApiResponse<CMSObject>) {}
}

export class SetObjects {
  static readonly type = '[CMS] Set Objects';
  constructor(public objects: PaginatedApiResponse<CMSObject>) {}
}

export class SetPosts {
  static readonly type = '[CMS] Set Posts';
  constructor(public posts: PaginatedApiResponse<CMSObject>) {}
}

export class SetTrainings {
  static readonly type = '[CMS] Set Trainings';
  constructor(public trainings: PaginatedApiResponse<CMSObject>) {}
}

export class ResetCMSObjects {
  static readonly type = '[CMS] Reset Objects';
  constructor() {}
}
