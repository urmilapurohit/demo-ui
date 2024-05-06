/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonType } from '../../models/button';
import { DataGrid } from '../../models/data-grid-models/data-grid.config';
import { DataGridFieldDataType, DataGridFieldType } from '../../models/data-grid-models/data-grid-column.config';

export const tablefrom = new FormGroup({
  id: new FormControl(1),
  name: new FormControl('John Doe'),
  isInEditMode: new FormControl(false),
  isEdited: new FormControl(false),
  isGroup: new FormControl(false),
});

export const gridData = [
  {
    id: 1,
    name: 'Microsoft',
    isActive: false,
    departmentEmail: 'abc@gmail.com',
    departmentEmailCc: '',
    noOfEmployee: 10
  },
  {
    id: 2,
    name: 'PHP',
    isActive: true,
    departmentEmail: 'xyz@gmail.com',
    departmentEmailCc: 'null',
    noOfEmployee: 10
  },
  {
    id: 3,
    name: 'Business Development',
    isActive: true,
    departmentEmail: 'mno@gmail.com',
    departmentEmailCc: 'null',
    noOfEmployee: 10
  },
  {
    id: 4,
    name: 'Analysis',
    isActive: true,
    departmentEmail: 'pqr@gmail.com',
    departmentEmailCc: 'null',
    noOfEmployee: 10
  },
  {
    id: 5,
    name: 'HR',
    isActive: true,
    departmentEmail: 'xyz@gmail.com',
    departmentEmailCc: 'null',
    noOfEmployee: 10
  },
];
export const gridConfig:DataGrid<any> = {
  actionButtons: [
    {
      btnImageSrc: 'assets/images/edit-icon.svg',
      btnType: ButtonType.img,
      className: 'action-item table-icon-btn',
      tooltip: 'Edit',
      callback: (data: any) => {
        if (data?.rowData?.id) {
          console.log(data.rowData.name);
        }
      },
    },
    {
      btnImageSrc: 'assets/images/delete-icon.svg',
      btnType: ButtonType.img,
      tooltip: 'Delete',
      className: 'action-item table-icon-btn',
      callback: (data: any) => {
        if (data?.rowData?.id) {
          console.log(data.rowData.name);
        }
      },
    },
  ],
  columns: [
    {
      field: 'id',
      title: 'Id',
      fieldDataType: 2,
      fieldType: 1,
      isSortable: true,
    },
    {
      field: 'name',
      title: 'Department',
      fieldDataType: 1,
      fieldType: 1,
      isSortable: true,
      editConfig: {
        isEditable: true,
        controlType: 'text',
       textBoxKeyUp: () => { console.log('TextBox Key Up'); },
       textBoxValueChange: () => { console.log('Textbox Value Change'); },
       copyBtnClick: (index: number) => {
        console.log(`Copy button clicked for index: ${index}`);
      },
      },
      callback: () => { console.log('Edit call back'); }
    },
    {
      field: 'isActive',
      title: 'Status',
      editConfig: {
        isEditable: true,
        controlType: 'slidetoggle',
      },
      fieldDataType: 7,
      fieldType: 1,
    },
    {
      field: 'departmentEmail',
      title: 'Email',
      fieldDataType: 1,
      fieldType: 1,
      isSortable: true,
    },
    {
      field: 'departmentEmailCc',
      title: 'EmailCc',
      fieldDataType: 1,
      fieldType: 1,
      isSortable: true,
    },
    {
      field: 'noOfEmployee',
      title: 'Employee',
      fieldDataType: 2,
      fieldType: 1,
      isSortable: true,
      editConfig: {
        isEditable: true,
        controlType: 'text',
       textBoxKeyUp: () => { console.log('TextBox Key Up'); },
       textBoxValueChange: () => { console.log('Textbox Value Change'); },
       copyBtnClick: (index: number) => {
        console.log(`Copy button clicked for index: ${index}`);
      },
      },
      callback: () => { console.log('Edit call back'); }
    }
  ],
  defaultPageSize: 3,
  totalDataLength: 5,
  isNoRecordFound: false,
  gridData: { data: gridData },
  id: 'DepartmentGrid',
  idFieldKey: 'id',
  displayIndexNumber: false,
  features: {
    hidePagination: false,
  },
  isClientSidePagination: true,
  defaultSort: { sortColumn: 'id', dir: 'asc' },
  gridFilter: { order: { sortColumn: 'id', dir: 'asc'}, pageNumber: 1, pageSize: 5 },
  pageIndex: 1,
  // eslint-disable-next-line unused-imports/no-unused-vars
  getSortOrderAndColumn: (event) => {
      console.log('success');
  },
  paginationCallBack: () => {
    console.log('success');
  }
};
export const testColumn = {
  field: 'exampleField',
  fieldType: DataGridFieldType.data,
  fieldDataType: DataGridFieldDataType.string,
  checkCondition: (rowData: any) => true,
  callback: (rowData: any) => {},
};
export const testButton = {
  btnType: ButtonType.icon,
  isActiveInactiveBtn: true,
  activeInactiveField: 'active',
  btnIcon: 'icon',
  className: 'buttonClass',
  tooltip: 'Tooltip',
  callback: () => {},
};
