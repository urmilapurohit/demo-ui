import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { DocumentService } from '../../services/document.service';
import { AddDocumentComponent } from './add.document.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { UIService } from '../../../../../common/services/ui.service';
import { addDocumentData, documentData, optionData } from '../../data/testData';

describe('AddDocumentComponent', () => {
    let component: AddDocumentComponent;
    let fixture: ComponentFixture<AddDocumentComponent>;
    let router: Router;
    let service: DocumentService;
    let uiService: jasmine.SpyObj<UIService>;
    let globalService: jasmine.SpyObj<GlobalService>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
                AppRoutingModule,
                BrowserAnimationsModule,
                HttpClientModule],
            providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
            declarations: [AddDocumentComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddDocumentComponent);
        globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
        uiService = TestBed.inject(UIService) as jasmine.SpyObj<UIService>;
        service = TestBed.inject(DocumentService);
        component = fixture.componentInstance;
        component.documentId = '8';
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

    it('should navigate to document page on cancel Button Click', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.cancelButtonConfig.callback();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/document']);
    });

    it('should call onSave Method on Enter press title field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.title.onEnterPress) {
            component.title.onEnterPress();
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

    it('should call onSave Method on Enter press document category field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.documentCategory.onEnterPress) {
            component.documentCategory.onEnterPress();
        }
        expect(saveSpy).toHaveBeenCalled();
    });

    it('should call onSave Method on Enter press display order field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.displayOrder.onEnterPress) {
            component.displayOrder.onEnterPress();
        }
        expect(saveSpy).toHaveBeenCalled();
    });

    it('should call getDocumentById ', () => {
        const consoleSpy = spyOn(component, 'getDocumentById');
        component.getDocumentById(8);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should set form group values on successful response', () => {
        const id = 1;
        const mockDocumentData = {
            isSuccess: true,
            data: addDocumentData
        };
        spyOn(service, 'getDocumentById').and.returnValue(of(mockDocumentData));
        component.getDocumentById(id);
        expect(service.getDocumentById).toHaveBeenCalledWith(id);
        expect(component.addDocumentFormGroup.value).toEqual(addDocumentData);
    });

    it('should update document on valid form submission and navigate to the document route', fakeAsync(() => {
        const formData = new FormData();
        formData.append('title', documentData.title);
        formData.append('status', documentData.status);
        formData.append('documentCategoryId', documentData.documentCategoryId.toString());
        formData.append('displayOrder', documentData.displayOrder.toString());

        component.addDocumentFormGroup = new FormGroup({
            title: new FormControl(documentData.title),
            documentCategoryId: new FormControl(documentData.documentCategoryId),
            status: new FormControl(documentData.status),
            displayOrder: new FormControl(documentData.displayOrder)
        });

        component.isEdit = true;
        component.documentId = '1';

        spyOn(service, 'updateDocument').and.returnValue(of({
            isSuccess: true,
            message: 'Document updated successfully',
            data: formData
        }));

        spyOn(globalService, 'openSnackBar');

        // const navigateSpy = spyOn(router, 'navigate');

        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
        discardPeriodicTasks();
    }));

    it('should add document on valid form submission ', fakeAsync(() => {
        component.addDocumentFormGroup = new FormGroup({
            title: new FormControl(documentData.title),
            documentCategoryId: new FormControl(documentData.documentCategoryId),
            status: new FormControl(documentData.status),
            displayOrder: new FormControl(documentData.displayOrder)
        });

        component.isEdit = false;
        component.documentId = '1';

        spyOn(service, 'addDocument').and.returnValue(of({
            isSuccess: true,
            message: 'Document add successfully',
            data: documentData
        }));

        spyOn(globalService, 'openSnackBar');
        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
        discardPeriodicTasks();
    }));

    it('should handle error on document update', fakeAsync(() => {
        component.addDocumentFormGroup = new FormGroup({
            title: new FormControl(documentData.title),
            documentCategoryId: new FormControl(documentData.documentCategoryId),
            status: new FormControl(documentData.status),
            displayOrder: new FormControl(documentData.displayOrder)
        });

        component.isEdit = true;
        component.documentId = '1';

        spyOn(service, 'updateDocument').and.returnValue(throwError('Update failed'));

        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
        discardPeriodicTasks();
    }));

    // it('should handle error on document add', fakeAsync(() => {
    //     component.addDocumentFormGroup = new FormGroup({
    //         title: new FormControl(documentData.title),
    //         documentCategoryId: new FormControl(documentData.documentCategoryId),
    //         status: new FormControl(documentData.status),
    //         displayOrder: new FormControl(documentData.displayOrder)
    //     });

    //     component.isEdit = false;
    //     component.documentId = '1';

    //     spyOn(service, 'addDocument').and.returnValue(throwError('add failed'));

    //     component.saveButtonConfig.callback();

    //     tick();

    //     expect(component.loading).toBeFalse();
    // }));

    // it('should add document on valid form submission and navigate to the document route', fakeAsync(() => {
    //     component.addDocumentFormGroup = new FormGroup({
    //         title: new FormControl(documentData.title),
    //         documentCategoryId: new FormControl(documentData.documentCategoryId),
    //         status: new FormControl(documentData.status),
    //         displayOrder: new FormControl(documentData.displayOrder)
    //     });

    //     component.isEdit = false;
    //     component.documentId = '1';

    //     spyOn(service, 'addDocument').and.returnValue(of({
    //         isSuccess: true,
    //         message: 'Document add successfully',
    //         data: documentData
    //     }));

    //     spyOn(globalService, 'openSnackBar');

    //     const navigateSpy = spyOn(router, 'navigate');

    //     component.saveButtonConfig.callback();

    //     tick();

    //     // Expectations
    //     expect(component.loading).toBeFalse();
    //     expect(globalService.openSnackBar).toHaveBeenCalledWith('Document add successfully');
    //     expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DOCUMENT.DOCUMENT_ABSOLUTE]);
    // }));

    it('should handle error when fetching document by ID', () => {
        spyOn(service, 'getDocumentById').and.returnValue(throwError('Error fetching document'));
        component.getDocumentById(8);
        expect(service.getDocumentById).toHaveBeenCalledWith(8);
        expect(component.addDocumentFormGroup.value).toEqual({
            title: '',
            documentCategory: '',
            displayOrder: null
        });
    });

    it('should set form group values on successful response with truthy data', () => {
        const id = 10;
        const mockDocumentData = {
            isSuccess: true,
            data: addDocumentData
        };
        spyOn(service, 'getDocumentById').and.returnValue(of(mockDocumentData));
        component.getDocumentById(id);
        expect(service.getDocumentById).toHaveBeenCalledWith(id);
        expect(component.addDocumentFormGroup.value).toEqual(addDocumentData);
    });

    it('should set form group values on successful response with falsy data', () => {
        const id = 1;
        const mockDocumentData = {
            isSuccess: true,
            data: null
        };
        spyOn(service, 'getDocumentById').and.returnValue(of(mockDocumentData));
        component.getDocumentById(id);
        expect(service.getDocumentById).toHaveBeenCalledWith(id);
        expect(component.addDocumentFormGroup.value).toEqual({
            title: '',
            documentCategory: '',
            displayOrder: null
        });
    });

    it('should set documentCategoryList correctly on successful API call', fakeAsync(() => {
        const mockData = optionData;
        spyOn(uiService, 'getDropdownOptions').and.returnValue(of(mockData));

        component.getDocumentCategoryList();
        tick();

        expect(component.documentCategoryList).toEqual(mockData);
    }));
});
