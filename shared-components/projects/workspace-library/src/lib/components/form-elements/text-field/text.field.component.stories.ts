/* eslint-disable no-alert */
import {
  Meta,
  StoryObj,
  argsToTemplate,
  moduleMetadata,
} from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldComponent } from './text.field.component';
import { InputType } from '../../../models/text.field';
import { MaterialModule } from '../../../material/material.module';

const meta: Meta<TextFieldComponent> = {
  title: 'TextField',
  component: TextFieldComponent,
  argTypes: {
    config: {
      description: `
      label:label for field
      
      placeholder:pass placeholder for field

      formControlName:pass for form handling

      type:pass type of textfield from below
      text = 1,
      number = 2,
      email = 3,
      password = 4,

      onEnterPress:pass method to call on Enterpress
      
      customclass:pass css class for aditional styling
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [],
      providers: [FormGroupDirective],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: TextFieldComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-text-field ${argsToTemplate(args)}></lib-text-field>
   `,
  }),
};

export default meta;
type Story = StoryObj<TextFieldComponent>;

export const TextField: Story = {
  args: {
    config: {
      label: 'Username',
      formControlName: 'userName',
      placeholder: '',
      type: InputType.text,
      customClass: 'small-width-field',
      onEnterPress: () => {
        alert('Enter Press');
      },
    },
    isSubmitted: true,
  },
};

export const Password: Story = {
  args: {
    config: {
      label: 'Password',
      formControlName: 'password',
      placeholder: '',
      type: InputType.password,
      customClass: 'custom-form-control',
      onEnterPress: () => {
        alert('Enter Press');
      },
    },
    isSubmitted: true,
  },
};
