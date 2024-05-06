import { Component, Input } from '@angular/core';
import {
  Button,
  ButtonCategory,
  ButtonType,
  ButtonVariant,
  TooltipDirection,
} from '../../../models/button';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() buttonConfig!: Button;
  @Input() isLoading = false;
  buttonTypes = ButtonType;
  buttonVariants = ButtonVariant;
  tooltipDirections = TooltipDirection;
  @Input() item!: any;
  onBtnClick = (e: any) => {
    if (!this.isMenuButton) {
      this.buttonConfig.callback(e, this.item);
    }
  };

  isButtonDisable = (): boolean => {
    if (this.buttonConfig.disableCallBack) {
      return this.buttonConfig.disableCallBack();
    }
    return false;
  };

  get btnClass() {
    let cssClass = '';
    if (this.buttonConfig?.className) {
      cssClass = this.buttonConfig?.className;
    }
    if (this.buttonConfig?.customWidthClass) {
      cssClass += ` ${this.buttonConfig?.customWidthClass}`;
    }
    return cssClass;
  }

  get isImageButton() {
    return (
      this.buttonConfig.buttonType === ButtonType.img
      || (this.buttonConfig.buttonType === ButtonType.imgWithText
        && this.buttonConfig.imgUrl)
    );
  }

  get isIconButton() {
    return (
      (this.buttonConfig.buttonType === ButtonType.icon
        || this.buttonConfig.buttonType === ButtonType.iconWithText)
      && this.buttonConfig.icon
    );
  }

  get isAnchorButton() {
    return this.buttonConfig.buttonType === ButtonType.anchorButton;
  }

  get isMenuButton() {
    return this.buttonConfig.buttonCategory === ButtonCategory.menubutton;
  }

  get tooltip() {
    return this.buttonConfig?.tooltip ? this.buttonConfig?.tooltip : '';
  }
}
