import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { ApplicationService } from './core/services/application.service';
import { BrowserSpecsService } from './core/services/browser-specs.service';
import { CmsService } from './core/services/cms.service';
import { ContactService } from './core/services/contact.service';
import { LocalizationService } from './core/services/localization.service';
import { SearchService } from './core/services/search.service';
import { SeoService } from './core/services/seo.service';
import { TransferStateService } from './core/services/transfer-state.service';
import { CookieState } from './core/state/cookie/cookie.state';
import { SetLanguage } from './core/state/localization/localization.actions';
import { BreadcrumbsComponent } from './shared/components/breadcrumbs/breadcrumbs.component';
import { CookieDialogComponent } from './shared/components/cookie-dialog/cookie-dialog.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { Observable } from 'rxjs';
import { LocalizationState } from './core/state/localization/localization.state';
import { PipesModule } from './core/pipes/pipes.module';
import { AssetService } from './core/services/asset.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    PipesModule,
    BreadcrumbsComponent,
    CookieDialogComponent,
    RouterModule,
    CommonModule,
  ],
  providers: [
    CmsService,
    SearchService,
    LocalizationService,
    TransferStateService,
    BrowserSpecsService,
    SeoService,
    ApplicationService,
    ContactService,
    AssetService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'xrthinktank';
  public cookieSettings$ = this.store.select(CookieState.getSettings);

  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  public get isClient() {
    return isPlatformBrowser(this.platformId);
  }

  initializeGoogleAnalytics(): void {
    console.log('INIT GOOGLE ANALYTICS');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-26XE85G2BG';
    document.head.appendChild(script);

    script.onload = () => {
      window['dataLayer'] = window['dataLayer'] || [];
      function gtag(...args: any[]) {
        window['dataLayer'].push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-26XE85G2BG');
    };
  }

  ngOnInit(): void {
    this.cookieSettings$.subscribe((setting) => {
      if (setting === 'accepted') {
        this.initializeGoogleAnalytics();
      }
    });

    this.route.paramMap.subscribe((params) => {
      const lang = params.get('lang') || 'de';

      if (lang === 'de' || lang === 'en') {
        this.store.dispatch(new SetLanguage(lang));
      }
    });
  }
}
