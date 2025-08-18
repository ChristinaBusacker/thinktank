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
  host: { ngSkipHydration: '' }, // ← Hydration für dieses Element überspringen
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

    // WICHTIG: Erst NACH erfolgreicher Hydration clientseitig schreiben
    if (this.isBrowser) {
      appRef.isStable.pipe(filter(Boolean), take(1)).subscribe(() => {
        // einmal nach Hydration anwenden (falls Input schon da)
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
      // Server: sofort setzen (geht in SSR-HTML-Snapshot)
      this.sanitizedHtml = next;
      return;
    }

    if (this.isBrowser) {
      // Client: nur NACH Hydration schreiben (siehe ctor)
      // wenn isStable noch nicht erreicht: nichts tun
      // (HostBinding wird dann im subscribe oben gesetzt)
      // hier ein kleiner Guard:
      if (document.readyState === 'complete' || (window as any).ngHydrated) {
        if (next !== this.sanitizedHtml) this.sanitizedHtml = next;
      }
    }
  }
}
