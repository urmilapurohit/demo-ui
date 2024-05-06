import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { DateFieldComponent } from './date.field.component';

describe('Datefield', () => {
  let component: DateFieldComponent;
  let fixture: ComponentFixture<DateFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateFieldComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });

    fixture = TestBed.createComponent(DateFieldComponent);
    component = fixture.componentInstance;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
