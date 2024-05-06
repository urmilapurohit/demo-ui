import { Preview, componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [componentWrapperDecorator((story) => `<div class="story-card">${story}</div>`)],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
