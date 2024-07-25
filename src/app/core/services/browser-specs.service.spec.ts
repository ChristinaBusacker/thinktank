import { TestBed } from '@angular/core/testing';

import { BrowserSpecsService } from './browser-specs.service';

describe('BrowserSpecsService', () => {
  let service: BrowserSpecsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserSpecsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
