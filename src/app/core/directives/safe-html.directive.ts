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
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appSafeHtml]',
  host: { ngSkipHydration: '' },
})
export class SafeHtmlDirective {
  @Input() appSafeHtml: string | null = null;
  @HostBinding('innerHTML') sanitizedHtml = '';

  private hydrated = false;

  constructor(
    private s: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: Object,
    appRef: ApplicationRef
  ) {
    if (isPlatformServer(platformId)) {
      // Server: sofort rendern
      this.apply();
    } else if (isPlatformBrowser(platformId)) {
      // Client: exakt NACH Stabilisierung einmal setzen
      appRef.isStable.pipe(filter(Boolean), take(1)).subscribe(() => {
        this.hydrated = true;
        this.apply(); // ← ohne readyState/Window-Checks
      });
    }
  }

  ngOnChanges() {
    // Bei Input-Änderungen erneut anwenden:
    // - Server: sofort
    // - Client: nur wenn Hydration abgeschlossen
    this.apply();
  }

  private apply() {
    const raw = this.appSafeHtml ?? '';
    const next = this.s.sanitize(SecurityContext.HTML, raw) ?? '';
    if (!this.hydrated && typeof window !== 'undefined') return; // warten bis isStable
    if (this.sanitizedHtml !== next) this.sanitizedHtml = next;
  }
}
