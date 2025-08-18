import { Directive, Input, OnChanges, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Directive({
  selector: '[appSafeHtml]',
})
export class SafeHtmlDirective implements OnChanges {
  @Input() appSafeHtml: string | null = null;

  @HostBinding('innerHTML')
  sanitizedHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const raw = this.appSafeHtml ?? '';
    this.sanitizedHtml =
      this.sanitizer.sanitize(SecurityContext.HTML, raw) ?? '';
  }
}
