import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MenuComponent } from '../menu/menu.component';
import { LanguagePickerComponent } from '../language-picker/language-picker.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, MenuComponent, LanguagePickerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
