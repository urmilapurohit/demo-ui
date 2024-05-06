/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MaterialModule } from '../../../material/material.module';
import { RadiobuttonComponent } from './radiobutton.component';

const meta: Meta<RadiobuttonComponent> = {
  title: 'RadioButton',
  component: RadiobuttonComponent,
  argTypes: {
    config: {
      description: `
      label:label for field
      
      options:pass options for dropdown 

      formControlName:pass for form handling

      change:pass method to call onchange
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: RadiobuttonComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-radiobutton ${argsToTemplate(
      args
    )}></lib-radiobutton>`,
    styles: [],
  }),
};

export default meta;
type Story = StoryObj<RadiobuttonComponent>;

export const RadioButton: Story = {
  args: {
    config: {
      label: 'Payment Type',
      formControlName: 'paymentType',
      options: [
        { value: 1, label: 'Online', checked: true },
        { value: 2, label: 'Offline', checked: false },
      ],
      change: (event: MatRadioChange) => {
        console.log('Radio Button Change', event.value);
      },
    },
  },
};
