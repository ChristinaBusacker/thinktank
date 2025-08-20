import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ContactForm,
  ContentComponent,
  ImageCarousel,
  Page,
} from '../../../core/interfaces/cms.interfaces';
import { DirectivesModule } from '../../core/directives/directives.module';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form.component';
import { ImageSliderComponent } from '../../shared/components/image-slider/image-slider.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    ImageSliderComponent,
    ContactFormComponent,
    PipesModule,
  ],
  standalone: true,
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent implements OnInit {
  public page?: Page;
  transformedHtml!: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private sanitizer: DomSanitizer
  ) {}

  isContentComponent(object: any): ContentComponent | undefined {
    if (object.content) {
      return object as ContentComponent;
    }

    return undefined;
  }

  isContactForm(object: any): ContactForm | undefined {
    if (!object.content && !object.images) {
      return object as ContactForm;
    }

    return undefined;
  }

  isImageCarousel(object: any): ImageCarousel | undefined {
    if (object.images) {
      return object as ImageCarousel;
    }

    return undefined;
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

  sanitize(html: string) {
    return this.replaceYouTubeLinks(html);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.page = data['page'];

      if (this.page) {
        this.seo.setTitle(this.page.title + ' | XRthinktank');
        this.seo.setMetaDescription(this.page.seoDescription || '');
        this.seo.setOpenGraphData([
          { property: 'og:title', content: this.page.title + ' | XRthinktank' },
          {
            property: 'og:description',
            content: this.page.seoDescription || '',
          },
          { property: 'og:image', content: this.page.image?.url || '' },
        ]);
      }
    });
  }
}
