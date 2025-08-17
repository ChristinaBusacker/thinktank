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

  constructor(private route: ActivatedRoute, private seo: SeoService) {}

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
