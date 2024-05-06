import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, Checkbox, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { GeneralService } from '@services/general.service';
import { Subject, takeUntil } from 'rxjs';
import { MemberRoleService } from '../../services/member.role.service';
import { IMemberRole, IMemberRoleObject } from '../../models/member.role.model';

@Component({
  selector: 'app-add-member-role',
  templateUrl: './add.member.role.component.html',
  styleUrl: './add.member.role.component.css'
})
export class AddMemberRoleComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addMemberRoleFormGroup!: FormGroup;
  member!: DropDown;
  status!: DropDown;
  oneDrivePath !: TextField;
  memberOptions: DropdownValue[] = [];
  isBde!: Checkbox;
  isBa!: Checkbox;
  isPreSalesAdmin!: Checkbox;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  memberID: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: MemberRoleService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private generalService: GeneralService,
  ) {
    this.memberID = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.memberID) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addMemberRoleFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getMembers();
    this.setDropDownConfig();
    this.setTextBoxConfig();
    this.setCheckBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    if (this.isEdit) {
      this.getMemberRoleById(Number(this.memberID));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Member Role' : 'Add Member Role';
    this.breadcrumbItems = [
      { label: 'Pre-Sales', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Member Role', link: ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.MEMBER_ROLE_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addMemberRoleFormGroup = this.fb?.group({
      member: ["", [Validators.required]],
      isPreSalesAdmin: [false],
      isBa: [false],
      isBde: [false],
      oneDrivePath: ["", [Validators.maxLength(250)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.MEMBER_ROLE_ABSOLUTE]); });
  }

  private setDropDownConfig = (): void => {
    this.member = {
      data: {
        data: this.memberOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'member',
      isSearchable: true,
      formControlName: 'member',
      label: 'Member',
      isRequired: true,
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private setTextBoxConfig = (): void => {
    this.oneDrivePath = {
      label: 'One Drive Path',
      formControlName: 'oneDrivePath',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getMembers() {
    this.uiService.getDropdownOptions(this.generalService.getMembers(), true, { id: "", text: 'Select Member' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.memberOptions = data;
        this.setDropDownConfig();
      }
    });
  }

  private setCheckBoxConfig = (): void => {
    this.isBde = this.uiService.getCheckBoxConfig('Is BDE', 'isBde');
    this.isBa = this.uiService.getCheckBoxConfig('Is BA', 'isBa');
    this.isPreSalesAdmin = this.uiService.getCheckBoxConfig('Is Admin', 'isPreSalesAdmin');
  };

  private getMemberRoleById(id: number) {
    this.service.getMemberRoleById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IMemberRoleObject>) => {
        if (res.isSuccess && res.data) {
          this.addMemberRoleFormGroup.setValue({
            member: res.data.memberId,
            isPreSalesAdmin: res.data.isPreSalesAdmin,
            isBa: res.data.isBa,
            isBde: res.data.isBde,
            oneDrivePath: res.data.onedrivePath,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addMemberRoleFormGroup.valid) {
      const data: IMemberRole = {
        memberId: this.f?.['member']?.value,
        isPreSalesAdmin: this.f?.['isPreSalesAdmin']?.value,
        isBa: this.f?.['isBa']?.value,
        isBde: this.f?.['isBde']?.value,
        onedrivePath: this.f?.['oneDrivePath']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateMemberRole(Number(this.memberID), data) : this.service.addMemberRole(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IMemberRoleObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.MEMBER_ROLE_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
  // #endregion
}
