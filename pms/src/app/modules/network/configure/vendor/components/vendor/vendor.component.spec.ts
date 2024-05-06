import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { GLOBAL_CONSTANTS } from '../../../../../../common/constants/constant';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { VendorComponent } from './vendor.component';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { VendorService } from '../../services/vendor.service';
import { PageAccessTypes, Pages } from '../../../../../../common/constants/Enums';

describe('VendorComponent', () => {
  let component: VendorComponent;
  let service: VendorService;
  let fixture: ComponentFixture<VendorComponent>;
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
      declarations: [VendorComponent],
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
    fixture = TestBed.createComponent(VendorComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(VendorService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Vendor, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Vendor, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getVendorList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call onEnterPress in search vendor enter', () => {
    const consoleSpy = spyOn(component, 'getVendorList');
    if (component.phoneNumber.onEnterPress) {
      component.phoneNumber.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getVendorList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getVendorList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getVendorList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.vendorGridConfig.actionButtons
      && component.vendorGridConfig.actionButtons[1].callback
    ) {
      component.vendorGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit vendor page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.vendorGridConfig.actionButtons
      && component.vendorGridConfig.actionButtons[0].callback
    ) {
      component.vendorGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/network/configure/vendor/edit', 1]);
  });

  it('should navigate to add vendor page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addVendor();
    expect(navigateSpy).toHaveBeenCalledWith(['/network/configure/vendor/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getVendorList');
    if (component.vendorGridConfig.paginationCallBack) {
      component.vendorGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getVendorList');
    if (component.vendorGridConfig.getSortOrderAndColumn) {
      component.vendorGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set vendorList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getVendors').and.returnValue(of(mockResponse));
    component.getVendorList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getVendors').and.returnValue(throwError('Some error'));
    component.getVendorList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);
    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getVendorList');
    if (
      component.vendorGridConfig.actionButtons
      && component.vendorGridConfig.actionButtons[1].callback
    ) {
      component.vendorGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(1, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getVendorList).toHaveBeenCalled();
  });

  it('should handle error during update', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);
    spyOn(service, 'updateStatus').and.returnValue(
      throwError('Some error occurred.')
    );
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getVendorList');
    if (
      component.vendorGridConfig.actionButtons
      && component.vendorGridConfig.actionButtons[1].callback
    ) {
      component.vendorGridConfig.actionButtons[1].callback(rowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(1, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getVendorList).not.toHaveBeenCalled();
  });
});
