/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lib-show-error',
  templateUrl: './show.error.component.html',
  styleUrl: './show.error.component.css',
})
export class ShowErrorComponent implements OnInit {
  @Input() ctrl: any = new FormControl();
  @Input() submit: boolean = false;
  @Input() formGroup: any;
  errorCtrlLabel: string = this.ctrl;

  ngOnInit(): void {
    this.errorCtrlLabel = this.splitStringWithCapital(this.ctrl);
  }

  ERROR_MESSAGE: any = {
    required: () => `*${this.errorCtrlLabel} is required.`,
    email: () => `*Please enter a valid e-mail address.`,
    whitespace: () => `*White spaces are not allowed.`,
    minlength: (par: any) => `*Min ${par.requiredLength} characters is required.`,
    maxlength: (par: any) => `*Max ${par.requiredLength} characters is Allowed.`,
    pattern: () => `*${this.errorCtrlLabel} pattern is wrong.`,
    max: (par: any) => `*Value can't be more than ${par.max}.`,
    min: (par: any) => `*Value can't be  less than ${par.min}`,
    requiredDropDown: () => `*${this.errorCtrlLabel} is required.`,
    mustMatch: () => `*${this.errorCtrlLabel} should be same.`,
    invalidPassword: () => 'Password must be 8-20 characters long and must contain at least one digit, one lowercase letter, one uppercase letter, and one special character.',
    invalidContactNo: () => 'Please enter a valid contact number'
  };

  shouldShowErrors() {
    if (this.submit && this.formGroup.status === 'INVALID') {
      return true;
    } else return false;
  }

  splitStringWithCapital(inputString: string) {
    const wordsArray = inputString.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    const resultArray = wordsArray.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const resultString = resultArray.join(' ');
    return resultString;
  }

  listOfErrors(): string[] {
    if (this.formGroup?.controls[this.ctrl]?.errors?.customMessage) {
      return [this.formGroup?.controls[this.ctrl]?.errors?.customMessage];
    }
    else if (this.formGroup?.controls[this.ctrl]?.errors?.matDatepickerParse?.text) {
      return ['*Invalid Date.'];
    } else if (this.formGroup?.controls[this.ctrl]?.errors?.matDatepickerMax) {
      return [`*${this.ctrl}Date Not Valid.`];
    } else if (this.formGroup?.controls[this.ctrl]?.errors) {
      return Object?.keys(this.formGroup?.controls[this.ctrl]?.errors).map(
        (err) => this.ERROR_MESSAGE[err](
          this.formGroup?.controls[this.ctrl]?.getError(err)
        )
      );
    } else return [];
  }
}
