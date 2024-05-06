import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { Button, ButtonType, ButtonVariant, Checkbox, DataGrid, DataGridActionButton, DataGridFullRowData, DateField, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { DateFormats, Pages } from '@constants/Enums';
import { DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS, LOOKUP_CATEGORY_ID } from '@constants/constant';
import { InquiryService } from '../../services/inquiry.service';
import { IInquiryList, IInquiryObject, IInquirySearchParams, IPersonalizedViewObject, ISavedSearchObj, ISavedSearchResponse, IStatusModel } from '../../models/inquiry';
import { InquiryTableColumns, PersonalizedViewList, RatingList } from '../../config/inquiry.config';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.css'
})
export class InquiryComponent implements OnInit, OnDestroy {
  // #region class members
  filterForm!: FormGroup;
  baDropDownConfig!: DropDown;
  bdeDropDownConfig!: DropDown;
  statusIds!: DropDown;
  searchName!: TextField;
  fromDate!: DateField;
  toDate!: DateField;
  country!: DropDown;
  source!: DropDown;
  rating!: DropDown;
  projectTechnology!: DropDown;
  status!: DropDown;
  inquiryType!: DropDown;
  openInquiries!: Checkbox;
  saveSearch!: TextField;
  personalizedView!: DropDown;
  searchBtnConfig!: Button;
  advanceSearchBtnConfig!: Button;
  resetBtnConfig!: Button;
  saveSearchBtnConfig!: Button;

  inquiryGridConfig!: DataGrid<IInquiryObject>;
  inquiryList: IInquiryList | null = {} as IInquiryList;
  initialSearchParams: IInquirySearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Date',
    bdeIds: "",
    baIds: "",
    statusIds: "",
    fromDate: new Date(""),
    toDate: new Date(""),
    countryIds: "",
    sourceIds: "",
    ratings: "",
    projectTechnologyIds: "",
    typeId: 0,
    isOpenInquiries: true,
  };
  inquirySearchParams: IInquirySearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = true;
  loading: boolean = false;
  pagePermissions: PageAccessPermission;
  showHideWrapper: boolean = false;

  technologiesList!: DropdownValue[];
  memberRoleBAList!: DropdownValue[];
  memberRoleBDEList!: DropdownValue[];
  statusList!: IStatusModel[];
  countryList!: DropdownValue[];
  sourceList!: DropdownValue[];
  inquiryTypeList!: DropdownValue[];

  savedSearchId: number = 0;
  savedSearchList!: ISavedSearchObj[];

  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = InquiryTableColumns;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private permissionService: PermissionService,
    public globalService: GlobalService,
    public router: Router,
    public service: InquiryService
  ) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.PreSalesInquiry);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.fetchAllList();
    this.getSavedSearch();
    this.getInquiryList();
    this.getPersonalizedView();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods

  getIdTracking(item: any) {
    return item.id;
  }

  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Pre-Sales', link: '' },
      { label: 'Inquiry', link: '' },
    ];
  }

  // toggle hide-search/advance-search button
  toggleHideWrapper() {
    this.showHideWrapper = !this.showHideWrapper;
    this.advanceSearchBtnConfig.buttonText = this.showHideWrapper ? 'Hide Search' : 'Advance Search';
  }

  addInquiry() {
    this.router.navigate([ROUTES.PRE_SALES.INQUIRY.ADD_INQUIRY_ABSOLUTE]);
  }

  // get saved search data by id and patch them to search fields
  onClickSavedSearchText(i: number): void {
    this.service.getSavedSearchById(i)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ISavedSearchResponse>) => {
          if (res.isSuccess && res.data) {
            const data = res.data.searchCriteriaContent;
            this.savedSearchId = res.data.id;
            this.filterForm.patchValue({
              saveSearch: res.data.searchName
            });
            this.filterForm.patchValue({
              bde: data.bdeIds ? this.uiService.convertStringToNumArray(data.bdeIds) : '',
              ba: data.baIds ? this.uiService.convertStringToNumArray(data.baIds) : '',
              status: data.statusIds ? this.uiService.convertStringToNumArray(data.statusIds) : '',
              searchName: data.search || '',
              fromDate: data.fromDate,
              toDate: data.toDate,
              country: data.countryIds ? this.uiService.convertStringToNumArray(data.countryIds) : '',
              source: data.sourceIds ? this.uiService.convertStringToNumArray(data.sourceIds) : '',
              rating: data.ratings ? this.uiService.convertStringToNumArray(data.ratings) : '',
              projectTechnology: data.projectTechnologyIds ? this.uiService.convertStringToNumArray(data.projectTechnologyIds) : '',
              inquiryType: data.typeId || 0,
              openInquiries: data.isOpenInquiries || false
            });
            if (data.fromDate || data.toDate || data.countryIds || data.sourceIds || data.ratings || data.projectTechnologyIds || data.typeId) {
              this.showHideWrapper = true;
              this.advanceSearchBtnConfig.buttonText = 'Hide Search';
            }
            else {
              this.showHideWrapper = false;
              this.advanceSearchBtnConfig.buttonText = 'Advance Search';
            }
            this.applyFilter();
          }
        }
      });
  }

  onDeleteButtonClick(i: number): void {
    this.service.deleteSavedSearchStatus(i)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ISavedSearchObj>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.getSavedSearch();
          }
        }
      });
  }

  // get saved search field list
  private getSavedSearch() {
    this.service.getSavedSearch()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISavedSearchObj[]>) => {
          if (res.isSuccess && res.data) {
            this.savedSearchList = res.data;
          }
        }
      });
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      bde: [""],
      ba: [""],
      status: [""],
      searchName: [""],
      fromDate: [null],
      toDate: [null],
      country: [""],
      source: [""],
      rating: [""],
      projectTechnology: [""],
      inquiryType: [""],
      openInquiries: [true],
      saveSearch: [""],
      personalizedView: [""]
    });
  }

  private setTextBoxConfig = (): void => {
    this.bdeDropDownConfig = {
      data: {
        data: this.memberRoleBDEList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'bde',
      formControlName: 'bde',
      label: 'BDE',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.baDropDownConfig = {
      data: {
        data: this.memberRoleBAList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'ba',
      formControlName: 'ba',
      label: 'BA',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.statusIds = {
      data: {
        data: this.statusList?.map((x) => { return { id: x.id, text: x.name }; }) || []
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.searchName = {
      label: 'Search',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.fromDate = {
      label: 'From Date',
      formControlName: 'fromDate',
      needOnKeyDown: true,
      placeholder: "DD-MMM-YYYY",
      max: () => this.filterForm.get('toDate')?.value,
      isYearPicker: false
    };
    this.toDate = {
      label: 'To Date',
      formControlName: 'toDate',
      needOnKeyDown: true,
      placeholder: "DD-MMM-YYYY",
      min: () => this.filterForm.get('fromDate')?.value,
      isYearPicker: false
    };
    this.country = {
      data: {
        data: this.countryList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'country',
      formControlName: 'country',
      label: 'Country',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.source = {
      data: {
        data: this.sourceList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'source',
      formControlName: 'source',
      label: 'Source',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.rating = {
      data: {
        data: RatingList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'rating',
      formControlName: 'rating',
      label: 'Rating',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.projectTechnology = {
      data: {
        data: this.technologiesList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'projectTechnology',
      formControlName: 'projectTechnology',
      label: 'Project Technology',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.inquiryType = {
      data: {
        data: this.inquiryTypeList
      },
      feature: {
        allowMultiple: false
      },
      id: 'inquiryType',
      formControlName: 'inquiryType',
      label: 'InquiryType',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.openInquiries = {
      label: 'Open Inquiries',
      formControlName: 'openInquiries',
      click: () => { }
    };
    this.saveSearch = {
      placeholder: 'Enter Search Name',
      label: '',
      formControlName: 'saveSearch',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { }
    };
    this.personalizedView = {
      data: {
        data: PersonalizedViewList
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'personalized-view',
      formControlName: 'personalizedView',
      label: 'Personalized View',
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: () => { this.updatePersonalizedView(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.advanceSearchBtnConfig = {
      id: 'advance-search',
      buttonText: 'Advance Search',
      buttonType: ButtonType.default,
      className: 'custom-border-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.toggleHideWrapper(); },
    };
    this.resetBtnConfig = {
      id: 'clear',
      buttonText: 'Clear',
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.resetFilter(); },
    };
    this.saveSearchBtnConfig = {
      id: 'save-search',
      buttonText: '',
      buttonVariant: ButtonVariant.iconOnly,
      buttonType: ButtonType.img,
      imgUrl: 'assets/images/save-search-icon.svg',
      className: 'icon-btn icon-only',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.OnSaveSearch(); },
    };
  }

  private preparePayload(): void {
    this.inquirySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      bdeIds: this.filterForm.get('bde')?.value ? this.filterForm.get('bde')?.value.join(',') : '',
      baIds: this.filterForm.get('ba')?.value ? this.filterForm.get('ba')?.value.join(',') : '',
      statusIds: this.filterForm.get('status')?.value ? this.filterForm.get('status')?.value.join(',') : '',
      search: this.filterForm.get('searchName')?.value,
      fromDate: this.filterForm.get('fromDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('fromDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      toDate: this.filterForm.get('toDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('toDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      countryIds: this.filterForm.get('country')?.value ? this.filterForm.get('country')?.value.join(',') : '',
      sourceIds: this.filterForm.get('source')?.value ? this.filterForm.get('source')?.value.join(',') : '',
      ratings: this.filterForm.get('rating')?.value ? this.filterForm.get('rating')?.value.join(',') : '',
      projectTechnologyIds: this.filterForm.get('projectTechnology')?.value ? this.filterForm.get('projectTechnology')?.value.join(',') : '',
      typeId: this.filterForm.get('inquiryType')?.value || 0,
      isOpenInquiries: this.filterForm.get('openInquiries')?.value
    };
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.preparePayload();
    this.getInquiryList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.savedSearchId = 0;
    this.filterForm.patchValue({
      bde: '',
      ba: '',
      status: '',
      searchName: '',
      fromDate: '',
      toDate: '',
      country: '',
      source: '',
      rating: '',
      projectTechnology: '',
      inquiryType: 0,
      openInquiries: true,
      saveSearch: ''
    });
    this.inquirySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getInquiryList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.inquiryGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];

    const Ids: number[] = this.filterForm.get('personalizedView')?.value;
    this.tableColumns.forEach((cols) => {
      let column;
      if (Ids.includes(cols.id)) {
        column = { ...cols, isHidden: false };
      } else {
        column = cols;
      }
      columnData.push(this.uiService.getColumnConfig(column));
    });

    return columnData;
  }

  private getActionButtons(): DataGridActionButton<IInquiryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IInquiryObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IInquiryObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PRE_SALES.INQUIRY.EDIT_INQUIRY_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    const viewHistory: DataGridActionButton<IInquiryObject> = this.uiService.getHistoryActionButtonConfig((data: DataGridFullRowData<IInquiryObject>) => {
      if (data?.rowData?.id) {
        this.router.navigate([ROUTES.PRE_SALES.INQUIRY.HISTORY_ABSOLUTE, data.rowData.id]);
      }
    });
    actionsButton.push(viewHistory);
    return actionsButton;
  }

  private getGridConfig = (): DataGrid<IInquiryObject> => {
    const config: DataGrid<IInquiryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.inquirySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.inquirySearchParams.pageSize,
      totalDataLength: this.inquiryList?.totalRecords || 0,
      isNoRecordFound: !((this.inquiryList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.inquirySearchParams = {
          ...this.inquirySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getInquiryList();
      },
      gridData: {
        data: this.inquiryList?.records,
        dataSource: undefined
      },
      id: 'InquiryGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'date' },
        pageNumber: this.inquirySearchParams.pageNumber,
        pageSize: this.inquirySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.inquirySearchParams = {
            ...this.inquirySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };
          this.getInquiryList();
        }
      }
    };
    return config;
  };

  // on save all search fields
  private OnSaveSearch(): void {
    const searchName = this.filterForm.get('saveSearch')?.value;
    const data = {
      searchName,
      searchCriteriaContent: {
        bdeIds: this.filterForm.get('bde')?.value ? this.filterForm.get('bde')?.value.join(',') : '',
        baIds: this.filterForm.get('ba')?.value ? this.filterForm.get('ba')?.value.join(',') : '',
        statusIds: this.filterForm.get('status')?.value ? this.filterForm.get('status')?.value.join(',') : '',
        search: this.filterForm.get('searchName')?.value,
        fromDate: this.filterForm.get('fromDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('fromDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
        toDate: this.filterForm.get('toDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('toDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
        countryIds: this.filterForm.get('country')?.value ? this.filterForm.get('country')?.value.join(',') : '',
        sourceIds: this.filterForm.get('source')?.value ? this.filterForm.get('source')?.value.join(',') : '',
        ratings: this.filterForm.get('rating')?.value ? this.filterForm.get('rating')?.value.join(',') : '',
        projectTechnologyIds: this.filterForm.get('projectTechnology')?.value ? this.filterForm.get('projectTechnology')?.value.join(',') : '',
        typeId: this.filterForm.get('inquiryType')?.value || 0,
        isOpenInquiries: this.filterForm.get('openInquiries')?.value
      }
    };

    const apiService = this.savedSearchId > 0 ? this.service.updateSavedSearch(this.savedSearchId, data) : this.service.addSavedSearch(data);
    apiService.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISavedSearchObj>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.filterForm.get('saveSearch')?.patchValue("");
          }
          this.getSavedSearch();
        }
      });
  }

  private getInquiryList() {
    this.isGridLoading = false;
    const data = {
      ...this.inquirySearchParams
    };

    this.service.getInquiry(data)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IInquiryList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.inquiryList = res.data;
              this.setTableConfig();
            }
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

  // get personalized views to show columns
  private getPersonalizedView() {
    this.service.getPersonalizedView()
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IPersonalizedViewObject>) => {
          if (res.isSuccess) {
            if (res.data) {
              if (res.data.columnIds) {
                this.filterForm.patchValue({
                  personalizedView: this.uiService.convertStringToNumArray(res.data.columnIds)
                });
              }
              this.setTableConfig();
            }
          }
        }
      });
  }

  // update personalize view for user
  private updatePersonalizedView() {
    const data = {
      columnIds: this.filterForm.get('personalizedView')?.value.join(",")
    };

    this.loading = true;
    this.service.addUpdatePersonalizedView(data)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IPersonalizedViewObject>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.loading = false;
              this.setTableConfig();
            }
          }
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private fetchAllList() {
    const sources = [
      this.uiService.getDropdownOptions(this.service.getLookUpCategoryByID(LOOKUP_CATEGORY_ID.COUNTRY), true),
      this.service.getStatusDropDown().pipe(
        map((res: BaseResponseModel<IStatusModel[]>) => {
          if (res.isSuccess && res.data) {
            return res.data;
          } else {
            return [];
          }
        })
      ),
      this.uiService.getDropdownOptions(this.service.getMemberRoleBdeDropDown(), true),
      this.uiService.getDropdownOptions(this.service.getLookUpCategoryByID(LOOKUP_CATEGORY_ID.PRESALES_INQUIRY_SOURCE), true),
      this.uiService.getDropdownOptions(this.service.getMemberRoleBaDropDown(), true),
      this.uiService.getDropdownOptions(this.service.getProjectTechnologyDropDown(), true),
      this.uiService.getDropdownOptions(this.service.getLookUpCategoryByID(LOOKUP_CATEGORY_ID.PRESALES_TYPE), true)
    ];
    return forkJoin(sources)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res) => {
        const [country, status, memberBDE, source, memberBA, projectTechnology, inquiryType] = res;
        this.countryList = country as DropdownValue[];
        this.statusList = status as IStatusModel[];
        this.memberRoleBDEList = memberBDE as DropdownValue[];
        this.sourceList = source as DropdownValue[];
        this.memberRoleBAList = memberBA as DropdownValue[];
        this.technologiesList = projectTechnology as DropdownValue[];
        this.inquiryTypeList = inquiryType as DropdownValue[];
        this.setTextBoxConfig();
      });
  }
  // #endregion
}
