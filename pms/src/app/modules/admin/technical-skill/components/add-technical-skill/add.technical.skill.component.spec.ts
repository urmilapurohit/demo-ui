import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ROUTES } from '../../../../../common/constants/routes';
import { addTechnicalSkillData, technicalSkillData } from '../../data/testData';
import { TechnicalSkillService } from '../../services/technical.skill.service';
import { AddTechnicalSkillComponent } from './add.technical.skill.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';

describe('AddTechnicalSkillComponent', () => {
  let component: AddTechnicalSkillComponent;
  let fixture: ComponentFixture<AddTechnicalSkillComponent>;
  let router: Router;
  let service: TechnicalSkillService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddTechnicalSkillComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddTechnicalSkillComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(TechnicalSkillService);
    component = fixture.componentInstance;
    component.technicalSkillId = '2';
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

  it('should navigate to technical skill page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/technical-skills']);
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

  it('should call getTechnicalSkillById ', () => {
    const consoleSpy = spyOn(component, 'getTechnicalSkillById');
    component.getTechnicalSkillById(2);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 2;
    const mockTechnicalSkillData = {
      isSuccess: true,
      data: addTechnicalSkillData
    };
    spyOn(service, 'getTechnicalSkillById').and.returnValue(of(mockTechnicalSkillData));
    component.getTechnicalSkillById(id);
    expect(service.getTechnicalSkillById).toHaveBeenCalledWith(id);
    expect(component.addTechnicalSkillFormGroup.value).toEqual(addTechnicalSkillData);
  });

  it('should update technical skill on valid form submission and navigate to the technical skill route', fakeAsync(() => {
    component.addTechnicalSkillFormGroup = new FormGroup({
      name: new FormControl(technicalSkillData.name),
      status: new FormControl(technicalSkillData.status),
      abbreviation: new FormControl(technicalSkillData.abbreviation)
    });

    component.isEdit = true;
    component.technicalSkillId = '2';

    spyOn(service, 'updateTechnicalSkill').and.returnValue(of({
      isSuccess: true,
      message: 'Technical Skill updated successfully',
      data: technicalSkillData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technical Skill updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE]);
  }));

  it('should add technical skill on valid form submission ', fakeAsync(() => {
    component.addTechnicalSkillFormGroup = new FormGroup({
      name: new FormControl(technicalSkillData.name),
      status: new FormControl(technicalSkillData.status),
      abbreviation: new FormControl(technicalSkillData.abbreviation)
    });

    component.isEdit = false;
    component.technicalSkillId = '2';

    spyOn(service, 'addTechnicalSkill').and.returnValue(of({
      isSuccess: true,
      message: 'Technical skill add successfully',
      data: technicalSkillData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technical skill add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE]);
  }));

  it('should handle error on technical skill update', fakeAsync(() => {
    component.addTechnicalSkillFormGroup = new FormGroup({
      name: new FormControl(technicalSkillData.name),
      status: new FormControl(technicalSkillData.status),
      abbreviation: new FormControl(technicalSkillData.abbreviation)
    });

    component.isEdit = true;
    component.technicalSkillId = '2';

    spyOn(service, 'updateTechnicalSkill').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on technical skill add', fakeAsync(() => {
    component.addTechnicalSkillFormGroup = new FormGroup({
      name: new FormControl(technicalSkillData.name),
      status: new FormControl(technicalSkillData.status),
      abbreviation: new FormControl(technicalSkillData.abbreviation)
    });

    component.isEdit = false;
    component.technicalSkillId = '2';

    spyOn(service, 'addTechnicalSkill').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add technical skill on valid form submission and navigate to the technical skill route', fakeAsync(() => {
    component.addTechnicalSkillFormGroup = new FormGroup({
      name: new FormControl(technicalSkillData.name),
      status: new FormControl(technicalSkillData.status),
      abbreviation: new FormControl(technicalSkillData.abbreviation)
    });

    component.isEdit = false;
    component.technicalSkillId = '2';

    spyOn(service, 'addTechnicalSkill').and.returnValue(of({
      isSuccess: true,
      message: 'Technical skill add successfully',
      data: technicalSkillData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Technical skill add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE]);
  }));

  it('should handle error when fetching technical skill by ID', () => {
    spyOn(service, 'getTechnicalSkillById').and.returnValue(throwError('Error fetching technical skill'));
    component.getTechnicalSkillById(2);
    expect(service.getTechnicalSkillById).toHaveBeenCalledWith(2);
    expect(component.addTechnicalSkillFormGroup.value).toEqual({
      name: '',
      abbreviation: ''
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 2;
    const mockTechnicalSkillData = {
      isSuccess: true,
      data: addTechnicalSkillData
    };
    spyOn(service, 'getTechnicalSkillById').and.returnValue(of(mockTechnicalSkillData));
    component.getTechnicalSkillById(id);
    expect(service.getTechnicalSkillById).toHaveBeenCalledWith(id);
    expect(component.addTechnicalSkillFormGroup.value).toEqual(addTechnicalSkillData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockTechnicalSkillData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getTechnicalSkillById').and.returnValue(of(mockTechnicalSkillData));
    component.getTechnicalSkillById(id);
    expect(service.getTechnicalSkillById).toHaveBeenCalledWith(id);
    expect(component.addTechnicalSkillFormGroup.value).toEqual({
      name: '',
      abbreviation: ''
    });
  });
});
