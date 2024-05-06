/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { DataGridColumn } from '../../../models/data-grid-models/data-grid-column.config';
import { DataGridActionButton } from '../../../models/data-grid-models/data-grid-action-button.config';
import { DataGridFullRowData } from '../../../models/data-grid-models/data-grid-data.config';
import { DataGridEditFeatureConfig } from '../../../models/data-grid-models/data-grid-features.config';
import { Button, ButtonCategory, ButtonVariant } from '../../../models/button';

@Component({
  selector: 'lib-data-grid-action-element',
  templateUrl: './app-data-grid-action-element.component.html'
})
export class AppDataGridActionElementComponent<T> {
  @Input() formGroup!: FormGroup;
  @Input() columns!: DataGridColumn<T>[];
  @Input() rowData!: T | null;
  @Input() actionButtons!: DataGridActionButton<T>[];
  @Input() getCurrentPaginationFn!: () => MatPaginator;
  @Input() gridEditConfig!: DataGridEditFeatureConfig<T>;
  @Input() getRowFullDataFn!: (formGroup: FormGroup) => DataGridFullRowData<T>;
  @Input() isLoading!: boolean;
  checkButtonVisible = (button: DataGridActionButton<T>): boolean => {
    return !button.visibleCallback || button.visibleCallback(this.rowData ? this.rowData : ({} as T));
  };

  public saveRecord = (): void => {
    if (this.formGroup.valid) {
      if (this.gridEditConfig.singleRowSaveCallback) {
        this.gridEditConfig.singleRowSaveCallback(this.formGroup.getRawValue(), this.getRowFullDataFn(this.formGroup));
      }
    }
  };

  getAppButtonConfig = (
    button: DataGridActionButton<T>,
    index: number
  ): Button => {
    return {
      id: `btnGrid-${index}`,
      buttonText: '',
      buttonType: button.btnType,
      imgUrl: button.isBooleanBtn ? this.getValueByKey(this.rowData, button?.booleanField ?? '') ? button.btnAlternateSrc : button.btnImageSrc : button.btnImageSrc,
      icon: button.btnIcon,
      className: button.className,
      buttonCategory: ButtonCategory.normal,
      buttonVariant: ButtonVariant.iconOnly,
      tooltip: button.isBooleanBtn ? this.getValueByKey(this.rowData, button?.booleanField ?? '') ? button.tooltip : button.alterTooltip : button.tooltip,
      isRounded: true,
      callback: () => this.actionButtonClick(this.formGroup, button, index)
    };
  };

  getValueByKey(obj: any, key: string): any {
    if (obj && key) {
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      } else { /* empty */ }
    }
    return undefined;
  }

  actionButtonClick = (
    formGroup: FormGroup,
    btn: DataGridActionButton<T>,
    index: number
  ): void => {
    const currentRowData: DataGridFullRowData<T> = {
      currentRowIndex: index,
      currentPageSize: this.getCurrentPaginationFn()?.pageSize,
      // eslint-disable-next-line no-unsafe-optional-chaining
      currentPageNumber: this.getCurrentPaginationFn()?.pageIndex + 1,
      rowData: this.rowData,
    };
    if (btn.callback !== undefined) {
      btn?.callback(currentRowData);
    }
  };
}
