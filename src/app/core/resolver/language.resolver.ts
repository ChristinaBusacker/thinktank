import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngxs/store";
import { SetLanguage } from "../state/localization/localization.actions";

export const languageResolver: ResolveFn<Object> = async (route, state) => {
    const store = inject(Store)
    const lang = route.paramMap.get('lang') || 'de';

    if (lang === 'de' || lang === 'en') {
        store.dispatch(new SetLanguage(lang));
    }
}