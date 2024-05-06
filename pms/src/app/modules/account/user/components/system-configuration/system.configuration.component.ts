import { Component, OnInit } from '@angular/core';
import { DataGrid } from 'workspace-library';
import { Router } from '@angular/router';
import { ISystemConfigurationSearchParams, SystemElement, SystemElementList } from '../../models/user';
import { DEFAULT_ORDER, DEFAULT_PAGINATION } from '../../../../../common/constants/constant';
import { UserService } from '../../services/user';
import { UIService } from '../../../../../common/services/ui.service';

const SYSTEM_DATA: SystemElement[] = [
  { id: 1, itemType: 'LAPTOP', itemModel: 'Dell Vostro 3525', quantity: '1', itemHome: 'No', serialNo: '3CLY9V3', itemType2: 'Motherboard', itemModel2: 'DH61WW', quantity2: '1', itemHome2: 'No', serialNo2: '3CLY9V3', itemType3: 'Motherboard', itemModel3: 'DH61WW', quantity3: '1', itemHome3: 'No', serialNo3: '3CLY9V3', },
  { id: 2, itemType: 'Laptop Bag', itemModel: 'Dell Laptop Bag', quantity: '1', itemHome: 'Yes', serialNo: '548796884', itemType2: 'RAM', itemModel2: '16GB, DDR3', quantity2: '1', itemHome2: 'No', serialNo2: '548796884', itemType3: 'RAM', itemModel3: '16GB, DDR3', quantity3: '1', itemHome3: 'No', serialNo3: '548796884', },
  { id: 3, itemType: '3.5mm Y splitter 1 Male to 2 Female Port', itemModel: '3.5mm Y Splitter 1 Male to 2 Female Port', quantity: '1', itemHome: 'Yes', serialNo: '8457968425', itemType2: 'Processor', itemModel2: 'Intel i5 2500k', quantity2: '1', itemHome2: 'No', serialNo2: '8457968425', itemType3: 'Processor', itemModel3: 'Intel i5 2500k', quantity3: '1', itemHome3: 'No', serialNo3: '8457968425', },
  { id: 4, itemType: 'Head Phone', itemModel: 'iball Rocky', quantity: '1', itemHome: 'No', serialNo: '1236584789', itemType2: 'HardDisk', itemModel2: '320GB SATA', quantity2: '1', itemHome2: 'No', serialNo2: '1236584789', itemType3: 'HardDisk', itemModel3: '320GB SATA', quantity3: '1', itemHome3: 'No', serialNo3: '1236584789', },
  { id: 5, itemType: 'Mouse', itemModel: 'Circle USB Mouse', quantity: '1', itemHome: 'Yes', serialNo: '8965471523', itemType2: 'SMPS', itemModel2: '400W SMPS', quantity2: '1', itemHome2: 'No', serialNo2: '8965471523', itemType3: 'SMPS', itemModel3: '400W SMPS', quantity3: '1', itemHome3: 'No', serialNo3: '8965471523', },
];
const initialSearchParams: ISystemConfigurationSearchParams = {
  ...DEFAULT_PAGINATION,
  sortBy: 'Name'
};
@Component({
  selector: 'app-system-configuration',
  templateUrl: './system.configuration.component.html',
  styleUrl: './system.configuration.component.css'
})

export class SystemConfigurationComponent implements OnInit {
  systemConfigurationGridConfig!: DataGrid<SystemElement>;
  systemConfigurationList: SystemElementList | null = {} as SystemElementList;
  isGridLoading: boolean = true;
  systemConfigurationSearchParams: ISystemConfigurationSearchParams = { ...initialSearchParams };
  constructor(
    private service: UserService,
    private uiService: UIService,
    private router: Router,
  ) {
    this.systemConfigurationSearchParams = {
      ...this.systemConfigurationSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.systemConfigurationSearchParams.pageSize
    };
  }
  tableColumns: any[] = [
    {
      field: "itemType",
      title: "Item Type",
    },
    {
      field: "itemModel",
      title: "Item Model",
    },
    {
      field: "quantity",
      title: "Qnty",
    },
    {
      field: "itemHome",
      title: "Has Taken To Home",
    },
    {
      field: "serialNo",
      title: "Serial Number",
    },
  ];
  ngOnInit(): void {
    this.setTableConfig();
    this.getSystemConfigurationList();
  }

  private setTableConfig(): void {
    this.systemConfigurationGridConfig = this.getGridConfig();
  }
  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }
  private getGridConfig = (): DataGrid<SystemElement> => {
    const config: DataGrid<SystemElement> = {
      columns: this.setTableColumns(),
      pageIndex: this.systemConfigurationSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.systemConfigurationSearchParams.pageSize,
      totalDataLength: this.systemConfigurationList?.totalRecords || 0,
      isNoRecordFound: false,
      paginationCallBack: (event) => {
        this.systemConfigurationSearchParams = {
          ...this.systemConfigurationSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getSystemConfigurationList();
      },
      gridData: {
        data: SYSTEM_DATA,
        dataSource: undefined
      },
      id: 'SystemConfigurationList',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'itemType' },
        pageNumber: this.systemConfigurationSearchParams.pageNumber,
        pageSize: this.systemConfigurationSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.systemConfigurationSearchParams = {
            ...this.systemConfigurationSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getSystemConfigurationList();
        }
      }
    };
    return config;
  };
  getSystemConfigurationList() {
    this.isGridLoading = false;
    // const data = {
    //   ...this.systemConfigurationSearchParams
    // };

    // this.service.getSystemConfigurationById().subscribe({
    //   next: (res: BaseResponseModel<SystemElementList>) => {
    //     if (res.isSuccess) {
    //       if (res.data) {
    //         this.systemConfigurationList = res.data;
    //         this.setTableConfig();
    //       }
    //     }
    //     setTimeout(() => {
    //       this.isGridLoading = false;
    //     }, 300);
    //   },
    //   error: () => {
    //     this.isGridLoading = false;
    //   }
    // });
  }
  backToUserProfile() {
    this.router.navigate(['account/user/my-profile']);
  }
}
