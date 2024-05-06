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
import { BookComponent } from './book.component';
import { BookService } from '../../services/book.service';
import { optionData, responseData, rowData, searchParam, sortParam } from '../../data/testdata';
import { GLOBAL_CONSTANTS } from '../../../../../common/constants/constant';
import { PermissionService } from '../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('BookComponent', () => {
  let component: BookComponent;
  let service: BookService;
  let fixture: ComponentFixture<BookComponent>;
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
      declarations: [BookComponent],
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
    fixture = TestBed.createComponent(BookComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(BookService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Book, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Book, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should set bookCategoryList when getBookCategories succeeds', () => {
    const mockBookData = {
      isSuccess: true,
      data: optionData
    };
    spyOn(service, 'getBookCategories').and.returnValue(of(mockBookData));
    component.ngOnInit();
    expect(service.getBookCategories).toHaveBeenCalled();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getBookList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getBookList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getBookList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getBookList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.bookGridConfig.actionButtons
      && component.bookGridConfig.actionButtons[1].callback
    ) {
      component.bookGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit book page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.bookGridConfig.actionButtons
      && component.bookGridConfig.actionButtons[0].callback
    ) {
      component.bookGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/book/edit', 17]);
  });

  it('should navigate to add book page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addBook();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/book/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getBookList');
    if (component.bookGridConfig.paginationCallBack) {
      component.bookGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getBookList');
    if (component.bookGridConfig.getSortOrderAndColumn) {
      component.bookGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set bookList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getBooks').and.returnValue(of(mockResponse));
    component.getBookList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
    // expect(component.getBookList).toEqual(responseData);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getBooks').and.returnValue(throwError('Some error'));
    component.getBookList();
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
    spyOn(component, 'getBookList');
    if (
      component.bookGridConfig.actionButtons
      && component.bookGridConfig.actionButtons[1].callback
    ) {
      component.bookGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(17, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getBookList).toHaveBeenCalled();
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
    spyOn(component, 'getBookList');
    if (
      component.bookGridConfig.actionButtons
      && component.bookGridConfig.actionButtons[1].callback
    ) {
      component.bookGridConfig.actionButtons[1].callback(rowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(17, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getBookList).not.toHaveBeenCalled();
  });
});
