import { CMSObject, CMSSearchResult, Events, Posts } from "../../../../core/interfaces/cms.interfaces";

export class SetSearchResults {
    static readonly type = '[Search] Set Results';
    constructor(public results: CMSSearchResult[] | undefined) { }
}