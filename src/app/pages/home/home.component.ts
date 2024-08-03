import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import { CMSObject, CMSObjectType, Event, Events, Localizations, Post, Posts } from '../../../core/interfaces/cms.interfaces';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { filter, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';
import { DirectivesModule } from '../../core/directives/directives.module';
import { LocalizationState } from '../../core/state/localization/localization.state';
import { PipesModule } from '../../core/pipes/pipes.module';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectivesModule, PipesModule, AccordionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  events$: Observable<Events> = inject(Store).select(CMSState.getEvents);
  posts$: Observable<Posts> = inject(Store).select(CMSState.getPosts);
  objects$: Observable<CMSObject[]> = inject(Store).select(CMSState.getObjects);
  localizations$: Observable<Localizations> = inject(Store).select(LocalizationState.getLocalizations);
  lang$: Observable<'de' | 'en'> = inject(Store).select(LocalizationState.getLanguage);

  lang: 'de' | 'en' = 'de';

  stateSubscriptions: { all: Observable<any>, events: Observable<any>, blog: Observable<any> } = {
    events: this.events$,
    blog: this.posts$,
    all: this.objects$
  }

  public currentRoute: 'all' | 'blog' | 'events' = 'all';

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private seo: SeoService) { }

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      this.currentRoute = this.route.snapshot.url[0].path === 'blog' ? 'blog' : 'events';
    } else {
      this.currentRoute = 'all';
    }

    this.lang$.subscribe(lang => {
      this.lang = lang

      const desc_de = "Entdecken Sie die Welt der erweiterten, virtuellen und gemischten Realität auf unserer Plattform! Tauschen Sie sich mit Gleichgesinnten über die neuesten Trends und Technologien in XR, AR und VR aus. Erfahren Sie mehr über innovative Anwendungen, teilen Sie Ihre Erfahrungen und lernen Sie von Experten in der Community. Jetzt beitreten und in die Zukunft eintauchen!"
      const desc_en = "Discover the world of augmented, virtual, and mixed reality on our platform! Connect with like-minded individuals to discuss the latest trends and technologies in XR, AR, and VR. Learn about innovative applications, share your experiences, and gain insights from experts in the community. Join now and dive into the future!"
      const title = this.lang === 'de' ? 'Willkommen bei XR-Thinktank' : 'Welcome to XR-Thinktank'
      const desc = this.lang === 'de' ? desc_de : desc_en;
      this.seo.setTitle(title)
      this.seo.setMetaDescription(desc);
      this.seo.setOpenGraphData([
        { property: 'og:title', content: title },
        { property: 'og:description', content: desc },
      ]);

    })


    this.cdr.detectChanges();
  }

  isCurrentType(value: CMSObjectType): boolean {

    if (this.currentRoute === 'all') {
      return true;
    }

    if (this.currentRoute === 'blog') {
      return value === CMSObjectType.post
    }

    if (this.currentRoute === 'events') {
      return value === CMSObjectType.event
    }

    return false
  }

  generateUrl(object: CMSObject) {
    return ['/', this.lang, object.type, object.data.url]
  }


  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
