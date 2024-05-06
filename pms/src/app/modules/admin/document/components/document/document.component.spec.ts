import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { optionData, responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { GLOBAL_CONSTANTS} from '../../../../../common/constants/constant';
import { DocumentComponent } from './document.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { PermissionService } from '../../../../../common/services/permission.service';
import { DocumentService } from '../../services/document.service';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let service: DocumentService;
  let fixture: ComponentFixture<DocumentComponent>;
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
      declarations: [DocumentComponent],
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
    fixture = TestBed.createComponent(DocumentComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(DocumentService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Document, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Document, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should set documentCategoryList when getDocumentCategories succeeds', () => {
    const mockDocumentData = {
      isSuccess: true,
      data: optionData
    };
    spyOn(service, 'getDocumentCategories').and.returnValue(of(mockDocumentData));
    component.ngOnInit();
    expect(service.getDocumentCategories).toHaveBeenCalled();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getDocumentList');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getDocumentList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getDocumentList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getDocumentList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.documentGridConfig.actionButtons
      && component.documentGridConfig.actionButtons[1].callback
    ) {
      component.documentGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit document page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.documentGridConfig.actionButtons
      && component.documentGridConfig.actionButtons[0].callback
    ) {
      component.documentGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/document/edit', 1]);
  });

  it('should navigate to add document page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addDocument();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/document/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getDocumentList');
    if (component.documentGridConfig.paginationCallBack) {
      component.documentGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getDocumentList');
    if (component.documentGridConfig.getSortOrderAndColumn) {
      component.documentGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set documentList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getDocuments').and.returnValue(of(mockResponse));
    component.getDocumentList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getDocuments').and.returnValue(throwError('Some error'));
    component.getDocumentList();
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
    spyOn(component, 'getDocumentList');
    if (
      component.documentGridConfig.actionButtons
      && component.documentGridConfig.actionButtons[1].callback
    ) {
      component.documentGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(1, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getDocumentList).toHaveBeenCalled();
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
    spyOn(component, 'getDocumentList');
    if (
      component.documentGridConfig.actionButtons
      && component.documentGridConfig.actionButtons[1].callback
    ) {
      component.documentGridConfig.actionButtons[1].callback(rowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(1, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getDocumentList).not.toHaveBeenCalled();
  });
});
