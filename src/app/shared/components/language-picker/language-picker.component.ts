import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SetLanguage } from '../../../core/state/localization/localization.actions';

@Component({
  selector: 'app-language-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss'
})
export class LanguagePickerComponent implements OnInit {
  public control = new FormControl()
  lang$: Observable<string> = inject(Store).select(LocalizationState.getLanguage);

  public open = false;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.lang$.subscribe((lang) => {
      console.log('Set language ' + lang)
      this.control.patchValue(lang, { emitEvent: false })
    });

    this.control.valueChanges.subscribe((lang: string) => {
      this.store.dispatch(new SetLanguage(lang))
    })
  }
}
