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
import { AddGroupComponent } from './add.group.component';
import { GroupService } from '../../services/group.service';
import { CoreModule } from '../../../../../../common/common.module';
import { testProjectGroupData } from '../../constant/testdata';

describe('AddProjectGroup', () => {
  let component: AddGroupComponent;
  let fixture: ComponentFixture<AddGroupComponent>;
  let router: Router;
  let service: GroupService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddGroupComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddGroupComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(GroupService);
    component = fixture.componentInstance;
    component.projectGroupId = '14';
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
  it('should navigate to project group page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]);
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
  it('should call getProjectGroupById ', () => {
    const consoleSpy = spyOn(component, 'getProjectGroupById');
      component.getProjectGroupById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form group values on successful response', () => {
      const id = 18;
      const mockProjectGroupData = {
        isSuccess: true,
        data: testProjectGroupData
      };
      spyOn(service, 'getProjectGroupById').and.returnValue(of(mockProjectGroupData));
      component.getProjectGroupById(id);
      expect(service.getProjectGroupById).toHaveBeenCalledWith(id);
  });
  it('should update project group on valid form submission and navigate to the project group route', fakeAsync(() => {
    component.addProjectGroupFormGroup = new FormGroup({
      name: new FormControl(testProjectGroupData.name),
      isActive: new FormControl(testProjectGroupData.isActive),
      description: new FormControl(testProjectGroupData.description)
    });

    component.isEdit = true;
    component.projectGroupId = '1';

    spyOn(service, 'updateProjectGroup').and.returnValue(of({
      isSuccess: true,
      message: 'Project Group updated successfully',
      data: testProjectGroupData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Group updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]);
  }));
  it('should add project group on valid form submission ', fakeAsync(() => {
    component.addProjectGroupFormGroup = new FormGroup({
      name: new FormControl(testProjectGroupData.name),
      status: new FormControl(testProjectGroupData.isActive),
      description: new FormControl(testProjectGroupData.description)
    });

    component.isEdit = false;
    component.projectGroupId = '1';

    spyOn(service, 'addProjectGroup').and.returnValue(of({
      isSuccess: true,
      message: 'Project Group add successfully',
      data: testProjectGroupData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Group add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]);
  }));
  it('should handle error on project group update', fakeAsync(() => {
    component.addProjectGroupFormGroup = new FormGroup({
      name: new FormControl(testProjectGroupData.name),
      status: new FormControl(testProjectGroupData.isActive),
      description: new FormControl(testProjectGroupData.description)
    });

    component.isEdit = true;
    component.projectGroupId = '14';

    spyOn(service, 'updateProjectGroup').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should handle error on project group add', fakeAsync(() => {
    component.addProjectGroupFormGroup = new FormGroup({
      name: new FormControl(testProjectGroupData.name),
      status: new FormControl(testProjectGroupData.isActive),
      description: new FormControl(testProjectGroupData.description)
    });

    component.isEdit = false;
    component.projectGroupId = '14';

    spyOn(service, 'addProjectGroup').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should add project group on valid form submission and navigate to the project group route', fakeAsync(() => {
    component.addProjectGroupFormGroup = new FormGroup({
      name: new FormControl(testProjectGroupData.name),
      status: new FormControl(testProjectGroupData.isActive),
      description: new FormControl(testProjectGroupData.description)
    });

    component.isEdit = false;
    component.projectGroupId = '1';

    spyOn(service, 'addProjectGroup').and.returnValue(of({
      isSuccess: true,
      message: 'Project Group add successfully',
      data: testProjectGroupData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Group add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]);
  }));
  it('should handle error when fetching project group by ID', () => {
    spyOn(service, 'getProjectGroupById').and.returnValue(throwError('Error fetching project group'));
    component.getProjectGroupById(14);
    expect(service.getProjectGroupById).toHaveBeenCalledWith(14);
    expect(component.addProjectGroupFormGroup.value).toEqual({
      name: '',
      description: ''
    });
  });
  it('should set form group values on successful response with truthy data', () => {
    const id = 14;
    const mockProjectGroupData = {
      isSuccess: true,
      data: testProjectGroupData
    };
    spyOn(service, 'getProjectGroupById').and.returnValue(of(mockProjectGroupData));
    component.getProjectGroupById(id);
    expect(service.getProjectGroupById).toHaveBeenCalledWith(id);
    expect(component.addProjectGroupFormGroup.value).toEqual({
      name: testProjectGroupData.name,
      description: testProjectGroupData.description,
    });
  });
  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockProjectGroupData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getProjectGroupById').and.returnValue(of(mockProjectGroupData));
    component.getProjectGroupById(id);
    expect(service.getProjectGroupById).toHaveBeenCalledWith(id);
    expect(component.addProjectGroupFormGroup.value).toEqual({
      name: '',
      description: ''
    });
  });
});
