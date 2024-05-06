import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { AuthRoutingModule } from '../auth-routing.module';
import { AuthService } from '../../../common/services/auth.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let router: Router;
  let service: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        HttpClientModule, HttpClientTestingModule, RouterTestingModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        WorkspaceLibraryModule, BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    if (component.userName.onEnterPress) {
      component.userName.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSubmit Method on submit Button Click', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    component.submitBtnConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call route to login on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelBtnConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should send mail on valid form submission ', fakeAsync(() => {
    component.forgotPasswordForm = new FormGroup({
      username: new FormControl('test'),
    });

    spyOn(service, 'forgotPassword').and.returnValue(of({
      isSuccess: true,
      message: 'Password sent to user email',
      data: {}
    }));
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.submitBtnConfig.callback();

    expect(component.isLoading).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/login', { state: { message: "Password sent to user email" } });
  }));

  it('should not call service if form is invalid', () => {
    component.forgotPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
    });
    spyOn(service, 'forgotPassword');
    component.submitBtnConfig.callback();

    expect(component.isLoading).toBeFalse();
  });

  it('should handle error on forgot password error', fakeAsync(() => {
    component.forgotPasswordForm = new FormGroup({
      username: new FormControl('test'),
    });

    spyOn(service, 'forgotPassword').and.returnValue(throwError('Login Error'));

    component.submitBtnConfig.callback();

    expect(component.isLoading).toBeFalse();
  }));
});
