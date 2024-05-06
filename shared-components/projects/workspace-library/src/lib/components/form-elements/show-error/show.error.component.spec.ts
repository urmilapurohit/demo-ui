import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowErrorComponent } from './show.error.component';

describe('ShowErrorComponent', () => {
  let component: ShowErrorComponent;
  let fixture: ComponentFixture<ShowErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowErrorComponent],
      imports: [ReactiveFormsModule, FormsModule], // Ensure to import necessary modules
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show errors when submit is true and formGroup is invalid', () => {
    component.submit = true;
    component.formGroup = new FormGroup({
      testControl: new FormControl('', Validators.required),
    });
    fixture.detectChanges();
    expect(component.shouldShowErrors()).toBe(true);
  });

  it('should not show errors when submit is true but formGroup is valid', () => {
    component.submit = true;
    component.formGroup = new FormGroup({
      testControl: new FormControl('validValue', Validators.required),
    });

    fixture.detectChanges();

    expect(component.shouldShowErrors()).toBe(false);
  });

  it('should return the list of errors correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*testControl is required.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('', Validators.required),
    });

    spyOn(formGroup.controls[controlName], 'getError').and.returnValue({ required: true });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });

  it('should handle specific error cases correctly', () => {
    const controlName = 'testControl';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('', Validators.required),
    });

    // Simulate a specific error case
    formGroup.controls[controlName].setErrors({
      matDatepickerParse: { text: 'Invalid Date' },
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain('*Invalid Date.');
  });
  it('should handle matDatepickerMax error case correctly', () => {
    const controlName = 'testControl';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('', Validators.required),
    });

    // Simulate the matDatepickerMax error
    formGroup.controls[controlName].setErrors({
      matDatepickerMax: true,
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(`*${controlName}Date Not Valid.`);
  });
  it('should handle required error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = `*${controlName} is required.`;
    const formGroup = new FormGroup({
      [controlName]: new FormControl('', Validators.required),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle email error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*Please enter a valid e-mail address.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('invalid-email', Validators.email),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle minlength error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*Min 5 characters is required.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('1234', Validators.minLength(5)),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle maxlength error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*Max 10 characters is Allowed.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('12345678901', Validators.maxLength(10)),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle pattern error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*testControl pattern is wrong.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl('invalid_pattern', Validators.pattern(/^[a-zA-Z0-9]*$/)),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle max error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*Value can\'t be more than 100.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl(150, Validators.max(100)),
    });

    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
  it('should handle min error case correctly', () => {
    const controlName = 'testControl';
    const errorMessage = '*Value can\'t be  less than 0.';
    const formGroup = new FormGroup({
      [controlName]: new FormControl(-5, Validators.min(0)),
    });
    component.ctrl = controlName;
    component.formGroup = formGroup;

    const errors = component.listOfErrors();

    expect(errors).toContain(errorMessage);
  });
});
