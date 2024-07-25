import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlDirective } from './safe-html.directive';
import { HygraphImageDirective } from './hygraph-image.directive';



@NgModule({
  declarations: [SafeHtmlDirective, HygraphImageDirective],
  imports: [
    CommonModule
  ],
  exports: [
    SafeHtmlDirective,
    HygraphImageDirective
  ]
})
export class DirectivesModule { }
