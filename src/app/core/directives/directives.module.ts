import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlDirective } from './safe-html.directive';



@NgModule({
  declarations: [SafeHtmlDirective],
  imports: [
    CommonModule
  ],
  exports: [
    SafeHtmlDirective
  ]
})
export class DirectivesModule { }
