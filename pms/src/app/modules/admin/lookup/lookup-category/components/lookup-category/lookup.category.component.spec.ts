import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LookupCategoryComponent } from './lookup.category.component';
import { LookupCategoryService } from '../../services/lookup.category.service';
import { CoreModule } from '../../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { testResponce, testRowData, testSearchParam, testSortParam } from '../../data/testData';
import { GLOBAL_CONSTANTS } from '../../../../../../common/constants/constant';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../../common/constants/Enums';

describe('LookupCategoryComponent', () => {
  let component: LookupCategoryComponent;
  let service: LookupCategoryService;
  let fixture: ComponentFixture<LookupCategoryComponent>;
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
      declarations: [LookupCategoryComponent],
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

    fixture = TestBed.createComponent(LookupCategoryComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(LookupCategoryService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    component = fixture.componentInstance;
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Lookup, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryList');
    if (component.editable.onEnterPress) {
      component.editable.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click reset button', () => {
    const consoleSpy = spyOn(component, 'getLookupCategoryList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateEditConfiguration on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateEditConfiguration');
    if (
      component.lookupCategoryGridConfig.actionButtons
      && component.lookupCategoryGridConfig.actionButtons[0].callback
    ) {
      component.lookupCategoryGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getLookupCategoryList');
    if (component.lookupCategoryGridConfig.paginationCallBack) {
      component.lookupCategoryGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getLookupCategoryList');
    if (component.lookupCategoryGridConfig.getSortOrderAndColumn) {
      component.lookupCategoryGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set lookupCategoryList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponce };
    spyOn(service, 'getLookupCategory').and.returnValue(of(mockResponse));
    component.getLookupCategoryList();
    fixture.detectChanges();
    expect(component.lookupCategoryList).toEqual(testResponce);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getLookupCategory').and.returnValue(throwError('Some error'));
    component.getLookupCategoryList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateEditableStatus').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getLookupCategoryList');
    if (
      component.lookupCategoryGridConfig.actionButtons
      && component.lookupCategoryGridConfig.actionButtons[0].callback
    ) {
      component.lookupCategoryGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateEditableStatus).toHaveBeenCalledWith(4, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getLookupCategoryList).toHaveBeenCalled();
  });

  it('should handle error during update', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateEditableStatus').and.returnValue(
      throwError('Some error occurred.')
    );

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getLookupCategoryList');

    if (
      component.lookupCategoryGridConfig.actionButtons
      && component.lookupCategoryGridConfig.actionButtons[0].callback
    ) {
      component.lookupCategoryGridConfig.actionButtons[0].callback(testRowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateEditableStatus).toHaveBeenCalledWith(4, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getLookupCategoryList).not.toHaveBeenCalled();
  });
});
