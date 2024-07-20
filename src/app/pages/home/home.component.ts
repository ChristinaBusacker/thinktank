import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import { Events } from '../../../core/interfaces/cms.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public events: Events = []

  constructor(private cmsService: CmsService) { }

  async ngOnInit(): Promise<void> {
    this.events = await this.cmsService.fetchEvents()
  }
}
