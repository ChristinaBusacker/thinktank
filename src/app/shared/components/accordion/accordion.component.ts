import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FrameComponent } from '../frame/frame.component';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    imports: [CommonModule, FrameComponent]
})
export class AccordionComponent implements AfterViewInit {
  @Input() isOpen = false;
  @ViewChild('content') content!: ElementRef;
  @Input() title: string | null = '';
  @Input() id: string = '';

  @Output() opened = new EventEmitter<string>();

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.setTabIndex();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.opened.emit(this.id);
    }
    this.setTabIndex();
  }

  setTabIndex() {
    const interactiveElements = this.content.nativeElement.querySelectorAll(
      'a, input, button, [tabindex], label'
    );
    interactiveElements.forEach((el: HTMLElement) => {
      if (this.isOpen) {
        this.renderer.removeAttribute(el, 'tabindex');
        if (el.tagName.toLowerCase() === 'label') {
          this.renderer.removeAttribute(el, 'aria-hidden');
        }
      } else {
        this.renderer.setAttribute(el, 'tabindex', '-1');
        if (el.tagName.toLowerCase() === 'label') {
          this.renderer.setAttribute(el, 'aria-hidden', 'true');
        }
      }
    });
  }
}
