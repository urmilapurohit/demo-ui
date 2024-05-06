import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hierarchy } from '@models/hierarchy.model';
import { BaseResponseModel } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { ManageService } from '../../services/manage.service';
import { ITeamManageHierarchyObject } from '../../models/manage';

@Component({
  selector: 'app-team-manage-hierarchy',
  templateUrl: './team.manage.hierarchy.component.html',
  styleUrl: './team.manage.hierarchy.component.css'
})
export class TeamManageHierarchyComponent implements OnInit, OnDestroy {
  // #region class members
  loggedInUserID: number | null = null;
  hierarchyConfig!: Hierarchy;
  parentUserData: ITeamManageHierarchyObject | undefined;
  childUsersData: ITeamManageHierarchyObject[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ManageService
  ) { }
  // #endregion

  ngOnInit() {
    this.getTeamManageHierarchy(undefined, true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  getTeamManageHierarchy(id?: number, isFirstCall?: boolean) {
    this.service.getTeamHierarchy(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITeamManageHierarchyObject[]>) => {
        if (res.isSuccess) {
          if (res.data) {
            const teamManageHierarchy = res.data;
            if (teamManageHierarchy) {
              this.parentUserData = teamManageHierarchy.find((manage) => manage.isParent);
              this.childUsersData = teamManageHierarchy.filter((manage) => !manage.isParent);

              if (isFirstCall && this.parentUserData) {
                this.loggedInUserID = this.parentUserData.id;
              }
              this.setHierarchyConfig();
            }
          }
        }
      },
    });
  }

  private setHierarchyConfig(): void {
    this.hierarchyConfig = {
      parentData: this.parentUserData,
      childData: this.childUsersData,
      nextImgUrl: '../../../../../../../assets/images/plus.svg',
      previousImgUrl: '../../../../../../../assets/images/minus.svg',
      previewImgUrl: '../../../../../../../assets/images/preview-bg-icon.jpg',
      onExpandHierarchy: (data: number) => { this.getTeamManageHierarchy(data); }
    };
  }
  // #endregion
}
