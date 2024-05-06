import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataGridService {
  getDeepNestedCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}
