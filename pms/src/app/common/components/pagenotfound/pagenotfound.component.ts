import { Component } from '@angular/core';
import { COMMON_ROUTES } from '../../constants/constant';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.css'
})
export class PagenotfoundComponent {
  dashboardRoute = COMMON_ROUTES.REDIRECT_TO_DASHBOARD;
}
