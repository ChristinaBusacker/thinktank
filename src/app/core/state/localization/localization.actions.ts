import { Localizations } from "../../../../core/interfaces/cms.interfaces";

export class SetLanguage {
    static readonly type = '[Localization] Set Language';
    constructor(public language: 'de' | 'en') { }
}

export class SetLocalizations {
    static readonly type = '[Localization] Set Localizations';
    constructor(public localizations: Localizations) { }
}