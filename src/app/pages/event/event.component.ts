import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  CMSObject,
  Event,
  ImageCarousel,
  TextAccordion,
} from '../../../core/interfaces/cms.interfaces';
import { DirectivesModule } from '../../core/directives/directives.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { LocalizationService } from '../../core/services/localization.service';
import { SeoService } from '../../core/services/seo.service';
import { CMSState } from '../../core/state/cms/cms.state';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { ImageSliderComponent } from '../../shared/components/image-slider/image-slider.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { Observable } from 'rxjs';
import { LocalizationState } from '../../core/state/localization/localization.state';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-event',
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    AccordionComponent,
    MapComponent,
    ReactiveFormsModule,
    ImageSliderComponent,
    PipesModule,
  ],
  standalone: true,
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit {
  event?: CMSObject;
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage,
  );
  openedAccordion: string = 'venue';

  transformedHtml!: SafeHtml;
  captionTransformed!: SafeHtml;

  route = inject(ActivatedRoute);

  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService,
    public localizationService: LocalizationService,
    private sanitizer: DomSanitizer,
  ) {}

  public getEvent(): Event {
    const prewrapper = this.event?.data as unknown;
    return prewrapper as Event;
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('eventUrl');
      this.store
        .select(CMSState.getEvents)
        .subscribe(
          (events) =>
            (this.event = events.find((event) => event.data.url === slug)),
        );

      if (this.event) {
        this.seo.setTitle(this.event.data.title + ' | XRthinktank');
        this.seo.setMetaDescription(this.event.data.excerpt.text || '');
        this.seo.setOpenGraphData([
          {
            property: 'og:title',
            content: this.event.data.title + ' | XRthinktank',
          },
          {
            property: 'og:description',
            content: this.event.data.excerpt.text || '',
          },
          { property: 'og:image', content: this.event.data.image.url },
        ]);

        this.transformedHtml = this.replaceYouTubeLinks(
          this.event.data.text.html,
        );

        this.captionTransformed = this.ensureATagsToTargetBlank(
          this.event.data.caption?.html || '',
        );
      }
    });

    console.log(this.event);
  }

  setOpenedAccordion(id: string) {
    this.openedAccordion = id;
  }

  @HostListener('click', ['$event'])
  onThumbnailClick(event: MouseEvent) {
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
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
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
          videoId,
        ) => `<div class="thumbnail-wrapper" data-video-id="${videoId}"><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                  alt="YouTube Video Thumbnail" 
                  class="youtube-thumbnail" 
                   />
                  <div class="thumbnail-overlay" data-video-id="${videoId}">
                    <svg class="thumbnail-overlay-play" data-video-id="${videoId}" width="42px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z"/></svg>
                    <p data-video-id="${videoId}">Youtube Video laden</p>
                  </div>
                </div>`,
      ),
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

  isTextAccordion(object: TextAccordion | ImageCarousel) {
    const a: any = object;
    if (a.text !== undefined) {
      return a as TextAccordion;
    }

    return undefined;
  }

  isImageCarousel(object: TextAccordion | ImageCarousel) {
    const a: any = object;
    if (a.images !== undefined) {
      return a as ImageCarousel;
    }

    return undefined;
  }
}
