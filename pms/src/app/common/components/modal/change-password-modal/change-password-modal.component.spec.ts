import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalService, PasswordValidator, WorkspaceLibraryModule } from 'workspace-library';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CoreModule } from '../../../common.module';
import { ChangePasswordModalComponent } from './change-password-modal.component';
import { AuthService } from '../../../services/auth.service';

describe('ChangePasswordModalComponent', () => {
  let component: ChangePasswordModalComponent;
  let fixture: ComponentFixture<ChangePasswordModalComponent>;
  let service: AuthService;
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  let globalService: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordModalComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        ReactiveFormsModule,
        WorkspaceLibraryModule, BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordModalComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.changePasswordFormGroup).toBeDefined();
    expect(component.changePasswordFormGroup.controls['oldPassword']).toBeDefined();
    expect(component.changePasswordFormGroup.controls['newPassword']).toBeDefined();
    expect(component.changePasswordFormGroup.controls['confirmPassword']).toBeDefined();
  });

  it('should call onSubmit Method on Enter press old password field', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    if (component.oldPassword.onEnterPress) {
      component.oldPassword.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on Enter press new password field', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    if (component.newPassword.onEnterPress) {
      component.newPassword.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on Enter press confirm password field', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    if (component.confirmPassword.onEnterPress) {
      component.confirmPassword.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on Change Password Button Click', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    component.changePasswordButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should close Modal on Cancel  Button Click', () => {
    component.cancelButtonConfig.callback();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call onSubmit when form is valid and onSubmit is called', () => {
    component.changePasswordFormGroup = new FormGroup({
      oldPassword: new FormControl('test'),
      newPassword: new FormControl('test'),
      confirmPassword: new FormControl('test')
    });

    spyOn(globalService, 'openSnackBar');

    spyOn(service, 'changePassword').and.returnValue(of({
      isSuccess: true,
      message: 'Password changes successfully',
      data: {}
    }));
    component.changePasswordButtonConfig.callback();
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should handle error in  onSubmit when form is valid and onSubmit is called', () => {
    component.changePasswordFormGroup = new FormGroup({
      oldPassword: new FormControl('test'),
      newPassword: new FormControl('test'),
      confirmPassword: new FormControl('test')
    });

    spyOn(service, 'changePassword').and.returnValue(throwError('Change Password error'));
    component.changePasswordButtonConfig.callback();
    expect(component.isLoading).toBeFalse();
  });

  it('should not call service if form is invalid', () => {
    component.changePasswordFormGroup = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('test', [Validators.required, PasswordValidator]),
      confirmPassword: new FormControl('test', [Validators.required])
    });

    spyOn(service, 'changePassword');
    component.changePasswordButtonConfig.callback();

    expect(service.changePassword).not.toHaveBeenCalled();

    expect(component.isLoading).toBeFalse();
  });
});
