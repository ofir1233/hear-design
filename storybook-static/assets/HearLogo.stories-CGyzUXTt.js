import{j as e}from"./iframe-BXICU-hg.js";import{H as p}from"./HearLogo-BRW9p_QJ.js";import"./preload-helper-D1UD9lgW.js";const h={title:"Atoms/Hear Logo",component:p,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"**Tier: Atoms** — Indivisible brand mark. No sub-component dependencies. Rendered as inline SVG (viewBox 0 0 69 60). The coral fill (`#FF7056`) is hardcoded in the path — no CSS override is needed on dark surfaces. Use `className` with Tailwind height utilities (`h-6`, `h-12`, etc.) to control size. \n\n**Consumed by:** `Molecules/Sign In/Hero`, `Organisms/Sidebar`"}}},argTypes:{className:{description:"CSS class applied to the root `<svg>`. Use Tailwind for sizing.",control:{type:"text"},table:{type:{summary:"string"},defaultValue:{summary:"''"}}}}},s={args:{className:""}},r={args:{className:"h-6 w-auto"}},n={args:{className:"h-12 w-auto"}},o={args:{className:"h-24 w-auto"}},t={args:{className:"h-8 w-auto"},parameters:{backgrounds:{default:"hear-sidebar"},docs:{description:{story:"Placement context: top-left of `Organisms/Sidebar`. `h-8` (32px) matches the current sidebar header sizing."}}}},l={args:{className:"h-12 w-auto"},parameters:{backgrounds:{default:"hear-dark"},docs:{description:{story:"The `#FF7056` fill is hardcoded in SVG — no CSS override needed for dark surfaces."}}}},i={render:()=>e.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:24,padding:16},children:[{label:"xs (16px)",cls:"h-4 w-auto"},{label:"sm (24px)",cls:"h-6 w-auto"},{label:"md (48px)",cls:"h-12 w-auto"},{label:"lg (96px)",cls:"h-24 w-auto"},{label:"xl (128px)",cls:"h-32 w-auto"}].map(({label:a,cls:d})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8},children:[e.jsx(p,{className:d}),e.jsx("span",{style:{fontSize:10,color:"#6b7280"},children:a})]},a))}),parameters:{layout:"padded",docs:{description:{story:"All canonical size variants for design review."}}}},c={render:()=>e.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:24,padding:16},children:[{label:"xs (16px)",cls:"h-4 w-auto"},{label:"sm (24px)",cls:"h-6 w-auto"},{label:"md (48px)",cls:"h-12 w-auto"},{label:"lg (96px)",cls:"h-24 w-auto"},{label:"xl (128px)",cls:"h-32 w-auto"}].map(({label:a,cls:d})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8},children:[e.jsx(p,{className:d}),e.jsx("span",{style:{fontSize:10,color:"#6b7280"},children:a})]},a))}),parameters:{layout:"padded",backgrounds:{default:"hear-dark"},docs:{description:{story:"All size variants on `#181818` — hardcoded fill holds at every scale."}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    className: ''
  }
}`,...s.parameters?.docs?.source},description:{story:"Natural dimensions — no class applied. Baseline reference size.",...s.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'h-6 w-auto'
  }
}`,...r.parameters?.docs?.source},description:{story:"24px — compact form for tight header bars and collapsed sidebar.",...r.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'h-12 w-auto'
  }
}`,...n.parameters?.docs?.source},description:{story:"48px — standard placement in headers and sign-in screens.",...n.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'h-24 w-auto'
  }
}`,...o.parameters?.docs?.source},description:{story:"96px — hero and marketing contexts, loading screens.",...o.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'h-8 w-auto'
  },
  parameters: {
    backgrounds: {
      default: 'hear-sidebar'
    },
    docs: {
      description: {
        story: 'Placement context: top-left of \`Organisms/Sidebar\`. ' + '\`h-8\` (32px) matches the current sidebar header sizing.'
      }
    }
  }
}`,...t.parameters?.docs?.source},description:{story:"Logo on the sidebar background (`#F5F5F3`).\r\n`h-8` (32px) matches the current Sidebar header placement.",...t.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'h-12 w-auto'
  },
  parameters: {
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: 'The \`#FF7056\` fill is hardcoded in SVG — no CSS override needed for dark surfaces.'
      }
    }
  }
}`,...l.parameters?.docs?.source},description:{story:`Logo on dark canvas — coral fill is self-contained.\r
No CSS override required.`,...l.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'flex-end',
    gap: 24,
    padding: 16
  }}>\r
      {[{
      label: 'xs (16px)',
      cls: 'h-4 w-auto'
    }, {
      label: 'sm (24px)',
      cls: 'h-6 w-auto'
    }, {
      label: 'md (48px)',
      cls: 'h-12 w-auto'
    }, {
      label: 'lg (96px)',
      cls: 'h-24 w-auto'
    }, {
      label: 'xl (128px)',
      cls: 'h-32 w-auto'
    }].map(({
      label,
      cls
    }) => <div key={label} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>\r
          <HearLogo className={cls} />\r
          <span style={{
        fontSize: 10,
        color: '#6b7280'
      }}>{label}</span>\r
        </div>)}\r
    </div>,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All canonical size variants for design review.'
      }
    }
  }
}`,...i.parameters?.docs?.source},description:{story:"All canonical size variants side-by-side on a light background.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'flex-end',
    gap: 24,
    padding: 16
  }}>\r
      {[{
      label: 'xs (16px)',
      cls: 'h-4 w-auto'
    }, {
      label: 'sm (24px)',
      cls: 'h-6 w-auto'
    }, {
      label: 'md (48px)',
      cls: 'h-12 w-auto'
    }, {
      label: 'lg (96px)',
      cls: 'h-24 w-auto'
    }, {
      label: 'xl (128px)',
      cls: 'h-32 w-auto'
    }].map(({
      label,
      cls
    }) => <div key={label} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>\r
          <HearLogo className={cls} />\r
          <span style={{
        fontSize: 10,
        color: '#6b7280'
      }}>{label}</span>\r
        </div>)}\r
    </div>,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: 'All size variants on \`#181818\` — hardcoded fill holds at every scale.'
      }
    }
  }
}`,...c.parameters?.docs?.source},description:{story:"All size variants on the dark canvas — confirms no inversion needed at any scale.",...c.parameters?.docs?.description}}};const x=["Default","Small","Medium","Large","OnSidebar","OnDark","AllSizes","AllSizesOnDark"];export{i as AllSizes,c as AllSizesOnDark,s as Default,o as Large,n as Medium,l as OnDark,t as OnSidebar,r as Small,x as __namedExportsOrder,h as default};
