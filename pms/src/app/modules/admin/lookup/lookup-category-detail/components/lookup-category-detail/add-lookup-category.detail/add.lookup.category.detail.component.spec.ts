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
import { AppRoutingModule } from '../../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../../common/common.module';
import { ROUTES } from '../../../../../../../common/constants/routes';
import { AddLookupCategoryDetailComponent } from './add.lookup.category.detail.component';
import { LookupCategoryDetailService } from '../../../services/lookup.category.detail.service';
import { lookupCategoryData, lookupCategoryDetailData } from '../../../data/testData';
import { UIService } from '../../../../../../../common/services/ui.service';

describe('AddLookupCategoryDetailComponent', () => {
    let component: AddLookupCategoryDetailComponent;
    let fixture: ComponentFixture<AddLookupCategoryDetailComponent>;
    let router: Router;
    let service: LookupCategoryDetailService;
    let uiService: jasmine.SpyObj<UIService>;
    let globalService: jasmine.SpyObj<GlobalService>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
                AppRoutingModule,
                BrowserAnimationsModule,
                HttpClientModule],
            providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
            declarations: [AddLookupCategoryDetailComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddLookupCategoryDetailComponent);
        globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
        uiService = TestBed.inject(UIService) as jasmine.SpyObj<UIService>;
        service = TestBed.inject(LookupCategoryDetailService);
        component = fixture.componentInstance;
        component.lookupCategoryDetailId = '19';
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

    it('should navigate to lookup category detail page on cancel button click', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.cancelButtonConfig.callback();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/lookup/category-detail']);
    });

    it('should call onSave method on enter press name field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.name.onEnterPress) {
            component.name.onEnterPress();
        }
        expect(saveSpy).toHaveBeenCalled();
    });

    it('should call onSave method on enter press lookup category field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.lookupCategory.onEnterPress) {
            component.lookupCategory.onEnterPress();
        }
        expect(saveSpy).toHaveBeenCalled();
    });

    it('should call onSave method on enter press display order field', () => {
        const saveSpy = spyOn<any>(component, 'OnSave');
        if (component.displayOrder.onEnterPress) {
            component.displayOrder.onEnterPress();
            expect(saveSpy).toHaveBeenCalled();
        }
    });

    it('should call getLookupCategoryDetailById ', () => {
        const consoleSpy = spyOn(component, 'getLookupCategoryDetailById');
        component.getLookupCategoryDetailById(19);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should set form group values on successful response', () => {
        const id = 19;
        const mockLookupCategoryDetailData = {
            isSuccess: true,
            data: lookupCategoryDetailData
        };
        spyOn(service, 'getLookupCategoryDetailById').and.returnValue(of(mockLookupCategoryDetailData));
        component.getLookupCategoryDetailById(id);
        expect(service.getLookupCategoryDetailById).toHaveBeenCalledWith(id);
        expect(component.addLookupCategoryDetailFormGroup.value).toEqual({
            name: 'Test Category',
            lookupCategory: 14,
            displayOrder: 1,
            description: 'test des'
        });
    });

    it('should update lookup category detail on valid form submission and navigate to the lookup category detail route', fakeAsync(() => {
        component.addLookupCategoryDetailFormGroup = new FormGroup({
            name: new FormControl(lookupCategoryDetailData.name),
            lookupCategory: new FormControl(lookupCategoryDetailData.lookupCategoryId),
            displayOrder: new FormControl(lookupCategoryDetailData.displayOrder),
            description: new FormControl(lookupCategoryDetailData.description),
        });

        component.isEdit = true;
        component.lookupCategoryDetailId = '19';

        spyOn(service, 'updateLookupCategoryDetail').and.returnValue(of({
            isSuccess: true,
            message: 'Lookup Category Detail updated successfully',
            data: lookupCategoryDetailData
        }));

        spyOn(globalService, 'openSnackBar');

        const navigateSpy = spyOn(router, 'navigate');

        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
        expect(globalService.openSnackBar).toHaveBeenCalledWith('Lookup Category Detail updated successfully');
        expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE]);
    }));

    it('should add lookup category detail on valid form submission ', fakeAsync(() => {
        component.addLookupCategoryDetailFormGroup = new FormGroup({
            name: new FormControl(lookupCategoryDetailData.name),
            lookupCategory: new FormControl(lookupCategoryDetailData.lookupCategoryId),
            displayOrder: new FormControl(lookupCategoryDetailData.displayOrder),
            description: new FormControl(lookupCategoryDetailData.description),
        });

        component.isEdit = false;
        component.lookupCategoryDetailId = '19';

        spyOn(service, 'addLookupCategoryDetail').and.returnValue(of({
            isSuccess: true,
            message: 'Lookup Category Detail add successfully',
            data: lookupCategoryDetailData
        }));

        spyOn(globalService, 'openSnackBar');
        const navigateSpy = spyOn(router, 'navigate');
        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
        expect(globalService.openSnackBar).toHaveBeenCalledWith('Lookup Category Detail add successfully');
        expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE]);
    }));

    it('should handle error on lookup category detail update', fakeAsync(() => {
        component.addLookupCategoryDetailFormGroup = new FormGroup({
            name: new FormControl(lookupCategoryDetailData.name),
            lookupCategory: new FormControl(lookupCategoryDetailData.lookupCategoryId),
            displayOrder: new FormControl(lookupCategoryDetailData.displayOrder),
            description: new FormControl(lookupCategoryDetailData.description),
        });

        component.isEdit = true;
        component.lookupCategoryDetailId = '19';

        spyOn(service, 'updateLookupCategoryDetail').and.returnValue(throwError('Update failed'));

        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
    }));

    it('should handle error on lookup category detail add', fakeAsync(() => {
        component.addLookupCategoryDetailFormGroup = new FormGroup({
            name: new FormControl(lookupCategoryDetailData.name),
            lookupCategory: new FormControl(lookupCategoryDetailData.lookupCategoryId),
            displayOrder: new FormControl(lookupCategoryDetailData.displayOrder),
            description: new FormControl(lookupCategoryDetailData.description),
        });

        component.isEdit = false;
        component.lookupCategoryDetailId = '19';

        spyOn(service, 'addLookupCategoryDetail').and.returnValue(throwError('add failed'));

        component.saveButtonConfig.callback();

        tick();

        expect(component.loading).toBeFalse();
    }));

    it('should add lookup category detail on valid form submission and navigate to the lookup category detail route', fakeAsync(() => {
        component.addLookupCategoryDetailFormGroup = new FormGroup({
            name: new FormControl(lookupCategoryDetailData.name),
            lookupCategory: new FormControl(lookupCategoryDetailData.lookupCategoryId),
            displayOrder: new FormControl(lookupCategoryDetailData.displayOrder),
            description: new FormControl(lookupCategoryDetailData.description),
        });

        component.isEdit = false;
        component.lookupCategoryDetailId = '19';

        spyOn(service, 'addLookupCategoryDetail').and.returnValue(of({
            isSuccess: true,
            message: 'Lookup category detail add successfully',
            data: lookupCategoryDetailData
        }));

        spyOn(globalService, 'openSnackBar');

        const navigateSpy = spyOn(router, 'navigate');

        component.saveButtonConfig.callback();

        tick();

        // Expectations
        expect(component.loading).toBeFalse();
        expect(globalService.openSnackBar).toHaveBeenCalledWith('Lookup category detail add successfully');
        expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE]);
    }));

    it('should handle error when fetching lookup category detail by ID', () => {
        spyOn(service, 'getLookupCategoryDetailById').and.returnValue(throwError('Error fetching lookup category detail'));
        component.getLookupCategoryDetailById(19);
        expect(service.getLookupCategoryDetailById).toHaveBeenCalledWith(19);
        expect(component.addLookupCategoryDetailFormGroup.value).toEqual({
            name: '',
            lookupCategory: '',
            displayOrder: null,
            description: ''
        });
    });

    it('should set form group values on successful response with truthy data', () => {
        const id = 19;
        const mockLookupCategoryDetailData = {
            isSuccess: true,
            data: lookupCategoryDetailData
        };
        spyOn(service, 'getLookupCategoryDetailById').and.returnValue(of(mockLookupCategoryDetailData));
        component.getLookupCategoryDetailById(id);
        expect(service.getLookupCategoryDetailById).toHaveBeenCalledWith(id);
        expect(component.addLookupCategoryDetailFormGroup.value).toEqual({
            name: lookupCategoryDetailData.name,
            lookupCategory: lookupCategoryDetailData.lookupCategoryId,
            displayOrder: lookupCategoryDetailData.displayOrder,
            description: lookupCategoryDetailData.description,
        });
    });
    it('should set form group values on successful response with falsy data', () => {
        const id = 19;
        const mockLookupCategoryDetailData = {
            isSuccess: true,
            data: null
        };
        spyOn(service, 'getLookupCategoryDetailById').and.returnValue(of(mockLookupCategoryDetailData));
        component.getLookupCategoryDetailById(id);
        expect(service.getLookupCategoryDetailById).toHaveBeenCalledWith(id);
        expect(component.addLookupCategoryDetailFormGroup.value).toEqual({
            name: '',
            lookupCategory: '',
            displayOrder: null,
            description: ''
        });
    });

    it('should set lookupCategoryList correctly on successful API call', fakeAsync(() => {
        const mockData = lookupCategoryData;
        spyOn(uiService, 'getDropdownOptions').and.returnValue(of(mockData));

        component.getLookupCategoryList();
        tick();

        expect(component.lookupCategoryList).toEqual(mockData);
    }));
});
