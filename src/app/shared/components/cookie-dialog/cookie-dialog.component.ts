import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetCookieSettings } from '../../../core/state/cookie/cookie.state';
import { FrameComponent } from '../frame/frame.component';

@Component({
  selector: 'app-cookie-dialog',
  standalone: true,
  imports: [FrameComponent],
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
