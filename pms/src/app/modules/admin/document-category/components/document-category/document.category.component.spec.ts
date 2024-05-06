import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentCategoryService } from '../../services/document.category.service';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { DocumentCategoryComponent } from './document.category.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { PermissionService } from '../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('DocumentCategoryComponent', () => {
  let component: DocumentCategoryComponent;
  let service: DocumentCategoryService;
  let fixture: ComponentFixture<DocumentCategoryComponent>;
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
      declarations: [DocumentCategoryComponent],
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

    fixture = TestBed.createComponent(DocumentCategoryComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    service = TestBed.inject(DocumentCategoryService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.DocumentCategory, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.DocumentCategory, PageAccessTypes.Edit);
    component.isDeletePermission = permissionService.checkAccessPermission(Pages.DocumentCategory, PageAccessTypes.Delete);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getDocumentCategoryList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getDocumentCategoryList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getDocumentCategoryList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call deleteDocumentCategoryRequest on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'deleteDocumentCategoryRequest');
    if (
      component.documentCategoryGridConfig.actionButtons
      && component.documentCategoryGridConfig.actionButtons[1].callback
    ) {
      component.documentCategoryGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit document category page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.documentCategoryGridConfig.actionButtons
      && component.documentCategoryGridConfig.actionButtons[0].callback
    ) {
      component.documentCategoryGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/document-category/edit', 15]);
  });

  it('should navigate to add document category page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addDocumentCategory();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/document-category/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getDocumentCategoryList');
    if (component.documentCategoryGridConfig.paginationCallBack) {
      component.documentCategoryGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getDocumentCategoryList');
    if (component.documentCategoryGridConfig.getSortOrderAndColumn) {
      component.documentCategoryGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set documentCategoryList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getDocumentCategory').and.returnValue(of(mockResponse));
    component.getDocumentCategoryList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
    expect(component.documentCategoryList).toEqual(responseData);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getDocumentCategory').and.returnValue(throwError('Some error'));
    component.getDocumentCategoryList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should delete document category when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteDocumentCategory').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getDocumentCategoryList');
    if (
      component.documentCategoryGridConfig.actionButtons
      && component.documentCategoryGridConfig.actionButtons[1].callback
    ) {
      component.documentCategoryGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteDocumentCategory).toHaveBeenCalledWith(15);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getDocumentCategoryList).toHaveBeenCalled();
  });
});
