import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CmsService } from '../../../core/services/cms.service';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SetHeaderState } from '../../../core/state/search/search.actions';

@Component({
  selector: 'app-language-picker',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss',
})
export class LanguagePickerComponent implements OnInit {
  public control = new FormControl();
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );
  public lang: 'de' | 'en' = 'de';

  public open = false;

  @Output() changed = new EventEmitter();

  constructor(
    private store: Store,
    private cmsService: CmsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lang$.subscribe((lang) => {
      this.control.patchValue(lang, { emitEvent: false });
      this.lang = lang;
    });

    this.control.valueChanges.subscribe((lang: 'de' | 'en') => {
      const currentUrl = this.router.url;
      this.changed.emit();
      this.store.dispatch(new SetHeaderState(false));
      const newUrl = currentUrl.replace(/^\/(en|de)/, `/${lang}`);
      this.router.navigateByUrl(newUrl);
    });
  }
}
