import{j as o}from"./iframe-BXICU-hg.js";import{S as r}from"./SignInHero-bO0t1ZR4.js";import"./preload-helper-D1UD9lgW.js";const s=t=>o.jsx("div",{style:{padding:40,minWidth:340},children:o.jsx(t,{})}),c={title:"Molecules/Sign In/Hero",component:r,tags:["autodocs"],decorators:[s],parameters:{layout:"centered",backgrounds:{default:"hear-dark"},docs:{description:{component:"**Tier: Molecules** — Functional composition of Atoms. Logo + badge + headline block used at the top-left of the Sign In page. \n\n**Atoms injected:** `Atoms/Hear Logo` (the SVG brand mark). The badge pill and headline text are inline — the pill is a candidate for extraction as a reusable `Atoms/Badge` component if it appears elsewhere in the system. \n\n**Consumed by:** `Organisms/Sign In`"}}},argTypes:{badge:{control:"text",description:"Label shown in the pill badge below the logo"}}},e={args:{badge:"Design Lab"}},a={args:{badge:"Enterprise"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'Design Lab'
  }
}`,...e.parameters?.docs?.source},description:{story:'Default badge — "Design Lab" environment label.',...e.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'Enterprise'
  }
}`,...a.parameters?.docs?.source},description:{story:"Custom badge — alternative environment or tier label.",...a.parameters?.docs?.description}}};const l=["Default","CustomBadge"];export{a as CustomBadge,e as Default,l as __namedExportsOrder,c as default};
