import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BrowserSpecsService {

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  supportsWebP(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
      // Was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    // Very old browser like IE 8, canvas not supported
    return false;
  }

  getWindowWidth(): Observable<number> {
    if (!this.isBrowser) {
      return new Observable(observer => {
        observer.next(0);
        observer.complete();
      });
    }
    return fromEvent(window, 'resize').pipe(
      startWith(window.innerWidth),
      map(() => window.innerWidth)
    );
  }

  isWindowWidthGreaterThan1200(): Observable<boolean> {
    return this.getWindowWidth().pipe(
      map(width => width > 1200)
    );
  }
}
