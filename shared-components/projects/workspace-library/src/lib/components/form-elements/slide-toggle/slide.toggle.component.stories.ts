/* eslint-disable no-console */
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { SlideToggleComponent } from './slide.toggle.component';
import { MaterialModule } from '../../../material/material.module';

const meta: Meta<SlideToggleComponent> = {
  title: 'SlideToggle',
  component: SlideToggleComponent,
  argTypes: {
    config: {
      description: `
      label:label for field
      
      formControlName:pass for form handling

      change:pass method to call onchange

      click:pass methos to call onclick
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
  render: (args: SlideToggleComponent) => ({
    props: {
      ...args,
    },
    template: `
    <lib-slide-toggle ${argsToTemplate(args)}></lib-slide-toggle>
    `,
  }),
};

export default meta;
type Story = StoryObj<SlideToggleComponent>;

export const slidetoggle: Story = {
  args: {
    config: {
      label: 'Active',
      formControlName: 'active',
      change: () => {
        console.log('change');
      },
      click: () => {
        console.log('click');
      },
    },
  },
};
