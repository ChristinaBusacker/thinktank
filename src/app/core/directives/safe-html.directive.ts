import { Directive, Input, OnChanges, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Directive({
  selector: '[appSafeHtml]',
  host: { ngSkipHydration: '' },
})
export class SafeHtmlDirective implements OnChanges {
  @Input() appSafeHtml: string | null = null;

  @HostBinding('innerHTML')
  sanitizedHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const raw = this.appSafeHtml ?? '';
    const next = this.sanitizer.sanitize(SecurityContext.HTML, raw) ?? '';
    if (next !== this.sanitizedHtml) {
      this.sanitizedHtml = next;
    }
  }
}
