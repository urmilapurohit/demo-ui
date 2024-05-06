/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import {
  ReactiveFormsModule,
  FormGroupDirective
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material/material.module';
import { AutoCompleteComponent } from './auto.complete.component';

const meta: Meta<AutoCompleteComponent> = {
  title: 'AutoComplete',
  component: AutoCompleteComponent,
  argTypes: {
    config: {
        description: `
        options: pass options you want in dropdown

        placeholder: pass placeholder for field

        customFormFieldClass: For additional styling

        onselect: pass method you want to call onSelect

        onInput: pass method you want to call onInput`,
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
  render: (args: AutoCompleteComponent) => ({
    props: {
      ...args,
    },
    template: `
   <lib-auto-complete ${argsToTemplate(
      args
    )}></lib-auto-complete>`,
  }),
};

export default meta;
type Story = StoryObj<AutoCompleteComponent>;

export const Autocomplete: Story = {
  args: {
    config: {
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
    },
  },
};
