import{S as t}from"./Sidebar-DPsFv5I6.js";import"./iframe-BXICU-hg.js";import"./preload-helper-D1UD9lgW.js";import"./HearLogo-BRW9p_QJ.js";import"./index-Bk43pguZ.js";const d={title:"Organisms/Sidebar",component:t,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:"**Tier: Organisms** — Main navigation panel. Fixed `272px` sidebar on desktop; full-width drawer overlay on mobile. Contains: project selector, 11 nav items, Storybook dev link, history section, user profile. \n\n**Atoms composed:** `Atoms/Hear Logo` (injected correctly). \n\n> ⚠️ **ARCHITECTURAL DRIFT** — `Sidebar.jsx` renders its own `<button>` markup with duplicated inline styles instead of importing `Atoms/Nav Item`. Style changes to `Atoms/Nav Item` will NOT propagate to this organism silently. **Resolution required:** Replace the internal button markup in `Sidebar.jsx` with the exported `NavItem` component from `src/components/NavItem.jsx` (to be created)."}}},argTypes:{isMobile:{control:"boolean",description:"Activates mobile drawer mode (full-width overlay)"},mobileOpen:{control:"boolean",description:"Controls mobile drawer visibility (only relevant when `isMobile` is true)"},onMobileClose:{action:"onMobileClose",description:"Callback fired when the mobile backdrop or close button is clicked"}}},e={args:{isMobile:!1,mobileOpen:!1}},o={args:{isMobile:!1,mobileOpen:!1},parameters:{viewport:{defaultViewport:"tablet"},docs:{description:{story:"Fixed 272px sidebar on a 768px viewport leaves ~496px for content."}}}},r={args:{isMobile:!0,mobileOpen:!0},parameters:{viewport:{defaultViewport:"mobile"},docs:{description:{story:"Mobile drawer in open state. Backdrop click fires `onMobileClose`."}}}},s={args:{isMobile:!0,mobileOpen:!1},parameters:{viewport:{defaultViewport:"mobile"},docs:{description:{story:"Mobile drawer closed — sidebar is translated off-screen."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    isMobile: false,
    mobileOpen: false
  }
}`,...e.parameters?.docs?.source},description:{story:"Desktop full sidebar — default rendering context.",...e.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    isMobile: false,
    mobileOpen: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Fixed 272px sidebar on a 768px viewport leaves ~496px for content.'
      }
    }
  }
}`,...o.parameters?.docs?.source},description:{story:`Tablet — sidebar still fixed at 272px but content column is tighter.\r
Verify no horizontal overflow at ~768px viewport.`,...o.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    isMobile: true,
    mobileOpen: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: 'Mobile drawer in open state. Backdrop click fires \`onMobileClose\`.'
      }
    }
  }
}`,...r.parameters?.docs?.source},description:{story:"Mobile — drawer open, full-width overlay with backdrop.",...r.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    isMobile: true,
    mobileOpen: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: 'Mobile drawer closed — sidebar is translated off-screen.'
      }
    }
  }
}`,...s.parameters?.docs?.source},description:{story:"Mobile — drawer closed, sidebar hidden off-screen via transform.",...s.parameters?.docs?.description}}};const c=["Desktop","Tablet","MobileOpen","MobileClosed"];export{e as Desktop,s as MobileClosed,r as MobileOpen,o as Tablet,c as __namedExportsOrder,d as default};
