import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataGrid } from 'workspace-library/lib/models/data-grid-models/data-grid.config';
import { DataGridFieldDataType } from 'workspace-library';
import { UIService } from '@services/ui.service';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { DEFAULT_PAGINATION } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { ManageService } from '../../services/manage.service';
import { ImmediateSeniorHistory, ImmediateSeniorHistorySearchParam } from '../../models/manage';

@Component({
  selector: 'app-immediate-senior-history',
  templateUrl: './immediate.senior.history.component.html',
  styleUrl: './immediate.senior.history.component.css'
})
export class ImmediateSeniorHistoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  immediateSeniorGridConfig!: DataGrid<ImmediateSeniorHistory>;
  immediateSeniorList: ImmediateSeniorHistory[] = [];
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  id!: string;
  initialSearchParams: ImmediateSeniorHistorySearchParam = {
    ...DEFAULT_PAGINATION,
  };
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "fullName", title: "Name", isSortable: false, },
    { field: "startDate", title: "Start Date", fieldDataType: DataGridFieldDataType.dateTime, isSortable: false, },
    { field: "endDate", title: "End Date", fieldDataType: DataGridFieldDataType.dateTime, isSortable: false, },
    { field: "days", title: "Days", customHeaderClassName: "days-column", isSortable: false, },
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ManageService,
    public router: Router,
    private route: ActivatedRoute,
    private uiService: UIService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }
  // #endregion

  ngOnInit(): void {
    this.setTableConfig();
    if (Number(this.id) > 0) {
      this.getImmediateSeniorHistoryList(Number(this.id));
    }
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  backButtonClick = () => {
    this.router.navigate([ROUTES.RESOURCE_MANAGEMENT.MANAGE.ABSOLUTE_MANAGE]);
  };

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Resource Management', link: '' },
      { label: 'Manage', link: ROUTES.RESOURCE_MANAGEMENT.MANAGE.ABSOLUTE_MANAGE },
      { label: 'Immediate Senior History', link: '' },
    ];
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.immediateSeniorGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<ImmediateSeniorHistory> => {
    const config: DataGrid<ImmediateSeniorHistory> = {
      columns: this.setTableColumns(),
      pageIndex: this.initialSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      totalDataLength: this.immediateSeniorList?.length,
      isNoRecordFound: !((this.immediateSeniorList?.length ?? 0) > 0),
      gridData: {
        data: this.immediateSeniorList,
        dataSource: undefined
      },
      id: 'VendorGrid',
      idFieldKey: 'fullName',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private getImmediateSeniorHistoryList(id: number) {
    this.service.getImmediateSeniorHistory(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ImmediateSeniorHistory[]>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.immediateSeniorList = res.data;
              this.setTableConfig();
            }
          }
          this.isGridLoading = false;
        },
        error: () => {
          this.isGridLoading = false;
        }
      });
    this.isGridLoading = false;
  }
  // #endregion
}
