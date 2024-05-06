import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.css'],
})
export class ToastMessageComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<ToastMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }
}
