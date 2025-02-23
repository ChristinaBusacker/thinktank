import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CMSObject } from '../../../core/interfaces/cms.interfaces';
import { environment } from '../../../environments/environment';
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

  transformedHtml!: SafeHtml;
  captionTransformed!: SafeHtml;

  schemaOrg = environment.schemaOrg;

  route = inject(ActivatedRoute);

  constructor(
    private store: Store,
    private seo: SeoService,
    public localizationService: LocalizationService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
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

      if (this.post) {
        this.transformedHtml = this.replaceYouTubeLinks(
          this.post.data.text.html
        );

        this.captionTransformed = this.ensureATagsToTargetBlank(
          this.post.data.caption?.html || ''
        );
      }
    });
  }

  replaceYouTubeLinks(html: string): SafeHtml {
    const anchorWithYouTubeLinkRegex =
      /<a[^>]*href="https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+)"[^>]*>(.*?)<\/a>/g;

    const transformed = html.replace(
      anchorWithYouTubeLinkRegex,
      (_, __, videoId) => {
        return `
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
      }
    );

    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }

  ensureATagsToTargetBlank(html: string): SafeHtml {
    if (isPlatformBrowser(this.platformId)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Alle <a>-Tags auswählen und bearbeiten
      const links = doc.querySelectorAll('a');
      links.forEach((link) => {
        link.setAttribute('target', '_blank');
      });

      // Das bearbeitete HTML zurückgeben
      return this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
