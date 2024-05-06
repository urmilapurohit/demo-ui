import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataGridColumn, DataGridFieldDataType, DataGridFieldType } from '../../../models/data-grid-models/data-grid-column.config';
import { DataGridService } from '../../../services/datagrid.service';
import { UIService } from '../../../services/ui.service';
import { GLOBAL_CONSTANTS } from '../../../models/constants';

@Component({
  selector: 'lib-data-grid-element',
  templateUrl: './app-data-grid-element.component.html',
  styleUrls: ['./app-data-grid-element.component.css']
})
export class AppDataGridElementComponent<T> implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() column!: DataGridColumn<T>;
  @Input() rowData!: T | null;
  @Input() isLoading!: boolean;
  @Input() totalRecords!: number;
  dataToShow: string = "";
  displayOrder: number = 0;
  constructor(
    private dataGridService: DataGridService,
    private uiService: UIService
  ) {
  }

  ngOnInit(): void {
    this.setDataToShow();
  }

  get isCellVisible(): boolean {
    return !this.column.checkCondition || this.column.checkCondition(this.rowData);
  }

  setDataToShow(): void {
    if (this.column.fieldType === DataGridFieldType.icon) {
      return;
    }
    const formFieldValue: string = this.formGroup.get(this.column.field as string)?.value;
    if (this.column.fieldType === DataGridFieldType.link || this.column.fieldType === DataGridFieldType.colorBox || this.column.fieldDataType === DataGridFieldDataType.string || this.column.fieldDataType === DataGridFieldDataType.number) {
      this.dataToShow = formFieldValue;
    }
    else if (this.column.fieldDataType === DataGridFieldDataType.boolean) {
      this.dataToShow = formFieldValue ? "Yes" : "No";
    }
    else if (this.column.fieldDataType === DataGridFieldDataType.date) {
      if (formFieldValue) this.dataToShow = formFieldValue ? this.uiService.convertDateFormat(formFieldValue, GLOBAL_CONSTANTS.DATE_FORMATE.DD_MMM_YYYY) : "";
    }
    else if (this.column.fieldDataType === DataGridFieldDataType.dateTime) {
      if (formFieldValue) this.dataToShow = formFieldValue ? this.uiService.convertDateFormat(formFieldValue, GLOBAL_CONSTANTS.DATE_FORMATE.DD_MMM_YYYY_HH_MM_A) : "";
    }
    else if (this.column.fieldType === DataGridFieldType.iconBoolean) {
      this.dataToShow = formFieldValue;
    }
    else if (this.column.fieldType === DataGridFieldType.iconGroup) {
      this.displayOrder = Number(formFieldValue);
    }
  }

  getCustomRenderTemplate() {
    return this.column.customRenderTemplate as TemplateRef<any>;
  }

  cellClickCallback = (): void => {
    if (this.column.callback) {
      this.column.callback(this.rowData);
    }
  };
  upClickCallback = (): void => {
    if (this.column.upCallBack) {
      this.column.upCallBack(this.rowData);
    }
  };
  downClickCallback = (): void => {
    if (this.column.downCallBack) {
      this.column.downCallBack(this.rowData);
    }
  };

  get displayType(): "Link" | "Normal" | "Icon" | "IconBoolean" | "ColorBox" | "IconGroup" | undefined {
    // eslint-disable-next-line default-case
    switch (this.column.fieldType) {
      case DataGridFieldType.link:
        return "Link";
      case DataGridFieldType.data:
        return "Normal";
      case DataGridFieldType.icon:
        return "Icon";
      case DataGridFieldType.iconBoolean:
          return "IconBoolean";
      case DataGridFieldType.colorBox:
          return "ColorBox";
      case DataGridFieldType.iconGroup:
          return "IconGroup";
    }
    return undefined;
  }

  public get toolTip(): string {
    let tooltip = '';
    if (this.column.showTooltip) {
      if (this.column.customToolTipConfig) {
        const row = this.dataGridService.getDeepNestedCopy(this.rowData);
        if (row && this.column?.customToolTip) {
          tooltip = row?.customToolTip ?? '';
        }
      }
      else if (this.dataToShow && this.dataToShow.length >= 25) {
        tooltip = this.dataToShow;
      }
      else {
        const row = this.dataGridService.getDeepNestedCopy(this.rowData);
        if (row && this.column?.customToolTip) {
          tooltip = row?.customToolTip ?? '';
        }
      }
    }
    return tooltip;
  }

  public get setCustomStyleRed(): boolean {
    return false;
  }

  public get setCustomStyleDarkBlue(): boolean {
    return false;
  }

  public get setCustomStyleGreen(): boolean {
    return false;
  }
}
