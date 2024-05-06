import { Component, OnDestroy, OnInit, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { IUserDetails } from '@models/common.model';
import { AuthService } from '@services/auth.service';
import { ROUTES } from '@constants/routes';
import { GeneralService } from '@services/general.service';
import { UserThemes } from '@constants/Enums';
import { THEME_LABEL } from '@constants/constant';
import { ChangePasswordModalComponent } from '../modal/change-password-modal/change-password-modal.component';
import { ENVIRONMENT } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  // #region class members
  @ViewChildren(MatMenuTrigger)
  trigger!: QueryList<MatMenuTrigger>;
  tooltipContent = THEME_LABEL.DARK;
  userData: IUserDetails | null = null;
  myControl = new FormControl('');
  options: string[] = ['Bench', 'Eengineer.ai', 'Front-end implementation_Apple', 'Healthcare Task Scheduler', 'In-house Development and Maintenace-PHP', 'Miscellaneous', 'Mobiddiction-Angular-Development', 'Others_Designing-2', 'PT-Flutter Monthly Hiring'];
  isAutocompleteOpen = false;
  selected = 'option1';
  filteredOptions!: Observable<string[]>;
  private themeChanged: Subject<string> = new Subject<string>();
  private userDataSubscription!: Subscription;
  // #endregion

  // #region constructor
  constructor(public dialog: MatDialog, private service: AuthService, private uiService: UIService, private renderer: Renderer2, public router: Router, private openService: GeneralService) {
    this.themeChanged
      .pipe(
        debounceTime(400),
      )
      .subscribe((theme) => {
        let themeId = 0;
        if (theme === THEME_LABEL.DARK) themeId = UserThemes.DARK;
        else if (theme === THEME_LABEL.LIGHT) themeId = UserThemes.LIGHT;
        if (themeId !== 0) this.saveThemePreference(themeId);
      });
  }
  // #endregion

  ngOnInit() {
    this.userDataSubscription = this.uiService.getUserData().subscribe((data) => {
      this.userData = data;
      if (data?.themeColorId === UserThemes.DARK) {
        this.toggleDarkMode();
        this.tooltipContent = THEME_LABEL.LIGHT;
      }
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value || '')),
    );
  }

  ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
    this.themeChanged.unsubscribe();
  }

  // #region class methods
  toggleSidebar() {
    document.body.classList.toggle('open-sidebar');
  }

  onThemeChange(theme: string) {
    this.toggleDarkMode();
    this.themeChanged.next(theme);
  }

  openDialog() {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '450px',
      autoFocus: false
    });
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-theme');

    if (this.tooltipContent === THEME_LABEL.DARK) {
      this.tooltipContent = THEME_LABEL.LIGHT;
    }
    else {
      this.tooltipContent = THEME_LABEL.DARK;
    }
  }

  openMenu(index: number) {
    this.trigger.toArray().forEach((item: MatMenuTrigger, i: number) => {
      if (i !== index && item.menuOpen) {
        item.closeMenu();
      }
    });
  }

  onAutocompleteOpened() {
    this.isAutocompleteOpen = true;
    const element = document.getElementById("selectProejct");
    if (element) {
      this.renderer.addClass(element, "header-dropdown-open");
    }
  }
  onAutocompleteClosed() {
    this.isAutocompleteOpen = false;
    const element = document.getElementById("selectProejct");
    if (element) {
      this.renderer.removeClass(element, "header-dropdown-open");
    }
  }

  userProfile(): void {
    this.router.navigate([ROUTES.ACCOUNT.USER.USER_ABSOLUTE]);
  }

  widgetSetting() {
    this.router.navigate([ROUTES.DASHBOARD.MEMBER_DASHBOARD_WIDGET.GET_MEMBER_DASHBOARD_WIDGET_ABSOLUTE]);
  }

  logout() {
    this.uiService.clearCookies();
    this.service.logout().subscribe({
      complete() {
        localStorage.clear();
        window.location.href = ENVIRONMENT.ACCOUNT_CLIENT_URL;
      }
    });
  }

  private saveThemePreference = (theme: number) => {
    this.openService.updateUserThemePreference(theme).subscribe();
  };

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
  // #endregion
}
