import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CmsService } from './core/services/cms.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { NgxsModule } from '@ngxs/store';
import { LocalizationState } from './core/state/localization/localization.state';
import { SearchService } from './core/services/search.service';
import { LanguagePickerComponent } from './shared/components/language-picker/language-picker.component';
import { LocalizationService } from './core/services/localization.service';
import { TransferStateService } from './core/services/transfer-state.service';
import { BrowserSpecsService } from './core/services/browser-specs.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  providers: [CmsService, SearchService, LocalizationService, TransferStateService, BrowserSpecsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xrthinktank';
}
