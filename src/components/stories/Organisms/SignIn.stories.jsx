/**
 * Organisms/Sign In
 *
 * Tier: Organisms — a complex, self-contained page section.
 *
 * Full-page sign-in screen. Composes all Sign In molecules into a
 * single authentication experience with Google OAuth and email fallback.
 *
 * Molecules composed:
 *   Molecules/Sign In/Hero          (logo + badge + headline)
 *   Molecules/Sign In/Google Button (OAuth CTA with loading/error states)
 *   Atoms/Auth Divider              (OR separator)
 *   Molecules/Sign In/Email Form    (email input + submit button)
 *
 * External dependency:
 *   @react-oauth/google GoogleOAuthProvider  (required context — added as decorator)
 *
 * Note: Google OAuth will not complete in Storybook without a real
 * GOOGLE_CLIENT_ID environment variable.
 */
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignIn from '../../SignIn.jsx'

export default {
  title: 'Organisms/Sign In',
  component: SignIn,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <GoogleOAuthProvider clientId="placeholder-client-id">
        <Story />
      </GoogleOAuthProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organisms** — Full authentication page section. ' +
          'Composes all Sign In molecules into a single cohesive flow. ' +
          '\n\n**Molecules & Atoms composed:** ' +
          '`Molecules/Sign In/Hero` → `Molecules/Sign In/Google Button` → ' +
          '`Atoms/Auth Divider` → `Molecules/Sign In/Email Form`. ' +
          '\n\n**External dependency:** `@react-oauth/google GoogleOAuthProvider` (injected via story decorator). ' +
          'Domain validation restricts login to `@hear.ai` addresses. ' +
          '\n\n> **Note:** Google OAuth requires a real `GOOGLE_CLIENT_ID` — the button renders ' +
          'but the auth flow will not complete in Storybook preview.',
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
