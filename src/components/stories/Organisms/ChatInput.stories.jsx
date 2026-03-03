/**
 * Organisms/Chat Input
 *
 * Tier: Organisms — a complex, self-contained interface section.
 *
 * Primary user input module. Multi-feature composition of several
 * interactive sub-units, all currently defined inline within ChatInput.jsx.
 *
 * ⚠️ COMPOSITION OPACITY — see flag below.
 *
 * Inline sub-components (not yet extracted as Atoms):
 *   MicIcon        — voice input trigger icon
 *   SubmitIcon     — send arrow icon (inside the submit button)
 *   AttachIcon     — file attachment icon
 *   ReturnIcon     — keyboard return hint icon
 *   NavigateIcon   — arrow-key hint icon
 *   CloseIcon      — escape-key hint icon (ESC label)
 *   ThinkingDots   — animated loading indicator (3-dot bounce)
 *
 * Resolution: Extract icons to `src/components/icons/` and register
 * each as an `Atoms/` story to make the organism's dependency graph
 * transparent and reusable across the system.
 */
import ChatInput from '../../ChatInput.jsx'

export default {
  title: 'Organisms/Chat Input',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-light' },
    docs: {
      description: {
        component:
          '**Tier: Organisms** — Complex, self-contained input section. ' +
          'Features: auto-resize textarea, `@` mention trigger with dropdown, ' +
          'file attachment (`+`), voice mic button, and an animated send button (arrow → thinking dots). ' +
          '`onSubmit(text)` fires on Enter (without Shift) or send-button click. ' +
          '\n\n**Atoms composed (inline — not yet extracted):** ' +
          'MicIcon, SubmitIcon, AttachIcon, ReturnIcon, NavigateIcon, CloseIcon, ThinkingDots. ' +
          '\n\n> ⚠️ **COMPOSITION OPACITY** — The 7 icon/animation sub-components above are defined ' +
          'inline in `ChatInput.jsx` with no individual story coverage. ' +
          'Developers cannot locate or reuse them from the design system. ' +
          '**Resolution:** Extract to `src/components/icons/` and add `Atoms/Chat Input Icons` story.',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'True while AI is streaming — disables submission, shows thinking dots',
    },
    settled: {
      control: 'boolean',
      description: 'True after a response completes — dropdowns open upward instead of downward',
    },
    defaultText: {
      control: 'text',
      description: 'Initial textarea content (submit button appears when non-empty)',
    },
    initialUploadOpen: {
      control: 'boolean',
      description: 'Open the upload dropdown on mount',
    },
    initialMentionQuery: {
      control: 'text',
      description: 'Seed the @mention dropdown on mount (empty string = show all items)',
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Called with the trimmed input string when the user submits',
    },
    onMentionChange: {
      action: 'onMentionChange',
      description: 'Called with `true/false` whenever @mention dropdown opens or closes',
    },
  },
}

/** Idle state — ready for user input. Mic button visible, submit hidden. */
export const Default = {
  args: { loading: false, settled: false },
}

/** Text entered — submit button slides in, mic fades out. */
export const WithText = {
  args: {
    loading: false,
    settled: false,
    defaultText: "What are the top signals from last week's enterprise calls?",
  },
  parameters: {
    docs: {
      description: {
        story: 'Submit button is visible when `defaultText` (or any typed text) is non-empty.',
      },
    },
  },
}

/** Long multi-line text — textarea auto-resizes up to `max-h-48`. */
export const WithLongText = {
  args: {
    loading: false,
    settled: false,
    defaultText:
      'Summarise the key themes from Q1 calls:\n' +
      '1. Enterprise churn signals and at-risk accounts\n' +
      '2. Feature requests mentioned more than 3 times\n' +
      '3. Competitor comparisons that came up in discovery\n' +
      '4. Onboarding friction points raised by new customers\n' +
      '5. Any pricing or packaging objections',
  },
}

/** Loading — AI is streaming; arrow slides left, thinking dots slide in. */
export const Loading = {
  args: { loading: true, settled: false, defaultText: 'Tell me about churn risk accounts.' },
  parameters: {
    docs: {
      description: {
        story: 'Submit is blocked. The send button shows animated thinking dots instead of the arrow.',
      },
    },
  },
}

/** Settled — response complete. Dropdowns open upward. */
export const Settled = {
  args: { loading: false, settled: true },
}

/** Follow-up streaming — new question submitted while settled below a response. */
export const SettledAndLoading = {
  args: {
    loading: true,
    settled: true,
    defaultText: 'Which of those accounts are in the healthcare vertical?',
  },
}

/** @mention dropdown open — all items visible, keyboard-navigable. */
export const MentionOpen = {
  args: {
    loading: false,
    settled: false,
    defaultText: '@',
    initialMentionQuery: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Triggered by typing `@`. `initialMentionQuery: ""` seeds all items on mount.',
      },
    },
  },
}

/** @mention dropdown in settled mode — panel attaches upward. */
export const MentionOpenSettled = {
  args: {
    loading: false,
    settled: true,
    defaultText: 'Loop in @',
    initialMentionQuery: '',
  },
}

/** Upload dropdown open — "Upload file" option visible. */
export const UploadOpen = {
  args: { loading: false, settled: false, initialUploadOpen: true },
}

/** Upload dropdown in settled mode — panel attaches upward. */
export const UploadOpenSettled = {
  args: { loading: false, settled: true, initialUploadOpen: true },
}
