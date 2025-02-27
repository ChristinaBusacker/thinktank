import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EventImage } from '../../../core/interfaces/cms.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private supportsWebP: boolean | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.supportsWebP = this.detectWebPSupportCanvas();
      console.log('WebP support:', this.supportsWebP);
    } else {
      this.supportsWebP = true; // SSR: Fallback
    }
  }

  private detectWebPSupportCanvas(): boolean {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      const data = canvas.toDataURL('image/webp');
      return data.indexOf('data:image/webp') === 0;
    }
    return false;
  }

  async getOptimizedImageUrl(image: EventImage): Promise<string> {
    if (this.supportsWebP === null && isPlatformBrowser(this.platformId)) {
      this.supportsWebP = this.detectWebPSupportCanvas();
    }
    return this.supportsWebP ? image.webpUrl : image.url;
  }
}
