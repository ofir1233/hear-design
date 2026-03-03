/**
 * Modules/Sign In
 *
 * Google OAuth authentication page with domain validation (@hear.ai),
 * hero video background, decorative SVG arcs, and grain overlay.
 *
 * Note: Google OAuth will not function in Storybook without a real
 * GOOGLE_CLIENT_ID environment variable. The story uses a mock onSignIn
 * action to demonstrate the component shell.
 */
import SignIn from '../../SignIn.jsx'

export default {
  title: 'Modules/Sign In',
  component: SignIn,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page sign-in screen with Google OAuth (`@react-oauth/google`). ' +
          'Domain validation restricts login to `@hear.ai` addresses. ' +
          'Dark-themed with grain texture overlay and decorative SVG arc background. ' +
          '**Note:** Google OAuth requires a real `GOOGLE_CLIENT_ID` — the button ' +
          'renders but auth flow will not complete in Storybook preview.',
      },
    },
  },
  argTypes: {
    onSignIn: {
      action: 'onSignIn',
      description: 'Callback fired after successful authentication and domain validation',
    },
  },
}

/** Full sign-in page — dark theme, grain overlay, decorative arcs. */
export const Default = {
  args: {},
  parameters: {
    backgrounds: { default: 'hear-dark' },
  },
}
