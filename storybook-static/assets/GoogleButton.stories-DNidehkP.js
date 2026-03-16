import{j as t}from"./iframe-BXICU-hg.js";import{G as a}from"./GoogleButton-CNCGA7M5.js";import"./preload-helper-D1UD9lgW.js";const i=n=>t.jsx("div",{style:{padding:32,width:340},children:t.jsx(n,{})}),g={title:"Molecules/Sign In/Google Button",component:a,tags:["autodocs"],decorators:[i],parameters:{layout:"centered",backgrounds:{default:"hear-dark"},docs:{description:{component:'**Tier: Molecules** — Button + error display composition. "Continue with Google" OAuth trigger. Pass `onClick` to start the Google login flow. `loading` disables the button and shows "Signing in…". `error` renders a validation message below the button. \n\n**Sub-components (inline, not yet extracted):** Button control, Google icon SVG, error text. These are candidates for extraction as discrete `Atoms/` entries. \n\n**Consumed by:** `Organisms/Sign In`'}}},argTypes:{onClick:{action:"clicked",description:"Fired when the button is pressed"},loading:{control:"boolean",description:"Shows loading state, disables button"},error:{control:"text",description:"Error message shown below the button"}}},r={args:{loading:!1,error:""}},e={args:{loading:!0,error:""}},o={args:{loading:!1,error:"Access is restricted to @hear.ai accounts."}},s={args:{loading:!1,error:"Google sign-in failed. Please try again."}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    loading: false,
    error: ''
  }
}`,...r.parameters?.docs?.source},description:{story:"Default ready-to-click state.",...r.parameters?.docs?.description}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    error: ''
  }
}`,...e.parameters?.docs?.source},description:{story:"In-progress — OAuth popup is open.",...e.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    loading: false,
    error: 'Access is restricted to @hear.ai accounts.'
  }
}`,...o.parameters?.docs?.source},description:{story:"Domain restriction error — user signed in with a non-@hear.ai account.",...o.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    loading: false,
    error: 'Google sign-in failed. Please try again.'
  }
}`,...s.parameters?.docs?.source},description:{story:"Generic network / OAuth failure.",...s.parameters?.docs?.description}}};const p=["Default","Loading","DomainError","GenericError"];export{r as Default,o as DomainError,s as GenericError,e as Loading,p as __namedExportsOrder,g as default};
