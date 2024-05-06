/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material/material.module';
import { AppDataGridComponent } from './app-data-grid.component';
import { AppDataGridElementComponent } from '../app-data-grid-element/app-data-grid-element.component';
import {
  AppDataGridEditElementComponent,
  ButtonComponent,
  SlideToggleComponent,
} from '../../components.index';
import { ButtonType } from '../../../models/button';
import { AppDataGridActionElementComponent } from '../app-data-grid-action-element/app-data-grid-action-element.component';

interface TableData {
  name: string;
  isActive: boolean;
  departmentEmail: string;
  departmentEmailCc: string;
}

interface ITableObject extends TableData {
  id: number;
}
const meta: Meta<AppDataGridComponent<ITableObject>> = {
  title: 'DataGrid',
  component: AppDataGridComponent,
  argTypes: {
    gridConfig: {
        description: `
    actionButtons:pass the array of actionbuttons

    columns: pass array of columns

    defaultPageSize: pass defualt pagesixe for table,

    totalDataLength: pass data length for table,

    isNoRecordFound: pass true or false,

    gridData: pass data in json format for datagrid,
       
    displayIndexNumber: pass true or false ,

    features: pass feature for datagrid from below option
     
    hidePagination?: boolean;

    exportEnabled?: boolean;

    selectConfig?: DataGridSelectConfig<T>;

    editConfig?: DataGridEditFeatureConfig<T>;

    groupColumn?: keyof(T);
    
    doubleClickCallback?: (data: T, column: DataGridColumn<T>) => void,
        
        `,
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [FormGroupDirective],
      declarations: [
        AppDataGridComponent,
        AppDataGridElementComponent,
        SlideToggleComponent,
        AppDataGridEditElementComponent,
        AppDataGridActionElementComponent,
        ButtonComponent,
      ],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: AppDataGridComponent<ITableObject>) => ({
    props: {
      ...args,
    },
    template: `<lib-data-grid ${argsToTemplate(args)}></lib-data-grid>`,
  }),
};
let griddata = [
  {
    id: 1,
    name: 'Microsoft',
    isActive: false,
    departmentEmail: 'abc@gmail.com',
    departmentEmailCc: '',
  },
  {
    id: 2,
    name: 'PHP',
    isActive: true,
    departmentEmail: 'xyz@gmail.com',
    departmentEmailCc: 'null',
  },
  {
    id: 3,
    name: 'Business Development',
    isActive: true,
    departmentEmail: 'mno@gmail.com',
    departmentEmailCc: 'null',
  },
  {
    id: 4,
    name: 'Analysis',
    isActive: true,
    departmentEmail: 'pqr@gmail.com',
    departmentEmailCc: 'null',
  },
  {
    id: 5,
    name: 'HR',
    isActive: true,
    departmentEmail: 'xyz@gmail.com',
    departmentEmailCc: 'null',
  },
];
export default meta;
type Story = StoryObj<AppDataGridComponent<ITableObject>> & {
  onInit?: (args: AppDataGridComponent<ITableObject>) => void;
};
export const Datagrid: Story = {
  args: {
    gridConfig: {
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
          },
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
      ],
      defaultPageSize: 3,
      totalDataLength: 5,
      isNoRecordFound: false,
      gridData: { data: griddata },
      id: 'DepartmentGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      features: {
        hidePagination: false,
      },
      pageIndex: 1,
      getSortOrderAndColumn: (event) => {
        if (event && event.sortColumn && event.sortDirection) {
          griddata = griddata.sort((a, b) => a.name.localeCompare(b.name));
        }
      },
    },
  },
};
