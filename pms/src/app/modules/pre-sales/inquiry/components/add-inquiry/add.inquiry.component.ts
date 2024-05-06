import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, ButtonVariant, Checkbox, DataGrid, DataGridFieldDataType, DataGridFieldType, DropDown, DropdownValue, GlobalService, InputType, MinMaxDateValidator, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { DateFormats } from '@constants/Enums';
import { LOOKUP_CATEGORY_ID } from '@constants/constant';
import { InquiryService } from '../../services/inquiry.service';
import { IInquiry, IInquiryObject, IMemberRoleResponse, IPreSalesHistory, IPreSalesRemark, IStatusModel, IUpdateInquiry } from '../../models/inquiry';
import { PreSalesInquiryConstant, RatingList } from '../../config/inquiry.config';

@Component({
  selector: 'app-add.inquiry',
  templateUrl: './add.inquiry.component.html',
  styleUrl: './add.inquiry.component.css'
})
export class AddInquiryComponent implements OnInit, OnDestroy {
  // #region class members
  addInquiryForm!: FormGroup;
  date!: TextField;
  country!: DropDown;
  status!: DropDown;
  closedReason!: DropDown;
  otherReason!: TextField;

  // BDE fields
  bde!: DropDown;
  projectName!: TextField;
  clientBudget!: TextField;
  rating!: DropDown;
  source!: DropDown;
  svnPath: string = '';
  updateSvn!: Checkbox;
  estimatedGivenDate!: TextField;
  remarkBDE!: TextArea;

  // BA fields
  ba!: DropDown;
  projectTechnology!: DropDown;
  otherMember!: TextField;
  hours!: TextField;
  inquiryType!: DropDown;
  remarkBA!: TextArea;

  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  historyButtonConfig!: Button;
  refreshButtonConfig!: Button;

  isSubmitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  inquiryId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  todayDate: string = '';

  initializeCurrentMember: IMemberRoleResponse = {
    isBa: false,
    isBde: false,
    isPreSalesAdmin: false,
    isActive: true
  };
  currentMember: IMemberRoleResponse = this.initializeCurrentMember;

  countryList!: DropdownValue[];
  statusList!: IStatusModel[];
  memberRoleBDEList!: DropdownValue[];
  sourceList!: DropdownValue[];
  memberRoleBAList!: DropdownValue[];
  projectTechnologyList!: DropdownValue[];
  inquiryTypeList!: DropdownValue[];
  closedReasonList!: DropdownValue[];

  preSalesData!: IInquiry;
  preSalesRemarks: IPreSalesRemark[] = [];
  historyGridConfig!: DataGrid<IPreSalesHistory>;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  showClosedReasonDropDown: boolean = false;
  showOtherReasonField: boolean = false;
  today = new Date();

  private ngUnsubscribe$ = new Subject<void>();

  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: InquiryService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.inquiryId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.inquiryId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addInquiryForm.controls;
  }

  ngOnInit(): void {
    this.getCurrentMember();
    this.initializeForm();
    if (this.isEdit) {
      this.getInquiryById(Number(this.inquiryId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.fetchAllList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Inquiry' : 'Add Inquiry';
    this.breadcrumbItems = [
      { label: 'Pre Sales', link: '' },
      { label: 'Inquiry', link: ROUTES.PRE_SALES.INQUIRY.INQUIRY_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  getRemarkTracking(item: any) {
    return item.id;
  }

  private initializeForm(): void {
    this.todayDate = this.uiService.convertDateFormat((new Date()).toString(), DateFormats.DD_MMM_YYYY_HH_MM);
    this.addInquiryForm = this.fb.group({
      date: [{ value: this.todayDate, disabled: true }],
      country: ["", [Validators.required, Validators.min(1)]],
      status: [{ value: PreSalesInquiryConstant.New_Inquiry_Status, disabled: !this.isEdit }, [Validators.required, Validators.min(1)]],
      closedReason: [""],
      otherReason: [""],
      bde: [{ value: "", disabled: this.isEdit }, [Validators.required, Validators.min(1)]],
      projectName: ["", [Validators.required, Validators.maxLength(200)]],
      clientBudget: ["", [Validators.maxLength(40)]],
      rating: ["", [Validators.required]],
      source: ["", [Validators.required, Validators.min(1)]],
      updateSvn: [true],
      estimatedGivenDate: ["", [MinMaxDateValidator(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()), new Date(new Date().getFullYear() + 1, 11, 31))]],
      remarkBDE: ["", [Validators.maxLength(2000)]],
      ba: ["", [Validators.required]],
      projectTechnology: ["", [Validators.required]],
      otherMember: [""],
      hours: [""],
      inquiryType: [""],
      remarkBA: ["", [Validators.maxLength(2000)]]
    });

    this.f['estimatedGivenDate'].disable();
  }

  // disable all BDE fields
  private disableBdeFormField(): void {
    this.f['closedReason'].disable();
    this.f['otherReason'].disable();
    this.f['bde'].disable();
    this.f['projectName'].disable();
    this.f['clientBudget'].disable();
    this.f['rating'].disable();
    this.f['source'].disable();
    this.f['updateSvn'].disable();
    this.f['estimatedGivenDate'].disable();
    this.f['remarkBDE'].disable();
  }

  // disable all BA fields
  private disableBaFormField(): void {
    this.f['ba'].disable();
    this.f['projectTechnology'].disable();
    this.f['otherMember'].disable();
    this.f['hours'].disable();
    this.f['inquiryType'].disable();
    this.f['remarkBA'].disable();
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PRE_SALES.INQUIRY.INQUIRY_ABSOLUTE]); });
    this.historyButtonConfig = {
      id: 'view-history',
      buttonText: '',
      buttonVariant: ButtonVariant.iconOnly,
      buttonType: ButtonType.img,
      imgUrl: 'assets/images/history.svg',
      className: 'icon-btn icon-only',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.router.navigate([ROUTES.PRE_SALES.INQUIRY.HISTORY_ABSOLUTE, Number(this.inquiryId)]); },
    };
    this.refreshButtonConfig = {
      id: 'refresh',
      buttonText: '',
      buttonVariant: ButtonVariant.iconOnly,
      buttonType: ButtonType.img,
      imgUrl: 'assets/images/refresh-icon.svg',
      className: 'icon-btn icon-only',
      customWidthClass: 'customFullWidthClass',
      callback: () => { },
    };
  }

  private setTextBoxConfig = (): void => {
    this.date = {
      label: 'Date',
      formControlName: 'date',
      type: InputType.text,
      customClass: 'custom-form-control'
    };
    this.country = {
      data: {
        data: this.countryList
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: true,
      id: 'country',
      formControlName: 'country',
      label: 'Country',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.status = {
      data: {
        data: this.statusList?.map((x) => { return { id: x.id, text: x.name }; }) || []
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: true,
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: (event) => { this.toggleClosedReason(event.value); }
    };
    this.closedReason = {
      data: {
        data: this.closedReasonList
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      id: 'closedReason',
      formControlName: 'closedReason',
      label: 'closedReason',
      customFormFieldClass: 'custom-form-group sm-form-group',
      isRequired: true,
      selectionChange: (event) => { this.toggleOtherReason(event.value); }
    };
    this.otherReason = {
      label: "Other Reason",
      formControlName: 'otherReason',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true
    };
    this.bde = {
      data: {
        data: this.memberRoleBDEList
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: true,
      id: 'bde',
      formControlName: 'bde',
      label: 'BDE',
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: () => { this.setSvnPath(); }
    };
    this.projectName = {
      label: 'Project Name',
      formControlName: 'projectName',
      placeholder: 'as per SVN folder name.',
      type: InputType.text,
      customClass: 'custom-form-control',
      onBlur: () => { this.setSvnPath(); }
    };
    this.clientBudget = {
      label: "Client's Budget",
      formControlName: 'clientBudget',
      type: InputType.text,
      customClass: 'custom-form-control'
    };
    this.rating = {
      data: {
        data: RatingList
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      id: 'rating',
      formControlName: 'rating',
      label: 'Rating',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.source = {
      data: {
        data: this.sourceList
      },
      feature: {
        allowMultiple: false
      },
      id: 'source',
      formControlName: 'source',
      label: 'Source',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.updateSvn = {
      label: 'Update',
      formControlName: 'updateSvn',
      change: () => { this.setSvnPath(); }
    };
    this.estimatedGivenDate = {
      label: 'Estimation Given Date',
      formControlName: 'estimatedGivenDate',
      type: InputType.text,
    };
    this.remarkBDE = {
      label: 'Remark',
      formControlName: 'remarkBDE',
      rows: 10,
      placeholder: '',
      customClass: 'custom-form-control'
    };
    this.ba = {
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
    this.projectTechnology = {
      data: {
        data: this.projectTechnologyList
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
    this.otherMember = {
      label: 'Other Member',
      formControlName: 'otherMember',
      type: InputType.text,
      customClass: 'custom-form-control'
    };
    this.hours = {
      label: 'Hours',
      formControlName: 'hours',
      type: InputType.text,
      customClass: 'custom-form-control'
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
      label: 'Inquiry Type',
      customFormFieldClass: 'custom-form-group sm-form-group'
    };
    this.remarkBA = {
      label: 'Remark',
      formControlName: 'remarkBA',
      rows: 10,
      placeholder: '',
      customClass: 'custom-form-control'
    };
  };

  private getInquiryById(id: number) {
    this.isGridLoading = false;
    this.service.getInquiryById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IInquiryObject>) => {
          if (res.isSuccess && res.data) {
            this.preSalesData = res.data;
            this.addInquiryForm.patchValue({
              date: this.uiService.convertDateFormat(res.data.date.toString(), DateFormats.DD_MMM_YYYY_HH_MM) || '',
              country: res.data.countryId || '',
              status: res.data.statusId || '',
              closedReason: res.data.closedLostReasonId || '',
              otherReason: res.data.closedLostOtherReason || '',
              bde: res.data.bdeId || '',
              projectName: res.data.projectName || '',
              clientBudget: res.data.clientBudget || '',
              rating: res.data.rating || '',
              source: res.data.sourceId || '',
              updateSvn: false,
              expectedDateBde: res.data.expectedDateBde || '',
              estimatedGivenDate: this.uiService.convertDateFormat(res.data.estimatedGivenDate.toString(), DateFormats.DD_MMM_YYYY_HH_MM) || '',
              remarkBDE: '',
              ba: res.data.baIds ? this.uiService.convertStringToNumArray(res.data.baIds) : '',
              projectTechnology: res.data.projectTechnologyIds ? this.uiService.convertStringToNumArray(res.data.projectTechnologyIds) : '',
              otherMember: res.data.otherMember || '',
              hours: res.data.hours || '',
              inquiryType: res.data.typeId || '',
              remarkBA: ''
            });
            this.svnPath = res.data.onedrivePath || '';
            if (this.preSalesData.statusId) {
              this.toggleClosedReason(this.preSalesData.statusId);
            }
            if (this.preSalesData.closedLostReasonId) {
              this.toggleOtherReason(this.preSalesData.closedLostReasonId);
            }
            this.createRemarkList();
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

  private createRemarkList(): void {
    this.preSalesRemarks = [];
    this.preSalesData.preSalesHistories?.forEach((item) => {
      if (item.fieldName === 'Remark') {
        this.preSalesRemarks.push({ remark: item.newValue, memberName: item.modifiedByName, createdOn: item.modifiedOn });
      }
    });
  }

  private OnSave(): void {
    this.isSubmitted = true;

    if (this.addInquiryForm.valid) {
      const bdeRemark = this.f['remarkBDE'].value;
      const baRemark = this.f['remarkBA'].value;
      // eslint-disable-next-line prefer-template
      const remarks: string = (bdeRemark && baRemark) ? bdeRemark + "," + baRemark : (bdeRemark || baRemark || "");
      if (this.f['ba']?.value && this.f['status']?.value === PreSalesInquiryConstant.New_Inquiry_Status) {
        this.globalService.openSnackBar("If BA is entered, status should not be New Inquiry.", "error-message");
      }
      else {
        const data: IUpdateInquiry = {
          date: this.uiService.convertDateFormat(this.f['date'].value, DateFormats.YYYY_MM_DD_HH_MM_SS),
          countryId: this.f['country'].value,
          statusId: this.f['status'].value,
          bdeId: this.f['bde'].value,
          projectName: this.f['projectName'].value,
          clientBudget: this.f['clientBudget'].value,
          rating: this.f['rating'].value,
          sourceId: this.f['source'].value,
          expectedDateBde: null,
          estimatedGivenDate: this.f['estimatedGivenDate'].value ? this.uiService.convertDateFormat(this.f['estimatedGivenDate'].value, DateFormats.YYYY_MM_DD_HH_MM_SS) : null,
          baIds: this.f['ba'].value ? this.f['ba'].value.join(',') : '',
          otherMember: this.f['otherMember'].value,
          projectTechnologyIds: this.f['projectTechnology'].value ? this.f['projectTechnology']?.value.join(',') : '',
          hours: this.f['hours'].value,
          onedrivePath: this.svnPath,
          closedLostReasonId: this.showClosedReasonDropDown ? this.f['closedReason'].value : null,
          closedLostOtherReason: this.showOtherReasonField ? this.f['otherReason'].value : null,
          typeId: this.f['inquiryType'].value || null,
          remark: remarks
        };
        this.loading = true;

        const api = this.isEdit ? this.service.updateInquiry(Number(this.inquiryId), data) : this.service.addInquiry(data);
        api.pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res: BaseResponseModel<IInquiryObject>) => {
              if (res.isSuccess) {
                this.loading = false;
                this.globalService.openSnackBar(res.message);
                this.router.navigate([ROUTES.PRE_SALES.INQUIRY.INQUIRY_ABSOLUTE]);
              }
            },
            error: () => {
              this.loading = false;
            }
          });
      }
    }
  }

  private setSvnPath(): void {
    const memberId = this.f['bde'].value;
    if (memberId > 0) {
      this.service.getOneDrivePath(memberId).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess && res.data) {
            let date = new Date().toString();
            if (this.isEdit) {
              date = this.preSalesData.date.toString();
            }
            if (this.f['updateSvn'].value) {
              this.svnPath = `${res.data}\\${this.uiService.convertDateFormat(date, DateFormats.MM_MMM)}\\${this.f['projectName'].value}`;
            } else {
              this.svnPath = this.preSalesData.onedrivePath || '';
            }
          }
        }
      });
    }
  }

  // history table
  private setTableConfig(): void {
    this.historyGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IPreSalesHistory> => {
    const records = this.preSalesData?.preSalesHistories?.filter((item) => item.fieldName === "StatusName");
    const config: DataGrid<IPreSalesHistory> = {
      actionButtons: [],
      columns: [{
        field: "modifiedOn",
        title: "Last Modified DateTime",
        fieldDataType: DataGridFieldDataType.dateTime,
        fieldType: DataGridFieldType.data,
        isSortable: true
      },
      {
        field: "modifiedByName",
        title: "Last Modified By",
        fieldDataType: DataGridFieldDataType.string,
        fieldType: DataGridFieldType.data
      },
      {
        field: "newValue",
        title: "Status",
        fieldDataType: DataGridFieldDataType.string,
        fieldType: DataGridFieldType.data
      }],
      pageIndex: 0,
      totalDataLength: records?.length || 0,
      isNoRecordFound: !((records?.length ?? 0) > 0),
      gridData: {
        data: records,
        dataSource: undefined
      },
      id: 'HistoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      features: {
        hidePagination: true
      }
    };
    return config;
  };

  // when status is closed-lost
  private toggleClosedReason(value: number): void {
    const record = this.statusList?.find((x) => x.id === value);
    if (this.statusList) {
      if (record && record.isEstimationDateRequired) {
        this.f['estimatedGivenDate'].patchValue(this.uiService.convertDateFormat((new Date()).toString(), DateFormats.DD_MMM_YYYY_HH_MM) || '');
        this.f['hours'].setValidators(Validators.required);
      }
      else {
        this.f['estimatedGivenDate'].patchValue("");
        this.f['hours'].clearValidators();
      }
    }
    if (value === PreSalesInquiryConstant.Closed_Lost_Status) {
      this.showClosedReasonDropDown = true;
      this.f['closedReason'].setValidators(Validators.required);
    } else {
      this.showClosedReasonDropDown = false;
      this.f['closedReason'].clearValidators();
    }
    this.f['hours'].updateValueAndValidity();
    this.f['closedReason'].updateValueAndValidity();
  }

  // when closed reason is other
  private toggleOtherReason(value: number): void {
    if (value === PreSalesInquiryConstant.Closed_Reason_Other) {
      this.showOtherReasonField = true;
      this.f['otherReason'].setValidators(Validators.required);
    } else {
      this.showOtherReasonField = false;
      this.f['otherReason'].clearValidators();
    }
    this.f['otherReason'].updateValueAndValidity();
  }

  // get logged in member role
  private getCurrentMember() {
    this.service.getCurrentMemberRole()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IMemberRoleResponse>) => {
          if (res.isSuccess && res.data) {
            this.currentMember = res.data;
          }
          if (this.currentMember.isPreSalesAdmin || (this.currentMember.isBa && this.currentMember.isBde)) {
            // if member is PreSales admin or ba and bde both
            this.f['status'].enable();
            // eslint-disable-next-line no-useless-return
            return;
          } else if (this.currentMember.isBa && !this.currentMember.isBde) {
            // if member is only BA
            this.disableBdeFormField();
          } else if (this.currentMember.isBde && !this.currentMember.isBa) {
            // if member is only BDE
            this.disableBaFormField();
          } else {
            this.addInquiryForm.disable();
          }
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
      this.uiService.getDropdownOptions(this.service.getLookUpCategoryByID(LOOKUP_CATEGORY_ID.PRESALES_TYPE), true),
      this.uiService.getDropdownOptions(this.service.getLookUpCategoryByID(LOOKUP_CATEGORY_ID.PRESALES_CLOSED_REASON), true),
    ];
    return forkJoin(sources)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        const [country, status, memberBDE, source, memberBA, projectTechnology, inquiryTye, closedReason] = res;
        this.countryList = country as DropdownValue[];
        // this.statusList = status as IStatusModel[];
        this.memberRoleBDEList = memberBDE as DropdownValue[];
        this.sourceList = source as DropdownValue[];
        this.memberRoleBAList = memberBA as DropdownValue[];
        this.projectTechnologyList = projectTechnology as DropdownValue[];
        this.inquiryTypeList = inquiryTye as DropdownValue[];
        this.closedReasonList = closedReason as DropdownValue[];
        if (this.currentMember) {
          if (this.currentMember.isPreSalesAdmin || (this.currentMember.isBa && this.currentMember.isBde)) {
            this.statusList = status as IStatusModel[];
          }
          else if (this.currentMember.isBa && !this.currentMember.isBde && !this.currentMember.isPreSalesAdmin && !(this.f['ba'].value.includes(this.currentMember.memberId))) {
            this.f['country'].disable();
            this.f['status'].disable();
            this.disableBaFormField();
            this.statusList = status as IStatusModel[];
          }
          else if (this.currentMember.isBa && !this.currentMember.isBde) {
            // if member is only BA
            this.statusList = (status as IStatusModel[])?.filter((x) => x.isVisibleInBa);
          } else if (this.currentMember.isBde && !this.currentMember.isBa) {
            // if member is only BDE
            this.statusList = (status as IStatusModel[])?.filter((x) => x.isVisibleInBde);
          }
        }
        this.setTextBoxConfig();
      });
  }
  // #endregion
}
