import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multiselect-search-dropdown',
  templateUrl: './multiselect-search-dropdown.component.html',
  styleUrl: './multiselect-search-dropdown.component.css'
})
export class MultiselectSearchDropdownComponent {
  providers = new FormControl();
  allProviders: any[] = [{ PROV: "aaa" }, { PROV: "aab" }, { PROV: "aac" }];
  filteredProviders: any[] = this.allProviders;

  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();

    this.filteredProviders = this.allProviders.filter(({ PROV }) => {
      const prov = PROV.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredProviders = this.allProviders;
  }
}
