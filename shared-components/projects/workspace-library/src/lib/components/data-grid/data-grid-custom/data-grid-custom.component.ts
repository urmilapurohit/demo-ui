import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableColumn } from '../../../models/data-grid-models/data-grid-custom.model';
import { Button } from '../../../models/button';

@Component({
  selector: 'lib-data-grid-custom',
  templateUrl: './data-grid-custom.component.html',
  styleUrls: ['./data-grid-custom.component.css']
})
export class DataGridCustomComponent implements OnDestroy {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() columnsData: TableColumn[] = [];
  @Output() deleteRowEvent = new EventEmitter<number>();
  @Output() addRowEvent = new EventEmitter<void>();
  @Output() inputBlurEvent = new EventEmitter<void>();
  @Output() inputEnterPressEvent = new EventEmitter<void>();
  subscription: Subscription | undefined;
  deleteRowButtonConfig!: Button;
  addRowButtonConfig!: Button;

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  deleteRow(index: number) {
    this.deleteRowEvent.emit(index);
  }

  addRow() {
    this.addRowEvent.emit();
  }

  blurEvent() {
    this.inputBlurEvent.emit();
  }

  public onEnterPress(): void {
    this.inputEnterPressEvent.emit();
  }
}
