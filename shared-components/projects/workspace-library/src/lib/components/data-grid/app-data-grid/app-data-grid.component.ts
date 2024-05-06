import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSelectChange } from '@angular/material/select';
import { DataGrid } from '../../../models/data-grid-models/data-grid.config';
import { DataGridEditFeatureConfig, DataGridFeatures } from '../../../models/data-grid-models/data-grid-features.config';
import { DataGridColumn } from '../../../models/data-grid-models/data-grid-column.config';
import { DataGridFilter } from '../../../models/data-grid-models/data-grid-filter.config';
import { DataGridFullRowData } from '../../../models/data-grid-models/data-grid-data.config';
import { Checkbox } from '../../../models/checkbox';
import { DropdownValue } from '../../../models/dropdown';

@Component({
  selector: 'lib-data-grid',
  templateUrl: './app-data-grid.component.html',
  styleUrls: ['./app-data-grid.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppDataGridComponent<T> implements OnInit, OnChanges, AfterViewInit {
  gridForm!: FormGroup;
  isColumnsLoaded: boolean = true;
  outputData!: MatTableDataSource<FormGroup>;
  @Input() gridConfig!: DataGrid<T>;
  @Input() isLoading!: boolean;
  @Input() resetSort: boolean = false;
  originalData: T[] = [];
  displayedColumns: string[] = [];
  totalRecords: number = 0;
  defaultPageSize: number = 10;
  gridFilter!: DataGridFilter<T>;
  defaultSortDir!: SortDirection;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  defaultSortColumn!: string | undefined;
  customTableClass!: string | undefined;

  ngOnInit(): void {
    if (this.gridConfig.formGroup) {
      this.gridForm = this.gridConfig.formGroup;
      this.totalRecords = this.gridConfig.totalDataLength ? this.gridConfig.totalDataLength : 0;
    } else {
      this.gridForm = new FormGroup({
        allRecords: new FormArray([]),
      });
    }
    this.defaultPageSize = this.gridConfig.defaultPageSize ?? 10;
    this.customTableClass = this.gridConfig.customTableClass;
    this.loadGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['gridConfig']?.firstChange) {
      this.loadGrid();
    }
    if (this.matPaginator) this.matPaginator.pageIndex = this.gridConfig.pageIndex;
    this.setSorting();

    if (this.resetSort) {
      this.resetSorting();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setSorting();
    }, 0);
    this.setPaginator();
    this.matSort.disableClear = true;
  }

  async resetSorting() {
    if (this.matSort) {
      const defaultColumn = this.gridConfig.gridFilter?.order.sortColumn as string;
      this.matSort.active = defaultColumn || '';
      this.matSort.direction = 'asc';
      this.matSort.sortChange.emit();
    }
  }

  private setSorting = (): void => {
    if (this.matSort) {
      this.defaultSortColumn = this.gridConfig?.columns?.filter((column: DataGridColumn<T>) => column?.field === this.gridFilter?.order?.sortColumn)[0]?.field;
      this.defaultSortDir = this.gridFilter?.order?.dir;
      if (this.outputData) this.outputData.sort = this.matSort;
    }
  };

  get editConfig(): DataGridEditFeatureConfig<T> {
    const result = this.featuresConfig?.editConfig ? this.featuresConfig?.editConfig : { isEditable: false };
    return result;
  }

  get featuresConfig(): DataGridFeatures<T> {
    return this.gridConfig?.features ? this.gridConfig?.features : {};
  }

  getOriginalDataFromFormGroup = (formGroup: FormGroup): T | null => {
    const filteredData: T[] = this.originalData.filter((item) => item[this.gridConfig.idFieldKey] === this.getIdFromFormGroup(formGroup));
    return filteredData.length > 0 ? filteredData[0] : null;
  };

  // eslint-disable-next-line class-methods-use-this
  getIdFromFormGroup = (formGroup: FormGroup): number => {
    return formGroup.get("id")?.value;
  };

  getRowFullData = (formGroup: FormGroup | null = null) => {
    const currentPaginationData: DataGridFullRowData<T> = {
      // eslint-disable-next-line no-unsafe-optional-chaining
      currentPageNumber: this.matPaginator?.pageIndex + 1,
      currentRowIndex: -1,
      currentPageSize: this.matPaginator?.pageSize,
      rowData: formGroup == null ? {} as T : this.getOriginalDataFromFormGroup(formGroup)
    };
    return currentPaginationData;
  };
  private setColumns = (): void => {
    if (this.gridConfig?.columns) {
      const data = this.gridConfig?.columns?.filter((column: DataGridColumn<T>) => {
        return !column.isHidden;
      }).map((column: DataGridColumn<T>) => column?.title);

      if (data) {
        this.displayedColumns = data as Array<string>;
      }
      if (this.gridConfig.actionButtons && this.gridConfig.actionButtons.length > 0) {
        this.displayedColumns.push('actions');
      }
      if (this.gridConfig.nestedGrid?.isContainNestedTable && this.gridConfig.nestedGrid?.nestedActionButtons && this.gridConfig.nestedGrid?.nestedActionButtons.length > 0) {
        this.displayedColumns.unshift('nestedAction');
      }
      if (this.gridConfig.displayIndexNumber) {
        this.displayedColumns.unshift('position');
      }
      this.isColumnsLoaded = true;
    }
  };

  private loadGrid = (): void => {
    this.setColumns();
    const values = { pageNumber: 1, pageSize: this.defaultPageSize, order: this.gridConfig.defaultSort };
    this.gridFilter = this.gridConfig?.gridFilter ?? values as any;
    this.manipulateDataSource(this.gridConfig?.gridData?.data);
  };

  isControlVisible(index: number, column: DataGridColumn<T>, element: any): boolean {
    if (column.editConfig?.needToShowBasedOn === "FormControl") {
      const rowData = this.getOriginalDataFromFormGroup(element);
      // eslint-disable-next-line no-nested-ternary
      const formControlName = column.field ? (rowData ? column.field.toString().concat(`_${rowData[column.editConfig?.idFieldKey as keyof typeof rowData]}`) : column.field.toString().concat(`_${index.toString()}`)) : '';
      const existControl = this.gridForm.get(formControlName);
      // eslint-disable-next-line no-unneeded-ternary
      return (existControl ? true : false);
    }
    return false;
  }

  private asFormGroup = (data: T): FormGroup => {
    const group = new FormGroup({});
    group.addControl("id", new FormControl<T[keyof(T)]>(data[this.gridConfig.idFieldKey]));
    group.addControl("isInEditMode", new FormControl<boolean>(Boolean(this.editConfig.setAllRowsInEditMode)));
    group.addControl("isEdited", new FormControl<boolean>(false));
    group.addControl("isGroup", new FormControl<boolean>(false));

    this.dataColumns.forEach((column) => {
      group.addControl(column.field as string, new FormControl(data[column.field as keyof (T)], column.editConfig?.validations ?? undefined));
    });

    return group;
  };

  get dataColumns(): DataGridColumn<T>[] {
    return this.gridConfig.columns.filter((c) => c.field !== "NA");
  }

  private manipulateDataSource = (data: T[] | undefined): void => {
    if (data) {
      const allRecordsFormArray = new FormArray(data?.map((x) => this.asFormGroup(x)));
      this.gridForm.setControl('allRecords', allRecordsFormArray);
      this.totalRecords = this.gridConfig?.totalDataLength ? this.gridConfig?.totalDataLength : 0;

      this.outputData = new MatTableDataSource<FormGroup>(allRecordsFormArray.controls);
      if (this.gridConfig && this.gridConfig.isClientSidePagination) {
        this.outputData.paginator = this.matPaginator;
      }
      this.originalData = [...data];
      this.setPaginator();
    }
  };

  private setPaginator = (): void => {
    if (this.matPaginator && !this.outputData?.paginator) {
      this.setPageAndIndex();
    }
  };

  private setPageAndIndex(): void {
    setTimeout(() => {
      if (this.matPaginator) { this.matPaginator.pageIndex = this.getCurrentPagination()?.pageIndex; }
      this.defaultPageSize = this.getCurrentPagination()?.pageSize ?? 10;
    }, 0);
  }

  getCurrentPagination = (): MatPaginator => {
    return this.matPaginator;
  };

  getIndexNumber = (i: number): number => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (!this.featuresConfig?.hidePagination) { return (this.getCurrentPagination()?.pageIndex * this.getCurrentPagination()?.pageSize) + (i + 1); }
    else {
      return i + 1;
    }
  };

  pageEvent(event: PageEvent) {
    this.gridFilter.pageNumber = event.pageIndex + 1;
    this.gridFilter.pageSize = event.pageSize;
    this.matPaginator.pageIndex = event.pageIndex;
    if (this.gridConfig.paginationCallBack) this.gridConfig.paginationCallBack(event);
  }

  // eslint-disable-next-line class-methods-use-this
  getCheckBoxConfig(index: number, column: DataGridColumn<T>, element: any): Checkbox {
    let rowData = null;
    if (column.editConfig?.idFieldKey) {
      rowData = this.getOriginalDataFromFormGroup(element);
    }
    return {
      // eslint-disable-next-line no-nested-ternary
      formControlName: column.field ? (rowData ? column.field.toString().concat(`_${rowData[column.editConfig?.idFieldKey as keyof typeof rowData]}`) : column.field.toString().concat(`_${index.toString()}`)) : '',
      label: column.editConfig?.label ? column.editConfig?.label : '',
      change: column.editConfig?.checkboxChange
    };
  }

  public sortTable = (sortParameters: any): void => {
    if (this.resetSort) return;
    const column = this.capitlizeFirstLetter(sortParameters?.active?.split(' ')?.join(''));
    const params: { sortColumn: string, sortDirection: string, pageIndex: number } = {
      sortColumn: column || "",
      sortDirection: sortParameters?.direction === 'asc' ? 'ascending' : 'descending',
      pageIndex: this.matPaginator?.pageIndex
    };
    if (this.gridConfig?.getSortOrderAndColumn) {
      this.gridConfig?.getSortOrderAndColumn(params);
    }
  };

  private capitlizeFirstLetter(str: string) {
    return `${str?.charAt(0)?.toUpperCase()}${str?.slice(1)}`;
  }

  // eslint-disable-next-line class-methods-use-this
  getTextBoxControl(index: number, column: DataGridColumn<T>, element?: any): string | null {
    let rowData = null;
    if (column.editConfig?.idFieldKey && element) {
      rowData = this.getOriginalDataFromFormGroup(element);
    }
    // eslint-disable-next-line no-nested-ternary
    return (column.field ? (rowData ? column.field.toString().concat(`_${rowData[column.editConfig?.idFieldKey as keyof typeof rowData]}`) : column.field.toString().concat(`_${index.toString()}`)) : '');
  }

  getSlideToggleControl(index: number, column: DataGridColumn<T>): string | null {
    return column.field ? column.field.toString().concat(`_${index.toString()}`) : '';
  }
  // eslint-disable-next-line class-methods-use-this
  onTextBoxKeyUp(event: any, index: number, column: DataGridColumn<T>) {
    if (column.editConfig?.textBoxKeyUp) {
      column.editConfig?.textBoxKeyUp(column.field.toString().concat(`_${index.toString()}`));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  textBoxValueChange(event: any, index: number, column: DataGridColumn<T>) {
    if (column.editConfig?.textBoxValueChange) {
      column.editConfig?.textBoxValueChange(column.field.toString().concat(`_${index.toString()}`));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  copyBtnClick(index: number, column: DataGridColumn<T>) {
    if (column.editConfig?.copyBtnClick) {
      column.editConfig?.copyBtnClick(index);
    }
  }

  onEditElementEnterClick(tableColumn: DataGridColumn<T>): void {
    if (tableColumn?.callback) {
      tableColumn?.callback();
    }
  }

  getColumnStyle = (column: DataGridColumn<T>): { [key: string]: any } => {
    const styles: { [key: string]: any } = {};
    if (column?.style) {
      if (column?.style?.width) {
        styles['width'] = `${column?.style?.width}%`;
      }
    }

    return styles;
  };

  getTDClass = (column: DataGridColumn<T>, element: any): string => {
    let className: string = '';

    if (column.needToShowTDClassBasedOn) {
      const rowData = this.getOriginalDataFromFormGroup(element);
      if (rowData) {
        className = `td-class-${rowData[column.needToShowTDClassBasedOn as keyof typeof rowData]}`;
      }
    }
    else if (column.customHeaderClassName) {
      className = column.customHeaderClassName;
    }
    return className;
  };

  isInvalid(index: number, column: DataGridColumn<T>): boolean {
    const control = column?.field ? column?.field?.toString()?.concat(`_${index?.toString()}`) : '';
    if (control) {
      return this.gridForm?.controls[control]?.invalid;
    }
    return false;
  }

  isMainTableRow(formGroup: FormGroup) {
    const rowData = this.getOriginalDataFromFormGroup(formGroup);
    let expandableField = null;
    if (rowData && rowData[this.gridConfig.nestedGrid?.expandableField as keyof typeof rowData]) {
      expandableField = rowData[this.gridConfig.nestedGrid?.expandableField as keyof typeof rowData] as Array<any>;
    }
    if (expandableField && expandableField.length > 0) {
      return true;
    }
    return false;
  }

  isExpandedTableRow(formGroup: FormGroup) {
    const rowData = this.getOriginalDataFromFormGroup(formGroup);
    if (rowData && rowData[this.gridConfig.nestedGrid?.expandField as keyof typeof rowData]) {
      return true;
    }
    return false;
  }

  getNestedGridConfig(formGroup: FormGroup): DataGrid<T> {
    const rowData = this.getOriginalDataFromFormGroup(formGroup);
    if (rowData && rowData[this.gridConfig.nestedGrid?.nestedGridField as keyof typeof rowData]) {
      return rowData[this.gridConfig.nestedGrid?.nestedGridField as keyof typeof rowData] as DataGrid<T>;
    }
    else {
      return {} as DataGrid<T>;
    }
  }

  selectionChange = (event: MatSelectChange, column: DataGridColumn<T>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    column.editConfig?.dropdownSelectionChange && column.editConfig?.dropdownSelectionChange(event);
  };

  getDropdownFieldData(column: DataGridColumn<T>, formGroup: FormGroup) {
    const rowData = this.getOriginalDataFromFormGroup(formGroup);
    if (rowData && rowData[column.editConfig?.dataFieldKey as keyof typeof rowData]) {
      return rowData[column.editConfig?.dataFieldKey as keyof typeof rowData] as DropdownValue[];
    }
    return [];
  }
}
