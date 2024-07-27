import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { I18nPipe } from './i18n.pipe';



@NgModule({
  declarations: [SafeHtmlPipe, I18nPipe],
  imports: [
    CommonModule
  ],
  exports: [
    SafeHtmlPipe,
    I18nPipe
  ]
})
export class PipesModule { }
