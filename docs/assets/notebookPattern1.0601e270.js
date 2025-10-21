import{b as $,i as a,o as s,f as p,h as n,s as r,j as b,m as z,l as _,g as k}from"./index.9c2bb3f9.js";import{_ as w}from"./plugin-vue_export-helper.21dcd24c.js";const C=["placeholder"],D={__name:"notebookPattern1",props:{width:{type:[String,Number],default:800},height:{type:[String,Number],default:600},coverColor:{type:String,default:"linear-gradient(135deg, #1e5799 0%,#207cca 51%,#2989d8 51%,#7db9e8 100%)"},gridColor:{type:String,default:"#e0e8e8"},pageColor:{type:String,default:"white"},gridSize:{type:Number,default:20},padding:{type:String,default:"40px 50px 20px 50px"},showDate:{type:Boolean,default:!1},datePlaceholder:{type:String,default:"Date..."},datePosition:{type:String,default:"top-right"},responsive:{type:Boolean,default:!0},maxWidth:{type:[String,Number],default:"90vw"},maxHeight:{type:[String,Number],default:"90vh"}},setup(l,{expose:g}){const e=l,o=$(""),u=a(()=>({width:e.responsive?"100%":`${i(e.width)}px`,height:e.responsive?"100%":`${i(e.height)}px`,maxWidth:e.responsive?e.maxWidth:"none",maxHeight:e.responsive?e.maxHeight:"none"})),c=a(()=>({width:`${i(e.width)}px`,height:`${i(e.height)}px`})),h=a(()=>({background:e.coverColor})),x=a(()=>({background:`
    linear-gradient(90deg,
      transparent 0%,
      transparent ${e.gridSize-1}px,
      ${e.gridColor} ${e.gridSize-1}px,
      ${e.gridColor} ${e.gridSize}px,
      transparent ${e.gridSize}px
    ),
    linear-gradient(to bottom,
      transparent 0%,
      transparent ${e.gridSize-1}px,
      ${e.gridColor} ${e.gridSize-1}px,
      ${e.gridColor} ${e.gridSize}px,
      transparent ${e.gridSize}px
    ),
    linear-gradient(${e.pageColor}, ${e.pageColor})
  `,backgroundSize:`${e.gridSize}px ${e.gridSize}px`,padding:e.padding})),v=a(()=>({fontSize:`${Math.max(12,e.gridSize*.7)}px`,lineHeight:`${e.gridSize}px`})),S=a(()=>({"top-right":{top:"20px",right:"30px",left:"auto"},"top-left":{top:"20px",left:"60px",right:"auto"},"top-center":{top:"20px",left:"50%",transform:"translateX(-50%)",right:"auto"}})[e.datePosition]),i=t=>typeof t=="string"?parseInt(t):t,f=t=>{t.target.select()},y=()=>{o.value&&console.log("Date entered:",o.value)};return g({getDate:()=>o.value,setDate:t=>{o.value=t},clearDate:()=>{o.value=""}}),(t,d)=>(s(),p("div",{class:"notebook-container",style:r(u.value)},[n("div",{class:"notebook-wrapper",style:r(c.value)},[n("div",{class:"notebook-cover",style:r(h.value)},[n("div",{class:"notebook-page",style:r(x.value)},[l.showDate?(s(),p("div",{key:0,class:"date-field",style:r(S.value)},[b(n("input",{type:"text","onUpdate:modelValue":d[0]||(d[0]=m=>o.value=m),placeholder:l.datePlaceholder,class:"date-input",onFocus:f,onBlur:y},null,40,C),[[z,o.value]])],4)):_("",!0),n("div",{class:"notebook-content",style:r(v.value)},[k(t.$slots,"default",{},void 0,!0)],4)],4)],4)],4)],4))}};var P=w(D,[["__scopeId","data-v-0b431232"]]);export{P as default};
