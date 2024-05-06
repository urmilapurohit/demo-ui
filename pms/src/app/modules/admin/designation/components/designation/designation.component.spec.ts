import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { DesignationComponent } from './designation.component';
import { DesignationService } from '../../services/designation.service';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../constant/testdata';
import { PermissionService } from '../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('DesignationComponent', () => {
  let component: DesignationComponent;
  let service: DesignationService;
  let fixture: ComponentFixture<DesignationComponent>;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;
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
      declarations: [DesignationComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        }, {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignationComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(DesignationService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component = fixture.componentInstance; permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;

    component.isAddPermission = permissionService.checkAccessPermission(Pages.ProjectGroup, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.ProjectGroup, PageAccessTypes.Edit);
    component.isDeletePermission = permissionService.checkAccessPermission(Pages.ProjectGroup, PageAccessTypes.Delete);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getDesignationList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getDesignationList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getDesignationList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call deleteDesignationConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'deleteDesignationConfirmation');
    if (
      component.designationGridConfig.actionButtons
      && component.designationGridConfig.actionButtons[1].callback
    ) {
      component.designationGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should navigate to edit designation page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.designationGridConfig.actionButtons
      && component.designationGridConfig.actionButtons[0].callback
    ) {
      component.designationGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/designation/edit', 14]);
  });
  it('should navigate to add designation page on click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addDesignation();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/designation/add']);
  });
  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getDesignationList');
    if (component.designationGridConfig.paginationCallBack) {
      component.designationGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getDesignationList');
    if (component.designationGridConfig.getSortOrderAndColumn) {
      component.designationGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should set designationList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponse };
    spyOn(service, 'getDesignation').and.returnValue(of(mockResponse));
    component.getDesignationList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.designationList).toEqual(testResponse);
  });
  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getDesignation').and.returnValue(throwError('Some error'));
    component.getDesignationList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });
  it('should delete designation when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteDesignation').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getDesignationList');
    if (
      component.designationGridConfig.actionButtons
      && component.designationGridConfig.actionButtons[1].callback
    ) {
      component.designationGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteDesignation).toHaveBeenCalledWith(14);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getDesignationList).toHaveBeenCalled();
  });
});
