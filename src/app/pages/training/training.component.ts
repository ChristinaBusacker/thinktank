import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  CMSObject,
  ImageCarousel,
  TextAccordion,
  Training,
} from '../../../core/interfaces/cms.interfaces';
import { environment } from '../../../environments/environment';
import { DirectivesModule } from '../../core/directives/directives.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { LocalizationService } from '../../core/services/localization.service';
import { SeoService } from '../../core/services/seo.service';
import { CMSState } from '../../core/state/cms/cms.state';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form.component';
import { ImageSliderComponent } from '../../shared/components/image-slider/image-slider.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-training',
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    AccordionComponent,
    MapComponent,
    ImageSliderComponent,
    PipesModule,
    ContactFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
})
export class TrainingComponent implements OnInit {
  training?: CMSObject;
  openedAccordion: string = 'venue';
  schemaOrg = environment.schemaOrg;

  route = inject(ActivatedRoute);

  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService,
    public localizationService: LocalizationService
  ) {}

  public getTraining(): Training {
    const prewrapper = this.training?.data as unknown;
    return prewrapper as Training;
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('trainingUrl');
      this.store.select(CMSState.getTrainings).subscribe(
        (trainings) =>
          (this.training = trainings.find((training) => {
            return training.data.url === slug;
          }))
      );

      if (this.training) {
        this.seo.setTitle(this.training.data.title + ' | XRthinktank');
        this.seo.setMetaDescription(this.training.data.excerpt.text || '');
        this.seo.setOpenGraphData([
          {
            property: 'og:title',
            content: this.training.data.title + ' | XRthinktank',
          },
          {
            property: 'og:description',
            content: this.training.data.excerpt.text || '',
          },
          { property: 'og:image', content: this.training.data.image.url },
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
