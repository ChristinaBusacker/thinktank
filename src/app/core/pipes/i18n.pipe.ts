import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Localizations } from '../../../core/interfaces/cms.interfaces';
import { LocalizationState } from '../state/localization/localization.state';

@Pipe({
    name: 'i18n',
})
export class I18nPipe implements PipeTransform {
    localizations$: Observable<Localizations> = inject(Store).select(LocalizationState.getLocalizations);

    transform(key: string): Observable<string> {
        return this.localizations$.pipe(
            map(localizations => localizations[key] || key)
        );
    }
}