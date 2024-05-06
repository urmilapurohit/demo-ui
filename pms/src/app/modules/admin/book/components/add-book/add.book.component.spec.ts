import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { ROUTES } from '../../../../../common/constants/routes';
import { addBookData, bookData, optionData } from '../../data/testdata';
import { AddBookComponent } from './add.book.component';
import { BookService } from '../../services/book.service';
import { UIService } from '../../../../../common/services/ui.service';

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;
  let router: Router;
  let service: BookService;
  let uiService: jasmine.SpyObj<UIService>;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddBookComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddBookComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    uiService = TestBed.inject(UIService) as jasmine.SpyObj<UIService>;
    service = TestBed.inject(BookService);
    component = fixture.componentInstance;
    component.bookId = '14';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.isEdit = true;
    component.ngOnInit();
  });

  it('should call onSave Method on Save Button Click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate to book page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/book']);
  });

  it('should call onSave Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press status field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press author field', () => {
    component.ngOnInit();
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.author.onEnterPress) {
      component.author.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press book category field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.bookCategory.onEnterPress) {
      component.bookCategory.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call getBookById ', () => {
    const consoleSpy = spyOn(component, 'getBookById');
    component.getBookById(14);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 1;
    const mockBookData = {
      isSuccess: true,
      data: addBookData
    };
    spyOn(service, 'getBookById').and.returnValue(of(mockBookData));
    component.getBookById(id);
    expect(service.getBookById).toHaveBeenCalledWith(id);
    expect(component.addBookFormGroup.value).toEqual(addBookData);
  });

  it('should update book on valid form submission and navigate to the book route', fakeAsync(() => {
    component.addBookFormGroup = new FormGroup({
      name: new FormControl(bookData.name),
      bookCategoryId: new FormControl(bookData.bookCategoryId),
      author: new FormControl(bookData.author),
      description: new FormControl(bookData.description),
      status: new FormControl(bookData.status),
    });

    component.isEdit = true;
    component.bookId = '1';

    spyOn(service, 'updateBook').and.returnValue(of({
      isSuccess: true,
      message: 'Book updated successfully',
      data: bookData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Book updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE]);
  }));

  it('should add book on valid form submission ', fakeAsync(() => {
    component.addBookFormGroup = new FormGroup({
      name: new FormControl(bookData.name),
      bookCategoryId: new FormControl(bookData.bookCategoryId),
      author: new FormControl(bookData.author),
      description: new FormControl(bookData.description),
      status: new FormControl(bookData.status),
    });

    component.isEdit = false;
    component.bookId = '1';

    spyOn(service, 'addBook').and.returnValue(of({
      isSuccess: true,
      message: 'Book add successfully',
      data: bookData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Book add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE]);
  }));

  it('should handle error on book update', fakeAsync(() => {
    component.addBookFormGroup = new FormGroup({
      name: new FormControl(bookData.name),
      bookCategoryId: new FormControl(bookData.bookCategoryId),
      author: new FormControl(bookData.author),
      description: new FormControl(bookData.description),
      status: new FormControl(bookData.status),
    });

    component.isEdit = true;
    component.bookId = '14';

    spyOn(service, 'updateBook').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on book add', fakeAsync(() => {
    component.addBookFormGroup = new FormGroup({
      name: new FormControl(bookData.name),
      bookCategoryId: new FormControl(bookData.bookCategoryId),
      author: new FormControl(bookData.author),
      description: new FormControl(bookData.description),
      status: new FormControl(bookData.status),
    });

    component.isEdit = false;
    component.bookId = '14';

    spyOn(service, 'addBook').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add book on valid form submission and navigate to the book route', fakeAsync(() => {
    component.addBookFormGroup = new FormGroup({
      name: new FormControl(bookData.name),
      bookCategoryId: new FormControl(bookData.bookCategoryId),
      author: new FormControl(bookData.author),
      description: new FormControl(bookData.description),
      status: new FormControl(bookData.status),
    });

    component.isEdit = false;
    component.bookId = '1';

    spyOn(service, 'addBook').and.returnValue(of({
      isSuccess: true,
      message: 'Book add successfully',
      data: bookData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Book add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE]);
  }));

  it('should handle error when fetching book by ID', () => {
    spyOn(service, 'getBookById').and.returnValue(throwError('Error fetching book'));
    component.getBookById(14);
    expect(service.getBookById).toHaveBeenCalledWith(14);
    expect(component.addBookFormGroup.value).toEqual({
      name: '',
      bookCategory: '',
      author: '',
      description: ''
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 10;
    const mockBookData = {
      isSuccess: true,
      data: addBookData
    };
    spyOn(service, 'getBookById').and.returnValue(of(mockBookData));
    component.getBookById(id);
    expect(service.getBookById).toHaveBeenCalledWith(id);
    expect(component.addBookFormGroup.value).toEqual(addBookData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockBookData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getBookById').and.returnValue(of(mockBookData));
    component.getBookById(id);
    expect(service.getBookById).toHaveBeenCalledWith(id);
    expect(component.addBookFormGroup.value).toEqual({
      name: '',
      bookCategory: '',
      author: '',
      description: ''
    });
  });

  it('should set bookCategoryList correctly on successful API call', fakeAsync(() => {
    const mockData = optionData;
    spyOn(uiService, 'getDropdownOptions').and.returnValue(of(mockData));

    component.getBookCategoryList();
    tick();

    expect(component.bookCategoryList).toEqual(mockData);
  }));
});
