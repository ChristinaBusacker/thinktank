import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { Event } from '../../../core/interfaces/cms.interfaces';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../../core/directives/directives.module';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectivesModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  event?: Event

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const slug = this.route.paramMap.subscribe((params) => {
      const slug = params.get('eventUrl')
      this.store.select(CMSState.getEvents).subscribe(
        (events) => this.event = events.find(event => event.url === slug)
      )
    })
  }
}