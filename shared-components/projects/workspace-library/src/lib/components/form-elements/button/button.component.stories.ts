/* eslint-disable key-spacing */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-alert */
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ButtonCategory,
  ButtonType,
  ButtonVariant,
} from '../../../models/button';
import { ButtonComponent } from './button.component';
import { MaterialModule } from '../../../material/material.module';

const meta: Meta<ButtonComponent> = {
  title: 'Button',
  component: ButtonComponent,
  argTypes: {
    buttonConfig: {
      description:`
      id:  'The ID of the button.',

      buttonText: The text content of the button.
       
      buttonType: The type of the button.
      default = 1,
      icon = 2,
      img = 3,
      imgWithText = 4,
      iconWithText = 5,
      anchorButton = 6,

      buttonVariant:The variant style of the button.
      stroked = 1,
      flat = 2,
      iconOnly = 3,
      anchorButton = 4,

      buttonCategory:The category of the button.
      normal = 1,
      menubutton = 2

      className:Additional CSS class for styling.

      customWidthClass:Custom width CSS class for the button.

      callback: Callback function triggered on button click.
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      declarations: [ButtonComponent],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: ButtonComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-button ${argsToTemplate(args)}></lib-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const NormalButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
  args: {
    buttonConfig: {
      id: 'normalButton',
      buttonText: 'Click me',
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.stroked,
      buttonCategory: ButtonCategory.normal,
      className: 'primary-btn',
      customWidthClass: '',
      callback: (element: any, item: any) => {
        alert('Button Clicked');
      },
    },
  },
};
