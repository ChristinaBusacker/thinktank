import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  openedAccordion: string = 'venue';

  route = inject(ActivatedRoute);

  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService,
    public localizationService: LocalizationService
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
            (this.event = events.find((event) => event.data.url === slug))
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
      }
    });
  }

  setOpenedAccordion(id: string) {
    this.openedAccordion = id;
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
