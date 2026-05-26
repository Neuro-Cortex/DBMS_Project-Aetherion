import{bt as e,e as j,bu as l,bp as N}from"./ui-DTtMa1PU.js";import{r as m}from"./state-DMRGEf_a.js";import{c as o}from"./charts-CBGW5lK0.js";import{t as E}from"./index-UQ2Jay8P.js";const M={xs:"max-w-xs",sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-xl","2xl":"max-w-2xl",full:"max-w-full mx-4"},R={center:"items-center justify-center",top:"items-start justify-center pt-20",bottom:"items-end justify-center pb-20"},S={default:`
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
  `,glass:`
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-2xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
  `,gradient:`
    bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10
    dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20
    backdrop-blur-xl
    border border-purple-500/20
  `,neon:`
    bg-gray-900/95 dark:bg-black/95
    border-2 border-cyan-500/50
    shadow-[0_0_40px_rgba(6,182,212,0.4)]
  `},_={fade:{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0}},scale:{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95}},slide:{initial:{opacity:0,y:-50},animate:{opacity:1,y:0},exit:{opacity:0,y:-50}},blur:{initial:{opacity:0,filter:"blur(10px)"},animate:{opacity:1,filter:"blur(0px)"},exit:{opacity:0,filter:"blur(10px)"}}},T=({isOpen:t,onClose:a,title:i,description:s,className:p,children:y,size:b="md",position:g="center",closeButton:d=!0,closeOnOverlay:u=!0,closeOnEscape:c=!0,footer:n,variant:f="default",animation:k="scale",blur:h=!0})=>{const v=m.useRef(null);m.useEffect(()=>{const r=w=>{w.key==="Escape"&&c&&a()};return t&&(document.addEventListener("keydown",r),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",r),document.body.style.overflow="unset"}},[t,c,a]);const x=r=>{u&&r.target===r.currentTarget&&a()};return e.jsx(j,{children:t&&e.jsxs("div",{className:"fixed inset-0 z-50 flex p-4",style:{perspective:"1000px"},children:[e.jsx(l.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},className:o("fixed inset-0",h?"backdrop-blur-md":"backdrop-blur-sm","bg-black/60"),onClick:x}),e.jsx("div",{className:o("relative w-full",R[g]),style:{display:"flex"},onClick:x,children:e.jsxs(l.div,{ref:v,..._[k],transition:{type:"spring",damping:25,stiffness:300},className:E(o("relative w-full",M[b],S[f],"rounded-3xl shadow-2xl overflow-hidden",p)),onClick:r=>r.stopPropagation(),children:[(i||s||d)&&e.jsx("div",{className:"px-8 pt-8 pb-4 border-b border-gray-200/50 dark:border-gray-700/50",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[i&&e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-1",children:i}),s&&e.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:s})]}),d&&e.jsx(l.button,{whileHover:{scale:1.1,rotate:90},whileTap:{scale:.9},onClick:a,className:"ml-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",children:e.jsx(N,{className:"w-5 h-5"})})]})}),e.jsx("div",{className:"px-8 py-6 overflow-y-auto max-h-[70vh] custom-scrollbar",children:y}),n&&e.jsx("div",{className:"px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50",children:n})]})})]})})};export{T as M};
//# sourceMappingURL=Modal-DSyDauan.js.map
