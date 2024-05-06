import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreModule } from '../../../../../common/common.module';
import { ROUTES } from '../../../../../common/constants/routes';
import { testEditEmailTemplateData, testEmailTemplateData } from '../../data/testData';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { EmailTemplateService } from '../../services/email.template.service';
import { EditEmailTemplateComponent } from './edit.email.template.component';

describe('EditEmailTemplateComponent', () => {
  let component: EditEmailTemplateComponent;
  let fixture: ComponentFixture<EditEmailTemplateComponent>;
  let router: Router;
  let service: EmailTemplateService;
  let globalService: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        BrowserModule,
        WorkspaceLibraryModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open'])
        },
      ],
      declarations: [EditEmailTemplateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditEmailTemplateComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(EmailTemplateService);
    component.emailTemplateId = '4';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.isEdit = true;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onSave Method on save button click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate to email template page on cancel button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE]);
  });

  it('should call getEmailTemplateById', () => {
    const consoleSpy = spyOn<any>(component, 'getEmailTemplateById');
    component.getEmailTemplateById(4);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 1;
    const mockEmailTemplateData = {
      isSuccess: true,
      data: testEditEmailTemplateData
    };
    spyOn(service, 'getEmailTemplateById').and.returnValue(of(mockEmailTemplateData));
    component.getEmailTemplateById(id);
    expect(service.getEmailTemplateById).toHaveBeenCalledWith(id);
    expect(component.editEmailTemplateFormGroup.value.name).toEqual(testEditEmailTemplateData.name);
    expect(component.editEmailTemplateFormGroup.value.subject).toEqual(testEditEmailTemplateData.subject);
    expect(component.editEmailTemplateFormGroup.value.templateData).toEqual(testEditEmailTemplateData.templateData);
    expect(component.editEmailTemplateFormGroup.value.token).toEqual(testEditEmailTemplateData.token);
  });

  it('should update email template on valid form submission and navigate to email template route', fakeAsync(() => {
    component.editEmailTemplateFormGroup = new FormGroup({
      name: new FormControl(testEditEmailTemplateData.name),
      subject: new FormControl(testEditEmailTemplateData.subject),
      templateData: new FormControl(testEditEmailTemplateData.templateData),
      token: new FormControl(testEditEmailTemplateData.token),
    });

    component.emailTemplateId = '1';

    spyOn(service, 'updateEmailTemplate').and.returnValue(of({
      isSuccess: true,
      message: 'Email template updated successfully',
      data: testEmailTemplateData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Email template updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_ABSOLUTE]);
  }));

  it('should handle error on email template update', fakeAsync(() => {
    component.editEmailTemplateFormGroup = new FormGroup({
      name: new FormControl(testEditEmailTemplateData.name),
      subject: new FormControl(testEditEmailTemplateData.subject),
      templateData: new FormControl(testEditEmailTemplateData.templateData),
      token: new FormControl(testEditEmailTemplateData.token),
    });

    component.emailTemplateId = '1';

    spyOn(service, 'updateEmailTemplate').and.returnValue(throwError('Update Failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error when fetching email template by id', () => {
    spyOn(service, 'getEmailTemplateById').and.returnValue(throwError('Error fetching email template'));
    component.getEmailTemplateById(4);
    expect(service.getEmailTemplateById).toHaveBeenCalledWith(4);
    expect(component.editEmailTemplateFormGroup.value).toEqual({
      name: '',
      subject: '',
      templateData: '',
      token: '',
      status: 'Active'
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 12;
    const mockEmailTemplateData = {
      isSuccess: true,
      data: testEditEmailTemplateData
    };
    spyOn(service, 'getEmailTemplateById').and.returnValue(of(mockEmailTemplateData));
    component.getEmailTemplateById(id);
    expect(service.getEmailTemplateById).toHaveBeenCalledWith(id);
    expect(component.editEmailTemplateFormGroup.value.name).toEqual(testEditEmailTemplateData.name);
    expect(component.editEmailTemplateFormGroup.value.subject).toEqual(testEditEmailTemplateData.subject);
    expect(component.editEmailTemplateFormGroup.value.templateData).toEqual(testEditEmailTemplateData.templateData);
    expect(component.editEmailTemplateFormGroup.value.token).toEqual(testEditEmailTemplateData.token);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockEmailTemplateData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getEmailTemplateById').and.returnValue(of(mockEmailTemplateData));
    component.getEmailTemplateById(id);
    expect(service.getEmailTemplateById).toHaveBeenCalledWith(id);
    expect(component.editEmailTemplateFormGroup.value).toEqual({
      name: '',
      subject: '',
      templateData: '',
      token: '',
      status: 'Active'
    });
  });
});
