/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { InputType } from '../../models/text.field';
import { DropDown } from '../../models/dropdown';
import { ButtonCategory, ButtonType, ButtonVariant } from '../../models/button';

export const testAutoCompleteConfig = {
  label: 'Autocomplete',
  formControlName: 'autoComplete',
  options: ['India', 'china', 'Indonesia', 'Iran', 'Irac', 'America'],
  placeholder: 'Pick one',
  customFormFieldClass: 'small-width-field',
  onSelect: (event: any) => {
    console.log(event);
  },
  onInput: (event: any) => {
    console.log(event);
  },
};
export const testTextBoxConfig = {
  label: 'Test',
  formControlName: 'test',
  type: InputType.text,
  customClass: 'custom-form-control',
  placeholder: 'Test',
  onEnterPress: () => {
    console.log('success');
  },
  onBlur: () => {
    console.log('success');
  },
};
export const testPasswordConfig = {
  label: 'Test',
  formControlName: 'test',
  type: InputType.password,
  customClass: 'custom-form-control',
  placeholder: 'Test',
};
export const testTextAreaConfig = {
  label: 'Test TextArea',
  formControlName: 'test',
  customClass: 'custom-textarea',
  placeholder: 'Test',
  keyup: (event: KeyboardEvent) => {
    console.log('keyup event triggered', event);
  },
  blur: (event: FocusEvent) => {
    console.log('blur event triggered', event);
  },
};
export const testTextAreaConfigEmpty = {
  label: 'Address',
  formControlName: 'address',
};
export const testSlideToggle = {
  label: 'Test',
  formControlName: 'test',
  change: (event: MatSlideToggleChange) => {
    console.log('change event triggered', event);
  },
  click: (event: any) => {
    console.log('click event triggered', event);
  },
};
export const testRadioConfig = {
    label: 'paymentType',
    formControlName: 'testRadio',
    options: [
      { value: 1, label: 'Online', checked: true },
      { value: 2, label: 'Offline', checked: false },
    ],
    change: jasmine.createSpy('change'),
  };
  export const testDropdownConfig: DropDown = {
    data: {
      data: [
        { id: 1, text: 'Applied' },
        { id: 2, text: 'Approved' },
        { id: 3, text: 'Rejected' },
        { id: 4, text: 'Paid' }],
    },
    feature: {
      allowMultiple: true
    },
    customFormFieldClass: 'test-class',
    customSelectClass: 'test-class',
    id: 'requestTypeFilter',
    formControlName: 'requestTypeFilter',
    label: 'Request Type Filter',
    onEnterPress: () => { console.log('enter press'); },
    selectionChange: (event: MatSelectChange, formControlName?: string) => {
        console.log('Selection change event triggered');
      },
  };
export const testDropDownSimpleChnage = {
    config: {
      currentValue: testDropdownConfig,
      previousValue: testDropdownConfig,
      isFirstChange: () => false,
      firstChange: false,
    },
};
export const testCheckBoxConfig = {
    label: 'Test',
    formControlName: 'test',
    change: (event: MatCheckboxChange) => {
        console.log('change event triggered');
      },
    click: (event: any) => {
        console.log('click event triggered');
      },
  };
export const testNormalButton = {
  buttonType: ButtonType.default,
  buttonVariant: ButtonVariant.stroked,
  buttonText: 'Click me',
  callback: jasmine.createSpy('callback'),
};
export const testIconOnlyButton = {
  buttonText: "Login",
  buttonType: ButtonType.icon,
  buttonVariant: ButtonVariant.iconOnly,
  icon: 'add',
  callback: jasmine.createSpy('callback'),
};
export const testImgButton = {
  buttonText: 'img',
  buttonType: ButtonType.imgWithText,
  buttonVariant: ButtonVariant.iconOnly,
  buttonCategory: ButtonCategory.normal,
  imgUrl: 'imgpath',
  callback: (element: any, item: any) => {
      // eslint-disable-next-line no-console
      console.log('img button clicked', element, item);
  },
};
export const testIconButton = {
  buttonType: ButtonType.icon,
  buttonVariant: ButtonVariant.stroked,
  buttonText: 'Click me',
  icon: 'add',
  callback: jasmine.createSpy('callback'),
};
export const testAnchorButton = {
  buttonCategory: ButtonCategory.normal,
  buttonType: ButtonType.anchorButton,
  buttonVariant: ButtonVariant.stroked,
  buttonText: 'Click me',
  className: 'custom-btn',
  customWidthClass: 'custom-width',
  callback: jasmine.createSpy('callback'),
  disableCallBack: jasmine.createSpy('disableCallBack').and.returnValue(true),
};
export const testEnabledButtonConfig = {
  buttonType: ButtonType.default,
  buttonVariant: ButtonVariant.stroked,
  buttonText: 'Click me',
  disableCallBack: jasmine.createSpy('disableCallBack').and.returnValue(false),
  callback: jasmine.createSpy('callback'),
};
export const testDateFieldConfig = {
  label: 'Birth Date',
  formControlName: 'test',
  placeholder: 'Birth Date',
  max: () => new Date('01/10/2024'),
  min: () => new Date('01/01/2024'),
  onChangeDate: () => { console.log('success'); },
  onEnterPress: () => { console.log('success'); }
};
export const testMinDate = {
  label: 'Birth Date',
  formControlName: 'test',
  placeholder: 'Birth Date',
  min: jasmine.createSpy('min').and.returnValue(new Date('2022-01-01')),
};
export const testMaxDate = {
  label: 'Birth Date',
  formControlName: 'test',
  placeholder: 'Birth Date',
  max: jasmine.createSpy('max').and.returnValue(new Date('2022-12-31')),
};
export const testDateConfig = {
  label: 'Birth Date',
  formControlName: 'test',
  placeholder: 'Birth Date',
};
