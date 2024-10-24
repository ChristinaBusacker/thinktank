import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CMSObject } from '../../../core/interfaces/cms.interfaces';
import { DirectivesModule } from '../../core/directives/directives.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { LocalizationService } from '../../core/services/localization.service';
import { SeoService } from '../../core/services/seo.service';
import { CMSState } from '../../core/state/cms/cms.state';
import { LocalizationState } from '../../core/state/localization/localization.state';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DirectivesModule, PipesModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post?: CMSObject;
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  langSubscription = new Subscription();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private seo: SeoService,
    public localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('postUrl');
      this.store
        .select(CMSState.getPosts)
        .subscribe(
          (posts) => (this.post = posts.find((post) => post.data.url === slug))
        );

      if (this.post) {
        this.seo.setTitle(this.post.data.title + ' | XRthinktank');
        this.seo.setMetaDescription(this.post.data.excerpt.text || '');
        this.seo.setOpenGraphData([
          {
            property: 'og:title',
            content: this.post.data.title + ' | XRthinktank',
          },
          {
            property: 'og:description',
            content: this.post.data.excerpt.text || '',
          },
          { property: 'og:image', content: this.post.data.image.url },
        ]);
      }
    });
  }
}
