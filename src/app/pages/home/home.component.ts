import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import { Events, Posts } from '../../../core/interfaces/cms.interfaces';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/localization.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  events$: Observable<Events> = inject(Store).select(CMSState.getEvents);
  posts$: Observable<Posts> = inject(Store).select(CMSState.getPosts);
}
