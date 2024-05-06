import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownComponent } from './dropdown.component';
import { MaterialModule } from '../../../material/material.module';

const meta: Meta<DropdownComponent> = {
  title: 'Dropdown',
  component: DropdownComponent,
  argTypes: {
    config: {
      description: `
      label:  Label for field
      
      feature: Pass allow multiple true

      data:pass options for dropdown 

      formControlName:pass for form handling
      `
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MaterialModule],
      providers: [FormGroupDirective],
    }),
  ],
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: DropdownComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-dropdown ${argsToTemplate(args)}></lib-dropdown>`
  }),
};

export default meta;
type Story = StoryObj<DropdownComponent>;

export const dropdown: Story = {
  args: {
    config: {
        data: {
          data: [
            { id: 1, text: 'Applied' },
            { id: 2, text: 'Approved' },
            { id: 3, text: 'Rejected' },
            { id: 4, text: 'Paid' }],
        },
        feature: {
          allowMultiple: false
        },
        id: 'requestTypeFilter',
        formControlName: 'requestTypeFilter',
        label: 'Request Type Filter'
      }
  },
};

export const multiselect: Story = {
  args: {
    config: {
        data: {
          data: [
            { id: 1, text: 'Applied' },
            { id: 2, text: 'Approved' },
            { id: 3, text: 'Rejected' },
            { id: 4, text: 'Paid' }],
        },
        feature: {
          allowMultiple: true
        },
        id: 'requestTypeFilter',
        formControlName: 'requestTypeFilter',
        label: 'Request Type Filter',
        customFormFieldClass: 'custom-dropdown-wrapper',
      }
  },
};
