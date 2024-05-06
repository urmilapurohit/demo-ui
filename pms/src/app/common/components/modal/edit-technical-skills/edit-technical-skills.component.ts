import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponseModel, Button, ButtonType, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { GeneralService } from '@services/general.service';
import { UIService } from '@services/ui.service';
import { TechnicalSkillModalData } from '@models/modal.model';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-technical-skills',
  templateUrl: './edit-technical-skills.component.html',
  styleUrl: './edit-technical-skills.component.css',
})
export class EditTechnicalSkillsComponent implements OnInit, OnDestroy {
  // #region class members
  technicalSkillDropdownConfig!: DropDown;
  technicalSkillDropdownOptions: DropdownValue[] = [];
  technicalSkillFormGroup!: FormGroup;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  isLoading: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region class members
  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private service: GeneralService,
    private globalService: GlobalService,
    public dialogRef: MatDialogRef<EditTechnicalSkillsComponent>,
    @Inject(MAT_DIALOG_DATA) public manageTeamData: TechnicalSkillModalData
  ) { }
  // #endregion

  get f() {
    return this.technicalSkillFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getTechnicalSkills();
    this.setTextBoxConfig();
    this.setButtonConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class members
  private initializeForm(): void {
    this.technicalSkillFormGroup = this.fb?.group(
      {
        technicalSkill: new FormControl(this.manageTeamData && this.manageTeamData.technicalSkillIds ? this.manageTeamData.technicalSkillIds : [])
      },
    );
  }

  private setTextBoxConfig = (): void => {
    this.technicalSkillDropdownConfig = {
      data: {
        data: this.technicalSkillDropdownOptions,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'editTechnicalSkill',
      formControlName: 'technicalSkill',
      label: `Technical skills of ${this.manageTeamData.fullName}`,
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.onSubmit(); }
    };
  };

  private setButtonConfig(): void {
    this.saveButtonConfig = {
      id: 'applyButton',
      buttonText: GLOBAL_CONSTANTS.SAVE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.onSubmit(); },
      disableCallBack: () => this.isLoading,
    };

    this.cancelButtonConfig = {
      id: 'cancelButton',
      buttonText: GLOBAL_CONSTANTS.CANCEL,
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.dialogRef.close(); },
      disableCallBack: () => this.isLoading,
    };
  }

  private getTechnicalSkills() {
    this.uiService.getDropdownOptions(this.service.getTechnicalSkills(), true)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (data: DropdownValue[]) => {
          this.technicalSkillDropdownOptions = data;
          this.setTextBoxConfig();
        },
      });
  }

  private onSubmit(): void {
    this.isLoading = true;
    if (this.technicalSkillFormGroup.valid) {
      const technicalSkillIds = this.f?.['technicalSkill']?.value;
      this.service.updateMemberTechnicalSkills(this.manageTeamData.id.toString(), technicalSkillIds)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<any>) => {
            if (res.isSuccess) {
              this.globalService.openSnackBar(res.message);
              this.isLoading = false;
              this.dialogRef.close(true);
            }
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
    else {
      this.isLoading = false;
    }
  }
  // #endregion
}
