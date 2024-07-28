import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CMSState } from '../../core/state/cms/cms.state';
import { Event, Post } from '../../../core/interfaces/cms.interfaces';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../../core/directives/directives.module';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DirectivesModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post?: Post

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const slug = this.route.paramMap.subscribe((params) => {
      const slug = params.get('postUrl')
      this.store.select(CMSState.getPosts).subscribe(
        (posts) => this.post = posts.find(post => post.url === slug)
      )
    })

  }
}
