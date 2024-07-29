import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, LanguagePickerComponent, PipesModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  public opened = false;
  public active = false;
  lang$: Observable<'de' | 'en'> = inject(Store).select(LocalizationState.getLanguage);

  lang: 'de' | 'en' = 'de';

  ngOnInit(): void {
    this.lang$.subscribe(lang => this.lang = lang)
  }
}
