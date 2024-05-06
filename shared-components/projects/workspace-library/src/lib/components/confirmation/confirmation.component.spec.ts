import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation.component';
import { IConfirmationModalData } from '../../models/confirmation';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { /* mock your data here */ } as IConfirmationModalData
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close when dialogAction is called with an action', () => {
    const action = 'confirm';
    component.dialogAction(action);
    const dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmationComponent>>;
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ data: action });
  });

  it('should call dialogRef.close when dialogAction is called without an action', () => {
    component.dialogAction();
    const dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmationComponent>>;
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ data: undefined });
  });
});
