import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Directive({
  selector: '[appSafeHtml]',
})
export class SafeHtmlDirective implements OnChanges {
  @Input() appSafeHtml: string | null = '';

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!('appSafeHtml' in changes)) return;

    const raw = changes['appSafeHtml'].currentValue ?? '';
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, raw) ?? '';
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', sanitized);
  }
}
