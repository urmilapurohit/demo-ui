import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthRoutingModule } from '../auth-routing.module';
import { MaterialModule } from '../../../common/material/material.module';
import { LogInTestData } from '../data/testdata';
import { AuthService } from '../../../common/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule,
        AuthRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        WorkspaceLibraryModule, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    component.ngOnInit();
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
  it('should call onSubmit Method on Login Button Click', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    component.logInBtnConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });
  it('should call onSubmit Method on Enter press password field', () => {
    const saveSpy = spyOn<any>(component, 'onSubmit');
    if (component.password.onEnterPress) {
      component.password.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });
  it('should login on valid form submission ', fakeAsync(() => {
    component.loginForm = new FormGroup({
      username: new FormControl('test'),
      password: new FormControl('test'),
    });

    spyOn(service, 'login').and.returnValue(of({
      isSuccess: true,
      message: 'User logged in successfully',
      data: LogInTestData
    }));
    component.logInBtnConfig.callback();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on login error', fakeAsync(() => {
    component.loginForm = new FormGroup({
      username: new FormControl('test'),
      password: new FormControl('test'),
    });

    spyOn(service, 'login').and.returnValue(throwError('Login Error'));

    component.logInBtnConfig.callback();

    expect(component.loading).toBeFalse();
  }));

  it('should not call service if form is invalid', () => {
    component.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    spyOn(service, 'login');
    component.logInBtnConfig.callback();

    expect(component.loading).toBeFalse();
  });
});
