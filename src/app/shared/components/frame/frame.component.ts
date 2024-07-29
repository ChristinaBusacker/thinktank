import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss'
})
export class FrameComponent implements OnInit {

  @Input('appearance') appearance: 'small' | 'thick' = 'thick'
  @HostBinding('class') classes: string = this.appearance

  ngOnInit(): void {
    this.classes = this.appearance
  }
}
