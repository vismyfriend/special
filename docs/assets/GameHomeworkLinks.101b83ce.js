import{h as y,n as D,r as t,o as G,b as _,c as m,d as f,t as w,F as L,l as B,f as H,x as M}from"./index.6f8c2ed5.js";import{s as N}from"./short-words-data.d237f4bd.js";import{_ as F}from"./plugin-vue_export-helper.21dcd24c.js";const I={key:0,class:"row"},Q={class:"col"},R={class:"wordCard"},S={class:"col"},V=["onClick"],W={__name:"GameHomeworkLinks",setup(b){y();const A=D(),h=t(),o=t([]),n=t({}),l=t([]),u=t(null),r=t(!1),c=t(0),p=e=>e.sort(()=>Math.random()-.5);let i=[];const k=()=>{if(i.length===0){console.error("\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0438\u0433\u0440\u044B.");return}if(c.value>=i.length){g();return}const e=i[c.value];n.value=e,console.log(n.value);const a=e.ru;l.value=C(a),u.value=null,r.value=!1},C=e=>{const a=o.value.map(d=>d.ru),s=[...new Set(a)];if(s.length<4)return s;const v=s.filter(d=>d!==e).slice(0,3);return v.push(e),p(v)},x=e=>{u.value=e;const a=n.value.ru;r.value=e===a,r.value?setTimeout(()=>{c.value++,c.value<o.value.length?k():g()},1e3):l.value=l.value.filter(s=>s!==e)},g=()=>{alert("\u0412\u044B \u043D\u0430\u0448\u043B\u0438 \u0432\u0441\u0435 \u043F\u0430\u0440\u044B, \u0433\u043E\u0442\u043E\u0432\u044C\u0442\u0435 \u0420\u0438\u0437\u043E\u0442\u0442\u043E!")};return G(()=>{h.value=A.params.missionName,o.value=N[h.value]||[],console.log(o.value),i=p([...o.value]),k()}),(e,a)=>o.value?(_(),m("div",I,[f("div",Q,[f("div",R,w(n.value.eng),1)]),f("div",S,[(_(!0),m(L,null,B(l.value,(s,v)=>(_(),m("div",{class:M(["wordCard",{active:u.value===s&&!r.value,correct:r.value&&u.value===s}]),key:v,onClick:d=>x(s)},w(s),11,V))),128))])])):H("",!0)}};var T=F(W,[["__scopeId","data-v-0420da26"]]);export{T as default};
