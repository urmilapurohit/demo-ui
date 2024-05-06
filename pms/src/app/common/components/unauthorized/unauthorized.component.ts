import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ENVIRONMENT } from '../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { COMMON_ROUTES } from '../../constants/constant';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent implements OnInit {
  dashboardRoute = COMMON_ROUTES.REDIRECT_TO_DASHBOARD;
  constructor(private service: AuthService, private dataService: UIService, private router: Router) {
  }
  ngOnInit(): void {
    this.checkUser();
  }

  async checkUser() {
    return this.service.validateUser().toPromise().then((response) => {
      if (response && response?.isSuccess && response?.data) {
        this.dataService.setAuthenticated();
        this.dataService.setPagePermission(response.data);
      }
      else {
        window.location.href = ENVIRONMENT.ACCOUNT_CLIENT_URL;
      }
    }).catch(() => {
      window.location.href = ENVIRONMENT.ACCOUNT_CLIENT_URL;
    });
  }
}
