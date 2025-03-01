import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
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
  imports: [CommonModule, DirectivesModule, PipesModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  standalone: true,
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

  @HostListener('click', ['$event'])
  onThumbnailClick(event: Event) {
    const eventTarget = event.target as HTMLElement;
    if (
      eventTarget.classList.contains('youtube-thumbnail') ||
      eventTarget.classList.contains('thumbnail-overlay') ||
      eventTarget.classList.contains('thumbnail-overlay-play') ||
      eventTarget.parentElement?.classList.contains('thumbnail-overlay') ||
      eventTarget.parentElement?.classList.contains('thumbnail-overlay-play')
    ) {
      const target = this.getParentUntilClass(eventTarget, 'thumbnail-wrapper');
      const videoId = target.getAttribute('data-video-id');

      if (videoId) {
        const iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('video-wrapper');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute(
          'allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        );
        iframe.setAttribute('allowfullscreen', '');
        iframeWrapper.appendChild(iframe);
        target.replaceWith(iframeWrapper);
      }
    }
  }

  replaceYouTubeLinks(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      html.replace(
        /<a[^>]*href="https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+)"[^>]*>(.*?)<\/a>/g,
        (
          _,
          __,
          videoId
        ) => `<div class="thumbnail-wrapper" data-video-id="${videoId}"><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                alt="YouTube Video Thumbnail" 
                class="youtube-thumbnail" 
                 />
                <div class="thumbnail-overlay" data-video-id="${videoId}">
                  <svg class="thumbnail-overlay-play" data-video-id="${videoId}" width="42px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z"/></svg>
                  <p data-video-id="${videoId}">Youtube Video laden</p>
                </div>
              </div>`
      )
    );
  }

  getParentUntilClass(element: HTMLElement, targetClass: string) {
    console.log(element);
    if (element.classList.contains(targetClass)) {
      return element;
    }

    if (!element.parentElement) {
      return element;
    }

    return this.getParentUntilClass(element.parentElement, targetClass);
  }

  ensureATagsToTargetBlank(html: string): SafeHtml {
    if (isPlatformBrowser(this.platformId)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const links = doc.querySelectorAll('a');
      links.forEach((link) => {
        link.setAttribute('target', '_blank');
      });

      return this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
