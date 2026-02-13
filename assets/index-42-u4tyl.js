import{g as Z,j as K}from"./index-DSsTZ9Mc.js";function Q(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const a in r)if(a!=="default"&&!(a in e)){const o=Object.getOwnPropertyDescriptor(r,a);o&&Object.defineProperty(e,a,o.get?o:{enumerable:!0,get:()=>r[a]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var x={};/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var R=function(e,t){return R=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var a in r)r.hasOwnProperty(a)&&(n[a]=r[a])},R(e,t)};function Y(e,t){R(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var C=function(){return C=Object.assign||function(t){for(var n,r=1,a=arguments.length;r<a;r++){n=arguments[r];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},C.apply(this,arguments)};function $(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n}function ee(e,t,n,r){var a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(i=e[l])&&(o=(a<3?i(o):a>3?i(t,n,o):i(t,n))||o);return a>3&&o&&Object.defineProperty(t,n,o),o}function te(e,t){return function(n,r){t(n,r,e)}}function ne(e,t){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(e,t)}function re(e,t,n,r){function a(o){return o instanceof n?o:new n(function(i){i(o)})}return new(n||(n=Promise))(function(o,i){function l(u){try{s(r.next(u))}catch(p){i(p)}}function f(u){try{s(r.throw(u))}catch(p){i(p)}}function s(u){u.done?o(u.value):a(u.value).then(l,f)}s((r=r.apply(e,t||[])).next())})}function oe(e,t){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},r,a,o,i;return i={next:l(0),throw:l(1),return:l(2)},typeof Symbol=="function"&&(i[Symbol.iterator]=function(){return this}),i;function l(s){return function(u){return f([s,u])}}function f(s){if(r)throw new TypeError("Generator is already executing.");for(;n;)try{if(r=1,a&&(o=s[0]&2?a.return:s[0]?a.throw||((o=a.return)&&o.call(a),0):a.next)&&!(o=o.call(a,s[1])).done)return o;switch(a=0,o&&(s=[s[0]&2,o.value]),s[0]){case 0:case 1:o=s;break;case 4:return n.label++,{value:s[1],done:!1};case 5:n.label++,a=s[1],s=[0];continue;case 7:s=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(s[0]===6||s[0]===2)){n=0;continue}if(s[0]===3&&(!o||s[1]>o[0]&&s[1]<o[3])){n.label=s[1];break}if(s[0]===6&&n.label<o[1]){n.label=o[1],o=s;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(s);break}o[2]&&n.ops.pop(),n.trys.pop();continue}s=t.call(e,n)}catch(u){s=[6,u],a=0}finally{r=o=0}if(s[0]&5)throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}}function ae(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]}function ie(e,t){for(var n in e)n!=="default"&&!t.hasOwnProperty(n)&&(t[n]=e[n])}function X(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function W(e,t){var n=typeof Symbol=="function"&&e[Symbol.iterator];if(!n)return e;var r=n.call(e),a,o=[],i;try{for(;(t===void 0||t-- >0)&&!(a=r.next()).done;)o.push(a.value)}catch(l){i={error:l}}finally{try{a&&!a.done&&(n=r.return)&&n.call(r)}finally{if(i)throw i.error}}return o}function se(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(W(arguments[t]));return e}function le(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;for(var r=Array(e),a=0,t=0;t<n;t++)for(var o=arguments[t],i=0,l=o.length;i<l;i++,a++)r[a]=o[i];return r}function T(e){return this instanceof T?(this.v=e,this):new T(e)}function ue(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=n.apply(e,t||[]),a,o=[];return a={},i("next"),i("throw"),i("return"),a[Symbol.asyncIterator]=function(){return this},a;function i(c){r[c]&&(a[c]=function(d){return new Promise(function(S,V){o.push([c,d,S,V])>1||l(c,d)})})}function l(c,d){try{f(r[c](d))}catch(S){p(o[0][3],S)}}function f(c){c.value instanceof T?Promise.resolve(c.value.v).then(s,u):p(o[0][2],c)}function s(c){l("next",c)}function u(c){l("throw",c)}function p(c,d){c(d),o.shift(),o.length&&l(o[0][0],o[0][1])}}function ce(e){var t,n;return t={},r("next"),r("throw",function(a){throw a}),r("return"),t[Symbol.iterator]=function(){return this},t;function r(a,o){t[a]=e[a]?function(i){return(n=!n)?{value:T(e[a](i)),done:a==="return"}:o?o(i):i}:o}}function fe(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],n;return t?t.call(e):(e=typeof X=="function"?X(e):e[Symbol.iterator](),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(o){n[o]=e[o]&&function(i){return new Promise(function(l,f){i=e[o](i),a(l,f,i.done,i.value)})}}function a(o,i,l,f){Promise.resolve(f).then(function(s){o({value:s,done:l})},i)}}function me(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}function pe(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function de(e){return e&&e.__esModule?e:{default:e}}function he(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)}function ye(e,t,n){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,n),n}const ge=Object.freeze(Object.defineProperty({__proto__:null,get __assign(){return C},__asyncDelegator:ce,__asyncGenerator:ue,__asyncValues:fe,__await:T,__awaiter:re,__classPrivateFieldGet:he,__classPrivateFieldSet:ye,__createBinding:ae,__decorate:ee,__exportStar:ie,__extends:Y,__generator:oe,__importDefault:de,__importStar:pe,__makeTemplateObject:me,__metadata:ne,__param:te,__read:W,__rest:$,__spread:se,__spreadArrays:le,__values:X},Symbol.toStringTag,{value:"Module"})),O=Z(ge);var h={},D={},q={},m={},F;function _e(){return F||(F=1,Object.defineProperty(m,"__esModule",{value:!0}),m.documentTemplate=m.defaultMargins=void 0,m.defaultMargins={top:1440,right:1440,bottom:1440,left:1440,header:720,footer:720,gutter:0},m.documentTemplate=function(e,t,n,r){return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:ns6="http://schemas.openxmlformats.org/schemaLibrary/2006/main"
  xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"
  xmlns:ns8="http://schemas.openxmlformats.org/drawingml/2006/chartDrawing"
  xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
  xmlns:ns11="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
  xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram"
  xmlns:ns13="urn:schemas-microsoft-com:office:excel"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:ns17="urn:schemas-microsoft-com:office:powerpoint"
  xmlns:odx="http://opendope.org/xpaths"
  xmlns:odc="http://opendope.org/conditions"
  xmlns:odq="http://opendope.org/questions"
  xmlns:odi="http://opendope.org/components"
  xmlns:odgm="http://opendope.org/SmartArt/DataHierarchy"
  xmlns:ns24="http://schemas.openxmlformats.org/officeDocument/2006/bibliography"
  xmlns:ns25="http://schemas.openxmlformats.org/drawingml/2006/compatibility"
  xmlns:ns26="http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas">
  <w:body>
    <w:altChunk r:id="htmlChunk" />
    <w:sectPr>
      <w:pgSz w:w="`+e+'" w:h="'+t+'" w:orient="'+n+`" />
      <w:pgMar w:top="`+r.top+`"
               w:right="`+r.right+`"
               w:bottom="`+r.bottom+`"
               w:left="`+r.left+`"
               w:header="`+r.header+`"
               w:footer="`+r.footer+`"
               w:gutter="`+r.gutter+`"/>
    </w:sectPr>
  </w:body>
</w:document>
`}),m}var g={},B;function ve(){return B||(B=1,Object.defineProperty(g,"__esModule",{value:!0}),g.mhtDocumentTemplate=void 0,g.mhtDocumentTemplate=function(e,t){return`MIME-Version: 1.0
Content-Type: multipart/related;
    type="text/html";
    boundary="----=mhtDocumentPart"


------=mhtDocumentPart
Content-Type: text/html;
    charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Location: file:///C:/fake/document.html

`+e+`

`+t+`

------=mhtDocumentPart--
`}),g}var _={},E;function we(){return E||(E=1,Object.defineProperty(_,"__esModule",{value:!0}),_.mhtPartTemplate=void 0,_.mhtPartTemplate=function(e,t,n,r){return`------=mhtDocumentPart
Content-Type: `+e+`
Content-Transfer-Encoding: `+t+`
Content-Location: `+n+`

`+r+`
`}),_}(function(e){Object.defineProperty(e,"__esModule",{value:!0});var t=O;t.__exportStar(_e(),e),t.__exportStar(ve(),e),t.__exportStar(we(),e)})(q);Object.defineProperty(D,"__esModule",{value:!0});D.getMHTdocument=void 0;var G=q;function be(e){var t=xe(e),n=t.imageContentParts.join(`
`);return e=t.htmlSource.replace(/\=/g,"=3D"),G.mhtDocumentTemplate(e,n)}D.getMHTdocument=be;function xe(e){var t=[],n=/"data:(\w+\/\w+);(\w+),(\S+)"/g,r=function(a,o,i,l){var f=t.length,s=o.split("/")[1],u="file:///C:/fake/image"+f+"."+s;return t.push(G.mhtPartTemplate(o,i,u,l)),'"'+u+'"'};return/<img/g.test(e)?(e=e.replace(n,r),{htmlSource:e,imageContentParts:t}):{htmlSource:e,imageContentParts:t}}var J={},v={},I;function Te(){return I||(I=1,Object.defineProperty(v,"__esModule",{value:!0}),v.contentTypesXml=void 0,v.contentTypesXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType=
    "application/vnd.openxmlformats-package.relationships+xml" />
  <Override PartName="/word/document.xml" ContentType=
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/afchunk.mht" ContentType="message/rfc822"/>
</Types>
`),v}var w={},k;function Pe(){return k||(k=1,Object.defineProperty(w,"__esModule",{value:!0}),w.documentXmlRels=void 0,w.documentXmlRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk"
    Target="/word/afchunk.mht" Id="htmlChunk" />
</Relationships>
`),w}var b={},A;function Oe(){return A||(A=1,Object.defineProperty(b,"__esModule",{value:!0}),b.relsXml=void 0,b.relsXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship
      Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
      Target="/word/document.xml" Id="R09c83fafc067488e" />
</Relationships>
`),b}(function(e){Object.defineProperty(e,"__esModule",{value:!0});var t=O;t.__exportStar(Te(),e),t.__exportStar(Pe(),e),t.__exportStar(Oe(),e)})(J);var y={};Object.defineProperty(y,"__esModule",{value:!0});var De=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Se=typeof window<"u"&&typeof window.document<"u",je=(typeof self>"u"?"undefined":De(self))==="object"&&self.constructor&&self.constructor.name==="DedicatedWorkerGlobalScope",Me=typeof process<"u"&&process.versions!=null&&process.versions.node!=null,Re=function(){return typeof window<"u"&&window.name==="nodejs"||navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")};y.isBrowser=Se;y.isWebWorker=je;y.isNode=Me;y.isJsDom=Re;Object.defineProperty(h,"__esModule",{value:!0});h.addFiles=h.generateDocument=void 0;var P=O,Ce=D,j=J,N=q,L=y,Xe={orientation:"portrait",margins:{}};function z(e,t){return P.__assign(P.__assign({},e),t)}function qe(e){return P.__awaiter(this,void 0,void 0,function(){var t;return P.__generator(this,function(n){switch(n.label){case 0:return[4,e.generateAsync({type:"arraybuffer"})];case 1:return t=n.sent(),L.isBrowser?[2,new Blob([t],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})]:[2,new Buffer(new Uint8Array(t))]}})})}h.generateDocument=qe;function M(e){return L.isBrowser?new Blob([e]):new Buffer(e,"utf-8")}function Fe(e){var t=e.orientation,n=e.margins,r=z(N.defaultMargins,n),a=0,o=0;return t==="landscape"?(o=12240,a=15840):(a=12240,o=15840),N.documentTemplate(a,o,t,r)}function Be(e,t,n){var r=z(Xe,n);return e.file("[Content_Types].xml",M(j.contentTypesXml),{createFolders:!1}),e.folder("_rels").file(".rels",M(j.relsXml),{createFolders:!1}),e.folder("word").file("document.xml",Fe(r),{createFolders:!1}).file("afchunk.mht",Ce.getMHTdocument(t),{createFolders:!1}).folder("_rels").file("document.xml.rels",M(j.documentXmlRels),{createFolders:!1})}h.addFiles=Be;Object.defineProperty(x,"__esModule",{value:!0});x.asBlob=void 0;var H=O,U=h,Ee=K;function Ie(e,t){return t===void 0&&(t={}),H.__awaiter(this,void 0,void 0,function(){var n;return H.__generator(this,function(r){switch(r.label){case 0:return n=new Ee,U.addFiles(n,e,t),[4,U.generateDocument(n)];case 1:return[2,r.sent()]}})})}x.asBlob=Ie;const Ae=Q({__proto__:null,default:x},[x]);export{Ae as i};
