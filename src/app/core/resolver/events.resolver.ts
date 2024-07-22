import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { CmsService } from "../services/cms.service";

export const eventsResolver: ResolveFn<Object> = async (route, state) => {
    return await inject(CmsService).fetchEvents();
}