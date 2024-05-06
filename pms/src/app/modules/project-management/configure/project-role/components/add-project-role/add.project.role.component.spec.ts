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
import { ROUTES } from '@constants/routes';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { AddProjectRoleComponent } from './add.project.role.component';
import { ProjectRoleService } from '../../services/project.role.service';
import { testProjectRoleData } from '../../constant/testdata';

describe('AddProjectRole', () => {
  let component: AddProjectRoleComponent;
  let fixture: ComponentFixture<AddProjectRoleComponent>;
  let router: Router;
  let service: ProjectRoleService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddProjectRoleComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddProjectRoleComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ProjectRoleService);
    component = fixture.componentInstance;
    component.projectRoleId = '14';
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
  it('should navigate to project role page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]);
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
  it('should call onSave Method on Enter press abbreviation field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.abbreviation.onEnterPress) {
      component.abbreviation.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });
  it('should call getProjectRoleById ', () => {
    const consoleSpy = spyOn(component, 'getProjectRoleById');
      component.getProjectRoleById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form role values on successful response', () => {
      const id = 18;
      const mockProjectRoleData = {
        isSuccess: true,
        data: testProjectRoleData
      };
      spyOn(service, 'getProjectRoleById').and.returnValue(of(mockProjectRoleData));
      component.getProjectRoleById(id);
      expect(service.getProjectRoleById).toHaveBeenCalledWith(id);
  });
  it('should update project role on valid form submission and navigate to the project role route', fakeAsync(() => {
    component.addProjectRoleFormGroup = new FormGroup({
      name: new FormControl(testProjectRoleData.name),
      isActive: new FormControl(testProjectRoleData.isActive),
      isMemberIdRequired: new FormControl(testProjectRoleData.isMemberIdRequired),
      abbreviation: new FormControl(testProjectRoleData.abbreviation)
    });

    component.isEdit = true;
    component.projectRoleId = '1';

    spyOn(service, 'updateProjectRole').and.returnValue(of({
      isSuccess: true,
      message: 'Project Role updated successfully',
      data: testProjectRoleData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Role updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]);
  }));
  it('should add project role on valid form submission ', fakeAsync(() => {
    component.addProjectRoleFormGroup = new FormGroup({
      name: new FormControl(testProjectRoleData.name),
      status: new FormControl(testProjectRoleData.isActive),
      isMemberIdRequired: new FormControl(testProjectRoleData.isMemberIdRequired),
      abbreviation: new FormControl(testProjectRoleData.abbreviation)
    });

    component.isEdit = false;
    component.projectRoleId = '1';

    spyOn(service, 'addProjectRole').and.returnValue(of({
      isSuccess: true,
      message: 'Project Role add successfully',
      data: testProjectRoleData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Role add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]);
  }));
  it('should handle error on project role update', fakeAsync(() => {
    component.addProjectRoleFormGroup = new FormGroup({
      name: new FormControl(testProjectRoleData.name),
      status: new FormControl(testProjectRoleData.isActive),
      isMemberIdRequired: new FormControl(testProjectRoleData.isMemberIdRequired),
      abbreviation: new FormControl(testProjectRoleData.abbreviation)
    });

    component.isEdit = true;
    component.projectRoleId = '14';

    spyOn(service, 'updateProjectRole').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should handle error on project role add', fakeAsync(() => {
    component.addProjectRoleFormGroup = new FormGroup({
      name: new FormControl(testProjectRoleData.name),
      status: new FormControl(testProjectRoleData.isActive),
      isMemberIdRequired: new FormControl(testProjectRoleData.isMemberIdRequired),
      abbreviation: new FormControl(testProjectRoleData.abbreviation)
    });

    component.isEdit = false;
    component.projectRoleId = '14';

    spyOn(service, 'addProjectRole').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should add project role on valid form submission and navigate to the project role route', fakeAsync(() => {
    component.addProjectRoleFormGroup = new FormGroup({
      name: new FormControl(testProjectRoleData.name),
      status: new FormControl(testProjectRoleData.isActive),
      isMemberIdRequired: new FormControl(testProjectRoleData.isMemberIdRequired),
      abbreviation: new FormControl(testProjectRoleData.abbreviation)
    });

    component.isEdit = false;
    component.projectRoleId = '1';

    spyOn(service, 'addProjectRole').and.returnValue(of({
      isSuccess: true,
      message: 'Project Role add successfully',
      data: testProjectRoleData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Role add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]);
  }));
  it('should handle error when fetching project role by ID', () => {
    spyOn(service, 'getProjectRoleById').and.returnValue(throwError('Error fetching project role'));
    component.getProjectRoleById(14);
    expect(service.getProjectRoleById).toHaveBeenCalledWith(14);
    expect(component.addProjectRoleFormGroup.value).toEqual({
      name: '',
      abbreviation: '',
      isMemberIdRequired: false,
    });
  });
  it('should set form role values on successful response with truthy data', () => {
    const id = 14;
    const mockProjectRoleData = {
      isSuccess: true,
      data: testProjectRoleData
    };
    spyOn(service, 'getProjectRoleById').and.returnValue(of(mockProjectRoleData));
    component.getProjectRoleById(id);
    expect(service.getProjectRoleById).toHaveBeenCalledWith(id);
    expect(component.addProjectRoleFormGroup.value).toEqual({
      name: testProjectRoleData.name,
      abbreviation: testProjectRoleData.abbreviation,
      isMemberIdRequired: testProjectRoleData.isMemberIdRequired,
    });
  });
  it('should set form role values on successful response with falsy data', () => {
    const id = 1;
    const mockProjectRoleData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getProjectRoleById').and.returnValue(of(mockProjectRoleData));
    component.getProjectRoleById(id);
    expect(service.getProjectRoleById).toHaveBeenCalledWith(id);
    expect(component.addProjectRoleFormGroup.value).toEqual({
      name: '',
      abbreviation: '',
      isMemberIdRequired: false,
    });
  });
});
