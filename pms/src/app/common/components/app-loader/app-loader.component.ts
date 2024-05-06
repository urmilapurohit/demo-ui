import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html'
})
export class AppLoaderComponent {
  @Input() loading: boolean = false;
}
