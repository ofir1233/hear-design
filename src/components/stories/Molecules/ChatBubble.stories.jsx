/**
 * Molecules/ChatBubble
 *
 * Tier: Molecule — a single message in the chat thread.
 * Three roles: 'ai' (markdown, action row, related chips), 'user' (right-aligned),
 * 'thinking' (animated typing dots).
 */
import ChatBubble from '../../ChatBubble.jsx'

export default {
  title: 'Molecules/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tier: Molecule** — Single message bubble in the chat thread. ' +
          'Role `ai`: renders markdown (via react-markdown + remark-gfm), action row (thumbs, copy, regenerate), and optional related-question chips. ' +
          'Role `user`: right-aligned plain text. ' +
          'Role `thinking`: animated three-dot indicator.',
      },
    },
  },
  argTypes: {
    role:        { control: { type: 'radio' }, options: ['ai', 'user', 'thinking'] },
    showActions: { control: 'boolean' },
    copied:      { control: 'boolean' },
  },
}

export const AIResponse = {
  args: {
    role: 'ai',
    text: 'The top three topics driving escalations this week are **Billing Disputes** (34%), **Account Access** (21%), and **Refund Requests** (15%). Compared to last week, billing disputes are up 8%.',
    related: ['Show billing dispute breakdown', 'Compare to last month', 'Which agents handled most escalations?'],
    showActions: true,
  },
}

export const UserMessage = {
  args: {
    role: 'user',
    text: 'What are the top topics driving escalations this week?',
  },
}

export const Thinking = {
  args: {
    role: 'thinking',
    text: '',
  },
  parameters: {
    docs: {
      description: { story: 'Animated three-dot indicator shown while the AI is generating a response.' },
    },
  },
}

export const WithMarkdownTable = {
  args: {
    role: 'ai',
    text: `Here's the agent performance breakdown:\n\n| Agent | CSAT | Calls | Avg Handle |\n|---|---|---|---|\n| Sarah Chen | 98.4 | 142 | 4:12 |\n| Marcus Reid | 96.1 | 118 | 5:07 |\n| Priya Nair | 94.8 | 97 | 6:34 |`,
    showActions: true,
  },
}

export const ActionsCopied = {
  args: {
    role: 'ai',
    text: 'Call volume is trending up 12% compared to yesterday.',
    showActions: true,
    copied: true,
  },
  parameters: {
    docs: {
      description: { story: 'Copy button shows checkmark for ~1.4 s after click.' },
    },
  },
}

export const NoRelated = {
  args: {
    role: 'ai',
    text: 'No follow-up suggestions are available for this response.',
    related: [],
    showActions: false,
  },
}
