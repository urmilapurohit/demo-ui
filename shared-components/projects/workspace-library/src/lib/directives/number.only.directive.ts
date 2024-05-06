import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[libNumberOnly]'
})
export class NumberOnlyDirective {
  @Input() isNumber: boolean = false;

  regexStr = '^[0-9]+$';
  specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft', 'Delete'];
  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    if (this.isNumber) {
      if (this.specialKeys.indexOf(event.key) !== -1) {
        return;
      }
      return new RegExp(this.regexStr).test(event.key);
    }
    return;
  }

  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    if (this.isNumber)
      event.preventDefault();
  }
}
