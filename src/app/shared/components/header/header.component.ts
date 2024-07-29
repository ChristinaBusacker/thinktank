import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MenuComponent } from '../menu/menu.component';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { FrameComponent } from '../frame/frame.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, MenuComponent, LanguagePickerComponent, RouterModule, FrameComponent],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  lang$: Observable<'de' | 'en'> = inject(Store).select(LocalizationState.getLanguage);

  lang: 'de' | 'en' = 'de';

  ngOnInit(): void {
    this.lang$.subscribe(lang => this.lang = lang)
  }
}
