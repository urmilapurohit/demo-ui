import { Component } from '@angular/core';

@Component({
  selector: 'app-arrangement',
  templateUrl: './arrangement.component.html',
  styleUrl: './arrangement.component.css'
})
export class ArrangementComponent {
  selectedOption: string = 'option1';

  isOpen = false;
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  isSelect: boolean = true;
  toggleSelectedClass(): void {
    this.isSelect = !this.isSelect;
  }
}
