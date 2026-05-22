const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-BZoF71zq.js","assets/vendor-239lmJ97.js","assets/redux-B2elA4-q.js","assets/charts-CUEpBdHa.js","assets/motion-B8_FlCg2.js","assets/icons-D8bxII30.js"])))=>i.map(i=>d[i]);
import{d as c,r as Re,R as Pe,B as we}from"./vendor-239lmJ97.js";import{d as S,b as A,c as Le,a as ke,P as Oe}from"./redux-B2elA4-q.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const Ce="modulepreload",$e=function(e){return"/"+e},Z={},De=function(t,a,o){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),n=r?.nonce||r?.getAttribute("nonce");s=Promise.allSettled(a.map(l=>{if(l=$e(l),l in Z)return;Z[l]=!0;const p=l.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":Ce,p||(d.as="script"),d.crossOrigin="",d.href=l,n&&d.setAttribute("nonce",n),document.head.appendChild(d),p)return new Promise((m,y)=>{d.addEventListener("load",m),d.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(r){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=r,window.dispatchEvent(n),!n.defaultPrevented)throw r}return s.then(r=>{for(const n of r||[])n.status==="rejected"&&i(n.reason);return t().catch(i)})};var re={exports:{}},C={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var je=c,Ie=Symbol.for("react.element"),Ne=Symbol.for("react.fragment"),Me=Object.prototype.hasOwnProperty,_e=je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Te={key:!0,ref:!0,__self:!0,__source:!0};function se(e,t,a){var o,s={},i=null,r=null;a!==void 0&&(i=""+a),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(r=t.ref);for(o in t)Me.call(t,o)&&!Te.hasOwnProperty(o)&&(s[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)s[o]===void 0&&(s[o]=t[o]);return{$$typeof:Ie,type:e,key:i,ref:r,props:s,_owner:_e.current}}C.Fragment=Ne;C.jsx=se;C.jsxs=se;re.exports=C;var g=re.exports,V={},Q=Re;V.createRoot=Q.createRoot,V.hydrateRoot=Q.hydrateRoot;let qe={data:""},Fe=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||qe},Ue=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Be=/\/\*[^]*?\*\/|  +/g,X=/\n+/g,E=(e,t)=>{let a="",o="",s="";for(let i in e){let r=e[i];i[0]=="@"?i[1]=="i"?a=i+" "+r+";":o+=i[1]=="f"?E(r,i):i+"{"+E(r,i[1]=="k"?"":t)+"}":typeof r=="object"?o+=E(r,t?t.replace(/([^,])+/g,n=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):i):r!=null&&(i=i[1]=="-"?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=E.p?E.p(i,r):i+":"+r+";")}return a+(t&&s?t+"{"+s+"}":s)+o},x={},ie=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+ie(e[a]);return t}return e},He=(e,t,a,o,s)=>{let i=ie(e),r=x[i]||(x[i]=(l=>{let p=0,u=11;for(;p<l.length;)u=101*u+l.charCodeAt(p++)>>>0;return"go"+u})(i));if(!x[r]){let l=i!==e?e:(p=>{let u,d,m=[{}];for(;u=Ue.exec(p.replace(Be,""));)u[4]?m.shift():u[3]?(d=u[3].replace(X," ").trim(),m.unshift(m[0][d]=m[0][d]||{})):m[0][u[1]]=u[2].replace(X," ").trim();return m[0]})(e);x[r]=E(s?{["@keyframes "+r]:l}:l,a?"":"."+r)}let n=a&&x.g;return a&&(x.g=x[r]),((l,p,u,d)=>{d?p.data=p.data.replace(d,l):p.data.indexOf(l)===-1&&(p.data=u?l+p.data:p.data+l)})(x[r],t,o,n),r},ze=(e,t,a)=>e.reduce((o,s,i)=>{let r=t[i];if(r&&r.call){let n=r(a),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;r=l?"."+l:n&&typeof n=="object"?n.props?"":E(n,""):n===!1?"":n}return o+s+(r??"")},"");function $(e){let t=this||{},a=e.call?e(t.p):e;return He(a.unshift?a.raw?ze(a,[].slice.call(arguments,1),t.p):a.reduce((o,s)=>Object.assign(o,s&&s.call?s(t.p):s),{}):a,Fe(t.target),t.g,t.o,t.k)}let ne,G,J;$.bind({g:1});let b=$.bind({k:1});function Ve(e,t,a,o){E.p=t,ne=e,G=a,J=o}function R(e,t){let a=this||{};return function(){let o=arguments;function s(i,r){let n=Object.assign({},i),l=n.className||s.className;a.p=Object.assign({theme:G&&G()},n),a.o=/go\d/.test(l),n.className=$.apply(a,o)+(l?" "+l:"");let p=e;return e[0]&&(p=n.as||e,delete n.as),J&&p[0]&&J(n),ne(p,n)}return s}}var Ge=e=>typeof e=="function",O=(e,t)=>Ge(e)?e(t):e,Je=(()=>{let e=0;return()=>(++e).toString()})(),le=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),We=20,W="default",de=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:o}=t;return de(e,{type:e.toasts.find(r=>r.id===o.id)?1:0,toast:o});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(r=>r.id===s||s===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+i}))}}},k=[],ce={toasts:[],pausedAt:void 0,settings:{toastLimit:We}},v={},pe=(e,t=W)=>{v[t]=de(v[t]||ce,e),k.forEach(([a,o])=>{a===t&&o(v[t])})},ue=e=>Object.keys(v).forEach(t=>pe(e,t)),Ye=e=>Object.keys(v).find(t=>v[t].toasts.some(a=>a.id===e)),D=(e=W)=>t=>{pe(t,e)},Ke={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ze=(e={},t=W)=>{let[a,o]=c.useState(v[t]||ce),s=c.useRef(v[t]);c.useEffect(()=>(s.current!==v[t]&&o(v[t]),k.push([t,o]),()=>{let r=k.findIndex(([n])=>n===t);r>-1&&k.splice(r,1)}),[t]);let i=a.toasts.map(r=>{var n,l,p;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((n=e[r.type])==null?void 0:n.removeDelay)||e?.removeDelay,duration:r.duration||((l=e[r.type])==null?void 0:l.duration)||e?.duration||Ke[r.type],style:{...e.style,...(p=e[r.type])==null?void 0:p.style,...r.style}}});return{...a,toasts:i}},Qe=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:a?.id||Je()}),P=e=>(t,a)=>{let o=Qe(t,e,a);return D(o.toasterId||Ye(o.id))({type:2,toast:o}),o.id},f=(e,t)=>P("blank")(e,t);f.error=P("error");f.success=P("success");f.loading=P("loading");f.custom=P("custom");f.dismiss=(e,t)=>{let a={type:3,toastId:e};t?D(t)(a):ue(a)};f.dismissAll=e=>f.dismiss(void 0,e);f.remove=(e,t)=>{let a={type:4,toastId:e};t?D(t)(a):ue(a)};f.removeAll=e=>f.remove(void 0,e);f.promise=(e,t,a)=>{let o=f.loading(t.loading,{...a,...a?.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let i=t.success?O(t.success,s):void 0;return i?f.success(i,{id:o,...a,...a?.success}):f.dismiss(o),s}).catch(s=>{let i=t.error?O(t.error,s):void 0;i?f.error(i,{id:o,...a,...a?.error}):f.dismiss(o)}),e};var Xe=1e3,et=(e,t="default")=>{let{toasts:a,pausedAt:o}=Ze(e,t),s=c.useRef(new Map).current,i=c.useCallback((d,m=Xe)=>{if(s.has(d))return;let y=setTimeout(()=>{s.delete(d),r({type:4,toastId:d})},m);s.set(d,y)},[]);c.useEffect(()=>{if(o)return;let d=Date.now(),m=a.map(y=>{if(y.duration===1/0)return;let w=(y.duration||0)+y.pauseDuration-(d-y.createdAt);if(w<0){y.visible&&f.dismiss(y.id);return}return setTimeout(()=>f.dismiss(y.id,t),w)});return()=>{m.forEach(y=>y&&clearTimeout(y))}},[a,o,t]);let r=c.useCallback(D(t),[t]),n=c.useCallback(()=>{r({type:5,time:Date.now()})},[r]),l=c.useCallback((d,m)=>{r({type:1,toast:{id:d,height:m}})},[r]),p=c.useCallback(()=>{o&&r({type:6,time:Date.now()})},[o,r]),u=c.useCallback((d,m)=>{let{reverseOrder:y=!1,gutter:w=8,defaultPosition:Y}=m||{},j=a.filter(h=>(h.position||Y)===(d.position||Y)&&h.height),Ee=j.findIndex(h=>h.id===d.id),K=j.filter((h,I)=>I<Ee&&h.visible).length;return j.filter(h=>h.visible).slice(...y?[K+1]:[0,K]).reduce((h,I)=>h+(I.height||0)+w,0)},[a]);return c.useEffect(()=>{a.forEach(d=>{if(d.dismissed)i(d.id,d.removeDelay);else{let m=s.get(d.id);m&&(clearTimeout(m),s.delete(d.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:l,startPause:n,endPause:p,calculateOffset:u}}},tt=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,at=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ot=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,rt=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${tt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${at} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ot} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,st=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,it=R("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${st} 1s linear infinite;
`,nt=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,lt=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,dt=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${nt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${lt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ct=R("div")`
  position: absolute;
`,pt=R("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ut=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,mt=R("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ut} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ft=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return t!==void 0?typeof t=="string"?c.createElement(mt,null,t):t:a==="blank"?null:c.createElement(pt,null,c.createElement(it,{...o}),a!=="loading"&&c.createElement(ct,null,a==="error"?c.createElement(rt,{...o}):c.createElement(dt,{...o})))},yt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,gt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ht="0%{opacity:0;} 100%{opacity:1;}",vt="0%{opacity:1;} 100%{opacity:0;}",bt=R("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,St=R("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,At=(e,t)=>{let a=e.includes("top")?1:-1,[o,s]=le()?[ht,vt]:[yt(a),gt(a)];return{animation:t?`${b(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},xt=c.memo(({toast:e,position:t,style:a,children:o})=>{let s=e.height?At(e.position||t||"top-center",e.visible):{opacity:0},i=c.createElement(ft,{toast:e}),r=c.createElement(St,{...e.ariaProps},O(e.message,e));return c.createElement(bt,{className:e.className,style:{...s,...a,...e.style}},typeof o=="function"?o({icon:i,message:r}):c.createElement(c.Fragment,null,i,r))});Ve(c.createElement);var Et=({id:e,className:t,style:a,onHeightUpdate:o,children:s})=>{let i=c.useCallback(r=>{if(r){let n=()=>{let l=r.getBoundingClientRect().height;o(e,l)};n(),new MutationObserver(n).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return c.createElement("div",{ref:i,className:t,style:a},s)},Rt=(e,t)=>{let a=e.includes("top"),o=a?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:le()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...o,...s}},Pt=$`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,L=16,wt=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:o,children:s,toasterId:i,containerStyle:r,containerClassName:n})=>{let{toasts:l,handlers:p}=et(a,i);return c.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:L,left:L,right:L,bottom:L,pointerEvents:"none",...r},className:n,onMouseEnter:p.startPause,onMouseLeave:p.endPause},l.map(u=>{let d=u.position||t,m=p.calculateOffset(u,{reverseOrder:e,gutter:o,defaultPosition:t}),y=Rt(d,m);return c.createElement(Et,{id:u.id,key:u.id,onHeightUpdate:p.updateHeight,className:u.visible?Pt:"",style:y},u.type==="custom"?O(u.message,u):s?s(u):c.createElement(xt,{toast:u,position:d}))}))},Jt=f;const Lt={user:null,isAuthenticated:!1,isLoading:!1,error:null},me=S({name:"auth",initialState:Lt,reducers:{loginStart:e=>{e.isLoading=!0,e.error=null},loginSuccess:(e,t)=>{e.isLoading=!1,e.isAuthenticated=!0,e.user=t.payload,e.error=null},login:(e,t)=>{e.isLoading=!1,e.isAuthenticated=!0,e.user=t.payload,e.error=null},loginFailure:(e,t)=>{e.isLoading=!1,e.error=t.payload},logout:e=>{e.user=null,e.isAuthenticated=!1,e.isLoading=!1,e.error=null,localStorage.removeItem("token")},updateProfile:(e,t)=>{e.user&&(e.user={...e.user,...t.payload})},addRole:(e,t)=>{e.user&&!e.user.roles.includes(t.payload)&&e.user.roles.push(t.payload)},removeRole:(e,t)=>{e.user&&(e.user.roles=e.user.roles.filter(a=>a!==t.payload),e.user.primaryRole===t.payload&&(e.user.primaryRole=e.user.roles[0]||"normal_user"))},setPrimaryRole:(e,t)=>{e.user&&e.user.roles.includes(t.payload)&&(e.user.primaryRole=t.payload)},addUpgrade:(e,t)=>{e.user&&!e.user.upgrades.includes(t.payload)&&e.user.upgrades.push(t.payload)},removeUpgrade:(e,t)=>{e.user&&(e.user.upgrades=e.user.upgrades.filter(a=>a!==t.payload))},switchRole:(e,t)=>{e.user&&e.user.roles.includes(t.payload)&&(e.user.primaryRole=t.payload)},setOnlineStatus:(e,t)=>{e.user&&(e.user.isOnline=t.payload)}}}),{loginStart:Wt,login:Yt,loginSuccess:Kt,loginFailure:Zt,logout:Qt,updateProfile:Xt,addRole:ea,removeRole:ta,setPrimaryRole:aa,addUpgrade:oa,removeUpgrade:ra,switchRole:sa,setOnlineStatus:ia}=me.actions,kt=me.reducer,Ot={profile:null,appointments:[],bloodDonations:[],recommendations:[],reminders:[],emergencyRequests:[],prescriptions:[],reports:[],timeline:[],stats:{upcomingAppointments:0,activePrescriptions:0,bloodDonations:0,medicalReports:0,healthScore:85},isLoading:!1},fe=S({name:"client",initialState:Ot,reducers:{setProfile:(e,t)=>{e.profile=t.payload},updateProfile:(e,t)=>{e.profile&&(e.profile={...e.profile,...t.payload})},setAppointments:(e,t)=>{e.appointments=t.payload,e.stats.upcomingAppointments=t.payload.filter(a=>a.status==="upcoming").length},addAppointment:(e,t)=>{e.appointments.unshift(t.payload),e.stats.upcomingAppointments++},updateAppointment:(e,t)=>{const a=e.appointments.findIndex(o=>o.id===t.payload.id);a!==-1&&(e.appointments[a]=t.payload)},setBloodDonations:(e,t)=>{e.bloodDonations=t.payload,e.stats.bloodDonations=t.payload.length},addBloodDonation:(e,t)=>{e.bloodDonations.unshift(t.payload),e.stats.bloodDonations++},setRecommendations:(e,t)=>{e.recommendations=t.payload},setReminders:(e,t)=>{e.reminders=t.payload,e.stats.activePrescriptions=t.payload.filter(a=>a.isActive).length},addReminder:(e,t)=>{e.reminders.push(t.payload),e.stats.activePrescriptions++},toggleReminder:(e,t)=>{const a=e.reminders.find(o=>o.id===t.payload);a&&(a.isActive=!a.isActive,e.stats.activePrescriptions=e.reminders.filter(o=>o.isActive).length)},setEmergencyRequests:(e,t)=>{e.emergencyRequests=t.payload},addEmergencyRequest:(e,t)=>{e.emergencyRequests.unshift(t.payload)},setPrescriptions:(e,t)=>{e.prescriptions=t.payload},setReports:(e,t)=>{e.reports=t.payload,e.stats.medicalReports=t.payload.length},addReport:(e,t)=>{e.reports.unshift(t.payload),e.stats.medicalReports++},setTimeline:(e,t)=>{e.timeline=t.payload},setStats:(e,t)=>{e.stats=t.payload},setLoading:(e,t)=>{e.isLoading=t.payload}}}),{setProfile:na,updateProfile:la,setAppointments:da,addAppointment:ca,updateAppointment:pa,setBloodDonations:ua,addBloodDonation:ma,setRecommendations:fa,setReminders:ya,addReminder:ga,toggleReminder:ha,setEmergencyRequests:va,addEmergencyRequest:ba,setPrescriptions:Sa,setReports:Aa,addReport:xa,setTimeline:Ea,setStats:Ra,setLoading:Pa}=fe.actions,Ct=fe.reducer,$t={profile:null,appointments:[],patients:[],prescriptions:[],emergencies:[],videoConsultations:[],earnings:{today:0,yesterday:0,weekly:0,monthly:0,yearly:0,totalConsultations:0,completedAppointments:0,cancelledAppointments:0,averageRating:0,earningsByDay:[],earningsByMonth:[]},schedule:[],reports:[],stats:{totalPatients:0,todayAppointments:0,completedToday:0,pendingEmergencies:0,videoConsultations:0,earningsToday:0,onlineStatus:!1,totalPrescriptions:0,averageConsultationTime:"15 mins"},isLoading:!1,error:null},ye=S({name:"doctor",initialState:$t,reducers:{setProfile:(e,t)=>{e.profile=t.payload},updateProfile:(e,t)=>{e.profile&&(e.profile={...e.profile,...t.payload})},setOnlineStatus:(e,t)=>{e.profile&&(e.profile.isOnline=t.payload,e.stats.onlineStatus=t.payload)},setAppointments:(e,t)=>{e.appointments=t.payload,e.stats.todayAppointments=t.payload.filter(a=>a.status==="upcoming"||a.status==="ongoing").length,e.stats.completedToday=t.payload.filter(a=>a.status==="completed").length},updateAppointment:(e,t)=>{const a=e.appointments.findIndex(o=>o.id===t.payload.id);a!==-1&&(e.appointments[a]=t.payload)},setPatients:(e,t)=>{e.patients=t.payload,e.stats.totalPatients=t.payload.length},addPatient:(e,t)=>{e.patients.unshift(t.payload),e.stats.totalPatients++},setPrescriptions:(e,t)=>{e.prescriptions=t.payload,e.stats.totalPrescriptions=t.payload.length},addPrescription:(e,t)=>{e.prescriptions.unshift(t.payload),e.stats.totalPrescriptions++},setEmergencies:(e,t)=>{e.emergencies=t.payload,e.stats.pendingEmergencies=t.payload.filter(a=>a.status==="pending").length},acceptEmergency:(e,t)=>{const a=e.emergencies.find(o=>o.id===t.payload);a&&(a.status="accepted",e.stats.pendingEmergencies=e.emergencies.filter(o=>o.status==="pending").length)},rejectEmergency:(e,t)=>{const a=e.emergencies.find(o=>o.id===t.payload);a&&(a.status="rejected",e.stats.pendingEmergencies=e.emergencies.filter(o=>o.status==="pending").length)},setVideoConsultations:(e,t)=>{e.videoConsultations=t.payload,e.stats.videoConsultations=t.payload.filter(a=>a.status==="waiting").length},setEarnings:(e,t)=>{e.earnings=t.payload,e.stats.earningsToday=t.payload.today},setSchedule:(e,t)=>{e.schedule=t.payload},updateSchedule:(e,t)=>{const a=e.schedule.findIndex(o=>o.day===t.payload.day);a!==-1&&(e.schedule[a]=t.payload)},setReports:(e,t)=>{e.reports=t.payload},setStats:(e,t)=>{e.stats=t.payload},setLoading:(e,t)=>{e.isLoading=t.payload},setError:(e,t)=>{e.error=t.payload}}}),{setProfile:wa,updateProfile:La,setOnlineStatus:ka,setAppointments:Oa,updateAppointment:Ca,setPatients:$a,addPatient:Da,setPrescriptions:ja,addPrescription:Ia,setEmergencies:Na,acceptEmergency:Ma,rejectEmergency:_a,setVideoConsultations:Ta,setEarnings:qa,setSchedule:Fa,updateSchedule:Ua,setReports:Ba,setStats:Ha,setLoading:za,setError:Va}=ye.actions,Dt=ye.reducer,ee={profile:null,bedInfo:[],bloodStock:[],stats:null,doctors:[],departments:[],isLoading:!1,error:null},ge=S({name:"hospital",initialState:ee,reducers:{setHospitalProfile:(e,t)=>{e.profile=t.payload},updateHospitalProfile:(e,t)=>{e.profile&&(e.profile={...e.profile,...t.payload})},setBedInfo:(e,t)=>{e.bedInfo=t.payload},updateBedAvailability:(e,t)=>{e.bedInfo=e.bedInfo.map(a=>a.id===t.payload.bedId?{...a,available:t.payload.available,occupied:t.payload.occupied}:a)},setBloodStock:(e,t)=>{e.bloodStock=t.payload},updateBloodStock:(e,t)=>{e.bloodStock=e.bloodStock.map(a=>a.bloodGroup===t.payload.bloodGroup?{...a,units:t.payload.units}:a)},setHospitalStats:(e,t)=>{e.stats=t.payload},setDoctors:(e,t)=>{e.doctors=t.payload},addDoctor:(e,t)=>{e.doctors.push(t.payload)},removeDoctor:(e,t)=>{e.doctors=e.doctors.filter(a=>a.id!==t.payload)},setDepartments:(e,t)=>{e.departments=t.payload},setEmergencyStatus:(e,t)=>{e.profile&&(e.profile.emergencyServiceStatus=t.payload)},setLoading:(e,t)=>{e.isLoading=t.payload},setError:(e,t)=>{e.error=t.payload},clearHospital:()=>ee}}),{setHospitalProfile:Ga,updateHospitalProfile:Ja,setBedInfo:Wa,updateBedAvailability:Ya,setBloodStock:Ka,updateBloodStock:Za,setHospitalStats:Qa,setDoctors:Xa,addDoctor:eo,removeDoctor:to,setDepartments:ao,setEmergencyStatus:oo,setLoading:ro,setError:so,clearHospital:io}=ge.actions,jt=ge.reducer,N={appointments:[],selectedAppointment:null,isLoading:!1,error:null,filters:{status:"all",type:"all",date:"",search:""},stats:{total:0,scheduled:0,completed:0,cancelled:0,todayCount:0},pagination:{page:1,limit:10,total:0}},M=A("appointments/fetchAll",async(e,{rejectWithValue:t})=>{try{return{appointments:[],pagination:{page:1,limit:10,total:0}}}catch(a){return t(a.message||"Failed to fetch appointments")}}),_=A("appointments/book",async(e,{rejectWithValue:t})=>{try{return{...e,id:Date.now().toString(),status:"scheduled",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}catch(a){return t(a.message||"Failed to book appointment")}}),T=A("appointments/cancel",async(e,{rejectWithValue:t})=>{try{return e}catch(a){return t(a.message||"Failed to cancel appointment")}}),q=A("appointments/reschedule",async({id:e,date:t,time:a},{rejectWithValue:o})=>{try{return{id:e,date:t,time:a}}catch(s){return o(s.message||"Failed to reschedule appointment")}}),he=S({name:"appointments",initialState:N,reducers:{setSelectedAppointment:(e,t)=>{e.selectedAppointment=t.payload},clearSelectedAppointment:e=>{e.selectedAppointment=null},setFilters:(e,t)=>{e.filters={...e.filters,...t.payload}},resetFilters:e=>{e.filters=N.filters},setPage:(e,t)=>{e.pagination.page=t.payload},updateAppointmentStatus:(e,t)=>{const a=e.appointments.find(o=>o.id===t.payload.id);a&&(a.status=t.payload.status,a.updatedAt=new Date().toISOString())},addAppointmentNote:(e,t)=>{const a=e.appointments.find(o=>o.id===t.payload.id);a&&(a.notes=t.payload.note)},clearError:e=>{e.error=null},resetAppointmentState:()=>N},extraReducers:e=>{e.addCase(M.pending,t=>{t.isLoading=!0,t.error=null}).addCase(M.fulfilled,(t,a)=>{t.isLoading=!1,t.appointments=a.payload.appointments,t.pagination=a.payload.pagination,t.stats.total=a.payload.pagination.total,t.stats.scheduled=t.appointments.filter(o=>o.status==="scheduled").length,t.stats.completed=t.appointments.filter(o=>o.status==="completed").length,t.stats.cancelled=t.appointments.filter(o=>o.status==="cancelled").length,t.stats.todayCount=t.appointments.filter(o=>{const s=new Date().toDateString();return new Date(o.date).toDateString()===s}).length}).addCase(M.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload}).addCase(_.pending,t=>{t.isLoading=!0,t.error=null}).addCase(_.fulfilled,(t,a)=>{t.isLoading=!1,t.appointments.unshift(a.payload),t.stats.total+=1,t.stats.scheduled+=1}).addCase(_.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload}).addCase(T.pending,t=>{t.isLoading=!0}).addCase(T.fulfilled,(t,a)=>{t.isLoading=!1;const o=t.appointments.find(s=>s.id===a.payload);o&&(o.status="cancelled",o.updatedAt=new Date().toISOString(),t.stats.scheduled=Math.max(0,t.stats.scheduled-1),t.stats.cancelled+=1)}).addCase(T.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload}).addCase(q.pending,t=>{t.isLoading=!0}).addCase(q.fulfilled,(t,a)=>{t.isLoading=!1;const o=t.appointments.find(s=>s.id===a.payload.id);o&&(o.date=a.payload.date,o.time=a.payload.time,o.updatedAt=new Date().toISOString())}).addCase(q.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload})}}),{setSelectedAppointment:no,clearSelectedAppointment:lo,setFilters:co,resetFilters:po,setPage:uo,updateAppointmentStatus:mo,addAppointmentNote:fo,clearError:yo,resetAppointmentState:go}=he.actions,It=he.reducer,te={requests:[],activeRequest:null,nearbyHospitals:[],availableAmbulances:[],isLoading:!1,isSubmitting:!1,error:null,sosActivated:!1,stats:{total:0,active:0,completed:0,avgResponseTime:"8 min",todayCount:0}},F=A("emergency/sendSOS",async(e,{rejectWithValue:t})=>{try{return{id:`EM-${Date.now()}`,patientId:"patient-1",patientName:"Current User",patientPhone:e.patientPhone,emergencyType:e.emergencyType,description:e.description,severity:e.severity,location:e.location,status:"pending",timeline:[{status:"pending",timestamp:new Date().toISOString(),note:"Emergency request received"}],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}catch(a){return t(a.message||"Failed to send SOS")}}),U=A("emergency/fetchHospitals",async(e,{rejectWithValue:t})=>{try{return[{id:"h1",name:"City General Hospital",address:"123 Main St, Downtown",distance:"2.3 km",estimatedTime:"5 min",erAvailable:!0,bedsAvailable:12,icuBedsAvailable:3,phone:"+1-555-0101",location:{lat:23.8103,lng:90.4125}},{id:"h2",name:"Metro Medical Center",address:"456 Park Ave, Midtown",distance:"4.1 km",estimatedTime:"8 min",erAvailable:!0,bedsAvailable:8,icuBedsAvailable:2,phone:"+1-555-0102",location:{lat:23.822,lng:90.425}},{id:"h3",name:"Memorial Emergency Hospital",address:"789 Oak Rd, Uptown",distance:"6.5 km",estimatedTime:"12 min",erAvailable:!0,bedsAvailable:20,icuBedsAvailable:5,phone:"+1-555-0103",location:{lat:23.795,lng:90.4}}]}catch(a){return t(a.message||"Failed to fetch hospitals")}}),B=A("emergency/fetchAmbulances",async(e,{rejectWithValue:t})=>{try{return[{id:"a1",driverName:"John Smith",vehicleNumber:"AMB-001",contactNumber:"+1-555-0201",currentLocation:{lat:23.812,lng:90.414},estimatedArrival:"5",status:"available"},{id:"a2",driverName:"Sarah Johnson",vehicleNumber:"AMB-002",contactNumber:"+1-555-0202",currentLocation:{lat:23.818,lng:90.42},estimatedArrival:"8",status:"available"}]}catch(a){return t(a.message||"Failed to fetch ambulances")}}),H=A("emergency/cancel",async(e,{rejectWithValue:t})=>{try{return e}catch(a){return t(a.message||"Failed to cancel emergency")}}),z=A("emergency/updateStatus",async({id:e,status:t,note:a},{rejectWithValue:o})=>{try{return{id:e,status:t,note:a}}catch(s){return o(s.message||"Failed to update status")}}),ve=S({name:"emergency",initialState:te,reducers:{activateSOS:e=>{e.sosActivated=!0},deactivateSOS:e=>{e.sosActivated=!1},setActiveRequest:(e,t)=>{e.activeRequest=t.payload},addTimelineEvent:(e,t)=>{const a=e.requests.find(o=>o.id===t.payload.id);a&&(a.timeline.push({status:t.payload.status,timestamp:new Date().toISOString(),note:t.payload.note}),a.status=t.payload.status)},updateAmbulanceLocation:(e,t)=>{const a=e.availableAmbulances.find(o=>o.id===t.payload.ambulanceId);a&&(a.currentLocation=t.payload.location,a.estimatedArrival=t.payload.estimatedArrival)},clearError:e=>{e.error=null},resetEmergencyState:()=>te},extraReducers:e=>{e.addCase(F.pending,t=>{t.isSubmitting=!0,t.error=null}).addCase(F.fulfilled,(t,a)=>{t.isSubmitting=!1,t.requests.unshift(a.payload),t.activeRequest=a.payload,t.sosActivated=!0,t.stats.active+=1,t.stats.total+=1,t.stats.todayCount+=1}).addCase(F.rejected,(t,a)=>{t.isSubmitting=!1,t.error=a.payload}).addCase(U.pending,t=>{t.isLoading=!0}).addCase(U.fulfilled,(t,a)=>{t.isLoading=!1,t.nearbyHospitals=a.payload}).addCase(U.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload}).addCase(B.pending,t=>{t.isLoading=!0}).addCase(B.fulfilled,(t,a)=>{t.isLoading=!1,t.availableAmbulances=a.payload}).addCase(B.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload}).addCase(H.pending,t=>{t.isSubmitting=!0}).addCase(H.fulfilled,(t,a)=>{t.isSubmitting=!1;const o=t.requests.find(s=>s.id===a.payload);o&&(o.status="cancelled",o.timeline.push({status:"cancelled",timestamp:new Date().toISOString(),note:"Emergency cancelled by user"}),t.stats.active=Math.max(0,t.stats.active-1)),t.activeRequest?.id===a.payload&&(t.activeRequest=null,t.sosActivated=!1)}).addCase(H.rejected,(t,a)=>{t.isSubmitting=!1,t.error=a.payload}).addCase(z.pending,t=>{t.isLoading=!0}).addCase(z.fulfilled,(t,a)=>{t.isLoading=!1;const o=t.requests.find(s=>s.id===a.payload.id);o&&(o.status=a.payload.status,o.timeline.push({status:a.payload.status,timestamp:new Date().toISOString(),note:a.payload.note}),a.payload.status==="completed"&&(t.stats.active=Math.max(0,t.stats.active-1),t.stats.completed+=1,t.sosActivated=!1,t.activeRequest=null))}).addCase(z.rejected,(t,a)=>{t.isLoading=!1,t.error=a.payload})}}),{activateSOS:ho,deactivateSOS:vo,setActiveRequest:bo,addTimelineEvent:So,updateAmbulanceLocation:Ao,clearError:xo,resetEmergencyState:Eo}=ve.actions,Nt=ve.reducer,ae={profile:null,medicines:[],orders:[],stockAlerts:[],totalOrders:0,totalRevenue:0,todayOrders:0,todayRevenue:0,isLoading:!1,error:null},be=S({name:"pharmacy",initialState:ae,reducers:{setPharmacyProfile:(e,t)=>{e.profile=t.payload},updatePharmacyProfile:(e,t)=>{e.profile&&(e.profile={...e.profile,...t.payload})},setMedicines:(e,t)=>{e.medicines=t.payload},addMedicine:(e,t)=>{e.medicines.push(t.payload)},updateMedicine:(e,t)=>{e.medicines=e.medicines.map(a=>a.id===t.payload.id?{...a,...t.payload.data}:a)},updateMedicineStock:(e,t)=>{e.medicines=e.medicines.map(a=>a.id===t.payload.id?{...a,stock:t.payload.stock}:a)},removeMedicine:(e,t)=>{e.medicines=e.medicines.filter(a=>a.id!==t.payload)},setOrders:(e,t)=>{e.orders=t.payload},addOrder:(e,t)=>{e.orders.unshift(t.payload),e.totalOrders+=1,e.todayOrders+=1,e.totalRevenue+=t.payload.totalAmount,e.todayRevenue+=t.payload.totalAmount},updateOrderStatus:(e,t)=>{e.orders=e.orders.map(a=>a.id===t.payload.id?{...a,status:t.payload.status}:a)},setStockAlerts:(e,t)=>{e.stockAlerts=t.payload},setPharmacyStats:(e,t)=>{e.totalOrders=t.payload.totalOrders,e.totalRevenue=t.payload.totalRevenue,e.todayOrders=t.payload.todayOrders,e.todayRevenue=t.payload.todayRevenue},setLoading:(e,t)=>{e.isLoading=t.payload},setError:(e,t)=>{e.error=t.payload},clearPharmacy:()=>ae}}),{setPharmacyProfile:Ro,updatePharmacyProfile:Po,setMedicines:wo,addMedicine:Lo,updateMedicine:ko,updateMedicineStock:Oo,removeMedicine:Co,setOrders:$o,addOrder:Do,updateOrderStatus:jo,setStockAlerts:Io,setPharmacyStats:No,setLoading:Mo,setError:_o,clearPharmacy:To}=be.actions,Mt=be.reducer,oe={currentAdmin:null,stats:null,pendingVerifications:[],allUsers:[],isLoading:!1,error:null},Se=S({name:"admin",initialState:oe,reducers:{setCurrentAdmin:(e,t)=>{e.currentAdmin=t.payload},setStats:(e,t)=>{e.stats=t.payload},updateStats:(e,t)=>{e.stats&&(e.stats={...e.stats,...t.payload})},setPendingVerifications:(e,t)=>{e.pendingVerifications=t.payload},approveVerification:(e,t)=>{e.pendingVerifications=e.pendingVerifications.map(a=>a.id===t.payload?{...a,status:"approved"}:a)},rejectVerification:(e,t)=>{e.pendingVerifications=e.pendingVerifications.map(a=>a.id===t.payload?{...a,status:"rejected"}:a)},setAllUsers:(e,t)=>{e.allUsers=t.payload},blockUser:(e,t)=>{e.allUsers=e.allUsers.map(a=>a.id===t.payload?{...a,isActive:!1}:a)},unblockUser:(e,t)=>{e.allUsers=e.allUsers.map(a=>a.id===t.payload?{...a,isActive:!0}:a)},deleteUser:(e,t)=>{e.allUsers=e.allUsers.filter(a=>a.id!==t.payload)},setLoading:(e,t)=>{e.isLoading=t.payload},setError:(e,t)=>{e.error=t.payload},clearAdmin:()=>oe}}),{setCurrentAdmin:qo,setStats:Fo,updateStats:Uo,setPendingVerifications:Bo,approveVerification:Ho,rejectVerification:zo,setAllUsers:Vo,blockUser:Go,unblockUser:Jo,deleteUser:Wo,setLoading:Yo,setError:Ko,clearAdmin:Zo}=Se.actions,_t=Se.reducer,Tt={darkMode:localStorage.getItem("darkMode")==="true",sidebarExpanded:!0,sidebarOpen:!1,notifications:0,language:localStorage.getItem("language")||"en",fontSize:"medium"},Ae=S({name:"ui",initialState:Tt,reducers:{toggleDarkMode:e=>{e.darkMode=!e.darkMode,localStorage.setItem("darkMode",e.darkMode.toString())},setDarkMode:(e,t)=>{e.darkMode=t.payload},toggleSidebar:e=>{e.sidebarExpanded=!e.sidebarExpanded},setSidebarOpen:(e,t)=>{e.sidebarOpen=t.payload},setNotifications:(e,t)=>{e.notifications=t.payload},incrementNotifications:e=>{e.notifications+=1},clearNotifications:e=>{e.notifications=0},setLanguage:(e,t)=>{e.language=t.payload,localStorage.setItem("language",t.payload)},setFontSize:(e,t)=>{e.fontSize=t.payload}}}),{toggleDarkMode:Qo,setDarkMode:Xo,toggleSidebar:er,setSidebarOpen:tr,setNotifications:ar,incrementNotifications:or,clearNotifications:rr,setLanguage:sr,setFontSize:ir}=Ae.actions,qt=Ae.reducer,Ft=Le({auth:kt,client:Ct,doctor:Dt,hospital:jt,appointment:It,emergency:Nt,pharmacy:Mt,admin:_t,ui:qt}),Ut=ke({reducer:Ft,middleware:e=>e({serializableCheck:!1}),devTools:!1}),Bt=c.lazy(()=>De(()=>import("./app-BZoF71zq.js").then(e=>e.b),__vite__mapDeps([0,1,2,3,4,5]))),Ht=()=>g.jsx("div",{className:"min-h-screen bg-[#050508] flex items-center justify-center",children:g.jsxs("div",{className:"text-center",children:[g.jsxs("div",{className:"relative w-16 h-16 mx-auto mb-4",children:[g.jsx("div",{className:"absolute inset-0 rounded-full border-2 border-white/10"}),g.jsx("div",{className:"absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin"}),g.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:g.jsx("span",{className:"text-cyan-400 text-lg",children:"⚕️"})})]}),g.jsx("p",{className:"text-white/60 text-sm",children:"Loading Aetherion Health..."})]})}),xe=document.getElementById("root");if(!xe)throw new Error("Root element not found!");const zt=V.createRoot(xe);zt.render(g.jsx(Pe.StrictMode,{children:g.jsx(Oe,{store:Ut,children:g.jsxs(we,{future:{v7_startTransition:!0,v7_relativeSplatPath:!0},children:[g.jsx(c.Suspense,{fallback:g.jsx(Ht,{}),children:g.jsx(Bt,{})}),g.jsx(wt,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#1f2937",color:"#ffffff",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px"}}})]})})}));export{wt as F,De as _,Qt as a,g as j,Yt as l,Jt as z};
