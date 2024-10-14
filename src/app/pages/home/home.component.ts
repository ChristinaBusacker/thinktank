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
import { Observable, Subscription } from 'rxjs';
import {
  CMSObject,
  CMSObjectType,
  Events,
  Localizations,
  Posts,
  Trainings,
} from '../../../core/interfaces/cms.interfaces';
import { DirectivesModule } from '../../core/directives/directives.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { SeoService } from '../../core/services/seo.service';
import { CMSState } from '../../core/state/cms/cms.state';
import { LocalizationState } from '../../core/state/localization/localization.state';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    PipesModule,
    AccordionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  events$: Observable<Events> = inject(Store).select(CMSState.getEvents);
  posts$: Observable<Posts> = inject(Store).select(CMSState.getPosts);
  objects$: Observable<CMSObject[]> = inject(Store).select(CMSState.getObjects);
  trainings$: Observable<Trainings> = inject(Store).select(
    CMSState.getTrainings
  );
  localizations$: Observable<Localizations> = inject(Store).select(
    LocalizationState.getLocalizations
  );
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  langSubscription = new Subscription();

  lang: 'de' | 'en' = 'de';

  stateSubscriptions: {
    all: Observable<CMSObject[]>;
    events: Observable<Events>;
    trainings: Observable<Trainings>;
    blog: Observable<Posts>;
  } = {
    events: this.events$,
    blog: this.posts$,
    trainings: this.trainings$,
    all: this.objects$,
  };

  public currentRoute: 'all' | 'blog' | 'events' | 'trainings' = 'all';

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      switch (this.route.snapshot.url[0].path) {
        case 'blog':
          this.currentRoute = 'blog';
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

  isCurrentType(value: CMSObjectType): boolean {
    if (this.currentRoute === 'all') {
      return true;
    }

    if (this.currentRoute === 'blog') {
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
