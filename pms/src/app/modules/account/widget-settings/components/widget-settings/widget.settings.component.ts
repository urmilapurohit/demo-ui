import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, DataGrid, GlobalService } from 'workspace-library';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { COMMON_ROUTES, DEFAULT_ORDER, DEFAULT_PAGINATION } from '@constants/constant';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { IWidgetDetails, IWidgetDetailsList, IWidgetDetailsObject, IWidgetDetailsSearchParams } from '../../models/widget-settings';
import { WidgetSettingsService } from '../../services/widget.settings.service';

@Component({
  selector: 'app-widget-settings',
  templateUrl: './widget.settings.component.html',
  styleUrl: './widget.settings.component.css'
})
export class WidgetSettingsComponent implements OnInit, OnDestroy {
  // #region initialize variables
  widgetId!: number;
  isVisible!: boolean;
  initialSearchParams: IWidgetDetailsSearchParams = {
    ...DEFAULT_PAGINATION,
  };
  widgetDetailsGridConfig!: DataGrid<IWidgetDetailsObject>;
  widgetSettingFormGroup!: FormGroup;
  widgetDetailsList: IWidgetDetailsList | null = {} as IWidgetDetailsList;
  widgetDetailsSearchParams: IWidgetDetailsSearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  isWidgetTableVisible: boolean = true;
  tableColumns: any[] = [
    { field: "title", title: "Title", customHeaderClassName: '' },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: WidgetSettingsService,
    private uiService: UIService,
    private router: Router,
    private globalService: GlobalService,
    private fb: FormBuilder,
  ) {
  }
  // #endregion

  ngOnInit(): void {
    this.widgetSettingFormGroup = this.fb?.group({});
    this.setTableConfig();
    this.getWidgetDetailsList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [];
  }

  handleBackBtn() {
    this.router.navigate([COMMON_ROUTES.REDIRECT_TO_DASHBOARD]);
  }

  private setTableConfig(): void {
    this.widgetDetailsGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    columnData.push({
      field: 'isVisible',
      title: 'Is Visible',
      customHeaderClassName: '',
      needToShowBasedOn: 'FormControl',
      editConfig: {
        isEditable: true,
        controlType: 'slidetoggle',
        slideToogleChange: (event: MatSlideToggleChange, element: any) => this.handleIsVisible(event, element),
      },
    },);
    return columnData;
  }

  private getGridConfig = (): DataGrid<IWidgetDetailsObject> => {
    const config: DataGrid<IWidgetDetailsObject> = {
      columns: this.setTableColumns(),
      formGroup: this.widgetSettingFormGroup,
      pageIndex: this.widgetDetailsSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.widgetDetailsSearchParams.pageSize,
      totalDataLength: this.widgetDetailsList?.totalRecords || 0,
      isNoRecordFound: !((this.widgetDetailsList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.widgetDetailsSearchParams = {
          ...this.widgetDetailsSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getWidgetDetailsList();
      },
      gridData: {
        data: this.widgetDetailsList?.records,
        dataSource: undefined
      },
      id: 'WidgetSettingGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'title' },
        pageNumber: this.widgetDetailsSearchParams.pageNumber,
        pageSize: this.widgetDetailsSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.widgetDetailsSearchParams = {
            ...this.widgetDetailsSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };
          this.getWidgetDetailsList();
        }
      }
    };
    return config;
  };

  private removeAllControls() {
    // eslint-disable-next-line no-restricted-syntax
    for (const controlName in this.widgetSettingFormGroup.controls) {
      if (this.widgetSettingFormGroup.controls[`${controlName}`]) {
        this.widgetSettingFormGroup.removeControl(controlName);
      }
    }
  }

  private getWidgetDetailsList() {
    this.isGridLoading = true;
    this.service.getWidgetDetails().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IWidgetDetailsList>) => {
        this.isGridLoading = false;
        if (res.isSuccess) {
          if (res.data) {
            this.widgetDetailsList = res?.data;
            this.isWidgetTableVisible = this.widgetDetailsList.totalRecords !== 0;
            this.setTableConfig();
            this.removeAllControls();
            this.widgetDetailsList.records.forEach((item, index) => {
              this.widgetSettingFormGroup.addControl(`isVisible_${index}`, new FormControl(item.isVisible));
            });
          }
        }
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private handleIsVisible(event: MatSlideToggleChange, element: any) {
    this.widgetId = element?.value?.id;
    this.isVisible = event?.checked;
    this.isGridLoading = true;
    const data: IWidgetDetails = {
      isVisible: this.isVisible,
    };
    this.service.updateWidgetDetails(Number(this.widgetId), Boolean(this.isVisible), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IWidgetDetailsObject>) => {
        if (res.isSuccess) {
          this.getWidgetDetailsList();
          this.isGridLoading = false;
          this.globalService.openSnackBar(res.message);
        }
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }
  // #endregion
}
