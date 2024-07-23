import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { debounceTime, combineLatest, Observable } from 'rxjs';
import { SetLanguage } from '../../../core/state/localization/localization.actions';
import { SearchService } from '../../../core/services/search.service';
import { CMSObjectType, CMSSearchResult, Post } from '../../../../core/interfaces/cms.interfaces';
import { SearchState } from '../../../core/state/search/cms.state';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  optionControl = new FormControl();
  searchQuery: string = '';
  searchOption: string = '';

  types = CMSObjectType;

  results$: Observable<CMSSearchResult[] | undefined> = inject(Store).select(SearchState.getSearchResults);

  constructor(private store: Store, private searchService: SearchService) { }

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(debounceTime(300)),
      this.optionControl.valueChanges
    ]).subscribe(([searchValue, optionValue]) => {
      this.searchQuery = searchValue;
      this.searchOption = optionValue;

      if (this.searchQuery.length > 1) {
        this.performSearch(searchValue, optionValue);
      }

    });

    this.results$.subscribe(results => console.log(results))

    this.optionControl.setValue('all', { emitEvent: true });
  }

  performSearch(query: string, option: string): void {
    this.searchService.search(query, option)
    console.log('Searching for:', query, 'in option:', option);
  }

  getImageUrl(object: CMSSearchResult) {
    if (object.type === this.types.event) {
      return (object.data as any).eventImage.url;
    }

    if (object.type === this.types.post) {
      return (object.data as any).postImage.url;
    }
  }
}
