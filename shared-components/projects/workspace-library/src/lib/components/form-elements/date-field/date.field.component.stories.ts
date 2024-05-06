/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateFieldComponent } from './date.field.component';
import { MaterialModule } from '../../../material/material.module';
import { ShowErrorComponent } from '../form.elements.index';

export const actionsData = {
  onChangeDate: action('onChangeDate'),
  onEnterPress: action('onEnterPress'),
};

const meta: Meta<DateFieldComponent> = {
  title: 'Datefield',
  component: DateFieldComponent,
  argTypes: {
    config: {
      description: `
      label:  Label for field
      
      placeholder: Placeholder for field

      min:pass min date to be selected in date

      max:pass max date to be selected

      onChangeDate: pass method to call onChange

      onEnterPress: pass method to call onEnter
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MaterialModule],
      declarations: [ShowErrorComponent],
      providers: [FormGroupDirective],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: DateFieldComponent) => ({
    props: {
      ...args,
      onChangeDate: actionsData.onChangeDate,
      onEnterPress: actionsData.onEnterPress,
    },
    template: `<lib-date-field ${argsToTemplate(args)}></lib-date-field>`,
    styles: []
  }),
};

export default meta;
type Story = StoryObj<DateFieldComponent>;

export const DateField: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments'
      },
    },
  },
  args: {
    config: {
      label: 'Birth Date',
      formControlName: 'dateOfBirth',
      placeholder: 'Birth Date',
      max: () => new Date('01/10/2024'),
      min: () => new Date('01/01/2024'),
      onChangeDate: (value: any) => console.log('onChangeDate', value),
      onEnterPress: (value: any) => console.log('onEnterPress', value),
    },
  }
};
