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
import { AddDesignationComponent } from './add.designation.component';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { DesignationService } from '../../services/designation.service';
import { testDesignationData } from '../../constant/testdata';
import { ROUTES } from '../../../../../common/constants/routes';

describe('AddDesignationComponent', () => {
  let component: AddDesignationComponent;
  let fixture: ComponentFixture<AddDesignationComponent>;
  let router: Router;
  let service: DesignationService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
        providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddDesignationComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddDesignationComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(DesignationService);
    component = fixture.componentInstance;
    component.designationId = '14';
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
  it('should navigate to designation page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/designation']);
  });
  it('should call onSave Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
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
  it('should call getDesignationById ', () => {
    const consoleSpy = spyOn(component, 'getDesignationById');
      component.getDesignationById(14);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form group values on successful response', () => {
      const id = 1;
      const mockDesignationData = {
        isSuccess: true,
        data: testDesignationData
      };
      spyOn(service, 'getDesignationById').and.returnValue(of(mockDesignationData));
      component.getDesignationById(id);
      expect(service.getDesignationById).toHaveBeenCalledWith(id);
      expect(component.addDesignationFormGroup.value).toEqual(testDesignationData);
  });
  it('should update Designation on valid form submission and navigate to the Designation route', fakeAsync(() => {
    component.addDesignationFormGroup = new FormGroup({
      name: new FormControl(testDesignationData.name),
      abbreviation: new FormControl(testDesignationData.abbreviation),
      canBeAssessor: new FormControl(testDesignationData.canBeAssessor),
      canBeReviewer: new FormControl(testDesignationData.canBeReviewer)
    });

    component.isEdit = true;
    component.designationId = '1';

    spyOn(service, 'updateDesignation').and.returnValue(of({
      isSuccess: true,
      message: 'Designation updated successfully',
      data: testDesignationData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Designation updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE]);
  }));
  it('should add Designation on valid form submission ', fakeAsync(() => {
    component.addDesignationFormGroup = new FormGroup({
      name: new FormControl(testDesignationData.name),
      abbreviation: new FormControl(testDesignationData.abbreviation),
      canBeAssessor: new FormControl(testDesignationData.canBeAssessor),
      canBeReviewer: new FormControl(testDesignationData.canBeReviewer)
    });

    component.isEdit = false;
    component.designationId = '1';

    spyOn(service, 'addDesignation').and.returnValue(of({
      isSuccess: true,
      message: 'Designation add successfully',
      data: testDesignationData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Designation add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE]);
  }));
  it('should handle error on Designation update', fakeAsync(() => {
    component.addDesignationFormGroup = new FormGroup({
      name: new FormControl(testDesignationData.name),
      abbreviation: new FormControl(testDesignationData.abbreviation),
      canBeAssessor: new FormControl(testDesignationData.canBeAssessor),
      canBeReviewer: new FormControl(testDesignationData.canBeReviewer)
    });

    component.isEdit = true;
    component.designationId = '14';

    spyOn(service, 'updateDesignation').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should handle error on Designation add', fakeAsync(() => {
    component.addDesignationFormGroup = new FormGroup({
      name: new FormControl(testDesignationData.name),
      abbreviation: new FormControl(testDesignationData.abbreviation),
      canBeAssessor: new FormControl(testDesignationData.canBeAssessor),
      canBeReviewer: new FormControl(testDesignationData.canBeReviewer)
    });

    component.isEdit = false;
    component.designationId = '14';

    spyOn(service, 'addDesignation').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));
  it('should add Designation on valid form submission and navigate to the Designation route', fakeAsync(() => {
    component.addDesignationFormGroup = new FormGroup({
      name: new FormControl(testDesignationData.name),
      abbreviation: new FormControl(testDesignationData.abbreviation),
      canBeAssessor: new FormControl(testDesignationData.canBeAssessor),
      canBeReviewer: new FormControl(testDesignationData.canBeReviewer)
    });

    component.isEdit = false;
    component.designationId = '1';

    spyOn(service, 'addDesignation').and.returnValue(of({
      isSuccess: true,
      message: 'Designation add successfully',
      data: testDesignationData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Designation add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE]);
  }));
  it('should handle error when fetching Designation by ID', () => {
    spyOn(service, 'getDesignationById').and.returnValue(throwError('Error fetching Designation'));
    component.getDesignationById(14);
    expect(service.getDesignationById).toHaveBeenCalledWith(14);
    expect(component.addDesignationFormGroup.value).toEqual({
        name: "",
        abbreviation: "",
        canBeAssessor: false,
        canBeReviewer: false
    });
  });
  it('should set form group values on successful response with truthy data', () => {
    const id = 1;
    const mockDesignationData = {
      isSuccess: true,
      data: testDesignationData
    };
    spyOn(service, 'getDesignationById').and.returnValue(of(mockDesignationData));
    component.getDesignationById(id);
    expect(service.getDesignationById).toHaveBeenCalledWith(id);
    expect(component.addDesignationFormGroup.value).toEqual(testDesignationData);
  });
  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockDesignationData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getDesignationById').and.returnValue(of(mockDesignationData));
    component.getDesignationById(id);
    expect(service.getDesignationById).toHaveBeenCalledWith(id);
    expect(component.addDesignationFormGroup.value).toEqual({
      name: '',
      abbreviation: '',
      canBeAssessor: false,
      canBeReviewer: false
    });
  });
});
