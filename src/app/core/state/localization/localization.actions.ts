export class SetLanguage {
    static readonly type = '[Localization] Set Language';
    constructor(public language: string) { }
}