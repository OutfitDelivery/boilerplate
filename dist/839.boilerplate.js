(self.webpackChunkboilerplate=self.webpackChunkboilerplate||[]).push([[839],{839:(e,t,o)=>{"use strict";function a(e){let t=document.createElement("span");t.style.fontSize=e.style.fontSize,t.style.display="inline-block",t.innerText="⠀",e.appendChild(t);let o=r(t);t.remove();let a=r(e)/o;return e.dataset.lineCount=a,a}function r(e){var t=window.getComputedStyle(e,null),o=parseFloat(t.getPropertyValue("height"));return"border-box"==t.getPropertyValue("box-sizing")&&(o=o-parseFloat(t.getPropertyValue("padding-top"))-parseFloat(t.getPropertyValue("padding-bottom"))-parseFloat(t.getPropertyValue("border-top-width"))-parseFloat(t.getPropertyValue("border-bottom-width"))),o}function l(e){var t=window.getComputedStyle(e,null),o=parseFloat(t.getPropertyValue("width"));return"border-box"==t.getPropertyValue("box-sizing")&&(o=o-parseFloat(t.getPropertyValue("padding-left"))-parseFloat(t.getPropertyValue("padding-right"))-parseFloat(t.getPropertyValue("border-left-width"))-parseFloat(t.getPropertyValue("border-right-width"))),o}function i(e="portrait"){const t=window.location.href.indexOf("exports")>-1,o=window.location.href.indexOf("localhost")>-1,r="true"===document.body.dataset.preventExportOverflow,l=o?void 0:window.parent.document.querySelector(".preview-frame");if(!(t&&r||l))return document.querySelectorAll("[data-max-line]").forEach((t=>{a(t)>("portrait"==e?t.dataset.maxLine:t.dataset.maxLineAlt||t.dataset.maxLine)?t.classList.add("overflow"):t.classList.remove("overflow")})),!0}function n(e="primary"){const t=window.location.href.indexOf("exports")>-1,o=window.location.href.indexOf("localhost")>-1,a="true"===document.body.dataset.preventExportOverflow,r=o?void 0:window.parent.document.querySelector(".preview-frame");t&&a||r||document.querySelectorAll("[data-max-height]").forEach((t=>{("dynamic"==t.dataset.maxHeight||"true"==t.dataset.maxHeightDynamic)&&d(t);const o="css"==t.dataset.maxHeight,a=window.getComputedStyle(document.body),r=t.scrollHeight,l=t.dataset.maxHeightUnit||"px",i=t.dataset.maxHeightAlt||t.dataset.maxHeight;let n="primary"==e?t.dataset.maxHeight:i;if(o){const e=window.getComputedStyle(t);n=parseFloat(e.maxHeight)}else t.style.maxHeight=n+l,"rem"==l&&(n*=parseFloat(a.fontSize));r>n?t.classList.add("overflow"):t.classList.remove("overflow")}))}function d(e){const t=e.parentNode;t.style.overflow="hidden";const o=parseFloat(window.getComputedStyle(t).height),a=parseFloat(window.getComputedStyle(t).paddingTop),r=parseFloat(window.getComputedStyle(t).paddingBottom),l=Math.floor(o-a-r)-[...t.querySelectorAll(".js-subtrahend")].reduce(((e,t)=>{const o=parseFloat(window.getComputedStyle(t).marginTop),a=parseFloat(window.getComputedStyle(t).marginBottom);return e+t.offsetHeight+o+a}),0);e.dataset.maxHeightDynamic="true",e.dataset.maxHeight=l,t.style.overflow="visible"}function s(){document.querySelectorAll("[data-char-limit]").forEach((e=>{const t=e.dataset.charLimit;if(null!=e){var o=e.querySelectorAll(".token-value");0!=o.length&&(e=o.item(0)),e.innerText.length>t?0!=o.length?e.parentNode.classList.add("overflow"):e.classList.add("overflow"):0!=o.length?e.parentNode.classList.remove("overflow"):e.classList.remove("overflow")}}))}o.r(t),o.d(t,{charLimit:()=>s,dynamicAssign:()=>d,maxHeightCheck:()=>n,maxLineCheck:()=>i,innerWidth:()=>l,innerHeight:()=>r,countLines:()=>a})}}]);