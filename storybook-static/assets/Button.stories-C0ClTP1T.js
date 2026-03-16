import{r as I,j as e}from"./iframe-BXICU-hg.js";import{i as z,k as w,d as k}from"./index-Bk43pguZ.js";import"./preload-helper-D1UD9lgW.js";const F={primary:{bg:"var(--c100)",bgHover:"var(--c80)",bgActive:"var(--c60)",color:"#FFFFFF",border:"none",spinTrack:"rgba(255,255,255,0.30)",spinArc:"#FFFFFF"},secondary:{bg:"transparent",bgHover:"var(--b20)",bgActive:"var(--b20)",color:"var(--b100)",border:"1.5px solid var(--b100)",spinTrack:"var(--b30)",spinArc:"var(--b100)"},ghost:{bg:"transparent",bgHover:"var(--bg-active)",bgActive:"var(--bg-active)",color:"var(--text-secondary)",border:"none",spinTrack:"var(--border-default)",spinArc:"var(--text-secondary)"},danger:{bg:"var(--c100)",bgHover:"var(--c80)",bgActive:"var(--c60)",color:"#FFFFFF",border:"none",spinTrack:"rgba(255,255,255,0.30)",spinArc:"#FFFFFF"},outline:{bg:"transparent",bgHover:"rgba(255,112,86,0.08)",bgActive:"rgba(255,112,86,0.14)",color:"var(--c100)",border:"1.5px solid var(--c100)",spinTrack:"rgba(255,112,86,0.30)",spinArc:"var(--c100)"}},A={sm:{height:32,paddingH:12,fontSize:12,borderRadius:6,gap:6,iconSize:14},md:{height:40,paddingH:16,fontSize:13,borderRadius:8,gap:8,iconSize:16},lg:{height:48,paddingH:20,fontSize:14,borderRadius:10,gap:8,iconSize:18}};function R({track:a,arc:y}){return e.jsx("span",{"aria-hidden":"true",style:{display:"inline-block",width:16,height:16,borderRadius:"50%",border:`2px solid ${a}`,borderTopColor:y,animation:"btn-spin 0.7s linear infinite",flexShrink:0}})}function r({variant:a="primary",size:y="md",disabled:f=!1,loading:h=!1,fullWidth:W=!1,leftIcon:v,rightIcon:B,onClick:D,type:T="button",children:x}){const[H,S]=I.useState(!1),[V,b]=I.useState(!1),n=F[a]??F.primary,t=A[y]??A.md,s=f||h,j=!x&&v!=null,C=s?n.bg:V?n.bgActive:H?n.bgHover:n.bg;return e.jsx("button",{"data-inspector":"Button",type:T,disabled:f,onClick:s?void 0:D,"aria-busy":h||void 0,onMouseEnter:()=>{s||S(!0)},onMouseLeave:()=>{S(!1),b(!1)},onMouseDown:()=>{s||b(!0)},onMouseUp:()=>{b(!1)},style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:t.gap,height:t.height,width:W?"100%":j?t.height:"auto",padding:j?0:`0 ${t.paddingH}px`,fontFamily:"'Byrd', sans-serif",fontSize:t.fontSize,fontWeight:500,lineHeight:1,letterSpacing:"0.01em",color:n.color,background:C,border:n.border,borderRadius:t.borderRadius,cursor:s?"not-allowed":"pointer",opacity:f?.4:1,pointerEvents:h?"none":void 0,transition:"background 150ms ease, opacity 150ms ease",whiteSpace:"nowrap",userSelect:"none",outline:"none",boxSizing:"border-box",flexShrink:0},children:h?e.jsx(R,{track:n.spinTrack,arc:n.spinArc}):e.jsxs(e.Fragment,{children:[v&&e.jsx("span",{style:{display:"flex",alignItems:"center",width:t.iconSize,height:t.iconSize,flexShrink:0},children:v}),x&&e.jsx("span",{children:x}),B&&e.jsx("span",{style:{display:"flex",alignItems:"center",width:t.iconSize,height:t.iconSize,flexShrink:0},children:B})]})})}r.__docgenInfo={description:"",methods:[],displayName:"Button",props:{variant:{defaultValue:{value:"'primary'",computed:!1},required:!1},size:{defaultValue:{value:"'md'",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1},loading:{defaultValue:{value:"false",computed:!1},required:!1},fullWidth:{defaultValue:{value:"false",computed:!1},required:!1},type:{defaultValue:{value:"'button'",computed:!1},required:!1}}};const G={title:"Atoms/Button",component:r,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"hear-light"},docs:{description:{component:"**Tier: Atom** — First-class reusable button for the Hear design system. \n\n**Variants:** `primary` (blue fill) · `secondary` (blue outline) · `ghost` (transparent) · `danger` (red fill)\n\n**Sizes:** `sm` 32px · `md` 40px (default) · `lg` 48px\n\n**States:** default · hover · active · `disabled` · `loading`\n\n**Icons:** Pass any icon component to `leftIcon` or `rightIcon`. Omit `children` with only `leftIcon` for a square icon-only button."}}},argTypes:{variant:{control:"select",options:["primary","secondary","ghost","danger"],description:"Visual style of the button",table:{defaultValue:{summary:"'primary'"}}},size:{control:"select",options:["sm","md","lg"],description:"Height and padding scale",table:{defaultValue:{summary:"'md'"}}},disabled:{control:"boolean",description:"Disables interaction and reduces opacity to 40%"},loading:{control:"boolean",description:"Replaces content with a spinner; blocks interaction"},fullWidth:{control:"boolean",description:"Stretches the button to fill its container"},children:{control:"text",description:"Button label text"},onClick:{action:"clicked"}}},i={args:{variant:"primary",size:"md",children:"Save changes",disabled:!1,loading:!1,fullWidth:!1}},o={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"ghost",children:"Ghost"}),e.jsx(r,{variant:"danger",children:"Danger"})]}),parameters:{docs:{description:{story:"`primary` for the main CTA · `secondary` for supporting actions · `ghost` for low-emphasis actions · `danger` for destructive operations."}}}},d={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx(r,{size:"sm",children:"Small"}),e.jsx(r,{size:"md",children:"Medium"}),e.jsx(r,{size:"lg",children:"Large"})]}),parameters:{docs:{description:{story:"`sm` 32px — compact toolbars & table rows · `md` 40px — default forms & dialogs · `lg` 48px — prominent page CTAs."}}}},l={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",loading:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",loading:!0,children:"Secondary"}),e.jsx(r,{variant:"ghost",loading:!0,children:"Ghost"}),e.jsx(r,{variant:"danger",loading:!0,children:"Danger"})]}),parameters:{docs:{description:{story:"The spinner inherits the button's text color. Button dimensions are frozen — no layout shift."}}}},c={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",disabled:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",disabled:!0,children:"Secondary"}),e.jsx(r,{variant:"ghost",disabled:!0,children:"Ghost"}),e.jsx(r,{variant:"danger",disabled:!0,children:"Danger"})]}),parameters:{docs:{description:{story:"`opacity: 0.4`, `cursor: not-allowed`. Hover and active states are suppressed."}}}},p={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",leftIcon:e.jsx(z,{}),children:"Record"}),e.jsx(r,{variant:"secondary",rightIcon:e.jsx(w,{}),children:"Attach"}),e.jsx(r,{variant:"ghost",leftIcon:e.jsx(k,{}),children:"Settings"}),e.jsx(r,{variant:"primary",leftIcon:e.jsx(z,{}),size:"sm"}),e.jsx(r,{variant:"secondary",leftIcon:e.jsx(w,{}),size:"md"}),e.jsx(r,{variant:"ghost",leftIcon:e.jsx(k,{}),size:"lg"})]}),parameters:{docs:{description:{story:"Pass any icon to `leftIcon` or `rightIcon`. Omit `children` with only `leftIcon` to get a square icon-only button that matches the size's height."}}}},u={render:()=>e.jsxs("div",{style:{width:340,display:"flex",flexDirection:"column",gap:10},children:[e.jsx(r,{variant:"primary",fullWidth:!0,children:"Continue"}),e.jsx(r,{variant:"secondary",fullWidth:!0,children:"Cancel"})]}),parameters:{docs:{description:{story:"`fullWidth={true}` — useful inside forms, dialogs, and mobile drawers."}}}},m={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"ghost",children:"Ghost"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"primary",loading:!0,children:"Loading"}),e.jsx(r,{variant:"primary",disabled:!0,children:"Disabled"})]}),parameters:{backgrounds:{default:"hear-dark"},docs:{description:{story:"On the dark canvas. `ghost` text colour (`#374151`) is intentionally dark — if the button appears on a dark surface in the product, pass a custom `style` or use `secondary` instead."}}}},g={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:["primary","secondary","ghost","danger"].map(a=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("span",{style:{width:80,fontSize:11,color:"#9ca3af",fontFamily:"monospace"},children:a}),e.jsx(r,{variant:a,size:"sm",children:"Small"}),e.jsx(r,{variant:a,size:"md",children:"Medium"}),e.jsx(r,{variant:a,size:"lg",children:"Large"})]},a))}),parameters:{docs:{description:{story:"Full 4 × 3 reference grid — every variant at every size."}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Save changes',
    disabled: false,
    loading: false,
    fullWidth: false
  }
}`,...i.parameters?.docs?.source},description:{story:"Default state — tweak all props live via the Controls panel.",...i.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary">Primary</Button>\r
      <Button variant="secondary">Secondary</Button>\r
      <Button variant="ghost">Ghost</Button>\r
      <Button variant="danger">Danger</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`primary\` for the main CTA · \`secondary\` for supporting actions · \`ghost\` for low-emphasis actions · \`danger\` for destructive operations.'
      }
    }
  }
}`,...o.parameters?.docs?.source},description:{story:"All four variants side-by-side.",...o.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12
  }}>\r
      <Button size="sm">Small</Button>\r
      <Button size="md">Medium</Button>\r
      <Button size="lg">Large</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`sm\` 32px — compact toolbars & table rows · \`md\` 40px — default forms & dialogs · \`lg\` 48px — prominent page CTAs.'
      }
    }
  }
}`,...d.parameters?.docs?.source},description:{story:"Three sizes in a row.",...d.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary" loading>Primary</Button>\r
      <Button variant="secondary" loading>Secondary</Button>\r
      <Button variant="ghost" loading>Ghost</Button>\r
      <Button variant="danger" loading>Danger</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The spinner inherits the button\\'s text color. Button dimensions are frozen — no layout shift.'
      }
    }
  }
}`,...l.parameters?.docs?.source},description:{story:"Loading state — spinner replaces content, button stays the same size.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary" disabled>Primary</Button>\r
      <Button variant="secondary" disabled>Secondary</Button>\r
      <Button variant="ghost" disabled>Ghost</Button>\r
      <Button variant="danger" disabled>Danger</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`opacity: 0.4\`, \`cursor: not-allowed\`. Hover and active states are suppressed.'
      }
    }
  }
}`,...c.parameters?.docs?.source},description:{story:"Disabled state across all variants.",...c.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary" leftIcon={<MicIcon />}>Record</Button>\r
      <Button variant="secondary" rightIcon={<AttachIcon />}>Attach</Button>\r
      <Button variant="ghost" leftIcon={<SettingsIcon />}>Settings</Button>\r
      <Button variant="primary" leftIcon={<MicIcon />} size="sm" />\r
      <Button variant="secondary" leftIcon={<AttachIcon />} size="md" />\r
      <Button variant="ghost" leftIcon={<SettingsIcon />} size="lg" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Pass any icon to \`leftIcon\` or \`rightIcon\`. Omit \`children\` with only \`leftIcon\` to get a square icon-only button that matches the size\\'s height.'
      }
    }
  }
}`,...p.parameters?.docs?.source},description:{story:"Icon support — left icon, right icon, and icon-only (square).",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: 340,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }}>\r
      <Button variant="primary" fullWidth>Continue</Button>\r
      <Button variant="secondary" fullWidth>Cancel</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`fullWidth={true}\` — useful inside forms, dialogs, and mobile drawers.'
      }
    }
  }
}`,...u.parameters?.docs?.source},description:{story:"Full-width button — stretches to fill its container.",...u.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary">Primary</Button>\r
      <Button variant="secondary">Secondary</Button>\r
      <Button variant="ghost">Ghost</Button>\r
      <Button variant="danger">Danger</Button>\r
      <Button variant="primary" loading>Loading</Button>\r
      <Button variant="primary" disabled>Disabled</Button>\r
    </div>,
  parameters: {
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: 'On the dark canvas. \`ghost\` text colour (\`#374151\`) is intentionally dark — if the button appears on a dark surface in the product, pass a custom \`style\` or use \`secondary\` instead.'
      }
    }
  }
}`,...m.parameters?.docs?.source},description:{story:"All variants on the dark canvas — confirm contrast and spinner colours.",...m.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}>\r
      {['primary', 'secondary', 'ghost', 'danger'].map(variant => <div key={variant} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>\r
          <span style={{
        width: 80,
        fontSize: 11,
        color: '#9ca3af',
        fontFamily: 'monospace'
      }}>{variant}</span>\r
          <Button variant={variant} size="sm">Small</Button>\r
          <Button variant={variant} size="md">Medium</Button>\r
          <Button variant={variant} size="lg">Large</Button>\r
        </div>)}\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Full 4 × 3 reference grid — every variant at every size.'
      }
    }
  }
}`,...g.parameters?.docs?.source},description:{story:"All sizes × all variants — full reference grid.",...g.parameters?.docs?.description}}};const L=["Default","AllVariants","Sizes","Loading","Disabled","WithIcons","FullWidth","OnDark","ReferenceGrid"];export{o as AllVariants,i as Default,c as Disabled,u as FullWidth,l as Loading,m as OnDark,g as ReferenceGrid,d as Sizes,p as WithIcons,L as __namedExportsOrder,G as default};
