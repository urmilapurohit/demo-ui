import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading:Subject<boolean> = new BehaviorSubject(false);

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }
}
