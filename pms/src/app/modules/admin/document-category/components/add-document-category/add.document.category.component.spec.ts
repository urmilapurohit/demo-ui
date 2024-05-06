// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { of, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { FormControl, FormGroup } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AppRoutingModule } from '../../../../../../../app-routing.module';
// import { CoreModule } from '../../../../../../../common/common.module';
// import { AddDocumentCategoryComponent } from './add.document.category.component';
// import { documentCategoryData } from '../../../../data/testData';
// import { ROUTES } from '../../../../../../../common/constants/routes';
// import { DocumentCategoryService } from '../../../../services/document.category.service';

// describe('AddDocumentCategoryComponent', () => {
//   let component: AddDocumentCategoryComponent;
//   let fixture: ComponentFixture<AddDocumentCategoryComponent>;
//   let router: Router;
//   let service: DocumentCategoryService;
//   let globalService: jasmine.SpyObj<GlobalService>;
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
//         AppRoutingModule,
//         BrowserAnimationsModule,
//         HttpClientModule],
//         providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
//       declarations: [AddDocumentCategoryComponent],
//     })
//       .compileComponents();

//     fixture = TestBed.createComponent(AddDocumentCategoryComponent);
//     globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
//     service = TestBed.inject(DocumentCategoryService);
//     component = fixture.componentInstance;
//     component.documentCategoryId = '15';
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

//   it('should navigate to document category page on cancel Button Click', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.cancelButtonConfig.callback();
//     expect(navigateSpy).toHaveBeenCalledWith(['/admin/document-category']);
//   });

//   it('should call onSave Method on Enter press name field', () => {
//     const saveSpy = spyOn<any>(component, 'OnSave');
//     if (component.name.onEnterPress) {
//       component.name.onEnterPress();
//     }
//     expect(saveSpy).toHaveBeenCalled();
//   });

//   it('should call getDocumentCategoryById ', () => {
//     const consoleSpy = spyOn(component, 'getDocumentCategoryById');
//       component.getDocumentCategoryById(15);
//       expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should set form group values on successful response', () => {
//       const id = 15;
//       const mockDocumentCategoryData = {
//         isSuccess: true,
//         data: documentCategoryData
//       };
//       spyOn(service, 'getDocumentCategoryById').and.returnValue(of(mockDocumentCategoryData));
//       component.getDocumentCategoryById(id);
//       expect(service.getDocumentCategoryById).toHaveBeenCalledWith(id);
//       expect(component.addDocumentCategoryFormGroup.value).toEqual({
//         name: 'Employee Newsletter'
//       });
//   });

//   it('should update document category on valid form submission and navigate to the document category route', fakeAsync(() => {
//     component.addDocumentCategoryFormGroup = new FormGroup({
//       name: new FormControl(documentCategoryData.name)
//     });

//     component.isEdit = true;
//     component.documentCategoryId = '15';

//     spyOn(service, 'updateDocumentCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Document Category updated successfully',
//       data: documentCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');

//     const navigateSpy = spyOn(router, 'navigate');

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Document Category updated successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY_ABSOLUTE]);
//   }));

//   it('should add document category on valid form submission ', fakeAsync(() => {
//     component.addDocumentCategoryFormGroup = new FormGroup({
//       name: new FormControl(documentCategoryData.name)
//     });

//     component.isEdit = false;
//     component.documentCategoryId = '15';

//     spyOn(service, 'addDocumentCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Document Category add successfully',
//       data: documentCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');
//     const navigateSpy = spyOn(router, 'navigate');
//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Document Category add successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY_ABSOLUTE]);
//   }));

//   it('should handle error on document category update', fakeAsync(() => {
//     component.addDocumentCategoryFormGroup = new FormGroup({
//       name: new FormControl(documentCategoryData.name)
//     });

//     component.isEdit = true;
//     component.documentCategoryId = '15';

//     spyOn(service, 'updateDocumentCategory').and.returnValue(throwError('Update failed'));

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//   }));

//   it('should handle error on document category add', fakeAsync(() => {
//     component.addDocumentCategoryFormGroup = new FormGroup({
//       name: new FormControl(documentCategoryData.name)
//     });

//     component.isEdit = false;
//     component.documentCategoryId = '15';

//     spyOn(service, 'addDocumentCategory').and.returnValue(throwError('add failed'));

//     component.saveButtonConfig.callback();

//     tick();

//     expect(component.loading).toBeFalse();
//   }));

//   it('should add document category on valid form submission and navigate to the document category route', fakeAsync(() => {
//     component.addDocumentCategoryFormGroup = new FormGroup({
//       name: new FormControl(documentCategoryData.name)
//     });

//     component.isEdit = false;
//     component.documentCategoryId = '15';

//     spyOn(service, 'addDocumentCategory').and.returnValue(of({
//       isSuccess: true,
//       message: 'Document Category add successfully',
//       data: documentCategoryData
//     }));

//     spyOn(globalService, 'openSnackBar');

//     const navigateSpy = spyOn(router, 'navigate');

//     component.saveButtonConfig.callback();

//     tick();

//     // Expectations
//     expect(component.loading).toBeFalse();
//     expect(globalService.openSnackBar).toHaveBeenCalledWith('Document Category add successfully');
//     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY_ABSOLUTE]);
//   }));

//   it('should handle error when fetching document category by ID', () => {
//     spyOn(service, 'getDocumentCategoryById').and.returnValue(throwError('Error fetching document category'));
//     component.getDocumentCategoryById(15);
//     expect(service.getDocumentCategoryById).toHaveBeenCalledWith(15);
//     expect(component.addDocumentCategoryFormGroup.value).toEqual({
//       name: ''
//     });
//   });

//   it('should set form group values on successful response with truthy data', () => {
//     const id = 1;
//     const mockDocumentCategoryData = {
//       isSuccess: true,
//       data: documentCategoryData
//     };
//     spyOn(service, 'getDocumentCategoryById').and.returnValue(of(mockDocumentCategoryData));
//     component.getDocumentCategoryById(id);
//     expect(service.getDocumentCategoryById).toHaveBeenCalledWith(id);
//     expect(component.addDocumentCategoryFormGroup.value).toEqual({
//       name: documentCategoryData.name
//     });
//   });

//   it('should set form group values on successful response with falsy data', () => {
//     const id = 1;
//     const mockDocumentCategoryData = {
//       isSuccess: true,
//       data: null
//     };
//     spyOn(service, 'getDocumentCategoryById').and.returnValue(of(mockDocumentCategoryData));
//     component.getDocumentCategoryById(id);
//     expect(service.getDocumentCategoryById).toHaveBeenCalledWith(id);
//     expect(component.addDocumentCategoryFormGroup.value).toEqual({
//       name: ''
//     });
//   });
// });
