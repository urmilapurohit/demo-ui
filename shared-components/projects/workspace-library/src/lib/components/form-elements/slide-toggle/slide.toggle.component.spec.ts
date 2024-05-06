import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { SlideToggleComponent } from './slide.toggle.component';
import { SlideToggel } from '../../../models/slide.toggel';
import { testSlideToggle } from '../testdata';

describe('SlideToggel', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideToggleComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });
    fixture = TestBed.createComponent(SlideToggleComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    const textFieldConfig: SlideToggel = testSlideToggle;
    component.config = textFieldConfig;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    component.ngOnInit();
    expect(component.config).toEqual(testSlideToggle);
  });

  it('should call change when slide toggle changes', () => {
    const slideToggleConfig: SlideToggel = testSlideToggle;
    const consoleSpy = spyOn(console, 'log');
    component.config = slideToggleConfig;

    const slideToggle = fixture.nativeElement.querySelector('mat-slide-toggle');
    slideToggle.dispatchEvent(new Event('change'));
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call click when slide toggle is clicked', () => {
    const slideToggleConfig: SlideToggel = testSlideToggle;
    const consoleSpy = spyOn(console, 'log');
    component.config = slideToggleConfig;

    const slideToggle = fixture.nativeElement.querySelector('mat-slide-toggle');
    slideToggle.dispatchEvent(new Event('click'));

    expect(consoleSpy).toHaveBeenCalled();
  });
});
