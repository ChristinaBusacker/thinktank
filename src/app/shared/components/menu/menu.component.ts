import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SetHeaderState } from '../../../core/state/search/search.actions';
import { SearchState } from '../../../core/state/search/search.state';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterModule,
    SearchComponent,
    LanguagePickerComponent,
    PipesModule,
  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public opened = false;
  public active = false;
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );
  opened$: Observable<boolean> = inject(Store).select(
    SearchState.getHeaderState
  );

  lang: 'de' | 'en' = 'de';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.lang$.subscribe((lang) => (this.lang = lang));

    this.opened$.subscribe((opened) => {
      this.opened = opened;
    });
  }

  toggleOverlay() {
    this.opened = !this.opened;
    this.store.dispatch(new SetHeaderState(this.opened));
  }
}
