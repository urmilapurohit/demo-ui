import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import {
  ButtonComponent,
  CheckboxComponent,
  DateFieldComponent,
  FileInputComponent,
  FormFieldComponent,
  ShowErrorComponent,
  SlideToggleComponent,
  TextAreaComponent,
  TextFieldComponent,
  DropdownComponent,
} from './components/form-elements/form.elements.index';
import { MaterialModule } from './material/material.module';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { GlobalService } from './services/global.service';
import { AppDataGridComponent } from './components/data-grid/app-data-grid/app-data-grid.component';
import { AppDataGridElementComponent } from './components/data-grid/app-data-grid-element/app-data-grid-element.component';
import { AppDataGridActionElementComponent } from './components/data-grid/app-data-grid-action-element/app-data-grid-action-element.component';
import { AppDataGridEditElementComponent } from './components/data-grid/app-data-grid-edit-element/app-data-grid-edit-element.component';
import { DataGridCustomComponent } from './components/data-grid/data-grid-custom/data-grid-custom.component';
import { RadiobuttonComponent } from './components/form-elements/radiobutton/radiobutton.component';
import { AutoCompleteComponent } from './components/form-elements/auto-complete/auto.complete.component';
import { YearPickerComponent } from './components/form-elements/date-field/year-picker/year.picker.component';
import { DatePickerComponent } from './components/form-elements/date-field/date-picker/date.picker.component';
import { NumberOnlyDirective } from './directives/number.only.directive';

@NgModule({
  declarations: [
    ToastMessageComponent,
    ButtonComponent,
    CheckboxComponent,
    DateFieldComponent,
    FileInputComponent,
    FormFieldComponent,
    ShowErrorComponent,
    SlideToggleComponent,
    TextAreaComponent,
    TextFieldComponent,
    DropdownComponent,
    ConfirmationComponent,
    AppDataGridActionElementComponent,
    AppDataGridEditElementComponent,
    AppDataGridElementComponent,
    AppDataGridComponent,
    DataGridCustomComponent,
    DataGridCustomComponent,
    RadiobuttonComponent,
    AutoCompleteComponent,
    YearPickerComponent,
    DatePickerComponent,
    NumberOnlyDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgxMatSelectSearchModule,
  ],
  exports: [
    ToastMessageComponent,
    ButtonComponent,
    CheckboxComponent,
    DateFieldComponent,
    FileInputComponent,
    FormFieldComponent,
    ShowErrorComponent,
    SlideToggleComponent,
    TextAreaComponent,
    TextFieldComponent,
    DropdownComponent,
    ConfirmationComponent,
    AppDataGridComponent,
    AppDataGridEditElementComponent,
    DataGridCustomComponent,
    NgxSkeletonLoaderModule,
    RadiobuttonComponent,
    AutoCompleteComponent,
    DatePickerComponent,
    YearPickerComponent
  ],
  providers: [
    GlobalService
  ],
})
export class WorkspaceLibraryModule { }
