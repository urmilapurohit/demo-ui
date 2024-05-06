import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CoreModule } from '../../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { LookupCategoryDetailComponent } from './lookup.category.detail.component';
import { LookupCategoryDetailService } from '../../services/lookup.category.detail.service';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { GLOBAL_CONSTANTS } from '../../../../../../common/constants/constant';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../../common/constants/Enums';

describe('LookupCategoryDetailComponent', () => {
  let component: LookupCategoryDetailComponent;
  let service: LookupCategoryDetailService;
  let fixture: ComponentFixture<LookupCategoryDetailComponent>;
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
      declarations: [LookupCategoryDetailComponent],
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

    fixture = TestBed.createComponent(LookupCategoryDetailComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(LookupCategoryDetailService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Lookup, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Lookup, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryDetailList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in lookup category enter', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryDetailList');
    if (component.lookupCategory.onEnterPress) {
      component.lookupCategory.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryDetailList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryDetailList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click reset button', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryDetailList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.lookupCategoryDetailGridConfig.actionButtons
      && component.lookupCategoryDetailGridConfig.actionButtons[1].callback
    ) {
      component.lookupCategoryDetailGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit lookup category detail page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.lookupCategoryDetailGridConfig.actionButtons
      && component.lookupCategoryDetailGridConfig.actionButtons[0].callback
    ) {
      component.lookupCategoryDetailGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/lookup/category-detail/edit', 11]);
  });

  it('should navigate to add lookup category detail page on click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addLookupCategoryDetail();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/lookup/category-detail/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getLookupCategoryDetailList');
    if (component.lookupCategoryDetailGridConfig.paginationCallBack) {
      component.lookupCategoryDetailGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getLookupCategoryDetailList');
    if (component.lookupCategoryDetailGridConfig.getSortOrderAndColumn) {
      component.lookupCategoryDetailGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set lookupCategoryDetailList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getLookupCategoryDetails').and.returnValue(of(mockResponse));
    component.getLookupCategoryDetailList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
    expect(component.lookupCategoryDetailList).toEqual(responseData);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getLookupCategoryDetails').and.returnValue(throwError('Some error'));
    component.getLookupCategoryDetailList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
  });

  it('should update status when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getLookupCategoryDetailList');
    if (
      component.lookupCategoryDetailGridConfig.actionButtons
      && component.lookupCategoryDetailGridConfig.actionButtons[1].callback
    ) {
      component.lookupCategoryDetailGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(11, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getLookupCategoryDetailList).toHaveBeenCalled();
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

    spyOn(component, 'getLookupCategoryDetailList');

    if (
      component.lookupCategoryDetailGridConfig.actionButtons
      && component.lookupCategoryDetailGridConfig.actionButtons[1].callback
    ) {
      component.lookupCategoryDetailGridConfig.actionButtons[1].callback(rowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(11, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getLookupCategoryDetailList).not.toHaveBeenCalled();
  });
});
