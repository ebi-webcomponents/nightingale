"use strict";(self.webpackChunkroot=self.webpackChunkroot||[]).push([[7493],{"./stories/17.Filter/NightingaleFilter.stories.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Filter:()=>Filter,__namedExportsOrder:()=>__namedExportsOrder,default:()=>NightingaleFilter_stories});var _NightingaleFilter_deselected,_NightingaleFilter_manager,lit_html=__webpack_require__("./node_modules/lit-html/lit-html.js"),tslib_es6=__webpack_require__("./node_modules/tslib/tslib.es6.mjs"),decorators=__webpack_require__("./node_modules/lit/decorators.js"),lit=__webpack_require__("./node_modules/lit/index.js"),groupBy=__webpack_require__("./packages/nightingale-filter/node_modules/lodash-es/groupBy.js"),src=__webpack_require__("./packages/nightingale-new-core/src/index.ts");let NightingaleFilter=class NightingaleFilter extends src.default{constructor(){super(),this.filters=[],this.for="",_NightingaleFilter_deselected.set(this,new Set),_NightingaleFilter_manager.set(this,void 0),this.filters=[]}connectedCallback(){super.connectedCallback(),this.closest("nightingale-manager")&&((0,tslib_es6.__classPrivateFieldSet)(this,_NightingaleFilter_manager,this.closest("nightingale-manager"),"f"),(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_manager,"f").register(this))}disconnectedCallback(){super.disconnectedCallback(),(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_manager,"f")&&(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_manager,"f").unregister(this)}render(){const groupByType=(0,groupBy.default)(this.filters,f=>f.type.text);return lit.html`
      <style>
        .group-title {
          line-height: normal;
        }

        .group {
          margin-bottom: 2.5rem;
        }

        .protvista_checkbox {
          position: relative;
          cursor: pointer;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          margin-top: 10px;
          line-height: 24px;
          outline: none;
        }

        .protvista_checkbox_input {
          margin: 0 0.25rem 0 0;
        }

        .protvista_checkbox_label {
          margin-left: 0.2rem;
          line-height: 1rem;
        }
      </style>
      ${Object.entries(groupByType).map(([type,group])=>lit.html`
          <h4 class="group-title">${type}</h4>
          <div class="group">
            ${group.map(filterItem=>lit.html` ${this.getCheckBox(filterItem)} `)}
          </div>
        `)}
    `}getCheckBox(filterItem){const{name,options}=filterItem,{label,color}=options;return lit.html`
      <label class="protvista_checkbox" tabindex="0">
        <input
          type="checkbox"
          style=${`accent-color: ${color}`}
          checked
          .value="${name}"
          class="protvista_checkbox_input"
          @change="${()=>this.toggleFilter(name)}"
        />
        <span class="protvista_checkbox_label"> ${label} </span>
      </label>
    `}toggleFilter(name){var _a;(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_deselected,"f").has(name)?(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_deselected,"f").delete(name):(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_deselected,"f").add(name),this.dispatchEvent(new CustomEvent("change",{bubbles:!0,composed:!0,detail:{type:"filters",handler:"property",for:this.for,value:null===(_a=this.filters)||void 0===_a?void 0:_a.filter(f=>!(0,tslib_es6.__classPrivateFieldGet)(this,_NightingaleFilter_deselected,"f").has(f.name)).map(f=>f.name)}}))}};_NightingaleFilter_deselected=new WeakMap,_NightingaleFilter_manager=new WeakMap,(0,tslib_es6.__decorate)([(0,decorators.property)({attribute:!1})],NightingaleFilter.prototype,"filters",void 0),(0,tslib_es6.__decorate)([(0,decorators.property)({type:String})],NightingaleFilter.prototype,"for",void 0),NightingaleFilter=(0,tslib_es6.__decorate)([(0,decorators.customElement)("nightingale-filter")],NightingaleFilter);const tests_filterConfig=[{name:"disease",type:{name:"consequence",text:"Filter Consequence"},options:{label:"Likely pathogenic or pathogenic",color:"#990000"},filterData:()=>{}},{name:"predicted",type:{name:"consequence",text:"Filter Consequence"},options:{label:"Predicted consequence",color:"#4c8acd"},filterData:()=>{}},{name:"nonDisease",type:{name:"consequence",text:"Filter Consequence"},options:{label:"Likely benign or benign",color:"#99cc00"},filterData:()=>{}},{name:"uncertain",type:{name:"consequence",text:"Filter Consequence"},options:{label:"Uncertain significance",color:"#009e73"},filterData:()=>{}}];const NightingaleFilter_stories={parameters:{storySource:{source:'import { html } from "lit-html";\nimport "../../packages/nightingale-filter/src/index";\nimport filterConfig from "../../packages/nightingale-filter/tests/filterConfig";\nexport default {\n    title: "Components/Utils/Filter"\n};\nconst Template = ()=>{\n    setTimeout(async ()=>{\n        await customElements.whenDefined("nightingale-filter");\n        const filterComponent = document.getElementById("filter");\n        if (filterComponent) {\n            filterComponent.filters = filterConfig;\n        }\n    }, 500);\n    return html`<nightingale-filter\n      for="variation"\n      id="filter"\n    ></nightingale-filter>\n    `;\n};\nexport const Filter = Template.bind({});\nFilter.args = {\n    for: "variation"\n};\n',locationsMap:{filter:{startLoc:{col:17,line:7},endLoc:{col:1,line:20},startBody:{col:17,line:7},endBody:{col:1,line:20}}}}},title:"Components/Utils/Filter"},Filter=(()=>(setTimeout(async()=>{await customElements.whenDefined("nightingale-filter");const filterComponent=document.getElementById("filter");filterComponent&&(filterComponent.filters=tests_filterConfig)},500),lit_html.html`<nightingale-filter
      for="variation"
      id="filter"
    ></nightingale-filter>
    `)).bind({});Filter.args={for:"variation"};const __namedExportsOrder=["Filter"];Filter.parameters={...Filter.parameters,docs:{...Filter.parameters?.docs,source:{originalSource:'() => {\n  setTimeout(async () => {\n    await customElements.whenDefined("nightingale-filter");\n    const filterComponent = document.getElementById("filter") as unknown as NightingaleFilter;\n    if (filterComponent) {\n      filterComponent.filters = filterConfig;\n    }\n  }, 500);\n  return html`<nightingale-filter\n      for="variation"\n      id="filter"\n    ></nightingale-filter>\n    `;\n}',...Filter.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=17-Filter-NightingaleFilter-stories.d1056801.iframe.bundle.js.map