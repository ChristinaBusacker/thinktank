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
      zoom: 13,
      dragging: false,
      tap: false
    });

    (window as any).L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=8634d561e6894b5e8f4f87940f8c5169', {
      attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: '<your apikey>',
      maxZoom: 22
    }).addTo(map);

    this.map = map;
  }

  private setMarker(lat: number, lon: number): void {
    const L = (window as any).L

    const customIcon = L.icon({
      iconUrl: 'assets/marker/positionmark2.png', // Pfad zu deinem benutzerdefinierten Bild
      iconSize: [30, 50], // Größe des Icons in Pixeln [Breite, Höhe]
      iconAnchor: [19, 38], // Punkt im Icon, der mit dem Markerposition verbunden wird [x, y]
      popupAnchor: [0, -38] // Punkt im Popup, der mit dem Icon verbunden wird [x, y]
    });

    L.marker([lat, lon], { icon: customIcon }).addTo(this.map)
  }

  public createGoogleLink() {
    return `https://maps.google.com/?q=${this.lat},${this.lon}`
  }
}
