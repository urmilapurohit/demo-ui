import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { PermissionService } from '../../../../../common/services/permission.service';
import { EmailTemplateService } from '../../services/email.template.service';
import { EmailTemplateComponent } from './email.template.component';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../data/testData';
import { ROUTES } from '../../../../../common/constants/routes';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('EmailTemplateComponent', () => {
  let component: EmailTemplateComponent;
  let fixture: ComponentFixture<EmailTemplateComponent>;
  let service: EmailTemplateService;
  let router: Router;
  let permissionService: jasmine.SpyObj<PermissionService>;

  beforeEach(async () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
    permissionServiceSpy.checkAccessPermission.and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        WorkspaceLibraryModule,
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [EmailTemplateComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        },
        { provide: PermissionService, useValue: permissionServiceSpy }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmailTemplateComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(EmailTemplateService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.EmailTemplate, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.EmailTemplate, PageAccessTypes.Edit);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getEmailTemplateList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getEmailTemplateList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getEmailTemplateList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit email template page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.emailTemplateGridConfig.actionButtons
      && component.emailTemplateGridConfig.actionButtons[0].callback
    ) {
      component.emailTemplateGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.EMAIL_TEMPLATE.EDIT_EMAIL_TEMPLATE_ABSOLUTE, 4]);
  });

  it('should navigate to preview email template page on click on preview button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.emailTemplateGridConfig.actionButtons
      && component.emailTemplateGridConfig.actionButtons[1].callback
    ) {
      component.emailTemplateGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.EMAIL_TEMPLATE.PREVIEW_EMAIL_TEMPLATE_ABSOLUTE, 4]);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getEmailTemplateList');
    if (component.emailTemplateGridConfig.paginationCallBack) {
      component.emailTemplateGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getEmailTemplateList');
    if (component.emailTemplateGridConfig.getSortOrderAndColumn) {
      component.emailTemplateGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set EmailTemplateList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponse };
    spyOn(service, 'getEmailTemplates').and.returnValue(of(mockResponse));
    component.getEmailTemplateList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(true);
    expect(component.emailTemplateList).toEqual(testResponse);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getEmailTemplates').and.returnValue(throwError('Some error'));
    component.getEmailTemplateList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });
});
