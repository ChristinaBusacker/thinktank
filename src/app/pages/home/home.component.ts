import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import { CMSObject, CMSObjectType, Event, Events, Post, Posts } from '../../../core/interfaces/cms.interfaces';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { filter, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  events$: Observable<Events> = inject(Store).select(CMSState.getEvents);
  posts$: Observable<Posts> = inject(Store).select(CMSState.getPosts);
  objects$: Observable<CMSObject[]> = inject(Store).select(CMSState.getObjects);

  stateSubscriptions: { all: Observable<any>, events: Observable<any>, blog: Observable<any> } = {
    events: this.events$,
    blog: this.posts$,
    all: this.objects$
  }

  public currentRoute: 'all' | 'blog' | 'events' = 'all';

  constructor(private router: Router, private route: ActivatedRoute) { }

  getImageUrl(object: CMSObject, target: 'desktop' | 'mobile') {
    if (object.type === CMSObjectType.event) {
      const data = (object.data as any)
      return target === 'desktop' ? data.desktopEventImage.url : data.eventImage.url;
    }

    if (object.type === CMSObjectType.post) {
      const data = (object.data as any)
      return target === 'mobile' ? data.desktopPostImage.url : data.postImage.url;
    }
  }

  getImage(object: Event | Post, target: 'desktop' | 'mobile') {
    const parsed = object as any;
    if (parsed.eventImage) {
      return target === 'desktop' ? parsed.desktopEventImage.url : parsed.eventImage.url;
    }

    if (parsed.postImage) {
      return target === 'mobile' ? parsed.desktopPostImage.url : parsed.postImage.url;
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      this.currentRoute = this.route.snapshot.url[0].path === 'blog' ? 'blog' : 'events';
    } else {
      this.currentRoute = 'all';
    }
  }
}
