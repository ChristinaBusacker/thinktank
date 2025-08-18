import {
  Directive,
  Input,
  HostBinding,
  Inject,
  PLATFORM_ID,
  ApplicationRef,
  ElementRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appSafeHtml]',
  host: { ngSkipHydration: '' }, // Hydration für dieses Element überspringen
})
export class SafeHtmlDirective {
  @Input() appSafeHtml: string | null = null;

  @HostBinding('innerHTML') sanitizedHtml = '';

  private readonly isServer: boolean;
  private readonly isBrowser: boolean;
  private hydrated = false;

  constructor(
    private s: DomSanitizer,
    private hostEl: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: Object,
    appRef: ApplicationRef
  ) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Warten, bis die App stabil ist (Hydration/Boot abgeschlossen)
      appRef.isStable.pipe(filter(Boolean), take(1)).subscribe(() => {
        this.hydrated = true;
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
      // Server darf immer schreiben (SSR-Snapshot erzeugen)
      this.sanitizedHtml = next;
      return;
    }

    if (this.isBrowser) {
      // Vor Hydration nichts tun (wird nach isStable erneut aufgerufen)
      if (!this.hydrated) return;

      // NUR schreiben, wenn das Host-Element aktuell leer ist
      const current = (this.hostEl.nativeElement.innerHTML || '')
        .replace(/&nbsp;/g, ' ')
        .trim();

      if (current.length === 0 && next !== this.sanitizedHtml) {
        this.sanitizedHtml = next;
      }
      // Falls bereits Inhalt vorhanden ist: NICHT überschreiben
    }
  }
}
