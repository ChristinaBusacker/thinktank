import {
  Events,
  Posts,
  Trainings,
} from '../../../../core/interfaces/cms.interfaces';

export class SetEvents {
  static readonly type = '[CMS] Set Events';
  constructor(public events: Events) {}
}

export class SetPosts {
  static readonly type = '[CMS] Set Posts';
  constructor(public posts: Posts) {}
}

export class SetTrainings {
  static readonly type = '[CMS] Set Trainings';
  constructor(public trainings: Trainings) {}
}
