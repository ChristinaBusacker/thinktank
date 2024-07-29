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
  private L?: any

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet().then(() => {
        this.initMap();
        this.setMarker(this.lat, this.lon);
      });
    }
  }

  private async loadLeaflet(): Promise<void> {
    const L = (window as any).L
    this.L = L;
  }

  private initMap(): void {
    const map = this.L?.map('map', {
      center: [this.lat, this.lon],
      zoom: 13
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.map = map;
  }

  private setMarker(lat: number, lon: number): void {
    this.L.marker([lat, lon]).addTo(this.map)
  }

  public createGoogleLink() {
    return `https://maps.google.com/?q=${this.lat},${this.lon}`
  }
}
