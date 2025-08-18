import {
  Directive,
  Input,
  HostBinding,
  Inject,
  PLATFORM_ID,
  ApplicationRef,
  ElementRef, // ← neu
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
    private hostEl: ElementRef<HTMLElement>, // ← neu
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
      // SSR: immer setzen (kommt in den HTML-Snapshot)
      this.sanitizedHtml = next;
      return;
    }

    if (this.isBrowser) {
      // dein vorhandener Guard:
      if (document.readyState !== 'complete' && !(window as any).ngHydrated)
        return;

      // NUR schreiben, wenn das Host-Element aktuell leer ist
      const el = this.hostEl.nativeElement;
      const current = (el.innerHTML || '')
        .replace(/<!--[\s\S]*?-->/g, '') // HTML-Kommentare ignorieren
        .replace(/&nbsp;/g, ' ') // geschützte Leerzeichen normalisieren
        .trim();

      if (current.length === 0 && next !== this.sanitizedHtml) {
        this.sanitizedHtml = next;
      }
      // Falls schon Inhalt vorhanden ist: NICHT überschreiben (verhindert Duplikate)
    }
  }
}
