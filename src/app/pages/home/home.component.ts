import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, Subscription } from 'rxjs';
import {
  CMSObject,
  CMSObjectType,
  Localizations,
} from '../../../core/interfaces/cms.interfaces';
import { DirectivesModule } from '../../core/directives/directives.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { CmsService } from '../../core/services/cms.service';
import { SeoService } from '../../core/services/seo.service';
import { CMSState } from '../../core/state/cms/cms.state';
import { LocalizationState } from '../../core/state/localization/localization.state';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { FrameComponent } from '../../shared/components/frame/frame.component';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        RouterModule,
        DirectivesModule,
        PipesModule,
        AccordionComponent,
        FrameComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  events$: Observable<CMSObject[]> = inject(Store).select(CMSState.getEvents);
  posts$: Observable<CMSObject[]> = inject(Store).select(CMSState.getPosts);
  objects$: Observable<CMSObject[]> = inject(Store).select(CMSState.getObjects);
  trainings$: Observable<CMSObject[]> = inject(Store).select(
    CMSState.getTrainings
  );
  localizations$: Observable<Localizations> = inject(Store).select(
    LocalizationState.getLocalizations
  );
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  getPaginationInfo$: Observable<{ [key: string]: boolean }> = inject(
    Store
  ).select(CMSState.getPaginationInfo);

  langSubscription = new Subscription();

  lang: 'de' | 'en' = 'de';

  stateSubscriptions: {
    all: Observable<CMSObject[]>;
    events: Observable<CMSObject[]>;
    trainings: Observable<CMSObject[]>;
    news: Observable<CMSObject[]>;
  } = {
    events: this.events$,
    news: this.posts$,
    trainings: this.trainings$,
    all: this.objects$,
  };

  public currentRoute: 'all' | 'news' | 'events' | 'trainings' = 'all';

  public get currentObjects(): Observable<CMSObject[]> {
    return this.stateSubscriptions[this.currentRoute];
  }

  public get hasMorePages(): Observable<boolean> {
    return this.getPaginationInfo$.pipe(
      map((paginationInfo) => {
        return paginationInfo[this.currentRoute];
      })
    );
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private seo: SeoService,
    private cmsService: CmsService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      switch (this.route.snapshot.url[0].path) {
        case 'news':
          this.currentRoute = 'news';
          break;
        case 'events':
          this.currentRoute = 'events';
          break;
        case 'trainings':
          this.currentRoute = 'trainings';
          break;
      }
    } else {
      this.currentRoute = 'all';
    }

    this.langSubscription.add(
      this.lang$.subscribe((lang) => {
        this.lang = lang;

        const desc_de =
          'Entdecken Sie die Welt der erweiterten, virtuellen und gemischten Realität auf unserer Plattform! Tauschen Sie sich mit Gleichgesinnten über die neuesten Trends und Technologien in XR, AR und VR aus. Erfahren Sie mehr über innovative Anwendungen, teilen Sie Ihre Erfahrungen und lernen Sie von Experten in der Community. Jetzt beitreten und in die Zukunft eintauchen!';
        const desc_en =
          'Discover the world of augmented, virtual, and mixed reality on our platform! Connect with like-minded individuals to discuss the latest trends and technologies in XR, AR, and VR. Learn about innovative applications, share your experiences, and gain insights from experts in the community. Join now and dive into the future!';
        const title =
          this.lang === 'de'
            ? 'Willkommen bei XR-Thinktank'
            : 'Welcome to XR-Thinktank';
        const desc = this.lang === 'de' ? desc_de : desc_en;
        this.seo.setTitle(title);
        this.seo.setMetaDescription(desc);
        this.seo.setOpenGraphData([
          { property: 'og:title', content: title },
          { property: 'og:description', content: desc },
        ]);
      })
    );

    this.cdr.detectChanges();
  }

  loadMore() {
    if (this.currentRoute === 'all') {
      this.cmsService.fetchObjects(true);
    }

    if (this.currentRoute === 'news') {
      this.cmsService.fetchPosts(true);
    }

    if (this.currentRoute === 'events') {
      this.cmsService.fetchEvents(true);
    }

    if (this.currentRoute === 'trainings') {
      this.cmsService.fetchTrainings(true);
    }
  }

  isCurrentType(value: CMSObjectType): boolean {
    if (this.currentRoute === 'all') {
      return true;
    }

    if (this.currentRoute === 'news') {
      return value === CMSObjectType.post;
    }

    if (this.currentRoute === 'events') {
      return value === CMSObjectType.event;
    }

    if (this.currentRoute === 'trainings') {
      return value === CMSObjectType.training;
    }

    return false;
  }

  generateUrl(object: CMSObject) {
    return ['/', this.lang, object.type, object.data.url];
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
