import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private router: Router) { }

  navigate(url: any) {
    this.router.navigate(url)
  }
}
