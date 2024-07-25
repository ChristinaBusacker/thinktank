import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BrowserSpecsService } from '../services/browser-specs.service';


@Directive({
    selector: '[appHygraphImage]'
})
export class HygraphImageDirective implements OnInit {

    @Input('appHygraphImage') imageId!: string;

    private baseUrl = 'https://eu-central-1-shared-euc1-02.graphassets.com/clyt6dfux03wh07uq8dpr84u8/'

    constructor(
        private el: ElementRef,
        private browserSpecsService: BrowserSpecsService
    ) { }

    ngOnInit() {
        if (!this.imageId) {
            return;
        }
        const supportsWebP = this.browserSpecsService.supportsWebP();
        const src = this.generateImageUrl(this.imageId, supportsWebP);
        this.el.nativeElement.src = src;
    }

    private generateImageUrl(id: string, supportsWebP: boolean): string {
        const format = supportsWebP ? 'output=format:WEBP/' : '';
        return `${this.baseUrl}${format}${id}`;
    }
}
