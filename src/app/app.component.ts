import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CmsService } from './core/services/cms.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { NgxsModule, Store } from '@ngxs/store';
import { LocalizationState } from './core/state/localization/localization.state';
import { SearchService } from './core/services/search.service';
import { LanguagePickerComponent } from './shared/components/language-picker/language-picker.component';
import { LocalizationService } from './core/services/localization.service';
import { TransferStateService } from './core/services/transfer-state.service';
import { BrowserSpecsService } from './core/services/browser-specs.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { SetLanguage } from './core/state/localization/localization.actions';
import { SeoService } from './core/services/seo.service';
import { ApplicationService } from './core/services/application.service';
import { ContactService } from './core/services/contact.service';
import { BreadcrumbsComponent } from './shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, BreadcrumbsComponent],
  providers: [CmsService, SearchService, LocalizationService, TransferStateService, BrowserSpecsService, SeoService, ApplicationService, ContactService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'xrthinktank';

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang') || 'de';

      if (lang === 'de' || lang === 'en') {
        this.store.dispatch(new SetLanguage(lang));
      }
    });
  }
}
