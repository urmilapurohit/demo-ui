import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { ToastMessageComponent } from './toast-message.component';

describe('ToastMessageComponent', () => {
  let component: ToastMessageComponent;
  let fixture: ComponentFixture<ToastMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastMessageComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(ToastMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have MatSnackBarRef and MAT_SNACK_BAR_DATA injected', () => {
    expect(component.snackBarRef).toBeTruthy();
    expect(component.data).toBeTruthy();
  });
});
