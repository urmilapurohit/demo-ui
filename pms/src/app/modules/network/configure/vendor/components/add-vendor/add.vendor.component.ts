import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DropDown, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { IVendorObject, IVendor } from '../../models/vendor';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-add.vendor',
  templateUrl: './add.vendor.component.html',
  styleUrl: './add.vendor.component.css'
})
export class AddVendorComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addVendorFormGroup!: FormGroup;
  name!: TextField;
  phoneNumber!: TextField;
  alternatePhoneNumber!: TextField;
  status!: DropDown;
  address!: TextArea;
  comments!: TextArea;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  vendorId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: VendorService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.vendorId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.vendorId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addVendorFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getVendorById(Number(this.vendorId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Vendor' : 'Add Vendor';
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Vendor', link: ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addVendorFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      phoneNumber: ["", [Validators.required, Validators.maxLength(50), Validators.pattern('^(?=.*\\S)[0-9,\\s]+$')]],
      alternatePhoneNumber: ["", [Validators.maxLength(50), Validators.pattern('^(?=.*\\S)[0-9,\\s]+$')]],
      address: ["", [Validators.required, Validators.maxLength(200)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      comments: ["", Validators.maxLength(500)]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.phoneNumber = {
      label: 'Phone Number',
      formControlName: 'phoneNumber',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.alternatePhoneNumber = {
      label: 'Alternate Phone Number',
      formControlName: 'alternatePhoneNumber',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: false
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);

    this.address = {
      label: 'Address',
      formControlName: 'address',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control',
      isRequired: true
    };

    this.comments = {
      label: 'Comments',
      formControlName: 'comments',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control'
    };
  };

  private getVendorById(id: number) {
    this.service.getVendorById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IVendorObject>) => {
        if (res.isSuccess && res.data) {
          this.addVendorFormGroup.setValue({
            name: res.data?.name || "",
            phoneNumber: res.data?.phoneNo || "",
            alternatePhoneNumber: res.data?.alternatePhoneNo || "",
            address: res.data?.address || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            comments: res.data?.comments || ""
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addVendorFormGroup.valid) {
      const data: IVendor = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        address: this.f?.['address']?.value,
        comments: this.f?.['comments']?.value,
        phoneNo: this.f?.['phoneNumber']?.value.trim(),
        alternatePhoneNo: this.f?.['alternatePhoneNumber']?.value.trim()
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateVendor(Number(this.vendorId), data) : this.service.addVendor(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IVendorObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE]);
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
