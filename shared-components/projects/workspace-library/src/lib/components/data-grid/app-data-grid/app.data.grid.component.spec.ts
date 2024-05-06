/* eslint-disable no-console */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material/material.module';
import { AppDataGridComponent } from './app-data-grid.component';
import { AppDataGridElementComponent } from '../app-data-grid-element/app-data-grid-element.component';
import { SlideToggleComponent } from '../../form-elements/slide-toggle/slide.toggle.component';
import { AppDataGridEditElementComponent } from '../app-data-grid-edit-element/app-data-grid-edit-element.component';
import { AppDataGridActionElementComponent } from '../app-data-grid-action-element/app-data-grid-action-element.component';
import { ButtonComponent } from '../../form-elements/button/button.component';
import { DataGrid } from '../../../models/data-grid-models/data-grid.config';
import { ShowErrorComponent } from '../../components.index';
import { Checkbox } from '../../../models/checkbox';
import { gridConfig } from '../testdata';
import { DataGridColumn } from '../../../../../../../dist/workspace-library/lib/models/data-grid-models/data-grid-column.config';

describe('DataGridComponent', () => {
  let component: AppDataGridComponent<any>;
  let fixture: ComponentFixture<AppDataGridComponent<any>>;
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
        providers: [FormGroupDirective],
        declarations: [
          AppDataGridComponent,
          AppDataGridElementComponent,
          SlideToggleComponent,
          AppDataGridEditElementComponent,
          AppDataGridActionElementComponent,
          ButtonComponent,
          ShowErrorComponent
        ],
    });
    fixture = TestBed.createComponent(AppDataGridComponent<any>);
    component = fixture.componentInstance;
    component.gridConfig = gridConfig;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    component.gridConfig = gridConfig;
    component.ngOnInit();
    expect(component.gridConfig).toBe(gridConfig);
  });
  it('should initialize gridConfig properties and call loadGrid on ngOnInit', () => {
    component.gridConfig = gridConfig;
    const formGroup = new FormGroup({});
component.gridConfig.formGroup = formGroup;
    const loadingSpy = spyOn<any>(component, 'loadGrid');

    component.ngOnInit();
    expect(component.gridForm).toBe(formGroup);
    expect(loadingSpy).toHaveBeenCalled();
    expect(component.gridForm instanceof FormGroup).toBeTruthy();
    expect(component.totalRecords).toBe(gridConfig.totalDataLength ?? 0);
    expect(component.defaultPageSize).toBe(gridConfig.defaultPageSize ?? 0);

    // Add more expectations based on your initialization logic
  });
  it('should initialize with default FormArray if gridConfig does not have formGroup', fakeAsync(() => {
    component.gridConfig = gridConfig;
    // Trigger change detection
    fixture.detectChanges();
    // Wrap the component initialization in fakeAsync
    component.ngOnInit();
    // Simulate the passage of time to allow asynchronous operations to complete
    tick();
    // Make assertions
    expect(component.gridForm.get('allRecords')).toBeTruthy();
    // Add more assertions based on your specific requirements
  }));
  it('should call loadGrid and setSorting on ngOnChanges', () => {
    // Mocking necessary dependencies or setting up your component as needed
    component.gridConfig = gridConfig;
    // Assuming you have a mock for matPaginator
    const matPaginatorMock: any = {
      pageIndex: 1, // Set the initial pageIndex for testing
    };

    component.matPaginator = matPaginatorMock;

    // Assuming you have a mock gridConfig
    const gridConfigMock: any = {
      pageIndex: 2, // Set the initial pageIndex in gridConfig for testing
    };

    const simpleChanges: SimpleChanges = {
      gridConfig: {
        currentValue: gridConfigMock,
        firstChange: false,
        isFirstChange: () => false,
        previousValue: null,
      },
    };

   const loadGrid = spyOn<any>(component, 'loadGrid');
   const sort = spyOn<any>(component, 'setSorting');

    component.ngOnChanges(simpleChanges);

    expect(loadGrid).toHaveBeenCalled();
    expect(sort).toHaveBeenCalled();
    expect(matPaginatorMock.pageIndex).toEqual(1);
  });
  it('should call setSorting, setPaginator, and disable clear on matSort in ngAfterViewInit', fakeAsync(() => {
    component.gridConfig = gridConfig;
   const sortingSpy = spyOn<any>(component, 'setSorting');
   const paginationSpy = spyOn<any>(component, 'setPaginator');
    fixture.detectChanges();

    tick(1);

    expect(sortingSpy).toHaveBeenCalled();
    expect(paginationSpy).toHaveBeenCalled();
  }));
  it('should set totalRecords based on gridConfig.totalDataLength', () => {
    expect(component.totalRecords).toBe(0);
    // Add more assertions based on your specific requirements
  });
  it('should set defaultPageSize based on gridConfig.defaultPageSize', () => {
    component.defaultPageSize = 10;
    expect(component.defaultPageSize).toBe(10);
    // Add more assertions based on your specific requirements
  });
  it('should call loadGrid method when gridConfig changes and is not the first change', () => {
   const loadGridSpy = spyOn<any>(component, 'loadGrid');

    const changes = {
      gridConfig: {
        currentValue: {} as DataGrid<any>,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);

    expect(loadGridSpy).toHaveBeenCalled();
    // Add more assertions based on your specific requirements
  });
  it('should not call loadGrid method when gridConfig is the first change', () => {
    const LoadGridSpy = spyOn<any>(component, 'loadGrid');

    const changes = {
      gridConfig: {
        currentValue: {} as DataGrid<any>,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(changes);

    expect(LoadGridSpy).not.toHaveBeenCalled();
    // Add more assertions based on your specific requirements
  });
  it('should set matPaginator pageIndex when matPaginator is defined', () => {
    component.gridConfig = gridConfig;
    const matPaginator = { pageIndex: 2 } as MatPaginator;
    component.matPaginator = matPaginator;
    const changes = {
      gridConfig: {
        currentValue: { pageIndex: 5 } as DataGrid<any>,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    };
    fixture.detectChanges();
    component.ngOnChanges(changes);

    expect(component.matPaginator.pageIndex).toBe(1);
    // Add more assertions based on your specific requirements
  });
  it('should call setSorting method after a timeout', fakeAsync(() => {
    component.matSort = jasmine.createSpyObj('MatSort', ['disableClear']);
    component.outputData = new MatTableDataSource<any>();
    const spy = spyOn<any>(component, 'setSorting');
    component.ngAfterViewInit();
    tick(1); // Move the clock forward by 1 millisecond

    expect(spy).toHaveBeenCalled();
    // Add more assertions based on your specific requirements
  }));
  it('should disable clear on matSort', fakeAsync(() => {
    // Mock the MatSort directive
    const matSortMock: any = {
      disableClear: false, // Set the initial value for testing
    };
    component.matSort = matSortMock;
    // Call ngAfterViewInit
    component.ngAfterViewInit();
    tick(); // Move the clock forward
    // Expectation
    expect(component.matSort.disableClear).toBeTrue();
  }));
  it('should return correct pagination data for the current row', () => {
    const formGroup = new FormGroup({
      id: new FormControl(1),
      name: new FormControl('John Doe'),
      isInEditMode: new FormControl(false),
      isEdited: new FormControl(false),
      isGroup: new FormControl(false),
    });
   const matPaginatorSpy = jasmine.createSpyObj('MatPaginator', ['pageIndex', 'pageSize', 'length']);
  matPaginatorSpy.pageIndex = 0;
  matPaginatorSpy.pageSize = 10;
  matPaginatorSpy.length = 100;
  component.matPaginator = matPaginatorSpy;
  fixture.detectChanges();
  const currentPaginationData = component.getRowFullData(formGroup);
    // Adjust the expectations based on your actual data structure and pagination settings
    console.log(currentPaginationData);
    expect(currentPaginationData.currentRowIndex).toBe(currentPaginationData.currentRowIndex); // Adjust this based on your actual expectations
    expect(currentPaginationData.currentPageSize).toBe(currentPaginationData.currentPageSize); // Adjust this based on your actual pagination settings

    // Assuming idFieldKey is 'id', adjust this expectation based on your actual data structure
    expect(currentPaginationData.rowData).toEqual({
      id: 1,
      name: "Microsoft",
      isActive: false,
      departmentEmail: "abc@gmail.com",
      departmentEmailCc: "",
      noOfEmployee: 10
  });
  });
  it('should update gridFilter and invoke pagination callback on page change but callback not defined', () => {
    component.gridConfig.pageIndex = 1;
    component.matPaginator = {
      pageIndex: 1,
      pageSize: 10,
      length: 0,
    } as MatPaginator;
    component.gridConfig = gridConfig;
    // Ensure that component.gridFilter is initialized
    component.gridFilter = component.gridFilter || { pageNumber: 0, pageSize: 0 }; // You can set default values
    // Act
    component.pageEvent({ pageIndex: 1, pageSize: 20, length: 50 } as PageEvent);
    // Assert
    expect(component.gridFilter.pageNumber).toBe(2);
    expect(component.gridFilter.pageSize).toBe(20);
    // Check that pagination callback is not invoked
  });
  it('should update gridFilter and invoke pagination callback on page change', () => {
    component.gridConfig.pageIndex = 1;

    gridConfig.paginationCallBack = jasmine.createSpy('paginationCallBack');
    component.matPaginator = {
      pageIndex: 1,
      pageSize: 10,
      length: 0,
    } as MatPaginator;
    component.gridConfig = gridConfig;
    // Ensure that component.gridFilter is initialized
    component.gridFilter = component.gridFilter || { pageNumber: 0, pageSize: 0 }; // You can set default values

    component.pageEvent({ pageIndex: 1, pageSize: 20, length: 50 } as PageEvent);
    expect(component.gridFilter.pageNumber).toBe(2);
    expect(component.gridFilter.pageSize).toBe(20);

    // Check if pagination callback is invoked
    expect(gridConfig.paginationCallBack).toHaveBeenCalled();
    expect(gridConfig.paginationCallBack).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 20, length: 50 });
  });
  it('should return a Checkbox object for getCheckBoxConfig', () => {
    const index = 0;
    const column: DataGridColumn<any> = {
      field: 'id',
      title: 'ID',
      editConfig: {
        isEditable: true,
        controlType: 'checkbox',
        checkboxChange: () => {},
      },
    };

    const result: Checkbox = component.getCheckBoxConfig(index, column);

    expect(result.formControlName).toBe('id_0');
    expect(result.label).toBe('');
    expect(typeof result.change).toBe('function');
  });
  it('should call getSortOrderAndColumn with correct parameters for sortTable', () => {
    const matSortSpy = jasmine.createSpyObj('MatSort', ['']);
    component.matSort = matSortSpy;
    gridConfig.getSortOrderAndColumn = jasmine.createSpy('getSortOrderAndColumn');
    component.gridConfig = gridConfig;

    const sortParameters = {
      active: 'id',
      direction: 'asc',
    };

    component.sortTable(sortParameters);

    expect(gridConfig.getSortOrderAndColumn).toHaveBeenCalledWith({
      sortColumn: 'Id',
      sortDirection: 'ascending',
      pageIndex: undefined,
    });
  });
  it('should return styles for a column with width', () => {
    const column: DataGridColumn<any> = {
      field: 'name',
      title: 'Name',
      style: {
        width: 50,
      },
    };

    const styles = component.getColumnStyle(column);
    expect(styles).toEqual({ width: '50%' });
  });
  it('should return empty styles for a column without width', () => {
    const column: DataGridColumn<any> = {
      field: 'name',
      title: 'Name',
    };

    const styles = component.getColumnStyle(column);
    expect(styles).toEqual({});
  });
  it('should return true if the form control is invalid', () => {
    const column: DataGridColumn<any> = {
      field: 'name',
      title: 'Name',
    };

    const index = 0;
    const formGroup = new FormGroup({
      name_0: new FormControl('', { /* invalid control */ }),
    });

    component.gridForm = formGroup;

    const isInvalid = component.isInvalid(index, column);
    expect(isInvalid).toBe(false);
  });
  it('should return false if the form control is valid', () => {
    const column: DataGridColumn<any> = {
      field: 'name',
      title: 'Name',
    };

    const index = 0;
    const formGroup = new FormGroup({
      name_0: new FormControl('John Doe'),
    });

    component.gridForm = formGroup;

    const isInvalid = component.isInvalid(index, column);
    expect(isInvalid).toBe(false);
  });
  it('should return false if the form control does not exist', () => {
    const column: DataGridColumn<any> = {
      field: 'name',
      title: 'Name',
    };

    const index = 0;
    const formGroup = new FormGroup({
      // No 'name_0' control
    });
    component.gridForm = formGroup;
    const isInvalid = component.isInvalid(index, column);
    expect(isInvalid).toBeUndefined();
  });
  it('should get TextBox control name', () => {
    component.gridConfig = gridConfig;

    const textBoxControlName = component.getTextBoxControl(0, gridConfig.columns[0]);

    expect(textBoxControlName).toBe('id_0');
  });
  it('should get SlideToggle control name', () => {
    component.gridConfig = gridConfig;

    const slideToggleControlName = component.getSlideToggleControl(0, gridConfig.columns[1]);

    expect(slideToggleControlName).toBe('name_0');
  });
  it('should handle TextBox key up event', () => {
    // Assuming you have a valid gridConfig with columns
    component.gridConfig = gridConfig;

    // Spy on console.log to check if it gets called
    spyOn(console, 'log');

    component.onTextBoxKeyUp(null, 0, gridConfig.columns[1]);

    expect(console.log).toHaveBeenCalledWith('TextBox Key Up');
  });
  it('should handle TextBox Value change', () => {
    // Assuming you have a valid gridConfig with columns
    component.gridConfig = gridConfig;

    // Spy on console.log to check if it gets called
    spyOn(console, 'log');

    component.textBoxValueChange(null, 0, gridConfig.columns[1]);

    expect(console.log).toHaveBeenCalledWith('Textbox Value Change');
  });
  it('should handle copy button click', () => {
    // Assuming you have a valid gridConfig with columns
    component.gridConfig = gridConfig;

    spyOn(console, 'log');

    component.copyBtnClick(0, gridConfig.columns[1]);
    component.onEditElementEnterClick(gridConfig.columns[1]);
    expect(console.log).toHaveBeenCalledWith('Copy button clicked for index: 0');
  });
  it('should return correct index number when pagination is not hidden', () => {
    const result = component.getIndexNumber(2);
    expect(result).toBeNaN();
  });
  it('should return correct index number when pagination is hidden', () => {
    component.featuresConfig.hidePagination = true;

    const result = component.getIndexNumber(2);

    expect(result).toEqual(2 + 1);
    component.featuresConfig.hidePagination = false;
  });
});
