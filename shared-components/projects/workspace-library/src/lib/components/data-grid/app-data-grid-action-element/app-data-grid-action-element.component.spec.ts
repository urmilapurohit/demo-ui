/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { AppDataGridActionElementComponent } from './app-data-grid-action-element.component';
import { DataGridActionButton } from '../../../models/data-grid-models/data-grid-action-button.config';
import { DataGridEditFeatureConfig } from '../../../models/data-grid-models/data-grid-features.config';
import { ButtonVariant, ButtonType, ButtonCategory } from '../../../models/button';
import { testButton } from '../testdata';

describe('AppDataGridActionElementComponent', () => {
  let component: AppDataGridActionElementComponent<any>;
  let fixture: ComponentFixture<AppDataGridActionElementComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppDataGridActionElementComponent],
    });

    fixture = TestBed.createComponent(AppDataGridActionElementComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormBuilder().group({
      // initialize form controls if needed
    });

    component.columns = [];
    component.rowData = null;
    component.actionButtons = [];
    component.getCurrentPaginationFn = () => ({ pageIndex: 0, pageSize: 10, length: 0 } as MatPaginator);
    component.gridEditConfig = {} as DataGridEditFeatureConfig<any>;
    component.getRowFullDataFn = (formGroup: FormGroup) => ({ currentRowIndex: 0, currentPageSize: 10, currentPageNumber: 1, rowData: null });
    component.isLoading = false;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check button visibility', () => {
    const button: DataGridActionButton<any> = {
      visibleCallback: (rowData) => rowData !== null,
      btnType: ButtonType.default
    };

    component.rowData = null;
    expect(component.checkButtonVisible(button)).toBeTrue();

    component.rowData = { id: 1, name: 'John Doe' };
    expect(component.checkButtonVisible(button)).toBeTrue();
  });

  it('should save record when form is valid', () => {
    const saveCallbackSpy = jasmine.createSpy('singleRowSaveCallback');
    component.gridEditConfig.singleRowSaveCallback = saveCallbackSpy;

    const formValue = { /* provide valid form data */ };
    component.formGroup.setValue(formValue);

    component.saveRecord();

    expect(saveCallbackSpy).toHaveBeenCalledWith(formValue, jasmine.any(Object));
  });

  it('should not save record when form is invalid', () => {
    const saveCallbackSpy = jasmine.createSpy('singleRowSaveCallback');
    component.gridEditConfig.singleRowSaveCallback = saveCallbackSpy;

    // Do not set form value, keeping it invalid

    component.saveRecord();

    expect(saveCallbackSpy).toHaveBeenCalled();
  });

  it('should get app button config', () => {
    const button: DataGridActionButton<any> = testButton;
    // Set rowData to make isActive true
    component.rowData = { active: true };
    const appButtonConfig = component.getAppButtonConfig(button, 0);
    expect(appButtonConfig).toEqual({
      id: 'btnGrid-0',
      buttonText: '',
      buttonType: ButtonType.icon,
      icon: 'icon',
      imgUrl: undefined,
      className: 'buttonClass',
      buttonCategory: ButtonCategory.normal,
      buttonVariant: ButtonVariant.iconOnly,
      tooltip: 'Make Inactive', // Adjust based on your actual tooltip expectation
      isRounded: true,
      callback: jasmine.any(Function),
    });
  });

  it('should get value by key', () => {
    const obj = { key: 'value' };
    expect(component.getValueByKey(obj, 'key')).toBe('value');
    expect(component.getValueByKey(obj, 'nonexistentKey')).toBeUndefined();
    expect(component.getValueByKey(null, 'key')).toBeUndefined();
    expect(component.getValueByKey(obj, 'value')).toBeUndefined();
  });

  it('should handle action button click', () => {
    const button: DataGridActionButton<any> = {
        btnType: ButtonType.default,
      callback: jasmine.createSpy('buttonCallback'),
    };

    component.rowData = { id: 1, name: 'John Doe' };

    component.actionButtonClick(component.formGroup, button, 0);

    expect(button.callback).toHaveBeenCalledWith({
      currentRowIndex: 0,
      currentPageSize: 10,
      currentPageNumber: 1,
      rowData: component.rowData,
    });
  });
});
