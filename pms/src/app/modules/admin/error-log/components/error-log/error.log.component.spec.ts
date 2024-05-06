import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormControl } from '@angular/forms';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { PermissionService } from '@services/permission.service';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { ErrorLogComponent } from './error.log.component';
import { ErrorLogService } from '../../services/error.log.service';
import { deleteErrorLog, testResponse, testRowData, testSearchParam, testSortParam } from '../../constant/testdata';

describe('ErrorLogList', () => {
  let component: ErrorLogComponent;
  let service: ErrorLogService;
  let fixture: ComponentFixture<ErrorLogComponent>;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
    permissionServiceSpy.checkAccessPermission.and.returnValue(true);
    formBuilder = new FormBuilder();
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
      declarations: [ErrorLogComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        },
        { provide: PermissionService, useValue: permissionServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorLogComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ErrorLogService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getErrorLogList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getErrorLogList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getErrorLogList');
    if (component.errorLogGridConfig.paginationCallBack) {
      component.errorLogGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getErrorLogList');
    if (component.errorLogGridConfig.getSortOrderAndColumn) {
      component.errorLogGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should call onSingleCheckBoxChange  method on single checkbox check', () => {
    const mockMatCheckboxChange: MatCheckboxChange = { checked: true } as MatCheckboxChange;
    const viewControlName = `selectErrorLog_1`;
    const formGroup = formBuilder.group({ [viewControlName]: true });
    component.gridForm = formGroup;
    component.errorLogList = testResponse;
    component.onSingleCheckBoxChange(mockMatCheckboxChange, viewControlName);
    const gridCheckBoxControl = component.gridForm.get(viewControlName) as FormControl;
    expect(gridCheckBoxControl.value).toBe(true);
  });
  it('should set all checkboxes in onSelectAllErrorLog', () => {
    component.gridForm = new FormBuilder().group({
      selectErrorLog: [false],
    });
    component.errorLogList = testResponse;
    component.errorLogList.records.forEach((record) => {
      component.gridForm.addControl(`selectErrorLog_${record.id}`, new FormControl(false));
    });
    const mockMatCheckboxChange: MatCheckboxChange = { checked: true } as MatCheckboxChange;
    if (component.selectErrorLog.change) {
      component.selectErrorLog.change(mockMatCheckboxChange, '');
    }
    component.errorLogList?.records?.forEach((record) => {
      const checkBoxControl = component.gridForm.get(`selectErrorLog_${record.id}`) as FormControl;
      expect(checkBoxControl.value).toBe(true);
    });
  });
  it('should set errorList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponse };
    spyOn(service, 'getErrorLogs').and.returnValue(of(mockResponse));
    component.getErrorLogList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(true);
    expect(component.errorLogList).toEqual(testResponse);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getErrorLogs').and.returnValue(throwError('Some error'));
    component.getErrorLogList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });
  it('should delete error logs when confirmation is "yes"', () => {
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteErrorLogs').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getErrorLogList');
    component.deleteErrorLog();
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteErrorLogs).toHaveBeenCalledWith(deleteErrorLog);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getErrorLogList).toHaveBeenCalled();
  });
  it('should handle error during delete', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteErrorLogs').and.returnValue(
      throwError('Some error occurred.')
    );

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getErrorLogList');
    component.deleteErrorLog();
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteErrorLogs).toHaveBeenCalledWith(deleteErrorLog);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
  });
  it('should navigate to error log trace page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.errorLogGridConfig.actionButtons
      && component.errorLogGridConfig.actionButtons[0].callback
    ) {
      component.errorLogGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/error-log/preview', 1]);
  });
});
