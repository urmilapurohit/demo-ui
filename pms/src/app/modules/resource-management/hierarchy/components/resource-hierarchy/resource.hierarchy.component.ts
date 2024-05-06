import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hierarchy } from '@models/hierarchy.model';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { HierarchyService } from '../../services/hierarchy.service';
import { ITeamManageHierarchyObject } from '../../models/hierarchy';

@Component({
  selector: 'app-resource.hierarchy',
  templateUrl: './resource.hierarchy.component.html',
  styleUrl: './resource.hierarchy.component.css'
})
export class ResourceHierarchyComponent implements OnInit, OnDestroy {
  // #region class member
  loggedInUserID: number | null = null;
  hierarchyConfig!: Hierarchy;
  breadcrumbItems: BreadcrumbItem[] = [];
  parentUserData: ITeamManageHierarchyObject | undefined;
  childUsersData: ITeamManageHierarchyObject[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: HierarchyService
  ) { }
  // #endregion

  ngOnInit() {
    this.getTeamManageHierarchy(undefined, true);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class member
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Resource Management', link: '' },
      { label: 'Hierarchy', link: '' }
    ];
  }

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
