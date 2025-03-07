"use strict";(self.webpackChunkpimemes_frontend=self.webpackChunkpimemes_frontend||[]).push([[405],{379:(e,t,o)=>{o.d(t,{A:()=>i});o(43);var n=o(579);const l={background:"linear-gradient(to bottom, rgba(106, 13, 173, 0.2), rgba(0, 0, 0, 1))",border:"1px solid rgba(106, 13, 173, 0.3)",borderRadius:"16px",padding:"24px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",backdropFilter:"blur(8px)"},r={color:"#FFD700",fontWeight:"bold",fontSize:"20px",marginBottom:"16px"},i=e=>{let{children:t,title:o,style:i={},titleStyle:a={}}=e;return(0,n.jsxs)("div",{style:{...l,...i},children:[o&&(0,n.jsx)("h2",{style:{...r,...a},children:o}),t]})}},405:(e,t,o)=>{o.r(t),o.d(t,{default:()=>p});var n=o(43);function l(e,t){let{title:o,titleId:l,...r}=e;return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":l},r),o?n.createElement("title",{id:l},o):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 4.5v15m7.5-7.5h-15"}))}const r=n.forwardRef(l);function i(e,t){let{title:o,titleId:l,...r}=e;return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":l},r),o?n.createElement("title",{id:l},o):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 12h14"}))}const a=n.forwardRef(i);var s=o(656),d=o(379),c=o(579);function p(){var e,t;const{isWalletConnected:o,walletBalance:l,connectWallet:i}=(0,s.A)(),[p,x]=(0,n.useState)("add"),[h,g]=(0,n.useState)("DOGEPI"),[u,y]=(0,n.useState)(""),[b,m]=(0,n.useState)(""),[f,j]=(0,n.useState)(!1),v=[{symbol:"DOGEPI",name:"DogePi",balance:0,poolShare:"12.5%"},{symbol:"SHIBPI",name:"ShibPi",balance:0,poolShare:"5.2%"},{symbol:"MOONPI",name:"MoonPi",balance:0,poolShare:"8.1%"}];return(0,c.jsxs)("div",{className:"container mx-auto px-4 py-8 max-w-2xl",children:[(0,c.jsxs)(d.A,{children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"},children:[(0,c.jsx)("h1",{style:{color:"#FFD700",fontWeight:"bold",fontSize:"24px"},children:"Liquidity"}),(0,c.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,c.jsx)("button",{onClick:()=>x("add"),style:{backgroundColor:"add"===p?"rgba(106, 13, 173, 0.5)":"transparent",color:"#FFD700",padding:"8px 16px",borderRadius:"12px",fontSize:"14px",transition:"background-color 0.2s"},children:"Add"}),(0,c.jsx)("button",{onClick:()=>x("remove"),style:{backgroundColor:"remove"===p?"rgba(106, 13, 173, 0.5)":"transparent",color:"#FFD700",padding:"8px 16px",borderRadius:"12px",fontSize:"14px",transition:"background-color 0.2s"},children:"Remove"})]})]}),(0,c.jsxs)("div",{style:{marginBottom:"24px"},children:[(0,c.jsx)("label",{style:{color:"#9ca3af",fontSize:"14px",display:"block",marginBottom:"8px"},children:"Select Token"}),(0,c.jsx)("select",{value:h,onChange:e=>g(e.target.value),style:{width:"100%",backgroundColor:"rgba(0, 0, 0, 0.4)",color:"#FFD700",padding:"16px",borderRadius:"12px",border:"none",outline:"none"},children:v.map((e=>(0,c.jsxs)("option",{value:e.symbol,children:[e.symbol," - ",e.name]},e.symbol)))})]}),(0,c.jsxs)("div",{style:{marginBottom:"24px"},children:[(0,c.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[(0,c.jsx)("label",{style:{color:"#9ca3af",fontSize:"14px"},children:"PI Amount"}),(0,c.jsxs)("span",{style:{color:"#9ca3af",fontSize:"14px"},children:["Balance: ",l.toFixed(2)]})]}),(0,c.jsxs)("div",{style:{display:"flex",gap:"12px",padding:"16px",backgroundColor:"rgba(0, 0, 0, 0.4)",borderRadius:"12px"},children:[(0,c.jsx)("input",{type:"number",value:u,onChange:e=>{return t=e.target.value,y(t),void m(t?(8333.33*parseFloat(t)).toString():"");var t},placeholder:"0.00",style:{flex:1,backgroundColor:"transparent",border:"none",outline:"none",color:"#FFD700",fontSize:"20px"}}),(0,c.jsx)("span",{style:{color:"#FFD700",fontWeight:"500"},children:"PI"})]})]}),(0,c.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[(0,c.jsxs)("label",{style:{color:"#9ca3af",fontSize:"14px"},children:[h," Amount"]}),(0,c.jsxs)("span",{style:{color:"#9ca3af",fontSize:"14px"},children:["Balance: ",(null===(e=v.find((e=>e.symbol===h)))||void 0===e?void 0:e.balance.toFixed(2))||"0.00"]})]}),(0,c.jsxs)("div",{style:{display:"flex",gap:"12px",padding:"16px",backgroundColor:"rgba(0, 0, 0, 0.4)",borderRadius:"12px"},children:[(0,c.jsx)("input",{type:"number",value:b,onChange:e=>{return t=e.target.value,m(t),void y(t?(parseFloat(t)/8333.33).toString():"");var t},placeholder:"0.00",style:{flex:1,backgroundColor:"transparent",border:"none",outline:"none",color:"#FFD700",fontSize:"20px"}}),(0,c.jsx)("span",{style:{color:"#FFD700",fontWeight:"500"},children:h})]})]})]}),(0,c.jsxs)("div",{style:{padding:"16px",backgroundColor:"rgba(0, 0, 0, 0.4)",borderRadius:"12px",marginBottom:"24px"},children:[(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[(0,c.jsx)("span",{style:{color:"#9ca3af",fontSize:"14px"},children:"Pool Share"}),(0,c.jsx)("span",{style:{color:"#FFD700",fontSize:"14px"},children:(null===(t=v.find((e=>e.symbol===h)))||void 0===t?void 0:t.poolShare)||"0%"})]}),(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,c.jsx)("span",{style:{color:"#9ca3af",fontSize:"14px"},children:"Rewards (24h)"}),(0,c.jsx)("span",{style:{color:"#FFD700",fontSize:"14px"},children:"0.12 PI"})]})]}),(0,c.jsx)("button",{onClick:async()=>{o?(j(!0),setTimeout((()=>{j(!1),y(""),m("")}),2e3)):i()},disabled:f||!u,style:{width:"100%",backgroundColor:u?"#FFD700":"rgba(106, 13, 173, 0.3)",color:u?"#000000":"#9ca3af",padding:"16px",borderRadius:"12px",fontWeight:"500",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.2s",cursor:u?"pointer":"not-allowed"},onMouseOver:e=>u&&(e.target.style.backgroundColor="#f7c600"),onMouseOut:e=>u&&(e.target.style.backgroundColor="#FFD700"),children:f?(0,c.jsxs)("svg",{className:"animate-spin h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,c.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,c.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):o?u?(0,c.jsxs)(c.Fragment,{children:["add"===p?(0,c.jsx)(r,{style:{width:"20px",height:"20px"}}):(0,c.jsx)(a,{style:{width:"20px",height:"20px"}}),"add"===p?"Add":"Remove"," Liquidity"]}):"Enter an amount":"Connect Wallet"})]}),(0,c.jsx)(d.A,{title:"Your Liquidity Positions",style:{marginTop:"24px"},children:v.map(((e,t)=>(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px",backgroundColor:"rgba(0, 0, 0, 0.4)",borderRadius:"12px",marginBottom:t<v.length-1?"16px":0},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,c.jsx)("div",{style:{width:"40px",height:"40px",background:"linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginRight:"12px"},children:(0,c.jsx)("span",{style:{color:"#FFD700",fontWeight:"bold"},children:e.symbol[0]})}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{style:{color:"#FFD700",fontWeight:"500"},children:e.name}),(0,c.jsxs)("div",{style:{color:"#9ca3af",fontSize:"14px"},children:["Pool Share: ",e.poolShare]})]})]}),(0,c.jsxs)("div",{style:{textAlign:"right"},children:[(0,c.jsxs)("div",{style:{color:"#FFD700",fontWeight:"500"},children:["1,000 ",e.symbol]}),(0,c.jsx)("div",{style:{color:"#9ca3af",fontSize:"14px"},children:"\u2248 0.12 PI"})]})]},t)))})]})}}}]);
//# sourceMappingURL=405.493a9ac1.chunk.js.map