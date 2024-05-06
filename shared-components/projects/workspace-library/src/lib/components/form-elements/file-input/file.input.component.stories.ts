import { moduleMetadata, argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileInputComponent } from './file.input.component';
import { MaterialModule } from '../../../material/material.module';

export const actionsData = {
  change: action('change'),
  click: action('click')
};

const meta: Meta<FileInputComponent> = {
  title: 'FileInput',
  component: FileInputComponent,
  argTypes: {
    fileInput: {
      description: `
      allowedExtensions:Pass array of allowed extention

      multipleSelection:pass true or false 
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
  render: (args: FileInputComponent) => ({
    props: {
      ...args,
      change: actionsData.change,
      click: actionsData.click
    },
    template: `<lib-file-input ${argsToTemplate(args)}></lib-file-input>`,
    styles: []
  }),
};

export default meta;
type Story = StoryObj<FileInputComponent>;

export const FileInput: Story = {
  args: {
    allowedExtensions: ['.csv'],
    multipleSelection: true,
  },
};
