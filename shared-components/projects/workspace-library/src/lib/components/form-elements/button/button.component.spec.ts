/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { Button } from '../../../models/button';
import { MaterialModule } from '../../../material/material.module';
import { testAnchorButton, testEnabledButtonConfig, testIconButton, testIconOnlyButton, testImgButton, testNormalButton } from '../testdata';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [MaterialModule],
    });

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle a normal button click', () => {
    const buttonConfig: Button = testNormalButton;
    component.buttonConfig = buttonConfig;
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(buttonConfig.callback).toHaveBeenCalledOnceWith(jasmine.any(Event), undefined);
  });

  it('should handle an icon-only button click', () => {
    const buttonConfig: Button = testIconOnlyButton;
    component.buttonConfig = buttonConfig;
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(buttonConfig.callback).toHaveBeenCalledOnceWith(jasmine.any(Event), undefined);
  });

  it('should correctly identify an image button', () => {
    const imgButtonConfig: Button = testImgButton;

    component.buttonConfig = imgButtonConfig;

    expect(component.isImageButton).toBe('imgpath');
    expect(component.isIconButton).toBeFalsy;
    expect(component.isAnchorButton).toBeFalsy;
  });

  it('should correctly identify an icon button', () => {
    const iconButtonConfig: Button = testIconButton;

    component.buttonConfig = iconButtonConfig;

    expect(component.isImageButton).toBe(false);
    expect(component.isIconButton).toBe('add');
    expect(component.isAnchorButton).toBe(false);
  });

  it('should correctly identify an anchor button', () => {
    const anchorButtonConfig: Button = testAnchorButton;
    component.buttonConfig = anchorButtonConfig;
    expect(component.isImageButton).toBe(false);
    expect(component.isIconButton).toBe(false);
    expect(component.isAnchorButton).toBe(true);
  });

  it('should generate btnClass with className and customWidthClass', () => {
    const buttonConfig: Button = testAnchorButton;
    component.buttonConfig = buttonConfig;
    expect(component.btnClass).toBe('custom-btn custom-width');
  });

  it('should handle button disable based on disableCallBack', () => {
    const disabledButtonConfig: Button = testAnchorButton;
    component.buttonConfig = disabledButtonConfig;
    fixture.detectChanges();

    expect(component.isButtonDisable()).toBe(true);

    const enabledButtonConfig: Button = testEnabledButtonConfig;
    component.buttonConfig = enabledButtonConfig;
    fixture.detectChanges();
    expect(component.isButtonDisable()).toBe(false);
  });
});
