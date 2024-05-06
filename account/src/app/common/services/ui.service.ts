import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private hasCheckedAuth: boolean = false;

  setAuthenticated(): void {
    this.hasCheckedAuth = true;
  }

  get hasCheckedLogin(): boolean {
    return this.hasCheckedAuth;
  }
}
