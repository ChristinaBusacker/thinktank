import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { SetCookieSettings } from '../../../core/state/cookie/cookie.state';
import { FrameComponent } from '../frame/frame.component';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';

@Component({
  selector: 'app-cookie-dialog',
  standalone: true,
  imports: [FrameComponent, CommonModule, PipesModule, LanguagePickerComponent],
  templateUrl: './cookie-dialog.component.html',
  styleUrl: './cookie-dialog.component.scss',
})
export class CookieDialogComponent {
  constructor(public store: Store) {}

  acceptCookie(): void {
    this.store.dispatch(new SetCookieSettings('accepted'));
    this.closeBanner();
  }

  rejectCookie(): void {
    this.store.dispatch(new SetCookieSettings('rejected'));
    this.closeBanner();
  }

  closeBanner(): void {
    const dialog = document.getElementById(
      'cookie-banner'
    ) as HTMLDialogElement;
    dialog.close();
  }
}
