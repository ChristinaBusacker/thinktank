import {
  Directive,
  Input,
  HostBinding,
  Inject,
  PLATFORM_ID,
  ApplicationRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Directive({
  selector: '[appSafeHtml]',
  host: { ngSkipHydration: '' },
})
export class SafeHtmlDirective {
  @Input() appSafeHtml: string | null = null;

  @HostBinding('innerHTML') sanitizedHtml = '';

  private isServer: boolean;
  private isBrowser: boolean;

  constructor(
    private s: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: Object,
    appRef: ApplicationRef
  ) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      appRef.isStable.pipe(filter(Boolean), take(1)).subscribe(() => {
        this.apply();
      });
    }
  }

  ngOnChanges() {
    this.apply();
  }

  private apply() {
    const raw = this.appSafeHtml ?? '';
    const next = this.s.sanitize(SecurityContext.HTML, raw) ?? '';

    if (this.isServer) {
      this.sanitizedHtml = next;
      return;
    }

    if (this.isBrowser) {
      if (document.readyState === 'complete' || (window as any).ngHydrated) {
        if (next !== this.sanitizedHtml) this.sanitizedHtml = next;
      }
    }
  }
}
