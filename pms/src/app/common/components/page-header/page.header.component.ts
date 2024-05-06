import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button, ButtonType, ButtonVariant, TooltipDirection } from 'workspace-library';
import { BreadcrumbItem } from '@models/common.model';

@Component({
  selector: 'app-page-header',
  templateUrl: './page.header.component.html',
  styleUrls: ['./page.header.component.css']
})
export class PageHeaderComponent implements OnInit {
  // #region class members
  @Input() showAddButton!: boolean;
  @Input() showSaveButton!: boolean;
  @Input() showBackButton!: boolean;
  @Input() items: BreadcrumbItem[] = [];
  @Input() heading!: string;
  @Input() tooltipMessage!: string;
  @Input() backButtonTitle!: string;
  @Output() handleAddClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() handleSaveClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() handleBackClick: EventEmitter<void> = new EventEmitter<void>();
  addBtnConfig!: Button;
  saveBtnConfig!: Button;
  backBtnConfig!: Button;
  // #endregion

  ngOnInit(): void {
    this.setBtnConfig();
  }

  // #region class methods
  setBtnConfig() {
    this.addBtnConfig = {
      id: 'addBtnPageHeader',
      buttonText: "Add Button",
      buttonType: ButtonType.img,
      buttonVariant: ButtonVariant.iconOnly,
      imgUrl: '../../../../assets/images/plus-icon-blue.svg',
      className: 'icon-btn plus-btn',
      customWidthClass: '',
      tooltip: this.tooltipMessage ?? "",
      tooltipDirection: TooltipDirection.left,
      tooltipClass: 'custom-tooltip left-pos',
      callback: () => { this.handleAddClick.emit(); },
    };

    this.backBtnConfig = {
      isVisible: true,
      id: 'backBtnPageHeader',
      buttonText: this.backButtonTitle,
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.stroked,
      className: 'custom-border-btn',
      customWidthClass: '',
      tooltip: this.tooltipMessage ?? "",
      callback: () => { this.handleBackClick.emit(); },
    };

    this.saveBtnConfig = {
      id: 'saveBtnPageHeader',
      buttonText: "Save Button",
      buttonType: ButtonType.img,
      buttonVariant: ButtonVariant.iconOnly,
      imgUrl: '../../../../assets/images/save-search-icon.svg',
      className: 'icon-btn',
      customWidthClass: '',
      tooltip: this.tooltipMessage ?? "",
      tooltipDirection: TooltipDirection.left,
      tooltipClass: 'custom-tooltip left-pos',
      callback: () => { this.handleSaveClick.emit(); },
    };
  }
  // #endregion
}
