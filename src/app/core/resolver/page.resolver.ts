import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { CmsService } from "../services/cms.service";
import { Page } from "../../../core/interfaces/cms.interfaces";
import { ApplicationService } from "../services/application.service";

export const pageResolver: ResolveFn<Object> = async (route, state) => {
    const app = inject(ApplicationService);
    const url = route.paramMap.get('page');
    let page: Page | undefined = undefined

    console.log('LOOK FOR PAGE')

    if (url) {
        page = await inject(CmsService).fetchPage(url);

        if (page) {
            return page
        }
    }

    const lang = route.paramMap.get('lang');
    app.navigate([lang, 'not-found'])
    return false
}