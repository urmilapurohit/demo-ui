import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  Button,
  ButtonType,
  ButtonVariant,
  ContactValidator, DropDown, DropdownValue,
  GlobalService, InputType, TextArea, TextField
} from 'workspace-library';
import { COMMON_ROUTES } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { BaseResponseModel, IUserDetails } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { DateFormats } from '@constants/Enums';
import { UserService } from '../../services/user';
import { IProfileDetails, IUpdateMyProfile } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  // #region class Members
  contactNo!: TextField;
  emergencyContactNo!: TextField;
  email!: TextField;
  bloodGroup!: TextField;
  diseasesInfo!: TextArea;
  editProfileForm!: FormGroup;
  systemConfigButton!: Button;
  toggleEditButton!: Button;
  toggleSaveButton!: Button;
  emailSelect!: DropDown;
  emailOptions: DropdownValue[] = [];
  initializeProfileDetails = {
    id: 0,
    fullName: '',
    userName: '',
    birthDate: '',
    gender: 1,
    contactNo: '',
    empNo: '',
    cardNo: '',
    email: '',
    department: '',
    designation: '',
    reportingPerson: '',
    projectManagerName: '',
    experience: '',
    joinDate: '',
    office: '',
    bloodGroup: '',
    emergencyContactNo: '',
    diseasesInfo: '',
    emailDomainId: 0,
    profilePhoto: null
  };
  profileDetails: IProfileDetails = { ...this.initializeProfileDetails };
  submitted: boolean = false;
  editToggle: boolean = true;
  userData: IUserDetails | null = null;

  private userDataSubscription!: Subscription;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private router: Router,
    private uiService: UIService,
    private globalService: GlobalService
  ) {
  }
  // #endregion

  get f() {
    return this.editProfileForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.getProfileDetails();
    this.subscribeToUserData();
    this.setDropDownConfig();
    this.getEmailOptions();
  }

  ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  getProfileDetails() {
    this.service.getMyProfile().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IProfileDetails>) => {
        if (res.isSuccess && res.data) {
          this.profileDetails = res.data;
          this.editProfileForm.setValue({
            email: res.data?.email.split('@')[0],
            mailDomain: res.data?.emailDomainId,
            contactNo: res.data?.contactNo || "",
            diseasesInfo: res.data?.diseasesInfo || "",
            emergencyContactNo: res.data?.emergencyContactNo || "",
            bloodGroup: res.data?.bloodGroup || ""
          });
          this.profileDetails.joinDate = res.data.joinDate ? this.uiService.convertDateFormat(res.data.joinDate as string, DateFormats.DD_MMM_YYYY) : "";
          this.profileDetails.birthDate = res.data.birthDate ? this.uiService.convertDateFormat(res.data.birthDate as string, DateFormats.DD_MMM_YYYY) : "";
        }
      }
    });
  }

  editDetailsToggle(): void {
    this.editToggle = !this.editToggle;
  }

  systemConfiguration() {
    this.router.navigate([ROUTES.ACCOUNT.USER.SYSTEM_CONFIGURATION_ABSOLUTE, 1]);
  }

  handleBackBtn() {
    this.router.navigate([COMMON_ROUTES.REDIRECT_TO_DASHBOARD]);
  }

  onSave(): void {
    this.submitted = true;
    if (this.editProfileForm.valid) {
      const selectedMailDomain = this.emailOptions.find((id) => id.id === this.f['mailDomain'].value);
      const data: IUpdateMyProfile = {
        email: `${this.f['email'].value}${selectedMailDomain?.text}`,
        contactNo: this.f['contactNo'].value,
        emergencyContactNo: this.f['emergencyContactNo'].value,
        diseasesInfo: this.f['diseasesInfo'].value,
        bloodGroup: this.f['bloodGroup'].value,
      };
      this.service.updateMyProfile(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IProfileDetails>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.getProfileDetails();
            this.editDetailsToggle();
          }
        }
      });
    }
  }

  private setDropDownConfig(): void {
    this.systemConfigButton = {
      id: 'applyButton',
      buttonText: 'My System Configuration',
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.iconWithText,
      className: 'custom-border-btn',
      imgUrl: './assets/images/system-config-icon.svg',
      callback: () => { this.systemConfiguration(); }
    };
    this.toggleEditButton = {
      id: 'toggleButton',
      buttonText: 'Edit Details',
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.iconWithText,
      className: 'primary-btn',
      imgUrl: './assets/images/edit-pencil-white.svg',
      callback: () => { this.editDetailsToggle(); }
    };
    this.toggleSaveButton = {
      id: 'toggleButton',
      buttonText: 'Save Details',
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.iconWithText,
      className: 'primary-btn',
      imgUrl: './assets/images/save-icon-white.svg',
      callback: () => { this.onSave(); }
    };
    this.emailSelect = {
      data: {
        data: this.emailOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      isRequired: true,
      id: 'emailSelected',
      formControlName: 'mailDomain',
      label: '',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.onSave(); }
    };
    this.bloodGroup = {
      isRequired: false,
      formControlName: 'bloodGroup',
      label: '',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.onSave(); }
    };
  }

  private setTextBoxConfig(): void {
    this.email = {
      label: '',
      formControlName: 'email',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.onSave(); }
    };
    this.emergencyContactNo = {
      label: '',
      formControlName: 'emergencyContactNo',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.onSave(); }
    };
    this.contactNo = {
      label: '',
      formControlName: 'contactNo',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.onSave(); }
    };
    this.diseasesInfo = {
      label: '',
      formControlName: 'diseasesInfo',
      customClass: 'custom-form-control',
      isRequired: false,
    };
  }

  private subscribeToUserData(): void {
    this.userDataSubscription = this.uiService.getUserData().subscribe((data) => {
      this.userData = data;
    });
  }

  private initializeForm(): void {
    this.editProfileForm = this.fb?.group({
      email: ['', [Validators.required]],
      mailDomain: ['', [Validators.required]],
      contactNo: ['', [Validators.required, ContactValidator]],
      diseasesInfo: [''],
      emergencyContactNo: ['', [Validators.required, ContactValidator]],
      bloodGroup: [''],
    });
  }

  private getEmailOptions() {
    this.uiService.getDropdownOptions(this.service.getEmailDomain(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.emailOptions = data;
        this.setDropDownConfig();
      }
    });
  }
  // #endregion
}
