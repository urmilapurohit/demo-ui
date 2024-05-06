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
import { AddStatusComponent } from './add.status.component';
import { StatusService } from '../../services/status.service';
import { testProjectStatusData } from '../../constant/testdata';
import { CoreModule } from '../../../../../../common/common.module';

describe('AddProjectStatus', () => {
  let component: AddStatusComponent;
  let fixture: ComponentFixture<AddStatusComponent>;
  let router: Router;
  let service: StatusService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddStatusComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddStatusComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(StatusService);
    component = fixture.componentInstance;
    component.projectStatusId = '1';
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
  it('should navigate to project Status page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]);
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
  it('should call getProjectStatusById ', () => {
    const consoleSpy = spyOn(component, 'getProjectStatusById');
      component.getProjectStatusById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form Status values on successful response', () => {
      const id = 18;
      const mockProjectStatusData = {
        isSuccess: true,
        data: testProjectStatusData
      };
      spyOn(service, 'getProjectStatusById').and.returnValue(of(mockProjectStatusData));
      component.getProjectStatusById(id);
      expect(service.getProjectStatusById).toHaveBeenCalledWith(id);
  });
  it('should update project Status on valid form submission and navigate to the project Status route', fakeAsync(() => {
    component.addProjectStatusFormGroup = new FormGroup({
      name: new FormControl(testProjectStatusData.name),
      isActive: new FormControl(testProjectStatusData.isActive),
      displayOrder: new FormControl(testProjectStatusData.displayOrder)
    });

    component.isEdit = true;
    component.projectStatusId = '1';

    spyOn(service, 'updateProjectStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Project Status updated successfully',
      data: testProjectStatusData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Status updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]);
  }));
  it('should add project Status on valid form submission ', fakeAsync(() => {
    component.addProjectStatusFormGroup = new FormGroup({
      name: new FormControl(testProjectStatusData.name),
      status: new FormControl(testProjectStatusData.isActive),
      displayOrder: new FormControl(testProjectStatusData.displayOrder)
    });

    component.isEdit = false;
    component.projectStatusId = '1';

    spyOn(service, 'addProjectStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Project Status add successfully',
      data: testProjectStatusData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Status add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]);
  }));
  it('should handle error on project Status update', fakeAsync(() => {
    component.addProjectStatusFormGroup = new FormGroup({
      name: new FormControl(testProjectStatusData.name),
      status: new FormControl(testProjectStatusData.isActive),
      displayOrder: new FormControl(testProjectStatusData.displayOrder)
    });

    component.isEdit = true;
    component.projectStatusId = '14';

    spyOn(service, 'updateProjectStatus').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should handle error on project Status add', fakeAsync(() => {
    component.addProjectStatusFormGroup = new FormGroup({
      name: new FormControl(testProjectStatusData.name),
      status: new FormControl(testProjectStatusData.isActive),
      displayOrder: new FormControl(testProjectStatusData.displayOrder)
    });

    component.isEdit = false;
    component.projectStatusId = '14';

    spyOn(service, 'addProjectStatus').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should add project Status on valid form submission and navigate to the project Status route', fakeAsync(() => {
    component.addProjectStatusFormGroup = new FormGroup({
      name: new FormControl(testProjectStatusData.name),
      status: new FormControl(testProjectStatusData.isActive),
      displayOrder: new FormControl(testProjectStatusData.displayOrder)
    });

    component.isEdit = false;
    component.projectStatusId = '1';

    spyOn(service, 'addProjectStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Project Status add successfully',
      data: testProjectStatusData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Project Status add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]);
  }));
  it('should handle error when fetching project Status by ID', () => {
    spyOn(service, 'getProjectStatusById').and.returnValue(throwError('Error fetching project Status'));
    component.getProjectStatusById(14);
    expect(service.getProjectStatusById).toHaveBeenCalledWith(14);
    expect(component.addProjectStatusFormGroup.value).toEqual({
      name: '',
      displayOrder: null
    });
  });
  it('should set form Status values on successful response with truthy data', () => {
    const id = 14;
    const mockProjectStatusData = {
      isSuccess: true,
      data: testProjectStatusData
    };
    spyOn(service, 'getProjectStatusById').and.returnValue(of(mockProjectStatusData));
    component.getProjectStatusById(id);
    expect(service.getProjectStatusById).toHaveBeenCalledWith(id);
    expect(component.addProjectStatusFormGroup.value).toEqual({
      name: testProjectStatusData.name,
      displayOrder: testProjectStatusData.displayOrder,
    });
  });
  it('should set form Status values on successful response with falsy data', () => {
    const id = 1;
    const mockProjectStatusData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getProjectStatusById').and.returnValue(of(mockProjectStatusData));
    component.getProjectStatusById(id);
    expect(service.getProjectStatusById).toHaveBeenCalledWith(id);
    expect(component.addProjectStatusFormGroup.value).toEqual({
      name: '',
      displayOrder: null
    });
  });
});
