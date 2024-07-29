import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Input() lat: number = 51.9;
  @Input() lon: number = 22.1;


  private map: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.initMap();
      this.setMarker(this.lat, this.lon);

    }
  }


  private initMap(): void {
    const map = (window as any).L?.map('map', {
      center: [this.lat, this.lon],
      zoom: 13
    });

    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.map = map;
  }

  private setMarker(lat: number, lon: number): void {
    (window as any).L.marker([lat, lon]).addTo(this.map)
  }

  public createGoogleLink() {
    return `https://maps.google.com/?q=${this.lat},${this.lon}`
  }
}
