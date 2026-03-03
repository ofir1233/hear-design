/**
 * Modules/Chat Input
 *
 * Multi-feature chat input with auto-resize textarea, @mention dropdown,
 * file attachment button, voice input, and animated submit button.
 *
 * States: default, loading (streaming AI response), settled (response complete)
 */
import ChatInput from '../../ChatInput.jsx'

export default {
  title: 'Modules/Chat Input',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-light' },
    docs: {
      description: {
        component:
          'Primary user input module. Features: auto-resize textarea, ' +
          '`@` mention trigger with dropdown, file attachment, voice mic button, ' +
          'and an animated send button. ' +
          '`onSubmit(text)` is called on Enter (without Shift) or send button click.',
      },
    },
  },
  argTypes: {
    loading:  {
      control: 'boolean',
      description: 'True while AI is streaming a response — disables submission',
    },
    settled:  {
      control: 'boolean',
      description: 'True after a response completes — may affect UI affordances',
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Called with the trimmed input string when the user submits',
    },
    onMentionChange: {
      action: 'onMentionChange',
      description: 'Called when `@mention` state changes',
    },
  },
}

/** Idle state — ready for user input. */
export const Default = {
  args: {
    loading: false,
    settled: false,
  },
}

/** Loading state — AI is generating. Submit button/Enter should be suppressed. */
export const Loading = {
  args: {
    loading: true,
    settled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Input locked while AI response is streaming.',
      },
    },
  },
}

/** Settled state — response complete, ready for follow-up. */
export const Settled = {
  args: {
    loading: false,
    settled: true,
  },
}
