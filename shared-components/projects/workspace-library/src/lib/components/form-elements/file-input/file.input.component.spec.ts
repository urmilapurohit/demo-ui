/* eslint-disable no-underscore-dangle */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from './file.input.component';

describe('FileInputComponent', () => {
  let component: FileInputComponent;
  let fixture: ComponentFixture<FileInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileInputComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
    });

    fixture = TestBed.createComponent(FileInputComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should set error message when isSubmitted is true, no file is selected, and errorMessage is empty', () => {
    spyOn(component.selectedFileChange, 'emit');
    spyOn(component.errorMessageChange, 'emit');

    component._isSubmitted = true;
    component.isSubmitted = true;
    const event = {
      target: {
        files: null,
      },
    };
    component.onFileSelected(event);
    expect(component.errorMessage).toEqual('Please select file.');
  });
  it('should emit selected file when onFileSelected is called', () => {
    const file = new File(['file content'], 'test.txt');
    const event = {
      target: {
        files: [file],
      },
    };

    spyOn(component.selectedFileChange, 'emit');
    spyOn(component.errorMessageChange, 'emit');

    component.onFileSelected(event);

    expect(component.selectedFile).toEqual([file]);
    expect(component.selectedFileChange.emit).toHaveBeenCalledWith([file]);
    expect(component.errorMessageChange.emit).toHaveBeenCalledWith('');
  });

  it('should handle invalid file extension and emit error message', () => {
    const invalidFile = new File(['file content'], 'test.invalid');
    const event = {
      target: {
        files: [invalidFile],
      },
    };

    spyOn(component.selectedFileChange, 'emit');
    spyOn(component.errorMessageChange, 'emit');

    component.allowedExtensions = ['txt'];

    component.onFileSelected(event);
    expect(component.errorMessage).toEqual('Invalid file extension.');
  });

  it('should clear file input value', () => {
    const nativeElement = { value: 'test' };
    component.fileInput = { nativeElement };

    component.clearFiledata();

    expect(nativeElement.value).toEqual('');
  });
  it('should set error message when isSubmitted is true and no file is selected', () => {
    const fileInput = {
      nativeElement: {
        value: 'test',
      },
    };
    spyOn(component.selectedFileChange, 'emit');
    spyOn(component.errorMessageChange, 'emit');

    component.fileInput = fileInput;
    component._isSubmitted = true;
    component.isSubmitted = true;

    expect(component.errorMessage).toEqual('Please select file.');
    expect(component.errorMessageChange.emit).toHaveBeenCalledWith('Please select file.');
  });

  it('should not set error message when isSubmitted is true and file is selected', () => {
    const file = new File(['file content'], 'test.txt');
    const event = {
      target: {
        files: [file],
      },
    };
    component.onFileSelected(event);
    spyOn(component.selectedFileChange, 'emit');
    spyOn(component.errorMessageChange, 'emit');

    component._isSubmitted = true;
    component.isSubmitted = true;

    expect(component.errorMessage).toEqual('');
  });
});
