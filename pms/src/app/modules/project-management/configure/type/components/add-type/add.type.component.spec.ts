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
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { ROUTES } from '../../../../../../common/constants/routes';
import { AddTypeComponent } from './add.type.component';
import { TypeService } from '../../services/type.service';
import { testProjectTypeData } from '../../constant/testdata';
import { CoreModule } from '../../../../../../common/common.module';

describe('AddTypeComponent', () => {
  let component: AddTypeComponent;
  let fixture: ComponentFixture<AddTypeComponent>;
  let router: Router;
  let service: TypeService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddTypeComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddTypeComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(TypeService);
    component = fixture.componentInstance;
    component.projectTypeId = '1';
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
  it('should navigate to project Type page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]);
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
  it('should call onSave Method on Enter press displayOrder field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.displayOrder.onEnterPress) {
      component.displayOrder.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });
  it('should call getProjectTypeById ', () => {
    const consoleSpy = spyOn(component, 'getProjectTypeById');
      component.getProjectTypeById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form type values on successful response', () => {
      const id = 18;
      const mockProjectTypeData = {
        isSuccess: true,
        data: testProjectTypeData
      };
      spyOn(service, 'getProjectTypeById').and.returnValue(of(mockProjectTypeData));
      component.getProjectTypeById(id);
      expect(service.getProjectTypeById).toHaveBeenCalledWith(id);
  });
  it('should update project type on valid form submission and navigate to the project type route', fakeAsync(() => {
    component.addProjectTypeFormGroup = new FormGroup({
      name: new FormControl(testProjectTypeData.name),
      isActive: new FormControl(testProjectTypeData.isActive),
      displayOrder: new FormControl(testProjectTypeData.displayOrder)
    });

    component.isEdit = true;
    component.projectTypeId = '1';

    spyOn(service, 'updateProjectType').and.returnValue(of({
      isSuccess: true,
      message: 'Project Type updated successfully',
      data: testProjectTypeData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Type updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]);
  }));
  it('should add project type on valid form submission ', fakeAsync(() => {
    component.addProjectTypeFormGroup = new FormGroup({
      name: new FormControl(testProjectTypeData.name),
      status: new FormControl(testProjectTypeData.isActive),
      displayOrder: new FormControl(testProjectTypeData.displayOrder)
    });

    component.isEdit = false;
    component.projectTypeId = '1';

    spyOn(service, 'addProjectType').and.returnValue(of({
      isSuccess: true,
      message: 'Project Type add successfully',
      data: testProjectTypeData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Type add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]);
  }));
  it('should handle error on project type update', fakeAsync(() => {
    component.addProjectTypeFormGroup = new FormGroup({
      name: new FormControl(testProjectTypeData.name),
      status: new FormControl(testProjectTypeData.isActive),
      displayOrder: new FormControl(testProjectTypeData.displayOrder)
    });

    component.isEdit = true;
    component.projectTypeId = '14';

    spyOn(service, 'updateProjectType').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should handle error on project type add', fakeAsync(() => {
    component.addProjectTypeFormGroup = new FormGroup({
      name: new FormControl(testProjectTypeData.name),
      status: new FormControl(testProjectTypeData.isActive),
      displayOrder: new FormControl(testProjectTypeData.displayOrder)
    });

    component.isEdit = false;
    component.projectTypeId = '14';

    spyOn(service, 'addProjectType').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should add project type on valid form submission and navigate to the project type route', fakeAsync(() => {
    component.addProjectTypeFormGroup = new FormGroup({
      name: new FormControl(testProjectTypeData.name),
      status: new FormControl(testProjectTypeData.isActive),
      displayOrder: new FormControl(testProjectTypeData.displayOrder)
    });

    component.isEdit = false;
    component.projectTypeId = '1';

    spyOn(service, 'addProjectType').and.returnValue(of({
      isSuccess: true,
      message: 'Project Type add successfully',
      data: testProjectTypeData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Type add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]);
  }));
  it('should handle error when fetching book category by ID', () => {
    spyOn(service, 'getProjectTypeById').and.returnValue(throwError('Error fetching Project Type'));
    component.getProjectTypeById(6);
    expect(service.getProjectTypeById).toHaveBeenCalledWith(6);
    expect(component.addProjectTypeFormGroup.value).toEqual({
      name: '',
      displayOrder: null
    });
  });
  it('should set form type values on successful response with truthy data', () => {
    const id = 14;
    const mockProjectTypeData = {
      isSuccess: true,
      data: testProjectTypeData
    };
    spyOn(service, 'getProjectTypeById').and.returnValue(of(mockProjectTypeData));
    component.getProjectTypeById(id);
    expect(service.getProjectTypeById).toHaveBeenCalledWith(id);
    expect(component.addProjectTypeFormGroup.value).toEqual({
      name: testProjectTypeData.name,
      displayOrder: testProjectTypeData.displayOrder,
    });
  });
  it('should set form type values on successful response with falsy data', () => {
    const id = 1;
    const mockProjectTypeData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getProjectTypeById').and.returnValue(of(mockProjectTypeData));
    component.getProjectTypeById(id);
    expect(service.getProjectTypeById).toHaveBeenCalledWith(id);
    expect(component.addProjectTypeFormGroup.value).toEqual({
      name: '',
      displayOrder: null
    });
  });
});
