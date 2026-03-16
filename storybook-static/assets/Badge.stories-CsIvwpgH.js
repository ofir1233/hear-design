import{j as e}from"./iframe-BXICU-hg.js";import"./preload-helper-D1UD9lgW.js";const h={outline:{bg:"transparent",border:"1px solid #e5e7eb",color:"#9ca3af",fontSize:12,fontWeight:500,paddingH:8,paddingV:2,defaultUppercase:!1},subtle:{bg:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600,paddingH:10,paddingV:3,defaultUppercase:!0},solid:{bg:"rgba(255,255,255,0.20)",border:"1px solid rgba(255,255,255,0.35)",color:"#ffffff",fontSize:9,fontWeight:700,paddingH:5,paddingV:2,defaultUppercase:!0}},B={cobalt:"b",green:"g",coral:"c",lilac:"l",teal:"t",horizon:"h",sage:"s"},m={pill:999,rect:4};function a({variant:c="outline",color:b,shape:f="pill",uppercase:u,children:v,style:y}){let r=h[c]??h.outline;if(c==="tinted"){const p=B[b]??"b";r={bg:`var(--${p}20)`,border:`1px solid var(--${p}30)`,color:`var(--${p}100)`,fontSize:11,fontWeight:600,paddingH:8,paddingV:2,defaultUppercase:!0}}const x=m[f]??m.pill,g=u!==void 0?u:r.defaultUppercase;return e.jsx("span",{"data-inspector":"Badge",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:`${r.paddingV}px ${r.paddingH}px`,background:r.bg,border:r.border,borderRadius:x,color:r.color,fontSize:r.fontSize,fontFamily:"'Byrd', sans-serif",fontWeight:r.fontWeight,lineHeight:1.4,letterSpacing:g?"0.08em":void 0,textTransform:g?"uppercase":void 0,whiteSpace:"nowrap",flexShrink:0,boxSizing:"border-box",...y},children:v})}a.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{variant:{defaultValue:{value:"'outline'",computed:!1},required:!1},shape:{defaultValue:{value:"'pill'",computed:!1},required:!1}}};const j={title:"Atoms/Badge",component:a,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"hear-light"},docs:{description:{component:"**Tier: Atom** — Formalizes the three badge patterns already in the product.\n\n**Variants:** `outline` (@ mention chip) · `subtle` (login hero label) · `solid` (Sidebar DEV tag)\n\n**Shapes:** `pill` borderRadius 999 · `rect` borderRadius 4\n\n**`uppercase`** defaults to `true` for `subtle` and `solid`, `false` for `outline`. Override with the prop."}}},argTypes:{variant:{control:"select",options:["outline","subtle","solid"],description:"Visual style of the badge",table:{defaultValue:{summary:"'outline'"}}},shape:{control:"select",options:["pill","rect"],description:"Border-radius shape",table:{defaultValue:{summary:"'pill'"}}},uppercase:{control:"boolean",description:"Force uppercase text + letter-spacing. Defaults to variant setting."},children:{control:"text",description:"Badge label text"}}},t={args:{variant:"outline",shape:"pill",children:"Tommy@"}},s={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(a,{variant:"outline",shape:"pill",children:"Tommy@"}),e.jsx(a,{variant:"outline",shape:"pill",children:"Whatever@"})]}),parameters:{docs:{description:{story:"Matches the handle chip in the **@ mention** dropdown (`ChatInput.jsx`). `outline` + `pill`, gray border, no fill."}}}},i={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(a,{variant:"subtle",shape:"pill",children:"Design Lab"}),e.jsx(a,{variant:"subtle",shape:"pill",children:"Beta"})]}),parameters:{backgrounds:{default:"hear-dark"},docs:{description:{story:"Matches the label below the logo in **SignInHero** (`SignInHero.jsx`). `subtle` + `pill`, semi-transparent white — use on dark surfaces."}}}},n={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(a,{variant:"solid",shape:"rect",children:"DEV"}),e.jsx(a,{variant:"solid",shape:"rect",children:"New"}),e.jsx(a,{variant:"solid",shape:"rect",children:"Beta"})]}),parameters:{backgrounds:{default:"hear-dark"},docs:{description:{story:"Matches the **DEV** tag on the Storybook nav link (`Sidebar.jsx`). `solid` + `rect`, more opaque white — use on dark surfaces."}}}},o={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"},children:[e.jsx(a,{variant:"outline",children:"Outline"}),e.jsx(a,{variant:"subtle",children:"Subtle"}),e.jsx(a,{variant:"solid",children:"Solid"})]}),parameters:{docs:{description:{story:"All three variants on the light canvas. Note: `subtle` and `solid` are designed for dark backgrounds — their white treatment is less visible here."}}}},d={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"},children:[e.jsx(a,{variant:"outline",children:"Outline"}),e.jsx(a,{variant:"subtle",children:"Subtle"}),e.jsx(a,{variant:"solid",children:"Solid"})]}),parameters:{backgrounds:{default:"hear-dark"},docs:{description:{story:"`subtle` and `solid` on their intended dark canvas. `outline` in gray is intentionally neutral — if it needs to be visible on dark, pass a custom `style` override."}}}},l={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx(a,{variant:"outline",shape:"pill",children:"Pill"}),e.jsx(a,{variant:"outline",shape:"rect",children:"Rect"})]}),parameters:{docs:{description:{story:"`pill` (borderRadius 999) for handle chips and hero labels · `rect` (borderRadius 4) for tags and dev labels."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    shape: 'pill',
    children: 'Tommy@'
  }
}`,...t.parameters?.docs?.source},description:{story:"Default state — tweak all props live via the Controls panel.",...t.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Badge variant="outline" shape="pill">Tommy@</Badge>\r
      <Badge variant="outline" shape="pill">Whatever@</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Matches the handle chip in the **@ mention** dropdown (\`ChatInput.jsx\`). \`outline\` + \`pill\`, gray border, no fill.'
      }
    }
  }
}`,...s.parameters?.docs?.source},description:{story:"Exact style used for @ mention handle chips in ChatInput.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Badge variant="subtle" shape="pill">Design Lab</Badge>\r
      <Badge variant="subtle" shape="pill">Beta</Badge>\r
    </div>,
  parameters: {
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: 'Matches the label below the logo in **SignInHero** (\`SignInHero.jsx\`). \`subtle\` + \`pill\`, semi-transparent white — use on dark surfaces.'
      }
    }
  }
}`,...i.parameters?.docs?.source},description:{story:"Exact style used below the Hear logo on the sign-in screen.",...i.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Badge variant="solid" shape="rect">DEV</Badge>\r
      <Badge variant="solid" shape="rect">New</Badge>\r
      <Badge variant="solid" shape="rect">Beta</Badge>\r
    </div>,
  parameters: {
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: 'Matches the **DEV** tag on the Storybook nav link (\`Sidebar.jsx\`). \`solid\` + \`rect\`, more opaque white — use on dark surfaces.'
      }
    }
  }
}`,...n.parameters?.docs?.source},description:{story:"Exact style used on the Storybook link in the Sidebar.",...n.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap'
  }}>\r
      <Badge variant="outline">Outline</Badge>\r
      <Badge variant="subtle">Subtle</Badge>\r
      <Badge variant="solid">Solid</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All three variants on the light canvas. Note: \`subtle\` and \`solid\` are designed for dark backgrounds — their white treatment is less visible here.'
      }
    }
  }
}`,...o.parameters?.docs?.source},description:{story:"All three variants on the light canvas.",...o.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap'
  }}>\r
      <Badge variant="outline">Outline</Badge>\r
      <Badge variant="subtle">Subtle</Badge>\r
      <Badge variant="solid">Solid</Badge>\r
    </div>,
  parameters: {
    backgrounds: {
      default: 'hear-dark'
    },
    docs: {
      description: {
        story: '\`subtle\` and \`solid\` on their intended dark canvas. \`outline\` in gray is intentionally neutral — if it needs to be visible on dark, pass a custom \`style\` override.'
      }
    }
  }
}`,...d.parameters?.docs?.source},description:{story:"All three variants on the dark canvas — their intended context.",...d.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10
  }}>\r
      <Badge variant="outline" shape="pill">Pill</Badge>\r
      <Badge variant="outline" shape="rect">Rect</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`pill\` (borderRadius 999) for handle chips and hero labels · \`rect\` (borderRadius 4) for tags and dev labels.'
      }
    }
  }
}`,...l.parameters?.docs?.source},description:{story:"Both shapes side-by-side.",...l.parameters?.docs?.description}}};const I=["Default","MentionHandle","SignInHeroBadge","SidebarDevBadge","AllVariants","AllVariantsDark","Shapes"];export{o as AllVariants,d as AllVariantsDark,t as Default,s as MentionHandle,l as Shapes,n as SidebarDevBadge,i as SignInHeroBadge,I as __namedExportsOrder,j as default};
