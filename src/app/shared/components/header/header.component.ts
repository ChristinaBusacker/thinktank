import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SetHeaderState } from '../../../core/state/search/search.actions';
import { FrameComponent } from '../frame/frame.component';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';
import { LogoComponent } from '../logo/logo.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    MenuComponent,
    LanguagePickerComponent,
    RouterModule,
    FrameComponent,
  ],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  lang: 'de' | 'en' = 'de';

  constructor(private store: Store) {}

  logoClicked() {
    this.store.dispatch(new SetHeaderState(false));
  }

  ngOnInit(): void {
    this.lang$.subscribe((lang) => (this.lang = lang));
  }
}
