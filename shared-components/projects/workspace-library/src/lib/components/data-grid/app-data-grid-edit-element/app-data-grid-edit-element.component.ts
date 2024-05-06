import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DataGridColumn } from '../../../models/data-grid-models/data-grid-column.config';
import { FormFieldType } from '../../../models/form.field';

@Component({
  selector: 'lib-data-grid-edit-element',
  templateUrl: './app-data-grid-edit-element.component.html',
  styleUrls: ['./app-data-grid-edit-element.component.css']
})
export class AppDataGridEditElementComponent<T> {
  @Input() formGroup!: FormGroup;
  @Input() column!: DataGridColumn<T>;
  @Input() rowData!: T | null;
  @Input() disabled!: boolean;
  @Input() gridFromGroup!: any;
  @Input() validationForForm !: string | undefined;
  isSubmitted: boolean = false;
  @Output() enterClickEvent = new EventEmitter<void>();
  @Input() index !: number;
  get shouldShowEditElement(): boolean | undefined {
    return this.column.editConfig && this.column.editConfig.isEditable;
  }
  get control(): AbstractControl | null {
    return this.formGroup.get(this.column.field as string);
  }

  get controlType(): FormFieldType | string {
        return 'text';
  }

  onEnterClick(): void {
    this.enterClickEvent.emit();
  }

  onInputValueChange(column: DataGridColumn<T>) {
    if (column?.editConfig?.textBoxValueChange) {
      column?.editConfig?.textBoxValueChange(column?.field?.toString()?.concat(`_${this.index?.toString()}`));
    }
  }
}
