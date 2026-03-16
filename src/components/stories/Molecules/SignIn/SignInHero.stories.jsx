/**
 * Molecules/Sign In/Hero
 *
 * Tier: Molecules — a functional composition of Atoms.
 *
 * Logo + badge pill + headline block at the top of the Sign In page.
 *
 * Composed of:
 *   Atoms/Hear Logo  (the SVG brand mark injected in the hero header)
 *   + badge pill (styled inline — candidate for extraction as a Label atom)
 *   + headline text (H-scale typography token)
 *
 * Consumed by:
 *   Organisms/Sign In  (first element in the auth panel)
 */
import SignInHero from '../../../sign-in/SignInHero.jsx'

const signInPanel = (Story) => (
  <div style={{ padding: 40, minWidth: 340 }}>
    <Story />
  </div>
)

export default {
  title: 'Molecules/Sign In/Hero',
  component: SignInHero,
  tags: ['autodocs'],
  decorators: [signInPanel],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        component:
          '**Tier: Molecules** — Functional composition of Atoms. ' +
          'Logo + badge + headline block used at the top-left of the Sign In page. ' +
          '\n\n**Atoms injected:** `Atoms/Hear Logo` (the SVG brand mark). ' +
          'The badge pill and headline text are inline — the pill is a candidate for extraction ' +
          'as a reusable `Atoms/Badge` component if it appears elsewhere in the system. ' +
          '\n\n**Consumed by:** `Organisms/Sign In`',
      },
    },
  },
  argTypes: {
    badge: { control: 'text', description: 'Label shown in the pill badge below the logo' },
  },
}

/** Default badge — "Design Lab" environment label. */
export const Default = {
  args: { badge: 'Design Lab' },
}

/** Custom badge — alternative environment or tier label. */
export const CustomBadge = {
  args: { badge: 'Enterprise' },
}
