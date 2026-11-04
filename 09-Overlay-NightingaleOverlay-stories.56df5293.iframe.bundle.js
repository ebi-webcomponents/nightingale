"use strict";(self.webpackChunkroot=self.webpackChunkroot||[]).push([[7684],{"./stories/09.Overlay/NightingaleOverlay.stories.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Overlay:()=>Overlay,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit_html__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js");__webpack_require__("./packages/nightingale-navigation/src/index.ts"),__webpack_require__("./packages/nightingale-overlay/src/index.ts"),__webpack_require__("./packages/nightingale-manager/src/index.ts");const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:'import { html } from "lit-html";\nimport "../../packages/nightingale-navigation/src/index.ts";\nimport "../../packages/nightingale-overlay/src/index.ts";\nimport "../../packages/nightingale-manager/src/index.ts";\nexport default {\n    title: "Components/Utils/Overlay",\n    argTypes: {\n        for: {\n            options: [\n                "all",\n                "navigation",\n                "sequence",\n                "div"\n            ],\n            control: {\n                type: "radio"\n            }\n        }\n    }\n};\nconst Template = (args)=>{\n    return html`\n    <div\n      id="all"\n      style="\n      height: 200px; \n      overflow: scroll;\n      border: 7px solid #c7dcec;\n    "\n    >\n      <nightingale-manager>\n        <nightingale-navigation\n          height="50"\n          length="27"\n          id="navigation"\n        ></nightingale-navigation>\n        <nightingale-sequence\n          id="sequence"\n          height="50"\n          sequence="THISISANEXAMPLEFORASEQUENCE"\n          length="27"\n          use-ctrl-to-zoom\n        ></nightingale-sequence>\n      </nightingale-manager>\n      <div id="div" style="background:red;width: 300px;height: 300px;"></div>\n    </div>\n    <nightingale-overlay\n      for=${args["for"]}\n      label=${args["label"]}\n    ></nightingale-overlay>\n  `;\n};\nexport const Overlay = Template.bind({});\nOverlay.args = {\n    for: "all",\n    label: "Use [CTRL] + scroll to zoom"\n};\n',locationsMap:{overlay:{startLoc:{col:17,line:21},endLoc:{col:1,line:52},startBody:{col:17,line:21},endBody:{col:1,line:52}}}}},title:"Components/Utils/Overlay",argTypes:{for:{options:["all","navigation","sequence","div"],control:{type:"radio"}}}},Overlay=(args=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
    <div
      id="all"
      style="
      height: 200px; 
      overflow: scroll;
      border: 7px solid #c7dcec;
    "
    >
      <nightingale-manager>
        <nightingale-navigation
          height="50"
          length="27"
          id="navigation"
        ></nightingale-navigation>
        <nightingale-sequence
          id="sequence"
          height="50"
          sequence="THISISANEXAMPLEFORASEQUENCE"
          length="27"
          use-ctrl-to-zoom
        ></nightingale-sequence>
      </nightingale-manager>
      <div id="div" style="background:red;width: 300px;height: 300px;"></div>
    </div>
    <nightingale-overlay
      for=${args.for}
      label=${args.label}
    ></nightingale-overlay>
  `).bind({});Overlay.args={for:"all",label:"Use [CTRL] + scroll to zoom"};const __namedExportsOrder=["Overlay"];Overlay.parameters={...Overlay.parameters,docs:{...Overlay.parameters?.docs,source:{originalSource:'args => {\n  return html`\n    <div\n      id="all"\n      style="\n      height: 200px; \n      overflow: scroll;\n      border: 7px solid #c7dcec;\n    "\n    >\n      <nightingale-manager>\n        <nightingale-navigation\n          height="50"\n          length="27"\n          id="navigation"\n        ></nightingale-navigation>\n        <nightingale-sequence\n          id="sequence"\n          height="50"\n          sequence="THISISANEXAMPLEFORASEQUENCE"\n          length="27"\n          use-ctrl-to-zoom\n        ></nightingale-sequence>\n      </nightingale-manager>\n      <div id="div" style="background:red;width: 300px;height: 300px;"></div>\n    </div>\n    <nightingale-overlay\n      for=${args["for"]}\n      label=${args["label"]}\n    ></nightingale-overlay>\n  `;\n}',...Overlay.parameters?.docs?.source}}}},"./packages/nightingale-overlay/src/index.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>nightingale_overlay_src});var tslib_es6=__webpack_require__("./node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs"),lit=__webpack_require__("./node_modules/.pnpm/lit@3.1.3/node_modules/lit/index.js"),decorators=__webpack_require__("./node_modules/.pnpm/lit@3.1.3/node_modules/lit/decorators.js"),src=__webpack_require__("./packages/nightingale-new-core/src/index.ts");let NightingaleOverlay=class NightingaleOverlay extends src.default{constructor(){super(...arguments),this.for="",this.label="Use [CTRL] + scroll to zoom",this.ticking=!1,this.over=!1,this.currentTarget=null,this.handleKeyDown=event=>{event.ctrlKey&&this.overlay&&(this.overlay.style.visibility="hidden")},this.handleKeyUp=event=>{event.ctrlKey&&this.overlay&&(this.overlay.style.display="block")},this.handleMouseOver=event=>{const{pageX,pageY}=event;if(this.currentTarget){const{height,width}=this.currentTarget.getBoundingClientRect(),offsetTop=this.getOffsetTop(this.currentTarget),offsetLeft=this.getOffsetLeft(this.currentTarget);pageX>offsetLeft&&pageX<offsetLeft+width&&pageY>offsetTop&&pageY<offsetTop+height?this.over=!0:(this.over=!1,this.overlay&&(this.overlay.style.visibility="hidden"))}},this.handleWheel=event=>{!this.ticking&&this.over&&Math.abs(event.deltaX)<Math.abs(event.deltaY)&&(window.requestAnimationFrame(()=>{this.overlay&&(this.overlay.style.visibility=event.ctrlKey?"hidden":"visible"),this.ticking=!1}),this.ticking=!0)}}refreshOverlay(){if(!this.currentTarget||!this.overlay)return;const{height,width}=this.currentTarget.getBoundingClientRect();this.overlay.style.height=`${height}px`,this.overlay.style.width=`${width}px`,this.overlay.style.top=`${this.currentTarget.offsetTop}px`,this.overlay.style.left=`${this.currentTarget.offsetLeft}px`}observeSizeChangeOfTarget(){this.currentTarget&&(this.sizeObserver=new ResizeObserver(this.refreshOverlay),this.sizeObserver.observe(this.currentTarget),this.sizeObserver.observe(document.body))}connectedCallback(){super.connectedCallback(),this.for&&(this.currentTarget=document.getElementById(this.for)),this.addEventListeners()}disconnectedCallback(){this.removeEventListeners()}willUpdate(changedProperties){changedProperties.has("for")&&(this.removeEventListeners(),this.currentTarget=document.getElementById(this.for),this.addEventListeners())}addEventListeners(){var _a;this.observeSizeChangeOfTarget(),null===(_a=this.currentTarget)||void 0===_a||_a.addEventListener("mouseover",this.handleMouseOver),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("wheel",this.handleWheel)}removeEventListeners(){var _a;this.sizeObserver&&this.sizeObserver.disconnect(),null===(_a=this.currentTarget)||void 0===_a||_a.removeEventListener("mouseover",this.handleMouseOver),window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("wheel",this.handleWheel)}getOffsetTop(element){return null===element||null===element.offsetParent?0:element.offsetTop+this.getOffsetTop(element.offsetParent)}getOffsetLeft(element){return null===element||null===element.offsetParent?0:element.offsetLeft+this.getOffsetLeft(element.offsetParent)}render(){var _a,_b,_c;const rect=null===(_a=this.currentTarget)||void 0===_a?void 0:_a.getBoundingClientRect();return lit.html` <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: ${(null===(_b=this.currentTarget)||void 0===_b?void 0:_b.offsetTop)||0}px;
        left: ${(null===(_c=this.currentTarget)||void 0===_c?void 0:_c.offsetLeft)||0}px;
        height: ${(null==rect?void 0:rect.height)||0}px;
        width: ${(null==rect?void 0:rect.width)||0}px;
        background: rgba(0,0,0,0.3);
        pointer-events: none;
        visibility: hidden;
      "
    >
      <header
        style="
          text-align: center;
          color: white;
          font-size: 1.3em;
          text-shadow: 1px 1px 1px darkslategrey;
        "
      >
        ${this.label}
      </header>
    </div>`}updated(){this.overlay=this.getElementsByTagName("div")[0],this.ticking=!1}};(0,tslib_es6.__decorate)([(0,decorators.property)({type:String})],NightingaleOverlay.prototype,"for",void 0),(0,tslib_es6.__decorate)([(0,decorators.property)({type:String})],NightingaleOverlay.prototype,"label",void 0),NightingaleOverlay=(0,tslib_es6.__decorate)([(0,decorators.customElement)("nightingale-overlay")],NightingaleOverlay);const nightingale_overlay_src=NightingaleOverlay}}]);
//# sourceMappingURL=09-Overlay-NightingaleOverlay-stories.56df5293.iframe.bundle.js.map