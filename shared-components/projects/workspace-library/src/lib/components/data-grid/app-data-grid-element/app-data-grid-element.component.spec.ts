import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { AppDataGridElementComponent } from './app-data-grid-element.component';
import { DataGridFieldType, DataGridFieldDataType } from '../../../models/data-grid-models/data-grid-column.config';
import { DataGridService } from '../../../services/datagrid.service';

describe('AppDataGridElementComponent', () => {
  let component: AppDataGridElementComponent<any>;
  let fixture: ComponentFixture<AppDataGridElementComponent<any>>;
  let dataGridServiceSpy: jasmine.SpyObj<DataGridService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataGridService', ['getDeepNestedCopy']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppDataGridElementComponent],
      providers: [{ provide: DataGridService, useValue: spy }],
    });
    fixture = TestBed.createComponent(AppDataGridElementComponent);
    component = fixture.componentInstance;
    dataGridServiceSpy = TestBed.inject(DataGridService) as jasmine.SpyObj<DataGridService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return "Link" for DataGridFieldType.link', () => {
    component.column = { fieldType: DataGridFieldType.link };
    const result = component.displayType;
    expect(result).toEqual('Link');
  });

  it('should return "Normal" for DataGridFieldType.data', () => {
    component.column = { fieldType: DataGridFieldType.data };
    const result = component.displayType;
    expect(result).toEqual('Normal');
  });

  it('should return "Icon" for DataGridFieldType.icon', () => {
    component.column = { fieldType: DataGridFieldType.icon };
    const result = component.displayType;
    expect(result).toEqual('Icon');
  });

  it('should return undefined for an unknown field type', () => {
    component.column = { fieldType: 'UnknownType' as unknown as DataGridFieldType };
    const result = component.displayType;
    expect(result).toBeUndefined();
  });
  it('should return customToolTip from row data', () => {
    const customToolTip = 'Custom Tooltip';
    dataGridServiceSpy.getDeepNestedCopy.and.returnValue({ customToolTip });
    component.column = { customToolTip: true }; // Assuming customToolTip is enabled for the column
    component.rowData = { customToolTip: 'Custom Tooltip' };
    const tooltip = component.toolTip;
    expect(tooltip).toEqual(customToolTip);
  });

  it('should return empty string for toolTip if customToolTip is not enabled', () => {
    component.column = { customToolTip: false }; // Assuming customToolTip is not enabled for the column
    // Handle undefined case in getDeepNestedCopy
    dataGridServiceSpy.getDeepNestedCopy.and.callFake((data) => {
      if (data === undefined) {
        return data;
      }
      return JSON.parse(JSON.stringify(data));
    });

    const tooltip = component.toolTip;
    expect(tooltip).toEqual('');
  });
  it('should return empty string for toolTip if row data is not available', () => {
    component.column = { customToolTip: true }; // Assuming customToolTip is enabled for the column
    component.rowData = null;
    const tooltip = component.toolTip;
    expect(tooltip).toEqual('');
  });

  it('should have setCustomStyleRed as false', () => {
    expect(component.setCustomStyleRed).toBeFalsy();
  });

  it('should have setCustomStyleDarkBlue as false', () => {
    expect(component.setCustomStyleDarkBlue).toBeFalsy();
  });

  it('should have setCustomStyleGreen as false', () => {
    expect(component.setCustomStyleGreen).toBeFalsy();
  });
  it('should invoke column callback when defined', () => {
    const mockCallback = jasmine.createSpy('mockCallback');
    component.column = { callback: mockCallback };
    component.rowData = { /* your row data */ };

    component.cellClickCallback();

    expect(mockCallback).toHaveBeenCalledWith(component.rowData);
  });

  it('should not invoke column callback when undefined', () => {
    const mockCallback = jasmine.createSpy('mockCallback');
    component.column = { callback: undefined };
    component.rowData = { /* your row data */ };

    component.cellClickCallback();

    expect(mockCallback).not.toHaveBeenCalled();
  });
  it('should set dataToShow for link or string or number field type', () => {
    component.column = { fieldType: DataGridFieldType.link, fieldDataType: DataGridFieldDataType.string, field: 'exampleField'};
    component.formGroup = new FormGroup({
      exampleField: new FormControl('exampleValue'),
    });
    component.setDataToShow();
    expect(component.dataToShow).toEqual('exampleValue');
  });

  it('should set dataToShow for boolean field type (true)', () => {
    component.column = { fieldDataType: DataGridFieldDataType.boolean, field: 'exampleField'};
    component.formGroup = new FormGroup({
      exampleField: new FormControl(true),
    });
    component.setDataToShow();
    expect(component.dataToShow).toEqual('Yes');
  });

  it('should set dataToShow for boolean field type (false)', () => {
    component.column = { fieldDataType: DataGridFieldDataType.boolean, field: 'exampleField' };
    component.formGroup = new FormGroup({
      exampleField: new FormControl(false),
    });

    component.setDataToShow();

    expect(component.dataToShow).toEqual('No');
  });

  it('should set dataToShow for date field type when date is present', () => {
    component.column = { fieldDataType: DataGridFieldDataType.date, field: 'exampleField' };
    component.formGroup = new FormGroup({
      exampleField: new FormControl(new Date()),
    });

    component.setDataToShow();

    expect(component.dataToShow).toEqual('');
  });
});
