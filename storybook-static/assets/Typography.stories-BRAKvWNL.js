import{j as e}from"./iframe-BXICU-hg.js";import"./preload-helper-D1UD9lgW.js";const y=[{label:"H1",size:140,lh:160,weight:400,case:"As typed"},{label:"H2",size:100,lh:140,weight:400,case:"As typed"},{label:"H3",size:80,lh:100,weight:400,case:"As typed"},{label:"H4",size:64,lh:88,weight:400,case:"As typed"},{label:"H5",size:56,lh:72,weight:400,case:"As typed"},{label:"H6",size:48,lh:68,weight:400,case:"As typed"},{label:"H7",size:40,lh:56,weight:400,case:"As typed"},{label:"H8",size:32,lh:48,weight:400,case:"As typed"}],h=[{label:"P1",size:40,lh:54,weight:400,case:"As typed"},{label:"P2",size:40,lh:54,weight:500,case:"As typed"},{label:"P3",size:40,lh:54,weight:600,case:"As typed"},{label:"P4",size:32,lh:48,weight:400,case:"As typed"},{label:"P5",size:32,lh:48,weight:500,case:"As typed"},{label:"P6",size:32,lh:48,weight:600,case:"As typed"},{label:"P7",size:24,lh:40,weight:400,case:"As typed"},{label:"P8",size:24,lh:40,weight:500,case:"As typed"},{label:"P9",size:24,lh:32,weight:400,case:"uppercase"},{label:"P10",size:18,lh:24,weight:500,case:"As typed"},{label:"P11",size:16,lh:24,weight:400,case:"As typed"},{label:"P12",size:16,lh:24,weight:500,case:"As typed"},{label:"P13",size:16,lh:24,weight:400,case:"uppercase"},{label:"P14",size:12,lh:16,weight:500,case:"As typed"}],g=t=>({400:"Regular",500:"Medium",600:"Semi Bold"})[t],a={fontSize:11,color:"#9ca3af",fontWeight:500,fontFamily:"monospace",minWidth:80};function o({label:t,size:s,lh:p,weight:c,case:n}){const m=n==="uppercase"?"CREATE FASTER":"Create Faster";return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"48px 1fr 100px 100px 80px 80px",alignItems:"center",gap:16,padding:"20px 0",borderBottom:"1px solid #f0f0ee"},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,color:"#9ca3af"},children:t}),e.jsx("div",{style:{fontFamily:"'Byrd', sans-serif",fontSize:s,lineHeight:`${p}px`,fontWeight:c,textTransform:n==="uppercase"?"uppercase":"none",color:"#181818",overflow:"hidden",whiteSpace:"nowrap"},children:m}),e.jsx("div",{style:a,children:n==="uppercase"?"All Caps":"As typed"}),e.jsx("div",{style:a,children:g(c)}),e.jsxs("div",{style:a,children:[s,"PX"]}),e.jsxs("div",{style:a,children:[p,"px"]})]})}function d(){return e.jsx("div",{style:{display:"grid",gridTemplateColumns:"48px 1fr 100px 100px 80px 80px",gap:16,padding:"0 0 12px",borderBottom:"2px solid #e5e7eb",marginBottom:4},children:["Style","","Case","Weight","Font Size","Line Height"].map((t,s)=>e.jsx("div",{style:{fontSize:11,fontWeight:600,color:"#c4c4c4",textTransform:"uppercase",letterSpacing:"0.06em"},children:t},s))})}const u={title:"Foundations/Typography",tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"white"},docs:{description:{component:"**Tier: Foundations** — Raw type scale tokens. Consumed by every tier above. Hear type scale using the **Byrd** font family. Titles H1–H8 are used for display and hero copy. Body P1–P14 cover every text use case from large callouts to legal-size captions. Scale tokens: `--type-h1` through `--type-p14` in `src/index.css`."}}}},r={render:()=>e.jsxs("div",{style:{maxWidth:900,fontFamily:"'Byrd', sans-serif"},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:20},children:"Titles"}),e.jsx(d,{}),y.map(t=>e.jsx(o,{...t},t.label))]})},i={render:()=>e.jsxs("div",{style:{maxWidth:900,fontFamily:"'Byrd', sans-serif"},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:20},children:"Body / Paragraph"}),e.jsx(d,{}),h.map(t=>e.jsx(o,{...t},t.label))]})},l={name:"All Styles",render:()=>e.jsxs("div",{style:{maxWidth:900,fontFamily:"'Byrd', sans-serif"},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:20},children:"Titles"}),e.jsx(d,{}),y.map(t=>e.jsx(o,{...t},t.label)),e.jsx("div",{style:{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",margin:"40px 0 20px"},children:"Body / Paragraph"}),e.jsx(d,{}),h.map(t=>e.jsx(o,{...t},t.label))]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 900,
    fontFamily: "'Byrd', sans-serif"
  }}>\r
      <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      marginBottom: 20
    }}>Titles</div>\r
      <TableHeader />\r
      {TITLES.map(t => <TypeRow key={t.label} {...t} />)}\r
    </div>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 900,
    fontFamily: "'Byrd', sans-serif"
  }}>\r
      <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      marginBottom: 20
    }}>Body / Paragraph</div>\r
      <TableHeader />\r
      {BODY.map(t => <TypeRow key={t.label} {...t} />)}\r
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'All Styles',
  render: () => <div style={{
    maxWidth: 900,
    fontFamily: "'Byrd', sans-serif"
  }}>\r
      <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      marginBottom: 20
    }}>Titles</div>\r
      <TableHeader />\r
      {TITLES.map(t => <TypeRow key={t.label} {...t} />)}\r
\r
      <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      margin: '40px 0 20px'
    }}>Body / Paragraph</div>\r
      <TableHeader />\r
      {BODY.map(t => <TypeRow key={t.label} {...t} />)}\r
    </div>
}`,...l.parameters?.docs?.source}}};const b=["Titles","Body","AllStyles"];export{l as AllStyles,i as Body,r as Titles,b as __namedExportsOrder,u as default};
