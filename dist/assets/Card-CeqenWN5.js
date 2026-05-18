import{j as s,t,c as l}from"./index-COLLEqZp.js";import{r as n}from"./redux-DabiTOow.js";import{m as y}from"./motion-wmL3MpUL.js";const w={default:`
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
  `,bordered:`
    bg-white dark:bg-gray-800
    border-2 border-gray-300 dark:border-gray-600
  `,elevated:`
    bg-white dark:bg-gray-800
    shadow-xl
  `,glass:`
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
  `,gradient:`
    bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10
    dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20
    border border-purple-500/20
  `,neon:`
    bg-gray-900/90 dark:bg-black/90
    border-2 border-cyan-500/50
    shadow-[0_0_30px_rgba(6,182,212,0.3)]
  `,neumorphic:`
    bg-gray-100 dark:bg-gray-800
    shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)]
    dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)]
  `},f={none:"p-0",sm:"p-4",md:"p-6",lg:"p-8",xl:"p-10"},h={none:"rounded-none",sm:"rounded-sm",md:"rounded-md",lg:"rounded-lg",xl:"rounded-xl","2xl":"rounded-2xl","3xl":"rounded-3xl"},u={none:"shadow-none",sm:"shadow-sm",md:"shadow-md",lg:"shadow-lg",xl:"shadow-xl","2xl":"shadow-2xl",glow:"shadow-[0_0_40px_rgba(168,85,247,0.4)]"},k=n.forwardRef(({className:r,variant:a="default",padding:e="md",rounded:d="2xl",shadow:o="md",hover:g=!1,interactive:p=!1,blur:x=!1,glow:b=!1,children:i,...m},c)=>s.jsx(y.div,{ref:c,className:t(l("relative transition-all duration-300","transform-gpu",w[a],f[e],h[d],u[o],g&&"hover:shadow-xl hover:-translate-y-1",p&&"cursor-pointer hover:scale-[1.02]",x&&"backdrop-blur-2xl",b&&"shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]",r)),whileHover:p?{scale:1.02}:void 0,whileTap:p?{scale:.98}:void 0,...m,children:i}));k.displayName="Card";const _=n.forwardRef(({className:r,bordered:a=!1,children:e,...d},o)=>s.jsx("div",{ref:o,className:t(l("flex flex-col space-y-1.5",a&&"pb-4 border-b border-gray-200 dark:border-gray-700"),r),...d,children:e}));_.displayName="CardHeader";const C=n.forwardRef(({className:r,as:a="h3",children:e,...d},o)=>s.jsx(a,{ref:o,className:t(l("text-2xl font-bold tracking-tight text-gray-900 dark:text-white"),r),...d,children:e}));C.displayName="CardTitle";const v=n.forwardRef(({className:r,children:a,...e},d)=>s.jsx("p",{ref:d,className:t(l("text-sm text-gray-500 dark:text-gray-400"),r),...e,children:a}));v.displayName="CardDescription";const N=n.forwardRef(({className:r,children:a,...e},d)=>s.jsx("div",{ref:d,className:t(l("pt-0"),r),...e,children:a}));N.displayName="CardContent";const j=n.forwardRef(({className:r,bordered:a=!1,children:e,...d},o)=>s.jsx("div",{ref:o,className:t(l("flex items-center",a&&"pt-4 border-t border-gray-200 dark:border-gray-700"),r),...d,children:e}));j.displayName="CardFooter";export{k as C};
