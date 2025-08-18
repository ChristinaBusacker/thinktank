import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appSafeHtml]',
})
export class SafeHtmlDirective implements OnChanges {
  @Input() appSafeHtml: string | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(): void {
    const raw = this.appSafeHtml ?? '';
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, raw) ?? '';

    if (isPlatformServer(this.platformId)) {
      // Server: schreiben + Marker setzen
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', sanitized);
      this.renderer.setAttribute(
        this.el.nativeElement,
        'data-ssr-safehtml',
        '1'
      );
      return;
    }

    // Browser: Wenn SSR schon geschrieben hat und Inhalt identisch ist -> erstes Update überspringen
    const el = this.el.nativeElement;
    if (
      isPlatformBrowser(this.platformId) &&
      el.hasAttribute('data-ssr-safehtml')
    ) {
      // Vergleich (leicht normalisiert) um Fehldiffs zu vermeiden
      const current = (el.innerHTML || '').trim();
      if (current === sanitized.trim()) {
        this.renderer.removeAttribute(el, 'data-ssr-safehtml');
        return; // nichts tun, verhindert Hydration-Duplikate
      }
      this.renderer.removeAttribute(el, 'data-ssr-safehtml');
    }

    this.renderer.setProperty(el, 'innerHTML', sanitized);
  }
}
