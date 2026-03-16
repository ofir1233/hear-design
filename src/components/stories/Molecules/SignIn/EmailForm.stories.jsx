/**
 * Molecules/Sign In/Email Form
 *
 * Tier: Molecules — a functional composition of Atoms.
 *
 * Email text input + "Continue with email" submit button.
 * A Molecule because it combines two distinct interactive atom types:
 * a controlled text input and a submit button, sharing a single submit action.
 *
 * Composed of:
 *   Input atom   (email text field — candidate for Atoms/TextInput)
 *   Button atom  (submit CTA — candidate for Atoms/Button)
 *
 * Consumed by:
 *   Organisms/Sign In  (secondary auth path below the OR divider)
 *
 * Note: email sign-in is not yet implemented in production.
 * The `disabled` prop controls the coming-soon state.
 */
import EmailForm from '../../../sign-in/EmailForm.jsx'

const signInPanel = (Story) => (
  <div style={{ padding: 32, width: 340 }}>
    <Story />
  </div>
)

export default {
  title: 'Molecules/Sign In/Email Form',
  component: EmailForm,
  tags: ['autodocs'],
  decorators: [signInPanel],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        component:
          '**Tier: Molecules** — Input + Button composition. ' +
          'Email input field combined with a "Continue with email" submit button. ' +
          'Currently `disabled` by default — email sign-in is coming soon. ' +
          'Set `disabled={false}` to preview the active/enabled state. ' +
          '\n\n**Atoms composed:** Text input (`Atoms/TextInput` — not yet extracted), ' +
          'submit button (`Atoms/Button` — not yet extracted). ' +
          '\n\n**Consumed by:** `Organisms/Sign In`',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables input and button (coming soon state)' },
  },
}

/** Coming-soon state — input and button are locked. */
export const Disabled = {
  args: { disabled: true },
}

/** Active state — email sign-in is enabled. */
export const Enabled = {
  args: { disabled: false },
}
