/**
 * Molecules/Sign In/Google Button
 *
 * Tier: Molecules — a functional composition of Atoms.
 *
 * "Continue with Google" OAuth button with loading and error states.
 * While visually a single button, it is classified as a Molecule because
 * it composes a clickable control + an error message display region,
 * each of which can change state independently.
 *
 * Composed of:
 *   Button control  (the primary interactive element — candidate for Atoms/Button)
 *   Google icon     (inline SVG — candidate for Atoms/Icon or Atoms/GoogleIcon)
 *   Error label     (conditional text display — candidate for Atoms/ErrorText)
 *
 * Consumed by:
 *   Organisms/Sign In  (primary OAuth entry point)
 */
import GoogleButton from '../../../sign-in/GoogleButton.jsx'

const signInPanel = (Story) => (
  <div style={{ padding: 32, width: 340 }}>
    <Story />
  </div>
)

export default {
  title: 'Molecules/Sign In/Google Button',
  component: GoogleButton,
  tags: ['autodocs'],
  decorators: [signInPanel],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        component:
          '**Tier: Molecules** — Button + error display composition. ' +
          '"Continue with Google" OAuth trigger. Pass `onClick` to start the Google login flow. ' +
          '`loading` disables the button and shows "Signing in…". ' +
          '`error` renders a validation message below the button. ' +
          '\n\n**Sub-components (inline, not yet extracted):** Button control, Google icon SVG, error text. ' +
          'These are candidates for extraction as discrete `Atoms/` entries. ' +
          '\n\n**Consumed by:** `Organisms/Sign In`',
      },
    },
  },
  argTypes: {
    onClick:  { action: 'clicked',   description: 'Fired when the button is pressed' },
    loading:  { control: 'boolean',  description: 'Shows loading state, disables button' },
    error:    { control: 'text',     description: 'Error message shown below the button' },
  },
}

/** Default ready-to-click state. */
export const Default = {
  args: { loading: false, error: '' },
}

/** In-progress — OAuth popup is open. */
export const Loading = {
  args: { loading: true, error: '' },
}

/** Domain restriction error — user signed in with a non-@hear.ai account. */
export const DomainError = {
  args: { loading: false, error: 'Access is restricted to @hear.ai accounts.' },
}

/** Generic network / OAuth failure. */
export const GenericError = {
  args: { loading: false, error: 'Google sign-in failed. Please try again.' },
}
