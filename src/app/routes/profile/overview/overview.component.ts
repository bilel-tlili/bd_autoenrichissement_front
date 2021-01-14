import { Component, OnInit } from '@angular/core';
import { User, SettingsService } from '@core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  user: User;

  constructor(settings: SettingsService) {
    this.user = settings.user;
  }
 

}
