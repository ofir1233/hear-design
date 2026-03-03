/**
 * Atoms/Auth Divider
 *
 * Tier: Atoms — simplest presentational unit. No sub-components, no props.
 *
 * A purely visual "OR" separator between the Google OAuth button
 * and the email sign-in form. Has no interactive behaviour.
 *
 * Consumed by:
 *   Organisms/Sign In  (positioned between GoogleButton molecule and EmailForm molecule)
 */
import AuthDivider from '../../sign-in/AuthDivider.jsx'

export default {
  title: 'Atoms/Auth Divider',
  component: AuthDivider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        component:
          '**Tier: Atoms** — Indivisible presentational separator. No props, no interactivity. ' +
          'Renders a horizontal rule with "OR" text centred between two auth options. ' +
          '\n\n**Consumed by:** `Organisms/Sign In` (placed between `Molecules/Sign In/Google Button` and `Molecules/Sign In/Email Form`)',
      },
    },
  },
}

const panel = (Story) => (
  <div style={{ width: 340, padding: 32 }}>
    <Story />
  </div>
)

/** Default — the only state. Purely presentational. */
export const Default = {
  decorators: [panel],
}
