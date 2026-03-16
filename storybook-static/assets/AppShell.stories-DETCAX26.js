import{j as e}from"./iframe-BXICU-hg.js";import{S as n}from"./Sidebar-DPsFv5I6.js";import"./preload-helper-D1UD9lgW.js";import"./HearLogo-BRW9p_QJ.js";import"./index-Bk43pguZ.js";function l({note:a="272px sidebar offset · #EFEFED canvas"}){return e.jsxs("div",{style:{marginLeft:272,minHeight:"100vh",background:"#EFEFED",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16},children:[e.jsx("div",{style:{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg, #FF7056, #FF4785)",opacity:.3}}),e.jsx("p",{style:{fontFamily:"'Byrd', sans-serif",fontSize:16,color:"#9ca3af",fontWeight:400},children:"Main content area"}),e.jsx("p",{style:{fontFamily:"'Byrd', sans-serif",fontSize:12,color:"#c4c4c4"},children:a})]})}function d({note:a}){return e.jsxs("div",{style:{minHeight:"100vh",background:"#EFEFED",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg, #FF7056, #FF4785)",opacity:.3}}),e.jsx("p",{style:{fontFamily:"'Byrd', sans-serif",fontSize:16,color:"#9ca3af"},children:"Full-width content"}),e.jsx("p",{style:{fontFamily:"'Byrd', sans-serif",fontSize:12,color:"#c4c4c4"},children:a})]})}const u={title:"Templates/App Shell",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:"**Tier: Templates** — Macro layout shell. No application logic. Demonstrates how `Organisms/Sidebar` (fixed, 272px) composes with the main content region (`margin-left: 272px`). \n\n**Organisms composed:** `Organisms/Sidebar`. \n\nUse this story for layout QA, spatial validation, and responsive breakpoint inspection."}}}},r={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{isMobile:!1,mobileOpen:!1}),e.jsx(l,{note:"272px sidebar offset · #EFEFED canvas"})]}),parameters:{viewport:{defaultViewport:"desktop"}}},o={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{isMobile:!1,mobileOpen:!1}),e.jsx(l,{note:"Wide (1440px) · sidebar fixed, content region expands"})]}),parameters:{viewport:{defaultViewport:"wide"}}},t={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{isMobile:!1,mobileOpen:!1}),e.jsx(l,{note:"Tablet (768px) · 272px sidebar → ~496px content"})]}),parameters:{viewport:{defaultViewport:"tablet"},docs:{description:{story:"Fixed 272px sidebar on 768px viewport leaves ~496px content column. Verify no horizontal overflow."}}}},s={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{isMobile:!0,mobileOpen:!1}),e.jsx(d,{note:"Mobile · sidebar hidden · tap hamburger to reveal"})]}),parameters:{viewport:{defaultViewport:"mobile"},docs:{description:{story:"`isMobile=true, mobileOpen=false` — sidebar is off-screen, content fills full viewport width."}}}},i={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{isMobile:!0,mobileOpen:!0}),e.jsx(d,{note:"Mobile · drawer open · backdrop covers content"})]}),parameters:{viewport:{defaultViewport:"mobile"},docs:{description:{story:"`isMobile=true, mobileOpen=true` — sidebar slides in, dark backdrop covers content. Backdrop click fires `onMobileClose`."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <>\r
      <Sidebar isMobile={false} mobileOpen={false} />\r
      <ContentPlaceholder note="272px sidebar offset · #EFEFED canvas" />\r
    </>,
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    }
  }
}`,...r.parameters?.docs?.source},description:{story:"Desktop layout (1280px) — sidebar + content area at full resolution.",...r.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <>\r
      <Sidebar isMobile={false} mobileOpen={false} />\r
      <ContentPlaceholder note="Wide (1440px) · sidebar fixed, content region expands" />\r
    </>,
  parameters: {
    viewport: {
      defaultViewport: 'wide'
    }
  }
}`,...o.parameters?.docs?.source},description:{story:"Wide layout (1440px) — content region expands, sidebar remains fixed at 272px.",...o.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <>\r
      <Sidebar isMobile={false} mobileOpen={false} />\r
      <ContentPlaceholder note="Tablet (768px) · 272px sidebar → ~496px content" />\r
    </>,
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Fixed 272px sidebar on 768px viewport leaves ~496px content column. Verify no horizontal overflow.'
      }
    }
  }
}`,...t.parameters?.docs?.source},description:{story:"Tablet (768px) — fixed sidebar leaves ~496px for content. Verify no overflow.",...t.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <>\r
      <Sidebar isMobile={true} mobileOpen={false} />\r
      <MobileContent note="Mobile · sidebar hidden · tap hamburger to reveal" />\r
    </>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: '\`isMobile=true, mobileOpen=false\` — sidebar is off-screen, content fills full viewport width.'
      }
    }
  }
}`,...s.parameters?.docs?.source},description:{story:"Mobile (375px) — drawer closed, sidebar off-screen, content fills full width.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <>\r
      <Sidebar isMobile={true} mobileOpen={true} />\r
      <MobileContent note="Mobile · drawer open · backdrop covers content" />\r
    </>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: '\`isMobile=true, mobileOpen=true\` — sidebar slides in, dark backdrop covers content. Backdrop click fires \`onMobileClose\`.'
      }
    }
  }
}`,...i.parameters?.docs?.source},description:{story:"Mobile (375px) — drawer open, sidebar slides in with backdrop.",...i.parameters?.docs?.description}}};const x=["Desktop","Wide","Tablet","MobileDrawerClosed","MobileDrawerOpen"];export{r as Desktop,s as MobileDrawerClosed,i as MobileDrawerOpen,t as Tablet,o as Wide,x as __namedExportsOrder,u as default};
