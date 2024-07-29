import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { Event, ImageCarousel, TextAccordion } from '../../../core/interfaces/cms.interfaces';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DirectivesModule } from '../../core/directives/directives.module';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ImageSliderComponent } from '../../shared/components/image-slider/image-slider.component';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectivesModule, AccordionComponent, MapComponent, ReactiveFormsModule, ImageSliderComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  event?: Event
  openedAccordion: string = 'venue'

  constructor(private store: Store, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) { }

  isBrowser() {
    return isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {
    const slug = this.route.paramMap.subscribe((params) => {
      const slug = params.get('eventUrl')
      this.store.select(CMSState.getEvents).subscribe(
        (events) => this.event = events.find(event => event.url === slug)
      )
    })
  }

  setOpenedAccordion(id: string) {
    this.openedAccordion = id;
  }

  isTextAccordion(object: TextAccordion | ImageCarousel) {
    const a: any = object;
    if (a.text !== undefined) {
      return a as TextAccordion
    }

    return undefined
  }

  isImageCarousel(object: TextAccordion | ImageCarousel) {
    const a: any = object;
    if (a.images !== undefined) {
      return a as ImageCarousel
    }

    return undefined
  }
}