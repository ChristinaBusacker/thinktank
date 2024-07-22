import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { debounceTime, combineLatest } from 'rxjs';
import { SetLanguage } from '../../../core/state/localization/localization.actions';
import { SearchService } from '../../../core/services/search.service';

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

  constructor(private store: Store, private searchService: SearchService) { }

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(debounceTime(300)),
      this.optionControl.valueChanges
    ]).subscribe(([searchValue, optionValue]) => {
      this.searchQuery = searchValue;
      this.searchOption = optionValue;
      this.performSearch(searchValue, optionValue);
    });

    this.optionControl.setValue('all', { emitEvent: true });
  }

  performSearch(query: string, option: string): void {
    this.searchService.search(query, option)
    console.log('Searching for:', query, 'in option:', option);
  }
}
