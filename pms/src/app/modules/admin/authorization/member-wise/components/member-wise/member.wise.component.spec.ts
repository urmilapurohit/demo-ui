import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { MemberWiseService } from '../../services/memberwise.service';
import { MemberWiseComponent } from './member.wise.component';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { Pages, PageAccessTypes } from '../../../../../../common/constants/Enums';
import { PermissionFormControlName, memberOptions, moduleOptions, responseData, responseViewAddData, singleResponseData, singleResponseFalseData } from '../../data/testdata';

describe('MemberWiseComponent', () => {
    let component: MemberWiseComponent;
    let fixture: ComponentFixture<MemberWiseComponent>;
    let service: MemberWiseService;
    let globalService: jasmine.SpyObj<GlobalService>;
    let permissionService: jasmine.SpyObj<PermissionService>;
    let formBuilder: FormBuilder;
    let mockService: any;

    beforeEach(async () => {
        const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
        permissionServiceSpy.checkAccessPermission.and.returnValue(true);
        formBuilder = new FormBuilder();
        mockService = jasmine.createSpyObj(['getFormControlPageAccessWiseAndPatchValue']); // Create a mock service
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
            declarations: [MemberWiseComponent],
            providers: [
                { provide: PermissionService, useValue: permissionServiceSpy }
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(MemberWiseComponent);
        globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
        service = TestBed.inject(MemberWiseService);
        permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
        component = fixture.componentInstance;
        component.isAddPermission = permissionService.checkAccessPermission(Pages.AuthorizationByMember, PageAccessTypes.Add);
        component.isEditPermission = permissionService.checkAccessPermission(Pages.AuthorizationByMember, PageAccessTypes.Edit);
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should set memberList when getMembers succeeds', () => {
        const mockPageRightsData = {
            isSuccess: true,
            data: memberOptions
        };
        spyOn(service, 'getMembers').and.returnValue(of(mockPageRightsData));
        component.ngOnInit();
        expect(service.getMembers).toHaveBeenCalled();
    });

    it('should set modules list when getModules succeeds', () => {
        const mockPageRightsData = {
            isSuccess: true,
            data: moduleOptions
        };
        spyOn(service, 'getModules').and.returnValue(of(mockPageRightsData));
        component.ngOnInit();
        expect(service.getModules).toHaveBeenCalled();
    });

    it('should call onEnterPress in member enter', () => {
        const consoleSpy = spyOn(component, 'getPageRights');
        if (component.memberDropdownConfig.onEnterPress) {
            component.memberDropdownConfig.onEnterPress();
        }
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call onEnterPress in module enter', () => {
        const consoleSpy = spyOn(component, 'getPageRights');
        if (component.moduleDropdownConfig.onEnterPress) {
            component.moduleDropdownConfig.onEnterPress();
        }
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call search method on click search button', () => {
        const consoleSpy = spyOn(component, 'getPageRights');
        component.searchBtnConfig.callback();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call resetFilter method on click Reset Button', () => {
        const consoleSpy = spyOn(component, 'resetPageRights');
        component.resetBtnConfig.callback();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call savePageRights method on click Save Button', () => {
        const consoleSpy = spyOn(component, 'savePageRights');
        component.saveBtnConfig.callback();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should set PageRights and call setTableConfig on successful API response', fakeAsync(() => {
        component.filterForm = new FormGroup({
            member: new FormControl(1),
            module: new FormControl(1),
        });

        spyOn(service, 'getPageRights').and.returnValue(of({
            isSuccess: true,
            message: 'Get Page Rights',
            data: responseData
        }));

        const consoleSpy = spyOn(component, 'bindControls');

        component.searchBtnConfig.callback();
        tick();
        fixture.autoDetectChanges();
        expect(service.getPageRights).toHaveBeenCalledWith(1, 1);
        expect(component.pageRightsGridData).toEqual(responseData);
        expect(consoleSpy).toHaveBeenCalled();
        expect(component.isGridLoading).toBeFalse();
    }));

    it('should not call getPagerights on invalid form submission', fakeAsync(() => {
        component.filterForm = new FormGroup({
            member: new FormControl("", [Validators.required]),
            module: new FormControl(1),
        });

        spyOn(service, 'getPageRights');

        component.searchBtnConfig.callback();

        expect(component.isGridLoading).toBeFalse();
    }));

    it('should set isGridLoading to false on API error', fakeAsync(() => {
        component.filterForm = new FormGroup({
            member: new FormControl(1),
            module: new FormControl(1),
        });

        spyOn(service, 'getPageRights').and.returnValue(throwError('Some error'));

        component.getPageRights();

        fixture.detectChanges();
        expect(component.submitted).toBeTrue();
        expect(component.isGridLoading).toBeFalse();
    }));

    it('should patch value to view form control', () => {
        const id = '123';
        const viewControlName = `${PermissionFormControlName.VIEW}${id}`;
        const formGroup = formBuilder.group({ [viewControlName]: true });
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.View, false, id);
        expect(formGroup.get(viewControlName)?.value).toBe(false);
    });

    it('should not patch value when view control does not exist', () => {
        const id = '123';
        const viewControlName = `${PermissionFormControlName.VIEW}${id}`;
        const formGroup = formBuilder.group({});
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.View, true, id);
        expect(formGroup.get(viewControlName)).toBeNull();
    });

    it('should patch value to add form control', () => {
        const id = '123';
        const addControlName = `${PermissionFormControlName.ADD}${id}`;
        const formGroup = formBuilder.group({ [addControlName]: true });
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Add, false, id);
        expect(formGroup.get(addControlName)?.value).toBe(false);
    });

    it('should not patch value when add control does not exist', () => {
        const id = '123';
        const addControlName = `${PermissionFormControlName.ADD}${id}`;
        const formGroup = formBuilder.group({});
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Add, true, id);
        expect(formGroup.get(addControlName)).toBeNull();
    });

    it('should patch value to Edit form control', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.EDIT}${id}`;
        const formGroup = formBuilder.group({ [controlName]: true });
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Edit, false, id);
        expect(formGroup.get(controlName)?.value).toBe(false);
    });

    it('should not patch value when edit control does not exist', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.EDIT}${id}`;
        const formGroup = formBuilder.group({});
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Edit, true, id);
        expect(formGroup.get(controlName)).toBeNull();
    });

    it('should patch value to Delete form control', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.DELETE}${id}`;
        const formGroup = formBuilder.group({ [controlName]: true });
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Delete, false, id);
        expect(formGroup.get(controlName)?.value).toBe(false);
    });

    it('should not patch value when delete control does not exist', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.DELETE}${id}`;
        const formGroup = formBuilder.group({});
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Delete, true, id);
        expect(formGroup.get(controlName)).toBeNull();
    });

    it('should patch value to Export form control', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.EXPORT}${id}`;
        const formGroup = formBuilder.group({ [controlName]: true });
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Export, false, id);
        expect(formGroup.get(controlName)?.value).toBe(false);
    });

    it('should not patch value when export control does not exist', () => {
        const id = '123';
        const controlName = `${PermissionFormControlName.EXPORT}${id}`;
        const formGroup = formBuilder.group({});
        component.headerForm = formGroup;
        component.getFormControlPageAccessWiseAndPatchValue(PageAccessTypes.Export, true, id);
        expect(formGroup.get(controlName)).toBeNull();
    });

    it('should remove all controls except those specified', () => {
        const controlsToKeep = ['control1', 'control2'];
        const formGroup = formBuilder.group({
            control1: 'value1',
            control2: 'value2',
            control3: 'value3'
        });
        component.headerForm = formGroup;
        component.removeAllControlsExcept(controlsToKeep);
        expect(formGroup.contains('control1')).toBeTrue();
        expect(formGroup.contains('control2')).toBeTrue();
        expect(formGroup.contains('control3')).toBeFalse();
    });

    it('should not remove any controls when all controls are specified to keep', () => {
        const controlsToKeep = ['control1', 'control2', 'control3'];
        const formGroup = formBuilder.group({
            control1: 'value1',
            control2: 'value2',
            control3: 'value3'
        });
        component.headerForm = formGroup;
        component.removeAllControlsExcept(controlsToKeep);

        expect(formGroup.contains('control1')).toBeTrue();
        expect(formGroup.contains('control2')).toBeTrue();
        expect(formGroup.contains('control3')).toBeTrue();
    });

    it('should patch value to true for view when checkbox is checked', () => {
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForView(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(1);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, true);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch values to false for add, edit, delete, and export when checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForView(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Add, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Edit, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Delete, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Export, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(4);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, false);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch values to true for add and view when checkbox is checked', () => {
        // Arrange
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');
        component.onCanChangeForAdd(data, `control_${id}`);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Add, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(2);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, true);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should not patch value for view when checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForAdd(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.Add, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, false);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch values to true for edit and view when checkbox is checked', () => {
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');
        component.onCanChangeForEdit(data, `control_${id}`);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Edit, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(2);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, true);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should not patch value for view when edit checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForEdit(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.Edit, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, false);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch values to true for delete and view when checkbox is checked', () => {
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');
        component.onCanChangeForDelete(data, `control_${id}`);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Delete, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(2);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, true);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should not patch value for view when delete checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForDelete(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.Delete, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, false);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch values to true for export and view when checkbox is checked', () => {
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');
        component.onCanChangeForExport(data, `control_${id}`);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Export, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(2);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, true);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should not patch value for view when export checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        spyOn(component, 'setAllCheckbox');
        spyOn(component, 'setHeaderCheckBox');

        component.onCanChangeForExport(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.Export, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).not.toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.setAllCheckbox).toHaveBeenCalledWith(id, false);
        expect(component.setAllCheckbox).toHaveBeenCalledTimes(1);
        expect(component.setHeaderCheckBox).toHaveBeenCalledTimes(1);
    });

    it('should patch all values to true when checkbox is checked', () => {
        // Arrange
        const id = '123';
        const data: any = { checked: true };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');
        component.onCanAllChange(data, `control_${id}`);

        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Add, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Edit, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Delete, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Export, true, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(5);
    });

    it('should patch all values to false when checkbox is unchecked', () => {
        const id = '123';
        const data: any = { checked: false };
        spyOn(component, 'getFormControlPageAccessWiseAndPatchValue');

        component.onCanAllChange(data, `control_${id}`);
        fixture.autoDetectChanges();

        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.View, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Add, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Edit, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Delete, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(PageAccessTypes.Export, false, id);
        expect(component.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledTimes(5);
    });

    it('should bind controls correctly when pageRightsGridData has data', () => {
        component.pageRightsGridData = singleResponseData;
        spyOn(component, 'setHeaderCheckBox');

        component.bindControls();

        expect(component.headerForm.contains(`${PermissionFormControlName.VIEW}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.VIEW}1`)?.value).toBe(true);
        expect(component.headerForm.contains(`${PermissionFormControlName.ADD}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.ADD}1`)?.value).toBe(true);
        expect(component.headerForm.contains(`${PermissionFormControlName.EDIT}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.EDIT}1`)?.value).toBe(true);
        expect(component.headerForm.contains(`${PermissionFormControlName.DELETE}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.DELETE}1`)?.value).toBe(true);
        expect(component.headerForm.contains(`${PermissionFormControlName.EXPORT}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.EXPORT}1`)?.value).toBe(true);
        expect(component.headerForm.contains(`${PermissionFormControlName.ALL}1`)).toBeTrue();
        expect(component.headerForm.get(`${PermissionFormControlName.ALL}1`)?.value).toBe(true);
        expect(component.setHeaderCheckBox).toHaveBeenCalled();
    });

    it('should update "all" checkbox to false when at least one checkbox is unchecked', () => {
        const id = '1';
        component.pageRightsGridData = singleResponseData;
        component.headerForm = formBuilder.group({
            [`${PermissionFormControlName.VIEW}${id}`]: true,
            [`${PermissionFormControlName.ADD}${id}`]: true,
            [`${PermissionFormControlName.EDIT}${id}`]: true,
            [`${PermissionFormControlName.DELETE}${id}`]: true,
            [`${PermissionFormControlName.EXPORT}${id}`]: true,
            [`${PermissionFormControlName.ALL}${id}`]: true
        });
        component.setAllCheckbox(id, false);
        expect(component.headerForm.get(`${PermissionFormControlName.ALL}${id}`)?.value).toBe(false);
    });

    it('should update "all" checkbox to true when all checkboxes are checked', () => {
        const id = '1';

        component.pageRightsGridData = singleResponseData;
        component.headerForm = formBuilder.group({
            [`${PermissionFormControlName.VIEW}${id}`]: true,
            [`${PermissionFormControlName.ADD}${id}`]: true,
            [`${PermissionFormControlName.EDIT}${id}`]: true,
            [`${PermissionFormControlName.DELETE}${id}`]: true,
            [`${PermissionFormControlName.EXPORT}${id}`]: true,
            [`${PermissionFormControlName.ALL}${id}`]: false
        });
        component.setAllCheckbox(id, true);

        expect(component.headerForm.get(`${PermissionFormControlName.ALL}${id}`)?.value).toBe(true);
    });

    it('should update header checkboxes correctly when all permissions are checked', () => {
        component.pageRightsGridData = responseData;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });

        component.setHeaderCheckBox();

        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
        expect(component.headerForm.get('canEditHeader')?.value).toBe(false);
        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(false);
        expect(component.headerForm.get('canExportHeader')?.value).toBe(false);
        expect(component.headerForm.get('canAllHeader')?.value).toBe(false);
    });

    it('should update header checkboxes correctly when not all permissions are checked', () => {
        component.pageRightsGridData = responseViewAddData;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });

        component.setHeaderCheckBox();

        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
        expect(component.headerForm.get('canEditHeader')?.value).toBe(false);
        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(false);
        expect(component.headerForm.get('canExportHeader')?.value).toBe(false);
        expect(component.headerForm.get('canAllHeader')?.value).toBe(false);
    });

    it('should update all permissions when "canAllHeader" checkbox is changed', () => {
        component.pageRightsGridData = singleResponseData;
        const id = 1;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false,
            [`${PermissionFormControlName.VIEW}${id}`]: true,
            [`${PermissionFormControlName.ADD}${id}`]: true,
            [`${PermissionFormControlName.EDIT}${id}`]: true,
            [`${PermissionFormControlName.DELETE}${id}`]: true,
            [`${PermissionFormControlName.EXPORT}${id}`]: true,
            [`${PermissionFormControlName.ALL}${id}`]: false
        });

        const data: any = { checked: true };

        component.onCanChangeHeader(data, 'canAllHeader');

        expect(component.headerForm.get('canViewHeader')?.value).toBe(true);
        expect(component.headerForm.get('canAddHeader')?.value).toBe(true);
        expect(component.headerForm.get('canEditHeader')?.value).toBe(true);
        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(true);
        expect(component.headerForm.get('canExportHeader')?.value).toBe(true);

        expect(component.headerForm.get(`${PermissionFormControlName.ALL}${id}`)?.value).toBe(true);
    });

    it('should call getFormControlPageAccessWiseAndPatchValue for each permission when formControlName is "canViewHeader"', () => {
        const data: MatCheckboxChange = { checked: false } as MatCheckboxChange;
        const formControlName = 'canViewHeader';
        const id = 1;
        component.pageRightsGridData = singleResponseData;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false,
            [`${PermissionFormControlName.VIEW}${id}`]: { value: true, disabled: false },
            [`${PermissionFormControlName.ADD}${id}`]: { value: true, disabled: false },
            [`${PermissionFormControlName.EDIT}${id}`]: { value: true, disabled: false },
            [`${PermissionFormControlName.DELETE}${id}`]: { value: true, disabled: false },
            [`${PermissionFormControlName.EXPORT}${id}`]: { value: true, disabled: false },
            [`${PermissionFormControlName.ALL}${id}`]: { value: false, disabled: false },
        });

        component.onCanChangeHeader(data, formControlName);

        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledWith(
            'View',
            true,
            '1'
        );
    });

    it('should call getFormControlPageAccessWiseAndPatchValue for each permission when formControlName is "canViewHeader" true', () => {
        const data: MatCheckboxChange = { checked: true } as MatCheckboxChange;
        const formControlName = 'canViewHeader';
        component.pageRightsGridData = singleResponseData;

        component.onCanChangeHeader(data, formControlName);

        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledOnceWith(
            'View',
            true,
            '1'
        );
        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledOnceWith(
            'Add',
            true,
            '1'
        );
        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledOnceWith(
            'Edit',
            true,
            '1'
        );
        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledOnceWith(
            'Delete',
            true,
            '1'
        );
        expect(mockService.getFormControlPageAccessWiseAndPatchValue).toHaveBeenCalledOnceWith(
            'Export',
            true,
            '1'
        );
    });

    it('should update specific permission when view checkbox is changed to true', () => {
        const data: any = { checked: true };
        component.pageRightsGridData = singleResponseData;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });

        component.onCanChangeHeader(data, 'canViewHeader');

        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update specific permission when view checkbox is changed to false', () => {
        const data: any = { checked: false };
        component.pageRightsGridData = singleResponseFalseData;
        const id = 1;
        component.headerForm = formBuilder.group({
            [`${PermissionFormControlName.VIEW}${id}`]: true,
            [`${PermissionFormControlName.ADD}${id}`]: true,
            [`${PermissionFormControlName.EDIT}${id}`]: true,
            [`${PermissionFormControlName.DELETE}${id}`]: true,
            [`${PermissionFormControlName.EXPORT}${id}`]: true,
            [`${PermissionFormControlName.ALL}${id}`]: true,
            canViewHeader: true,
            canAddHeader: true,
            canEditHeader: true,
            canDeleteHeader: true,
            canExportHeader: true,
            canAllHeader: true
        });

        component.onCanChangeHeader(data, 'canViewHeader');
        fixture.autoDetectChanges();

        expect(component.headerForm.get(`${PermissionFormControlName.VIEW}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.ADD}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.EDIT}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.DELETE}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.EXPORT}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.ALL}${id}`)?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(true);
        expect(component.headerForm.get('canAddHeader')?.value).toBe(true);
        expect(component.headerForm.get('canEditHeader')?.value).toBe(true);
        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(true);
        expect(component.headerForm.get('canExportHeader')?.value).toBe(true);
        expect(component.headerForm.get('canAllHeader')?.value).toBe(true);
    });

    it('should update specific permission when view checkbox is changed to true', () => {
        const data: any = { checked: true };
        component.pageRightsGridData = singleResponseData;
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });

        component.onCanChangeHeader(data, 'canAddHeader');

        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
    });

    it('should update specific permission when view checkbox is changed to false', () => {
        const data: any = { checked: false };
        component.pageRightsGridData = singleResponseData;
        const id = 1;
        component.headerForm = formBuilder.group({
            [`${PermissionFormControlName.VIEW}${id}`]: true,
            [`${PermissionFormControlName.ADD}${id}`]: true,
            [`${PermissionFormControlName.EDIT}${id}`]: true,
            [`${PermissionFormControlName.DELETE}${id}`]: true,
            [`${PermissionFormControlName.EXPORT}${id}`]: true,
            [`${PermissionFormControlName.ALL}${id}`]: true,
            canViewHeader: true,
            canAddHeader: true,
            canEditHeader: true,
            canDeleteHeader: true,
            canExportHeader: true,
            canAllHeader: true
        });

        component.onCanChangeHeader(data, 'canAddHeader');
        fixture.autoDetectChanges();

        expect(component.headerForm.get(`${PermissionFormControlName.VIEW}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.ADD}${id}`)?.value).toBe(false);
        expect(component.headerForm.get(`${PermissionFormControlName.EDIT}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.DELETE}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.EXPORT}${id}`)?.value).toBe(true);
        expect(component.headerForm.get(`${PermissionFormControlName.ALL}${id}`)?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(true);
        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
        expect(component.headerForm.get('canEditHeader')?.value).toBe(true);
        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(true);
        expect(component.headerForm.get('canExportHeader')?.value).toBe(true);
        expect(component.headerForm.get('canAllHeader')?.value).toBe(false);
    });

    it('should update "canAddHeader" and related permissions when "canAddHeader" checkbox is changed', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: false };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: true,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canAddHeader');

        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canAddHeader" and related permissions when "canAddHeader" checkbox is changed true', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: true };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: true,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canAddHeader');

        expect(component.headerForm.get('canAddHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canEditHeader" and related permissions when "canEditHeader" checkbox is changed', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: false };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: false,
            canEditHeader: true,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canEditHeader');

        expect(component.headerForm.get('canEditHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canEditHeader" and related permissions when "canEditHeader" checkbox is changed true', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: true };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: false,
            canEditHeader: true,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canEditHeader');

        expect(component.headerForm.get('canEditHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canDeleteHeader" and related permissions when "canDeleteHeader" checkbox is changed', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: false };
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canDeleteHeader');

        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canDeleteHeader" and related permissions when "canDeleteHeader" checkbox is changed true', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: true };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: true,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canDeleteHeader');

        expect(component.headerForm.get('canDeleteHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canExportHeader" and related permissions when "canExportHeader" checkbox is changed', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: false };
        component.headerForm = formBuilder.group({
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canExportHeader');

        expect(component.headerForm.get('canExportHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should update "canExportHeader" and related permissions when "canExportHeader" checkbox is changed to true', () => {
        component.pageRightsGridData = singleResponseData;
        const data: any = { checked: true };
        component.headerForm = formBuilder.group({
            canViewHeader: true,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: true,
            canAllHeader: false
        });
        component.onCanChangeHeader(data, 'canExportHeader');

        expect(component.headerForm.get('canExportHeader')?.value).toBe(false);
        expect(component.headerForm.get('canViewHeader')?.value).toBe(false);
    });

    it('should reset page rights properly', () => {
        const initialHeaderFormValues = {
            canViewHeader: false,
            canAddHeader: false,
            canEditHeader: false,
            canDeleteHeader: false,
            canExportHeader: false,
            canAllHeader: false
        };
        component.memberOptions = memberOptions;
        component.moduleOptions = moduleOptions;
        component.headerForm = formBuilder.group(initialHeaderFormValues);
        component.filterForm = formBuilder.group({
            member: memberOptions[1].id,
            module: moduleOptions[1].id
        });
        component.pageRightsGridData = [];

        component.resetPageRights();

        expect(component.filterForm.get('member')?.value).toBe(memberOptions[0].id);
        expect(component.filterForm.get('module')?.value).toBe(moduleOptions[0].id);
        expect(component.pageRightsGridData.length).toBe(0);
        expect(component.headerForm.value).toEqual(initialHeaderFormValues);
    });

    it('should save page rights successfully', () => {
        const mockResponse = { isSuccess: true, data: true, message: 'Success' };
        spyOn(service, 'SavePageRights').and.returnValue(of(mockResponse));
        spyOn(globalService, 'openSnackBar');
        component.memberId = 1;
        component.pageRightsGridData = singleResponseData;
        const formControlMock = jasmine.createSpyObj('FormControl', ['value']);
        formControlMock.value = true;
        spyOn(component.headerForm, 'get').and.returnValue(formControlMock);

        component.saveBtnConfig.callback();

        expect(service.SavePageRights).toHaveBeenCalledWith({
            memberId: 1,
            modulePageAccessRequestList: [{ modulePageId: 1, pageAccessTypeIds: [1, 2, 4, 3, 6] }]
        });
        expect(component.isGridLoading).toBeFalse();
        expect(globalService.openSnackBar).toHaveBeenCalled();
    });

    it('should handle error when saving page rights', () => {
        spyOn(service, 'SavePageRights').and.returnValue(throwError('Error'));
        component.memberId = 1;
        component.pageRightsGridData = singleResponseData;
        const formControlMock = jasmine.createSpyObj('FormControl', ['value']);
        formControlMock.value = true;
        spyOn(component.headerForm, 'get').and.returnValue(formControlMock);

        component.saveBtnConfig.callback();

        expect(service.SavePageRights).toHaveBeenCalled();
        expect(component.isGridLoading).toBeFalse();
    });
});
