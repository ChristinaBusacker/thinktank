import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { Store } from '@ngxs/store';

import { filter, Observable, Subscription } from 'rxjs';
import { LocalizationState } from '../../../core/state/localization/localization.state';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );
  langSubscription = new Subscription();
  lang: 'de' | 'en' = 'de';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.lang$.subscribe((lang) => (this.lang = lang));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    const url = this.router.routerState.snapshot.url;
    const splitted = url.split('/');
    splitted.shift();

    let urlHelper = '';

    for (const path of splitted) {
      breadcrumbs.push({
        label: ['de', 'en'].includes(path) ? 'Home' : path,
        url: `${urlHelper}/${path}`,
      });
      urlHelper += `/${path}`;
    }

    /*

    for (const child of children) {
      for (const path of child.snapshot.url) {
        const url = breadcrumbs.map((bc) => bc.url).join('/')
        debugger
        breadcrumbs.push({ label: path.path, url });
      }
    }

    */

    return breadcrumbs;
  }
}
