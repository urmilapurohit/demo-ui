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
import { AddDepartmentComponent } from './add.department.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { DepartmentService } from '../../services/department.service';
import { ROUTES } from '../../../../../common/constants/routes';
import {testAddDepartmentData, testDepartmentData } from '../../data/testdata';

describe('AddDepartmentComponent', () => {
  let component: AddDepartmentComponent;
  let fixture: ComponentFixture<AddDepartmentComponent>;
  let router: Router;
  let service: DepartmentService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddDepartmentComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddDepartmentComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(DepartmentService);
    component = fixture.componentInstance;
    component.departmentId = '14';
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

  it('should navigate to department page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/department']);
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

  it('should call onSave Method on Enter press email field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.email.onEnterPress) {
      component.email.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press emailCc field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.emailCC.onEnterPress) {
      component.emailCC.onEnterPress();
      expect(saveSpy).toHaveBeenCalled();
    }
  });

  it('should call getDepartmentById ', () => {
    const consoleSpy = spyOn(component, 'getDepartmentById');
      component.getDepartmentById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
      const id = 1;
      const mockDepartmentData = {
        isSuccess: true,
        data: testAddDepartmentData
      };
      spyOn(service, 'getDepartmentById').and.returnValue(of(mockDepartmentData));
      component.getDepartmentById(id);
      expect(service.getDepartmentById).toHaveBeenCalledWith(id);
      expect(component.addDepartMentFormGroup.value).toEqual(testAddDepartmentData);
  });

  it('should update department on valid form submission and navigate to the department route', fakeAsync(() => {
    component.addDepartMentFormGroup = new FormGroup({
      name: new FormControl(testDepartmentData.name),
      status: new FormControl(testDepartmentData.status),
      departmentEmail: new FormControl(testDepartmentData.departmentEmail),
      departmentEmailCc: new FormControl(testDepartmentData.departmentEmailCc),
    });

    component.isEdit = true;
    component.departmentId = '1';

    spyOn(service, 'updateDepartment').and.returnValue(of({
      isSuccess: true,
      message: 'Department updated successfully',
      data: testDepartmentData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Department updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DEPARTMENT.DEPARTMENT_ABSOLUTE]);
  }));

  it('should add department on valid form submission ', fakeAsync(() => {
    component.addDepartMentFormGroup = new FormGroup({
      name: new FormControl(testDepartmentData.name),
      status: new FormControl(testDepartmentData.status),
      departmentEmail: new FormControl(testDepartmentData.departmentEmail),
      departmentEmailCc: new FormControl(testDepartmentData.departmentEmailCc),
    });

    component.isEdit = false;
    component.departmentId = '1';

    spyOn(service, 'addDepartment').and.returnValue(of({
      isSuccess: true,
      message: 'Department add successfully',
      data: testDepartmentData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Department add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DEPARTMENT.DEPARTMENT_ABSOLUTE]);
  }));

  it('should handle error on department update', fakeAsync(() => {
    component.addDepartMentFormGroup = new FormGroup({
      name: new FormControl(testDepartmentData.name),
      status: new FormControl(testDepartmentData.status),
      departmentEmail: new FormControl(testDepartmentData.departmentEmail),
      departmentEmailCc: new FormControl(testDepartmentData.departmentEmailCc),
    });

    component.isEdit = true;
    component.departmentId = '14';

    spyOn(service, 'updateDepartment').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on department add', fakeAsync(() => {
    component.addDepartMentFormGroup = new FormGroup({
      name: new FormControl(testDepartmentData.name),
      status: new FormControl(testDepartmentData.status),
      departmentEmail: new FormControl(testDepartmentData.departmentEmail),
      departmentEmailCc: new FormControl(testDepartmentData.departmentEmailCc),
    });

    component.isEdit = false;
    component.departmentId = '14';

    spyOn(service, 'addDepartment').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add department on valid form submission and navigate to the department route', fakeAsync(() => {
    component.addDepartMentFormGroup = new FormGroup({
      name: new FormControl(testDepartmentData.name),
      departmentEmail: new FormControl(testDepartmentData.departmentEmail),
      departmentEmailCc: new FormControl(testDepartmentData.departmentEmailCc),
      status: new FormControl(true)
    });

    component.isEdit = false;
    component.departmentId = '1';

    spyOn(service, 'addDepartment').and.returnValue(of({
      isSuccess: true,
      message: 'Department add successfully',
      data: testDepartmentData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Department add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DEPARTMENT.DEPARTMENT_ABSOLUTE]);
  }));

  it('should handle error when fetching department by ID', () => {
    spyOn(service, 'getDepartmentById').and.returnValue(throwError('Error fetching department'));
    component.getDepartmentById(14);
    expect(service.getDepartmentById).toHaveBeenCalledWith(14);
    expect(component.addDepartMentFormGroup.value).toEqual({
      name: '',
      departmentEmail: '',
      departmentEmailCc: ''
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 12;
    const mockDepartmentData = {
      isSuccess: true,
      data: testAddDepartmentData
    };
    spyOn(service, 'getDepartmentById').and.returnValue(of(mockDepartmentData));
    component.getDepartmentById(id);
    expect(service.getDepartmentById).toHaveBeenCalledWith(id);
    expect(component.addDepartMentFormGroup.value).toEqual(testAddDepartmentData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockDepartmentData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getDepartmentById').and.returnValue(of(mockDepartmentData));
    component.getDepartmentById(id);
    expect(service.getDepartmentById).toHaveBeenCalledWith(id);
    expect(component.addDepartMentFormGroup.value).toEqual({
      name: '',
      departmentEmail: '',
      departmentEmailCc: ''
    });
  });
});
