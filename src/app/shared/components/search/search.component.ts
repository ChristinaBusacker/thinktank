import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { combineLatest, debounceTime, Observable } from 'rxjs';
import {
  CMSObjectType,
  CMSSearchResult,
} from '../../../../core/interfaces/cms.interfaces';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { SearchService } from '../../../core/services/search.service';
import { LocalizationState } from '../../../core/state/localization/localization.state';
import { SearchState } from '../../../core/state/search/search.state';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
  ],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  optionControl = new FormControl('all');
  searchQuery: string = '';
  searchOption: string = '';
  lang: 'de' | 'en' = 'de';

  lastSearch = { query: '', option: '', lang: '' };

  types = CMSObjectType;

  results$: Observable<CMSSearchResult[] | undefined> = inject(Store).select(
    SearchState.getSearchResults
  );
  lang$: Observable<'de' | 'en'> = inject(Store).select(
    LocalizationState.getLanguage
  );

  @Output() public clicked = new EventEmitter<boolean>();

  constructor(
    private store: Store,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(debounceTime(300)),
      this.optionControl.valueChanges,
    ]).subscribe(([searchValue, optionValue]) => {
      this.searchQuery = searchValue || '';
      this.searchOption = optionValue || '';

      if (this.searchQuery.length > 1) {
        this.performSearch();
      }
    });

    this.lang$.subscribe((lang) => {
      this.lang = lang;
      if (this.lastSearch.lang !== lang) {
        this.performSearch();
      }
    });

    this.optionControl.setValue('all', { emitEvent: true });
  }

  performSearch(): void {
    if (
      this.lastSearch.query !== this.searchQuery ||
      this.lastSearch.option !== this.searchOption ||
      (this.lastSearch.lang !== this.lang && this.lastSearch.query.length > 1)
    ) {
      this.searchService.search(this.searchQuery, this.searchOption);
      console.log(
        'Searching for:',
        this.searchQuery,
        'in option:',
        this.searchOption
      );
      this.lastSearch = {
        query: this.searchQuery,
        option: this.searchOption,
        lang: this.lang,
      };
    } else {
      console.log('Prevented search, because params doesnt changed');
    }
  }

  getImageUrl(object: CMSSearchResult) {
    if (object.type === this.types.event) {
      return (object.data as any).eventImage.url;
    }

    if (object.type === this.types.post) {
      return (object.data as any).postImage.url;
    }
  }

  navigate(object: CMSSearchResult) {
    this.clicked.emit(true);
    this.router.navigate(['/', this.lang, object.type, object.data.url]);
  }
}
