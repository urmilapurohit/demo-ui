// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

// import { Router } from '@angular/router';
// import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
// import { of, throwError } from 'rxjs';
// import { FormControl, FormGroup } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ROUTES } from '../../../../../common/constants/routes';
// import { AddBookCategoryComponent } from './add.book.category.component';
// import { BookCategoryService } from '../../services/book.category.service';
// import { bookCategoryData } from '../../data/testData';
// import { AppRoutingModule } from '../../../../../app-routing.module';
// import { CoreModule } from '../../../../../common/common.module';

// describe('AddBookCategoryComponent', () => {
//   let component: AddBookCategoryComponent;
//   let fixture: ComponentFixture<AddBookCategoryComponent>;
//   let router: Router;
//   let service: BookCategoryService;
//   let globalService: jasmine.SpyObj<GlobalService>;
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
//         AppRoutingModule,
//         BrowserAnimationsModule,
//         HttpClientModule],
//         providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
//       declarations: [AddBookCategoryComponent],
//     })
//       .compileComponents();

//     fixture = TestBed.createComponent(AddBookCategoryComponent);
//     globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
//     service = TestBed.inject(BookCategoryService);
//     component = fixture.componentInstance;
//     component.bookCategoryId = '6';
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//     component.isEdit = true;
//     component.ngOnInit();
//   });

//   it('should call onSave Method on Save Button Click', () => {
//     const saveSpy = spyOn<any>(component, 'OnSave');
//     component.saveButtonConfig.callback();
//     expect(saveSpy).toHaveBeenCalled();
//   });

//   it('should navigate to book category page on cancel Button Click', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.cancelButtonConfig.callback();
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]);
//   });

//   it('should call onSave Method on Enter press name field', () => {
//     const saveSpy = spyOn<any>(component, 'OnSave');
//     if (component.name.onEnterPress) {
//       component.name.onEnterPress();
//     }
//     expect(saveSpy).toHaveBeenCalled();
//   });

//   it('should call getBookCategoryById ', () => {
//     const consoleSpy = spyOn(component, 'getBookCategoryById');
//       component.getBookCategoryById(6);
//       expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should set form group values on successful response', () => {
//       const id = 6;
//       const mockBookCategoryData = {
//         isSuccess: true,
//         data: bookCategoryData
//       };
//       spyOn(service, 'getBookCategoryById').and.returnValue(of(mockBookCategoryData));
//       component.getBookCategoryById(id);
//       expect(service.getBookCategoryById).toHaveBeenCalledWith(id);
//       expect(component.addBookCategoryFormGroup.value).toEqual({
//         name: 'book category'
//       });
//   });

//   it('should update book category on valid form submission and navigate to the book category route', fakeAsync(() => {
//     component.addBookCategoryFormGroup = new FormGroup({
//       name: new FormControl(bookCategoryData.name)
//     });

//     component.isEdit = true;
//     component.bookCategoryId = '6';

//     spyOn(service, 'updateBookCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Book Category Data updated successfully',
//       data: bookCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');

//     const navigateSpy = spyOn(router, 'navigate');

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Book Category Data updated successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]);
//   }));

//   it('should add book category on valid form submission ', fakeAsync(() => {
//     component.addBookCategoryFormGroup = new FormGroup({
//       name: new FormControl(bookCategoryData.name)
//     });

//     component.isEdit = false;
//     component.bookCategoryId = '6';

//     spyOn(service, 'addBookCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Book Category add successfully',
//       data: bookCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');
//     const navigateSpy = spyOn(router, 'navigate');
//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Book Category add successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]);
//   }));

//   it('should handle error on book category update', fakeAsync(() => {
//     component.addBookCategoryFormGroup = new FormGroup({
//       name: new FormControl(bookCategoryData.name)
//     });

//     component.isEdit = true;
//     component.bookCategoryId = '6';

//     spyOn(service, 'updateBookCategory').and.returnValue(throwError('Update failed'));

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//   }));

//   it('should handle error on book category add', fakeAsync(() => {
//     component.addBookCategoryFormGroup = new FormGroup({
//       name: new FormControl(bookCategoryData.name)
//     });

//     component.isEdit = false;
//     component.bookCategoryId = '6';

//     spyOn(service, 'addBookCategory').and.returnValue(throwError('add failed'));

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//   }));

//   it('should add book category on valid form submission and navigate to the book category route', fakeAsync(() => {
//     component.addBookCategoryFormGroup = new FormGroup({
//       name: new FormControl(bookCategoryData.name)
//     });

//     component.isEdit = false;
//     component.bookCategoryId = '6';

//     spyOn(service, 'addBookCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Book Category add successfully',
//       data: bookCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');

//     const navigateSpy = spyOn(router, 'navigate');

//     component.saveButtonConfig.callback();

//     tick();

//     // Expectations
//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Book Category add successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]);
//   }));

//   it('should handle error when fetching book category by ID', () => {
//     spyOn(service, 'getBookCategoryById').and.returnValue(throwError('Error fetching book category'));
//     component.getBookCategoryById(6);
//     expect(service.getBookCategoryById).toHaveBeenCalledWith(6);
//     expect(component.addBookCategoryFormGroup.value).toEqual({
//       name: ''
//     });
//   });

//   it('should set form group values on successful response with truthy data', () => {
//     const id = 6;
//     const mockBookCategoryData = {
//       isSuccess: true,
//       data: bookCategoryData
//     };
//     spyOn(service, 'getBookCategoryById').and.returnValue(of(mockBookCategoryData));
//     component.getBookCategoryById(id);
//     expect(service.getBookCategoryById).toHaveBeenCalledWith(id);
//     expect(component.addBookCategoryFormGroup.value).toEqual({
//       name: bookCategoryData.name
//     });
//   });

//   it('should set form group values on successful response with falsy data', () => {
//     const id = 6;
//     const mockBookCategoryData = {
//       isSuccess: true,
//       data: null
//     };
//     spyOn(service, 'getBookCategoryById').and.returnValue(of(mockBookCategoryData));
//     component.getBookCategoryById(id);
//     expect(service.getBookCategoryById).toHaveBeenCalledWith(id);
//     expect(component.addBookCategoryFormGroup.value).toEqual({
//       name: ''
//     });
//   });
// });
