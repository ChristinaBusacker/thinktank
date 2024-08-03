import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, StateKey, TransferState } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class TransferStateService {

  constructor(private ts: TransferState, @Inject(PLATFORM_ID) private platformID: Object) { }

  get<T>(key: StateKey<T>) {
    const value: T | undefined = this.ts.get<T | undefined>(key, undefined)

    if (isPlatformBrowser(this.platformID)) {
      this.ts.remove(key)
    }

    return value;
  }

  set<T>(key: StateKey<T>, value: T) {
    if (isPlatformServer(this.platformID)) {
      this.ts.set<T | undefined>(key, value)
    }
  }

  async preferTransferState<T>(key: StateKey<T>, callback: () => Promise<T>) {
    if (isPlatformBrowser(this.platformID)) {

      const value = this.get(key);
      if (value) {
        return value
      }
    }

    const value = await callback();

    if (isPlatformServer(this.platformID)) {
      this.set<T>(key, value);
    }

    return value;
  }
}
