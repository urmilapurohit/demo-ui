/* eslint-disable no-console */
import { moduleMetadata, type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { TextAreaComponent } from './text.area.component';

const meta: Meta<TextAreaComponent> = {
  title: 'TextArea',
  component: TextAreaComponent,
  argTypes: {
    config: {
      description: `
      label:label for field
      
      formControlName:pass for form handling

      keyup:pass method to call onkeyup

      blur:pass methos to call onblur

      customclass:pass css class for aditional styling
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
  render: (args: TextAreaComponent) => ({
    props: {
      ...args,
    },
    template: `
    <lib-text-area ${argsToTemplate(args)}></lib-text-area>

`,
  }),
};

export default meta;
type Story = StoryObj<TextAreaComponent>;
export const TextArea: Story = {
  args: {
    config: {
      label: 'Address',
      formControlName: 'address',
      customClass: 'custom-form-control custom-textarea',
      keyup: (event: KeyboardEvent) => console.log('KeyUp Event:', event),
      blur: (event: FocusEvent) => console.log('Blur Event:', event),
    },
  },
};
