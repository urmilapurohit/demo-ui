import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../../../common/common.module';
import { ROUTES } from '../../../../../../common/constants/routes';
import { TechnologyService } from '../../services/technology.service';
import { AddTechnologyComponent } from './add.technology.component';
import { testAddTechnologyData, testTechnologyData } from '../../data/testdata';

describe('AddTechnologyComponent', () => {
  let component: AddTechnologyComponent;
  let fixture: ComponentFixture<AddTechnologyComponent>;
  let service: TechnologyService;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTechnologyComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        ReactiveFormsModule,
        WorkspaceLibraryModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddTechnologyComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(TechnologyService);
    component.technologyId = '14';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.isEdit = true;
    component.ngOnInit();
  });

  it('should initialize the form', () => {
    expect(component.addTechnologyFormGroup).toBeDefined();
    expect(component.addTechnologyFormGroup.controls['name']).toBeDefined();
    expect(component.addTechnologyFormGroup.controls['displayOrder']).toBeDefined();
  });

  it('should call onSubmit Method on Enter press Name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on Enter press Display Order field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.displayOrder.onEnterPress) {
      component.displayOrder.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on Save Button click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate back to technology page on Cancel  Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]);
  });

  it('should set form group values on successful response', () => {
    const id = 1;
    const mockDepartmentData = {
      isSuccess: true,
      data: testAddTechnologyData
    };
    spyOn(service, 'getTechnologyById').and.returnValue(of(mockDepartmentData));
    component.getTechnologyById(id);
    expect(service.getTechnologyById).toHaveBeenCalledWith(id);
    expect(component.addTechnologyFormGroup.value).toEqual(testTechnologyData);
  });

  it('should update technology on valid form submission and navigate to the technology route', fakeAsync(() => {
    component.addTechnologyFormGroup = new FormGroup({
      name: new FormControl(testTechnologyData.name),
      displayOrder: new FormControl(testTechnologyData.displayOrder)
    });

    component.isEdit = true;
    component.technologyId = '1';

    spyOn(service, 'updateTechnology').and.returnValue(of({
      isSuccess: true,
      message: 'Technology updated successfully',
      data: testTechnologyData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technology updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]);
  }));

  it('should add Technology on valid form submission ', fakeAsync(() => {
    component.addTechnologyFormGroup = new FormGroup({
      name: new FormControl(testTechnologyData.name),
      displayOrder: new FormControl(testTechnologyData.displayOrder)
    });

    component.isEdit = false;
    component.technologyId = '1';

    spyOn(service, 'addTechnology').and.returnValue(of({
      isSuccess: true,
      message: 'Technology added successfully',
      data: testTechnologyData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technology added successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]);
  }));

  it('should handle error on Technology update', fakeAsync(() => {
    component.addTechnologyFormGroup = new FormGroup({
      name: new FormControl(testTechnologyData.name),
      displayOrder: new FormControl(testTechnologyData.displayOrder),
    });

    component.isEdit = true;
    component.technologyId = '14';

    spyOn(service, 'updateTechnology').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on Technology add', fakeAsync(() => {
    component.addTechnologyFormGroup = new FormGroup({
      name: new FormControl(testTechnologyData.name),
      displayOrder: new FormControl(testTechnologyData.displayOrder),
    });

    component.isEdit = false;
    component.technologyId = '14';

    spyOn(service, 'addTechnology').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add Technology on valid form submission and navigate to the Technology route', fakeAsync(() => {
    component.addTechnologyFormGroup = new FormGroup({
      name: new FormControl(testTechnologyData.name),
      displayOrder: new FormControl(testTechnologyData.displayOrder),
    });

    component.isEdit = false;
    component.technologyId = '1';

    spyOn(service, 'addTechnology').and.returnValue(of({
      isSuccess: true,
      message: 'Technology add successfully',
      data: testTechnologyData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technology add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]);
  }));

  it('should handle error when fetching technology by ID', () => {
    spyOn(service, 'getTechnologyById').and.returnValue(throwError('Error fetching department'));
    component.getTechnologyById(14);
    expect(service.getTechnologyById).toHaveBeenCalledWith(14);
    expect(component.addTechnologyFormGroup.value).toEqual({
      name: '',
      displayOrder: null,
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 12;
    const mockTechnologyData = {
      isSuccess: true,
      data: testTechnologyData
    };
    spyOn(service, 'getTechnologyById').and.returnValue(of(mockTechnologyData));
    component.getTechnologyById(id);
    expect(service.getTechnologyById).toHaveBeenCalledWith(id);
    expect(component.addTechnologyFormGroup.value).toEqual(testTechnologyData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockTechnologyData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getTechnologyById').and.returnValue(of(mockTechnologyData));
    component.getTechnologyById(id);
    expect(service.getTechnologyById).toHaveBeenCalledWith(id);
    expect(component.addTechnologyFormGroup.value).toEqual({
      name: '',
      displayOrder: null
    });
  });
});
