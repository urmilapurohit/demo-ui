import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-multiselectdropdown',
  templateUrl: './multiselectdropdown.component.html',
  styleUrl: './multiselectdropdown.component.css'
})
export class MultiselectdropdownComponent {
  toppings = new FormControl('');
  toppingList: string[] = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6'];
}
