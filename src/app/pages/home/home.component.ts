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

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      this.currentRoute = this.route.snapshot.url[0].path === 'blog' ? 'blog' : 'events';
    } else {
      this.currentRoute = 'all';
    }

    this.lang$.subscribe(lang => this.lang = lang)

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
