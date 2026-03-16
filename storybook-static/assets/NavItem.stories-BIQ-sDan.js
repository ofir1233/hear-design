import{j as e}from"./iframe-BXICU-hg.js";import"./preload-helper-D1UD9lgW.js";function p(){return e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"}),e.jsx("path",{d:"M9 21V12h6v9"})]})}function l({label:d="Dashboard",active:c=!1,disabled:o=!1}){return e.jsxs("button",{disabled:o,style:{width:224,display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:"none",background:c?"#e8e8e6":"transparent",color:o?"#c4c4c4":c?"#111827":"#6b7280",fontSize:13.5,fontWeight:400,cursor:o?"not-allowed":"pointer",textAlign:"left",opacity:o?.5:1,fontFamily:"'Byrd', sans-serif",transition:"background 150ms ease, color 150ms ease"},children:[e.jsx(p,{}),d]})}const f={title:"Atoms/Nav Item",component:l,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"**Tier: Atoms** — Smallest interactive navigation unit. Base pattern for all navigation buttons in the sidebar. Uses inline styles — no CSS class dependencies. Active state: `#e8e8e6` bg + `#111827` text. Inactive state: transparent bg + `#6b7280` text. \n\n**Consumed by (intended):** `Organisms/Sidebar`\n\n> ⚠️ **ARCHITECTURAL DRIFT** — `Organisms/Sidebar` currently renders its own inline nav button markup instead of importing this atom. Style changes here will NOT propagate to the sidebar until this is resolved. **Resolution:** Replace Sidebar's internal button markup with this `NavItem` atom."}}},argTypes:{label:{control:"text",description:"Button label text"},active:{control:"boolean",description:"Active/selected state — `#e8e8e6` fill + dark text"},disabled:{control:"boolean",description:"Disabled state — reduced opacity, pointer-events off"}}},t={args:{label:"Dashboard",active:!1,disabled:!1}},a={args:{label:"Dashboard",active:!0,disabled:!1}},r={args:{label:"Dashboard",active:!1,disabled:!0}},s={args:{label:"Enterprise Account Intelligence Overview",active:!1,disabled:!1},parameters:{docs:{description:{story:"Overflow test at 224px fixed width. Item currently wraps. Flag for design review if >28-char labels are expected in production."}}}},i={args:{label:"Enterprise Account Intelligence Overview",active:!0,disabled:!1}},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4,padding:8,background:"#f5f5f3",borderRadius:12},children:[e.jsx(l,{label:"Inactive",active:!1,disabled:!1}),e.jsx(l,{label:"Active",active:!0,disabled:!1}),e.jsx(l,{label:"Disabled",active:!1,disabled:!0})]}),parameters:{layout:"centered",docs:{description:{story:"All navigable states on the sidebar background (`#f5f5f3`) for realistic preview."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Dashboard',
    active: false,
    disabled: false
  }
}`,...t.parameters?.docs?.source},description:{story:"Default inactive state — transparent background, muted text.",...t.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Dashboard',
    active: true,
    disabled: false
  }
}`,...a.parameters?.docs?.source},description:{story:"Active state — `#e8e8e6` fill, dark text, matches sidebar selection.",...a.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Dashboard',
    active: false,
    disabled: true
  }
}`,...r.parameters?.docs?.source},description:{story:"Disabled state — reduced opacity, pointer-events off.",...r.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Enterprise Account Intelligence Overview',
    active: false,
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Overflow test at 224px fixed width. Item currently wraps. ' + 'Flag for design review if >28-char labels are expected in production.'
      }
    }
  }
}`,...s.parameters?.docs?.source},description:{story:"Long label — tests text overflow at the fixed 224px item width.\r\nCurrently wraps. Add `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`\r\nif single-line truncation is the desired production behaviour.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Enterprise Account Intelligence Overview',
    active: true,
    disabled: false
  }
}`,...i.parameters?.docs?.source},description:{story:"Long label in active state.",...i.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 8,
    background: '#f5f5f3',
    borderRadius: 12
  }}>\r
      <NavItem label="Inactive" active={false} disabled={false} />\r
      <NavItem label="Active" active={true} disabled={false} />\r
      <NavItem label="Disabled" active={false} disabled={true} />\r
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'All navigable states on the sidebar background (\`#f5f5f3\`) for realistic preview.'
      }
    }
  }
}`,...n.parameters?.docs?.source},description:{story:"All navigable states on the sidebar background — most realistic preview.",...n.parameters?.docs?.description}}};const v=["Inactive","Active","Disabled","WithLongLabel","WithLongLabelActive","AllStates"];export{a as Active,n as AllStates,r as Disabled,t as Inactive,s as WithLongLabel,i as WithLongLabelActive,v as __namedExportsOrder,f as default};
