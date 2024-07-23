import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LocalizationState } from '../state/localization/localization.state';
import { Store } from '@ngxs/store';
import { Events } from '../../../core/interfaces/cms.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {


  constructor() { }

}
