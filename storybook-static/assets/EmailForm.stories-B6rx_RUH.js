import{j as s}from"./iframe-BXICU-hg.js";import{E as a}from"./EmailForm-BdOb4wdZ.js";import"./preload-helper-D1UD9lgW.js";const n=o=>s.jsx("div",{style:{padding:32,width:340},children:s.jsx(o,{})}),c={title:"Molecules/Sign In/Email Form",component:a,tags:["autodocs"],decorators:[n],parameters:{layout:"centered",backgrounds:{default:"hear-dark"},docs:{description:{component:'**Tier: Molecules** — Input + Button composition. Email input field combined with a "Continue with email" submit button. Currently `disabled` by default — email sign-in is coming soon. Set `disabled={false}` to preview the active/enabled state. \n\n**Atoms composed:** Text input (`Atoms/TextInput` — not yet extracted), submit button (`Atoms/Button` — not yet extracted). \n\n**Consumed by:** `Organisms/Sign In`'}}},argTypes:{disabled:{control:"boolean",description:"Disables input and button (coming soon state)"}}},e={args:{disabled:!0}},t={args:{disabled:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...e.parameters?.docs?.source},description:{story:"Coming-soon state — input and button are locked.",...e.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: false
  }
}`,...t.parameters?.docs?.source},description:{story:"Active state — email sign-in is enabled.",...t.parameters?.docs?.description}}};const l=["Disabled","Enabled"];export{e as Disabled,t as Enabled,l as __namedExportsOrder,c as default};
