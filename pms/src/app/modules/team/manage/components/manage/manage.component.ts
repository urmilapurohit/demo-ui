import { Component, OnDestroy } from '@angular/core';
import { GlobalService } from 'workspace-library';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { PageAccessPermission } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { ITeamManageSearchParams } from '../../models/manage';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnDestroy {
  // #region class members
  manageTeamSearchParams: ITeamManageSearchParams = {} as ITeamManageSearchParams;
  totalTeamManageRecord: number | null = null;
  pagePermissions: PageAccessPermission;
  currentTab: string = 'ListView';
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ManageService,
    private uiService: UIService,
    public globalService: GlobalService,
    private permissionService: PermissionService
  ) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.TeamManage);
  }
  // #endregion

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  showTab(tab: string): void {
    this.currentTab = tab;
  }

  handleManageTeamSearchParams(searchParams: ITeamManageSearchParams) {
    this.manageTeamSearchParams = searchParams;
  }

  handleTeamManageTotalRecordsParams(totalRecord: number | null) {
    this.totalTeamManageRecord = totalRecord;
  }

  hasAccessForExport() {
    return this.pagePermissions.isExportPermission && this.currentTab === "ListView";
  }

  exportToExcel() {
    if (this.totalTeamManageRecord) {
      this.service.exportToExcel(this.manageTeamSearchParams, 'blob').pipe(takeUntil(this.ngUnsubscribe$)).subscribe((blob: Blob) => {
        this.uiService.openFile(blob);
      });
    }
    else {
      this.globalService.openSnackBar(GLOBAL_CONSTANTS.COMMON_EXPORT_ERROR_MESSAGE, 'error-message');
    }
  }
  // #endregion
}
