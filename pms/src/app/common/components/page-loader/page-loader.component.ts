import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css'
})
export class PageLoaderComponent implements OnInit {
  constructor(public loader: LoaderService) { }
  loading: boolean = false;

  ngOnInit() {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loader.loading
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
