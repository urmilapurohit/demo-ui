import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataGrid, DataGridFieldDataType } from 'workspace-library';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { DateFormats } from '@constants/Enums';
import { IHistoryDetails, IHistoryObject, IInquiryObject, IPreSalesHistory } from '../../models/inquiry';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  // #region class members
  @ViewChild('historyDetailTemplate') historyDetailTemplate: TemplateRef<any> | undefined;
  historyGridConfig!: DataGrid<IHistoryObject>;
  historyDetailsGridConfig!: DataGrid<IHistoryDetails>;
  breadcrumbItems: BreadcrumbItem[] = [];
  isGridLoading: boolean = false;
  tableColumns: any[] = [];
  tableDetailsColumns: any[] = [];
  modifiedHistoryList: IHistoryObject[] = [];
  inquiryId: string = '';
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router,
    private service: InquiryService
  ) {
    this.inquiryId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  // #endregion

  ngOnInit(): void {
    this.setTableConfig();
    this.setBreadcrumb();
    if (Number(this.inquiryId) > 0) {
      this.getInquiryById(Number(this.inquiryId));
    }
  }

  ngAfterViewInit(): void {
    this.tableColumns = [
      { field: "modifiedOn", title: "Updated DateTime", customHeaderClassName: 'update-date-column', fieldDataType: DataGridFieldDataType.string, isSortable: false },
      { field: "modifiedByName", title: "Updated By", customHeaderClassName: 'update-date-column', fieldDataType: DataGridFieldDataType.string, isSortable: false },
      { field: "historyDetails", title: "History Details", fieldDataType: DataGridFieldDataType.CustomRenderTemplate, customRenderTemplate: this.historyDetailTemplate, isSortable: false }
    ];
    this.tableDetailsColumns = [
      { field: "fieldName", title: "Field Name", customHeaderClassName: 'field-name-column', isSortable: false },
      { field: "oldValue", title: "Old Value", customHeaderClassName: 'value-column', isSortable: false },
      { field: "newValue", title: "New Value", customHeaderClassName: 'value-column', isSortable: false }
    ];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Pre-Sales', link: '' },
      { label: 'Inquiry', link: ROUTES.PRE_SALES.INQUIRY.INQUIRY_ABSOLUTE },
      { label: 'History', link: '' }
    ];
  }

  backToInquiryList() {
    this.router.navigate([ROUTES.PRE_SALES.INQUIRY.INQUIRY_ABSOLUTE]);
  }

  getHistoryDetailsGrid(row: IHistoryDetails[]) {
    return this.getDetailsGridConfig(row);
  }

  private setTableConfig(): void {
    this.historyGridConfig = this.getGridConfig();
    this.historyDetailsGridConfig = this.getDetailsGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<IHistoryObject> => {
    const config: DataGrid<IHistoryObject> = {
      columns: this.setTableColumns(),
      pageIndex: 0,
      totalDataLength: this.modifiedHistoryList?.length || 0,
      isNoRecordFound: !((this.modifiedHistoryList?.length ?? 0) > 0),
      gridData: {
        data: this.modifiedHistoryList,
        dataSource: undefined
      },
      id: 'HistoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private setTableDetailsColumns() {
    const columnData: any[] = [];
    this.tableDetailsColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getDetailsGridConfig = (data?: IHistoryDetails[]): DataGrid<IHistoryDetails> => {
    const config: DataGrid<IHistoryDetails> = {
      columns: this.setTableDetailsColumns(),
      pageIndex: 0,
      totalDataLength: this.modifiedHistoryList?.length || 0,
      isNoRecordFound: !((this.modifiedHistoryList?.length ?? 0) > 0),
      gridData: {
        data,
        dataSource: undefined
      },
      id: 'HistoryDetailsGrid',
      idFieldKey: 'fieldName',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private mapHistoryList(historyList: IPreSalesHistory[]): IHistoryObject[] {
    let index = 1;
    const mappedList: IHistoryObject[] = [];
    historyList.forEach((item: any) => {
      const historyExist = mappedList.find((entry) => entry.version === item.version);
      if (historyExist) {
        historyExist.historyDetails.push({
          fieldName: item.fieldName,
          oldValue: item.oldValue,
          newValue: item.newValue
        });
      } else {
        mappedList.push({
          // eslint-disable-next-line no-plusplus
          id: index++,
          version: item.version,
          modifiedOn: item.modifiedOn,
          modifiedBy: item.modifiedBy,
          modifiedByName: item.modifiedByName,
          historyDetails: [{
            fieldName: item.fieldName,
            oldValue: item.oldValue,
            newValue: item.newValue
          }]
        });
      }
    });
    mappedList.sort((itemA, itemB) => {
      return itemB.version - itemA.version;
    });
    return mappedList;
  }

  private getInquiryById(id: number): void {
    this.isGridLoading = true;
    this.service.getInquiryById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IInquiryObject>) => {
          if (res.isSuccess && res.data) {
            let preSalesHistoryList: IPreSalesHistory[] = [];
            if (res.data.preSalesHistories) {
              preSalesHistoryList = res.data.preSalesHistories;
            }
            this.modifiedHistoryList = this.mapHistoryList(preSalesHistoryList);
            this.modifiedHistoryList.forEach((item: any) => {
              item.modifiedOn = this.uiService.convertDateFormat(item.modifiedOn.toString(), DateFormats.DD_MMM_YYYY_HH_MM_SS);
            });
            this.setTableConfig();
          }
          setTimeout(() => {
            this.isGridLoading = false;
          }, 300);
        },
        error: () => {
          this.isGridLoading = false;
        }
      });
  }
  // #endregion
}
