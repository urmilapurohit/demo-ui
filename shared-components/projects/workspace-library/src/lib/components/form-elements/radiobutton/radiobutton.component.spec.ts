import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { RadiobuttonComponent } from './radiobutton.component';
import { MaterialModule } from '../../../material/material.module';
import { testRadioConfig } from '../testdata';

describe('RadiobuttonComponent', () => {
  let component: RadiobuttonComponent;
  let fixture: ComponentFixture<RadiobuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiobuttonComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiobuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    component.ngOnInit();
  });
  it('should call config.change method on radio button change', () => {
    const matRadioChange: MatRadioChange = {
      source: null!,
      value: 'selectedValue',
    };
    component.config = testRadioConfig;

    component.change(matRadioChange);

    expect(testRadioConfig.change).toHaveBeenCalledWith(matRadioChange, 'testRadio');
  });
});
