import{Q as o}from"./QBtn.83aaae09.js";import{u as _,o as h,b,c as y,d as a,f as r,e as t,F as k}from"./index.773c3b4e.js";import{_ as I}from"./plugin-vue_export-helper.21dcd24c.js";const x={__name:"IntroPage",setup(P){const n=_(),c=()=>{n.push("/vismycoder")},l=()=>{n.push("/special-app")},i=()=>{window.open("https://t.me/vismyfriend?text=Hello Vincent","_blank")},m=()=>{alert("you clicked! It worked!")},p=()=>{n.push("/photos-of-agents")},u=e=>{if(e>3&&e<21)return"th";switch(e%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}};return h(()=>{const e=new Date,s=e.toLocaleString("default",{month:"long"}),g=e.toLocaleString("default",{weekday:"long"}),d=new Date().getDay(),f=u(d);document.getElementById("intro-message").innerHTML=`Hello , special agent <br> today\xA0 is\xA0 ${g}\xA0 <br> the ${e.getDate()}<strong><u>${f}</strong></u> of ${s}`}),(e,s)=>(b(),y(k,null,[s[0]||(s[0]=a("p",{class:"bubble right",id:"intro-message"},[r("Hi. "),a("br"),r(" \u041F\u0440\u0438\u0432\u0435\u0442\u0438\u043A\u0438")],-1)),t(o,{class:"q-mb-sm zoomIn",icon:"fingerprint",label:"Open S.P.E.C.I.A.L App",stack:"",glossy:"",color:"purple",onClick:l}),t(o,{class:"q-mb-sm zoomIn",icon:"camera",label:"see photos of secret agents",push:"",color:"primary",onClick:p}),t(o,{class:"q-mb-sm zoomIn",icon:"mail",label:"\u043F\u0440\u043E\u0439\u0442\u0438 \u0442\u0435\u0441\u0442",push:"",color:"primary",onClick:m}),t(o,{class:"q-mb-sm zoomIn",icon:"phone",label:"Send a message to Vincent",push:"",color:"primary",onClick:i}),t(o,{class:"q-mb-sm zoomIn",icon:"search",label:"Vismycoder",push:"",color:"green",onClick:c})],64))}};var C=I(x,[["__scopeId","data-v-0fdd2de0"]]);export{C as default};