import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appSafeHtml]',
    standalone: false
})
export class SafeHtmlDirective implements OnChanges {
    @Input() appSafeHtml!: string;
    private isBrowser: boolean;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isBrowser && changes['appSafeHtml'] && changes['appSafeHtml'].currentValue) {
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.appSafeHtml);
        }
    }
}
