import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { ErrorLogService } from '../../services/error.log.service';
import { IErrorLogObject } from '../../models/error.log';

@Component({
  selector: 'app-error-log-details',
  templateUrl: './error.log.details.component.html',
  styleUrl: './error.log.details.component.css'
})

export class ErrorLogDetailsComponent implements OnInit, OnDestroy {
  // #region class members
  errorLogId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  errorLogDetails!: IErrorLogObject;
  backButtonLink = ROUTES.ADMIN.ERROR_LOG.ERROR_LOG_ABSOLUTE;

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ErrorLogService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.errorLogId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  // #endregion

  ngOnInit(): void {
    this.getErrorLogById(Number(this.errorLogId));
    this.setBreadcrumb();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  backToErrorLog(): void {
    this.router.navigate([ROUTES.ADMIN.ERROR_LOG.ERROR_LOG_ABSOLUTE]);
  }

  getErrorLogById(id: number) {
    this.service.getErrorLogById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IErrorLogObject>) => {
          if (res.isSuccess && res.data) {
            this.errorLogDetails = res.data;
            this.errorLogDetails.createdOn = moment(res.data.createdOn).format('DD-MMM-YYYY h:mm A');
          }
        },
        error: () => {
        }
      });
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Error Log', link: ROUTES.ADMIN.ERROR_LOG.ERROR_LOG_ABSOLUTE },
      { label: 'Error Log Trace', link: '' },
    ];
  }

  // #endregion
}
