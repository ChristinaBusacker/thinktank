import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SetLanguage } from '../../../core/state/localization/localization.actions';
import { CmsService } from '../../../core/services/cms.service';

@Component({
  selector: 'app-language-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss'
})
export class LanguagePickerComponent implements OnInit {
  public control = new FormControl()
  lang$: Observable<'de' | 'en'> = inject(Store).select(LocalizationState.getLanguage);
  public lang: 'de' | 'en' = 'de';

  public open = false;

  constructor(private store: Store, private cmsService: CmsService) { }

  ngOnInit(): void {
    this.lang$.subscribe((lang) => {
      this.control.patchValue(lang, { emitEvent: false })
      this.cmsService.fetchEvents();
      this.cmsService.fetchPosts();
      this.lang = lang
    });

    this.control.valueChanges.subscribe((lang: 'de' | 'en') => {
      this.store.dispatch(new SetLanguage(lang))
    })
  }
}
