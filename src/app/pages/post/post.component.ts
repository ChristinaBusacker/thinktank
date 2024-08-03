import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { Event, Post } from '../../../core/interfaces/cms.interfaces';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../../core/directives/directives.module';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { SeoService } from '../../core/services/seo.service';
import { Observable, Subscription } from 'rxjs';
import { LocalizationState } from '../../core/state/localization/localization.state';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DirectivesModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post?: Post
  lang$: Observable<'de' | 'en'> = inject(Store).select(LocalizationState.getLanguage);

  langSubscription = new Subscription()


  constructor(private store: Store, private route: ActivatedRoute, private seo: SeoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('postUrl')
      this.store.select(CMSState.getPosts).subscribe(
        (posts) => this.post = posts.find(post => post.url === slug)
      )

      if (this.post) {
        this.seo.setTitle(this.post.title + ' | XRthinktank')
        this.seo.setMetaDescription(this.post.excerpt.text || '');
        this.seo.setOpenGraphData([
          { property: 'og:title', content: this.post.title + ' | XRthinktank' },
          { property: 'og:description', content: this.post.excerpt.text || '' },
          { property: 'og:image', content: this.post.image.url }
        ]);

      }
    })

  }
}
