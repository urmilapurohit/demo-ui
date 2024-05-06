import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel } from 'workspace-library';
import { BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { EmailTemplateService } from '../../services/email.template.service';
import { IEmailTemplateObject } from '../../models/email.template';

@Component({
  selector: 'app-preview-email-template',
  templateUrl: './preview.email.template.component.html',
  styleUrl: './preview.email.template.component.css'
})
export class PreviewEmailTemplateComponent implements OnInit, OnDestroy {
  // #region initialize variables
  emailTemplateId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  subject: string = '';
  templateData: string = '';
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: EmailTemplateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.emailTemplateId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  // #endregion

  ngOnInit(): void {
    this.getEmailTemplateById(Number(this.emailTemplateId));
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Email Template', link: ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE },
      { label: 'Template Preview', link: '' },
    ];
  }

  backToEmailTemplate(): void {
    this.router.navigate([ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE]);
  }

  private getEmailTemplateById(id: number) {
    this.service.getEmailTemplateById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IEmailTemplateObject>) => {
        if (res.isSuccess && res.data) {
          this.subject = res.data.subject;
          this.templateData = res.data.templateData;
        }
      }
    });
  }
  // #endregion
}
