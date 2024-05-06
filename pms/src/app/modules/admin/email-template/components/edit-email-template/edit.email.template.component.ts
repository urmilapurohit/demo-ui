import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, DropDown, FormField, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BaseResponseModel, BreadcrumbItem, CkEditor } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { IEmailTemplate, IEmailTemplateObject } from '../../models/email.template';
import { EmailTemplateService } from '../../services/email.template.service';

@Component({
    selector: 'app-edit-email-template',
    templateUrl: './edit.email.template.component.html',
    styleUrl: './edit.email.template.component.css'
})
export class EditEmailTemplateComponent implements OnInit, OnDestroy {
    // #region initialize variables
    editEmailTemplateFormGroup!: FormGroup;
    name!: TextField;
    subject!: TextField;
    header!: TextField;
    templateData!: FormField;
    token !: TextField;
    status!: DropDown;
    saveButtonConfig!: Button;
    cancelButtonConfig!: Button;
    ckEditorConfig!: CkEditor;
    submitted: boolean = false;
    loading: boolean = false;
    isEdit: boolean = false;
    emailTemplateId: string = '';
    breadcrumbItems: BreadcrumbItem[] = [];
    private ngUnsubscribe$ = new Subject<void>();
    // #endregion

    // #region constructor
    constructor(
        private fb: FormBuilder,
        private service: EmailTemplateService,
        private router: Router,
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private uiService: UIService
    ) {
        this.emailTemplateId = this.route.snapshot.paramMap.get('id') ?? '';
        if (Number(this.emailTemplateId) > 0) {
            this.isEdit = true;
        }
    }
    // #endregion

    get f() {
        return this.editEmailTemplateFormGroup.controls;
    }

    // #region ng methods
    ngOnInit(): void {
        this.initializeForm();
        if (this.isEdit) {
            this.getEmailTemplateById(Number(this.emailTemplateId));
        }
        this.setEditorConfig();
        this.setTextBoxConfig();
        this.setButtonConfig();
        this.setBreadcrumb();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
        this.ngUnsubscribe$.unsubscribe();
    }
    // #endregion

    // #region methods
    setBreadcrumb(): void {
        this.breadcrumbItems = [
            { label: 'Admin', link: '' },
            { label: 'Email Template', link: ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE },
            { label: 'Edit Email Template', link: '' },
        ];
    }

    private initializeForm(): void {
        this.editEmailTemplateFormGroup = this.fb?.group({
            name: ["", [Validators.required, Validators.maxLength(200)]],
            status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, [Validators.required]],
            subject: ["", [Validators.required, Validators.maxLength(200)]],
            header: ["", [Validators.required, Validators.maxLength(200)]],
            templateData: [""],
            token: [""]
        });
    }

    private setEditorConfig(): void {
        this.ckEditorConfig = {
            label: 'Name',
            formControlName: 'templateData',
            customClass: 'custom-form-control',
        };
    }

    private setButtonConfig(): void {
        this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
        this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE]); });
    }

    private setTextBoxConfig = (): void => {
        this.name = {
            label: 'Name',
            formControlName: 'name',
            type: InputType.text,
            customClass: 'custom-form-control',
            isRequired: true,
            onEnterPress: () => { this.OnSave(); }
        };

        this.subject = {
            label: 'Subject',
            formControlName: 'subject',
            type: InputType.text,
            customClass: 'custom-form-control',
            isRequired: true,
            onEnterPress: () => { this.OnSave(); }
        };

        this.header = {
            label: 'Header',
            formControlName: 'header',
            type: InputType.text,
            customClass: 'custom-form-control',
            isRequired: true,
            onEnterPress: () => { this.OnSave(); }
        };

        this.templateData = {
            label: 'Template Data',
            formControlName: 'templateData'
        };

        this.token = {
            label: 'Token',
            formControlName: 'token',
            type: InputType.text,
            customClass: 'custom-form-control',
            onEnterPress: () => { this.OnSave(); }
        };

        this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
    };

    private OnSave(): void {
        this.submitted = true;

        if (this.editEmailTemplateFormGroup.valid) {
            const data: IEmailTemplate = {
                isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
                subject: this.f['subject'].value,
                templateHeader: this.f['header'].value,
                templateData: this.f['templateData'].value,
                name: this.f['name'].value,
                token: this.f['token'].value
            };
            this.loading = true;
            this.service.updateEmailTemplate(Number(this.emailTemplateId), data)
                .pipe(takeUntil(this.ngUnsubscribe$))
                .subscribe({
                    next: (res: BaseResponseModel<IEmailTemplateObject>) => {
                        if (res.isSuccess) {
                            this.loading = false;
                            this.globalService.openSnackBar(res.message);
                            this.router.navigate([ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE]);
                        }
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
        }
    }

    private getEmailTemplateById(id: number): void {
        this.service.getEmailTemplateById(id)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (res: BaseResponseModel<IEmailTemplateObject>) => {
                    if (res.isSuccess && res.data) {
                        this.editEmailTemplateFormGroup.setValue({
                            name: res.data?.name || "",
                            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
                            subject: res.data?.subject || "",
                            header: res.data?.templateHeader || "",
                            templateData: res.data?.templateData || "",
                            token: res?.data?.token
                        });
                    }
                },
                error: () => {
                }
            });
    }
    // #endregion
}
