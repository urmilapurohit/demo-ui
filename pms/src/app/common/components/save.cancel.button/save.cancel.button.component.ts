import { Component, Input } from '@angular/core';
import { Button } from 'workspace-library';

@Component({
  selector: 'app-save-cancel-button',
  templateUrl: './save.cancel.button.component.html',
  styleUrl: './save.cancel.button.component.css'
})
export class SaveCancelButtonComponent {
  @Input() saveButtonConfig!:Button;
  @Input() cancelButtonConfig!:Button;
}
