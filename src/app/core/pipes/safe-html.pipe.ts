import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Pipe({
  name: 'safeHtml',
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private s: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml | '' {
    if (!value) return '';

    const cleaned = this.s.sanitize(SecurityContext.HTML, value) ?? '';
    return this.s.bypassSecurityTrustHtml(cleaned);
  }
}
