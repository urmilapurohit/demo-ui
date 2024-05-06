import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookCategoryComponent } from './book.category.component';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { BookCategoryService } from '../../services/book.category.service';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { PermissionService } from '../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('BookCategoryComponent', () => {
  let component: BookCategoryComponent;
  let service: BookCategoryService;
  let fixture: ComponentFixture<BookCategoryComponent>;
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
      declarations: [BookCategoryComponent],
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
    fixture = TestBed.createComponent(BookCategoryComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(BookCategoryService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Book, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Book, PageAccessTypes.Edit);
    component.isDeletePermission = permissionService.checkAccessPermission(Pages.Book, PageAccessTypes.Delete);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getBookCategoryList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getBookCategoryList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getBookCategoryList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call deleteBookCategoryRequest on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'deleteBookCategoryRequest');
    if (
      component.bookCategoryGridConfig.actionButtons
      && component.bookCategoryGridConfig.actionButtons[1].callback
    ) {
      component.bookCategoryGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit book category page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.bookCategoryGridConfig.actionButtons
      && component.bookCategoryGridConfig.actionButtons[0].callback
    ) {
      component.bookCategoryGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/book-category/edit', 6]);
  });

  it('should navigate to add book category page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addBookCategory();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/book-category/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getBookCategoryList');
    if (component.bookCategoryGridConfig.paginationCallBack) {
      component.bookCategoryGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getBookCategoryList');
    if (component.bookCategoryGridConfig.getSortOrderAndColumn) {
      component.bookCategoryGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set bookCategoryList and call setTableConfig on successful API response', fakeAsync(() => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getBookCategory').and.returnValue(of(mockResponse));
    component.getBookCategoryList();
    tick();
    expect(component.isGridLoading).toBe(false);
    expect(component.bookCategoryList).toEqual(responseData);
  }));

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getBookCategory').and.returnValue(throwError('Some error'));
    component.getBookCategoryList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should delete book category when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);
    spyOn(service, 'deleteBookCategory').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getBookCategoryList');
    if (
      component.bookCategoryGridConfig.actionButtons
      && component.bookCategoryGridConfig.actionButtons[1].callback
    ) {
      component.bookCategoryGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteBookCategory).toHaveBeenCalledWith(6);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getBookCategoryList).toHaveBeenCalled();
  });
});
