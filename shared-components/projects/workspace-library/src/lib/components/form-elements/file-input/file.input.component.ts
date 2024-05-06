/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { FileInput } from '../../../models/file.input.model';
import { validateFile } from '../../../validators/file.validator';

@Component({
  selector: 'lib-file-input',
  templateUrl: './file.input.component.html',
  styleUrl: './file.input.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class FileInputComponent {
  @Input() config!: FileInput;
  @Input() allowedExtensions: string[] = [];
  selectedFile: File[] | null = null;
  @Input() errorMessage: string = '';
  @Input() fileList: { id: number, name: string }[] = [];
  _isSubmitted: boolean = false;
  @Input()
  set isSubmitted(value: boolean) {
    this._isSubmitted = value;
    if (this._isSubmitted && !this.errorMessage.length && !this.selectedFile && !this.fileList.length) {
      this.validate();
    }
  }

  isValid: boolean = false;
  @Output() selectedFileChange = new EventEmitter<File[] | null>();
  @Output() errorMessageChange = new EventEmitter<string>();
  @Output() fileErrorStatusChanged = new EventEmitter<boolean>();
  @Output() previewFile = new EventEmitter<{ id: number, name: string }>();
  @Output() deleteFile = new EventEmitter<number>();

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;

  constructor(private cd: ChangeDetectorRef) { } // Inject ChangeDetectorRef

  onFileSelected(event: any) {
    const file: File[] = event.target.files;
    this.errorMessage = '';
    this.selectedFile = file;
    this.selectedFileChange.emit(this.selectedFile);
    this.validate();
  }

  clearFileData() {
    this.errorMessage = '';
    this.selectedFile = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
      this.cd.detectChanges();
    }
  }

  validate() {
    this.errorMessage = validateFile(this.selectedFile, this.config.allowedExtensions, this.config.maxSize, this.config.isRequired);
    this.errorMessageChange.emit(this.errorMessage);
    this.fileErrorStatusChanged.emit(!!this.errorMessage);
  }

  onPreview(file: { id: number, name: string }) {
    this.previewFile.emit(file);
  }

  onDelete(index: number) {
    this.deleteFile.emit(index);
  }
}
