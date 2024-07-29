import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { EventImage } from '../../../../core/interfaces/cms.interfaces';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss'
})
export class ImageSliderComponent implements OnInit, AfterViewInit {
  @Input() images!: EventImage[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const Glide = (window as any).Glide
      new Glide('.glide', {
        type: 'carousel',
        gap: 24,
        startAt: 0,
        hoverpause: true,
        autoplay: 5000,
        animationduration: 1000,
        direction: 'ltr',
        perView: 3,
        breakpoints: {
          1200: {
            perView: 2
          },
          600: {
            perView: 1
          }
        }
      }).mount();
    }
  }
}