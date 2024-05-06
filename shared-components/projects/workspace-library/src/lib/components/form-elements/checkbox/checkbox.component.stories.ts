/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxComponent } from './checkbox.component';
import { MaterialModule } from '../../../material/material.module';

const meta: Meta<CheckboxComponent> = {
  title: 'Checkbox',
  component: CheckboxComponent,
  argTypes: {
    config: {
      description: `
      label:  Label for field
      
      change:pass method call when chnage in checkbox
      
      click: pass method call when click on checkbox,
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [FormGroupDirective],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: CheckboxComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-checkbox ${argsToTemplate(args)}></lib-checkbox>`
  }),
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const checkbox: Story = {
  args: {
    config: {
      label: 'Remember Me',
      formControlName: 'rememberMe',
      change: () => {
        console.log('change');
      },
      click: () => {
        console.log('click');
      },
    },
  },
};
