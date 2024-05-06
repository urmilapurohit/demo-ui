import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IConfirmationModalData } from '../../models/confirmation';

@Component({
  selector: 'lib-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationModalData
  ) {
  }

  public dialogAction(action?: string): void {
    this.dialogRef.close({ data: action });
  }
}
