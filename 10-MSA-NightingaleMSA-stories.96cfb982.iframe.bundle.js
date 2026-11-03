"use strict";(self.webpackChunkroot=self.webpackChunkroot||[]).push([[8532],{"./stories/10.MSA/NightingaleMSA.stories.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LinksAndMSA:()=>LinksAndMSA,MSA:()=>MSA,MSAWithFeatures:()=>MSAWithFeatures,MinimalMSA:()=>MinimalMSA,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit_html__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit-html/lit-html.js"),_packages_nightingale_msa_src_colorschemes__WEBPACK_IMPORTED_MODULE_4__=(__webpack_require__("./packages/nightingale-msa/src/index.ts"),__webpack_require__("./packages/nightingale-navigation/src/index.ts"),__webpack_require__("./packages/nightingale-manager/src/index.ts"),__webpack_require__("./packages/nightingale-msa/src/colorschemes/index.ts")),_packages_nightingale_links_tests_example_tsv__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/nightingale-links/tests/example.tsv");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Tracks/Alignments",argTypes:{colorScheme:{options:_packages_nightingale_msa_src_colorschemes__WEBPACK_IMPORTED_MODULE_4__.defaultSchemes,control:{type:"select"}}},parameters:{storySource:{source:'import { html } from "lit-html";\nimport "../../packages/nightingale-msa/src/index.ts";\nimport "../../packages/nightingale-navigation/src/index.ts";\nimport "../../packages/nightingale-manager/src/index.ts";\nimport { defaultSchemes } from "../../packages/nightingale-msa/src/colorschemes";\n// @ts-ignore\nimport rawContactsHC from "../../packages/nightingale-links/tests/example.tsv";\nexport default {\n    title: "Components/Tracks/Alignments",\n    argTypes: {\n        colorScheme: {\n            options: defaultSchemes,\n            control: {\n                type: "select"\n            }\n        }\n    },\n    parameters: {\n        actions: {\n            handles: [\n                "onFeatureClick"\n            ]\n        }\n    }\n};\nconst testSequences = [\n    {\n        name: "seq1",\n        sequence: "r1XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII----XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII"\n    },\n    {\n        name: "seq2",\n        sequence: "R2XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXX-XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXXR"\n    },\n    {\n        name: "seq3",\n        sequence: "R3XAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJIIssssXAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJII"\n    },\n    {\n        name: "seq4",\n        sequence: "R4XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXX-XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXXR"\n    }\n];\nconst Template = (args)=>{\n    return html`\n    <nightingale-manager style="width: 100%">\n      <div style="padding-left: 100px">\n        <nightingale-navigation\n          height="50"\n          length="184"\n          id="navigation"\n          display-start=${args.displayStart}\n          display-end=${args.displayEnd}\n        ></nightingale-navigation>\n      </div>\n      <nightingale-msa\n        id="msa"\n        height=${args.height}\n        color-scheme=${args.colorScheme}\n        length="184"\n        display-start=${args.displayStart}\n        display-end=${args.displayEnd}\n        label-width="100"\n        highlight="10:19,40:49"\n        ?overlay-conservation=${args.overlayConsevation}\n      ></nightingale-msa>\n    </nightingale-manager>\n  `;\n};\nexport const MSA = Template.bind({});\nMSA.args = {\n    height: 200,\n    colorScheme: "aliphatic",\n    displayStart: 1,\n    displayEnd: 50,\n    overlayConsevation: false\n};\nMSA.play = async ()=>{\n    await customElements.whenDefined("nightingale-msa");\n    const msa = document.getElementById("msa");\n    if (msa) msa.data = [\n        ...testSequences,\n        ...testSequences,\n        ...testSequences\n    ];\n};\nexport const MinimalMSA = ()=>html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n        display-start="50"\n        display-end="130"\n      ></nightingale-navigation>\n    </div>\n    <nightingale-msa\n      id="msa-2"\n      height="200"\n      length="184"\n      display-start="50"\n      display-end="130"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight="3:20"\n      highlight-color="red"\n    ></nightingale-msa>\n  </nightingale-manager>\n`;\nMinimalMSA.play = async ()=>{\n    await customElements.whenDefined("nightingale-msa");\n    const msa = document.getElementById("msa-2");\n    if (msa) msa.data = [\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences\n    ];\n};\nexport const LinksAndMSA = ()=>html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n      ></nightingale-navigation>\n    </div>\n    <div style="display:flex">\n      <div\n        style="width: 100px; line-height:1rem; flex-grow: 1;display: flex; align-items: center;"\n      >\n        Contacts\n      </div>\n      <div style="flex-grow: 1;">\n        <nightingale-links\n          id="links"\n          height="50"\n          length="184"\n        ></nightingale-links>\n      </div>\n    </div>\n    <nightingale-msa\n      id="msa-3"\n      height="200"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight-color="orange"\n    ></nightingale-msa>\n  </nightingale-manager>\n`;\nLinksAndMSA.play = async ()=>{\n    await customElements.whenDefined("nightingale-msa");\n    const msa = document.getElementById("msa-3");\n    if (msa) msa.data = testSequences;\n    await customElements.whenDefined("nightingale-links");\n    const links = document.getElementById("links");\n    if (links) links.contacts = rawContactsHC;\n};\nexport const MSAWithFeatures = ()=>html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n        display-start="50"\n        display-end="130"\n      ></nightingale-navigation>\n    </div>\n    <nightingale-msa\n      id="msa-2"\n      height="200"\n      length="184"\n      display-start="50"\n      display-end="130"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight="3:20"\n      highlight-color="red"\n    ></nightingale-msa>\n  </nightingale-manager>\n`;\nMSAWithFeatures.play = async ()=>{\n    await customElements.whenDefined("nightingale-msa");\n    const msa = document.getElementById("msa-2");\n    if (msa) msa.data = [\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences,\n        ...testSequences\n    ];\n    msa.features = [\n        {\n            residues: {\n                from: 50,\n                to: 100\n            },\n            sequences: {\n                from: 2,\n                to: 5\n            },\n            id: "feature1",\n            borderColor: "#CC9933",\n            fillColor: "transparent",\n            mouseOverFillColor: "transparent",\n            mouseOverBorderColor: "#CC9933"\n        },\n        {\n            residues: {\n                from: 100,\n                to: 180\n            },\n            sequences: {\n                from: 7,\n                to: 8\n            },\n            id: "feature2",\n            borderColor: "blue",\n            fillColor: "blue",\n            mouseOverFillColor: "purple",\n            mouseOverBorderColor: "purple"\n        }\n    ];\n};\n',locationsMap:{msa:{startLoc:{col:17,line:44},endLoc:{col:1,line:69},startBody:{col:17,line:44},endBody:{col:1,line:69}},"minimal-msa":{startLoc:{col:26,line:87},endLoc:{col:1,line:110},startBody:{col:26,line:87},endBody:{col:1,line:110}},"links-and-msa":{startLoc:{col:27,line:128},endLoc:{col:1,line:159},startBody:{col:27,line:128},endBody:{col:1,line:159}},"msa-with-features":{startLoc:{col:31,line:168},endLoc:{col:1,line:191},startBody:{col:31,line:168},endBody:{col:1,line:191}}}},actions:{handles:["onFeatureClick"]}}},testSequences=[{name:"seq1",sequence:"r1XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII----XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII"},{name:"seq2",sequence:"R2XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXX-XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXXR"},{name:"seq3",sequence:"R3XAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJIIssssXAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJII"},{name:"seq4",sequence:"R4XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXX-XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXXR"}],MSA=(args=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
    <nightingale-manager style="width: 100%">
      <div style="padding-left: 100px">
        <nightingale-navigation
          height="50"
          length="184"
          id="navigation"
          display-start=${args.displayStart}
          display-end=${args.displayEnd}
        ></nightingale-navigation>
      </div>
      <nightingale-msa
        id="msa"
        height=${args.height}
        color-scheme=${args.colorScheme}
        length="184"
        display-start=${args.displayStart}
        display-end=${args.displayEnd}
        label-width="100"
        highlight="10:19,40:49"
        ?overlay-conservation=${args.overlayConsevation}
      ></nightingale-msa>
    </nightingale-manager>
  `).bind({});MSA.args={height:200,colorScheme:"aliphatic",displayStart:1,displayEnd:50,overlayConsevation:!1},MSA.play=async()=>{await customElements.whenDefined("nightingale-msa");const msa=document.getElementById("msa");msa&&(msa.data=[...testSequences,...testSequences,...testSequences])};const MinimalMSA=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <nightingale-manager style="width: 100%">
    <div style="padding-left: 100px">
      <nightingale-navigation
        height="50"
        length="184"
        id="navigation"
        display-start="50"
        display-end="130"
      ></nightingale-navigation>
    </div>
    <nightingale-msa
      id="msa-2"
      height="200"
      length="184"
      display-start="50"
      display-end="130"
      color-scheme="clustal2"
      label-width="100"
      highlight="3:20"
      highlight-color="red"
    ></nightingale-msa>
  </nightingale-manager>
`;MinimalMSA.play=async()=>{await customElements.whenDefined("nightingale-msa");const msa=document.getElementById("msa-2");msa&&(msa.data=[...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences])};const LinksAndMSA=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <nightingale-manager style="width: 100%">
    <div style="padding-left: 100px">
      <nightingale-navigation
        height="50"
        length="184"
        id="navigation"
      ></nightingale-navigation>
    </div>
    <div style="display:flex">
      <div
        style="width: 100px; line-height:1rem; flex-grow: 1;display: flex; align-items: center;"
      >
        Contacts
      </div>
      <div style="flex-grow: 1;">
        <nightingale-links
          id="links"
          height="50"
          length="184"
        ></nightingale-links>
      </div>
    </div>
    <nightingale-msa
      id="msa-3"
      height="200"
      color-scheme="clustal2"
      label-width="100"
      highlight-color="orange"
    ></nightingale-msa>
  </nightingale-manager>
`;LinksAndMSA.play=async()=>{await customElements.whenDefined("nightingale-msa");const msa=document.getElementById("msa-3");msa&&(msa.data=testSequences),await customElements.whenDefined("nightingale-links");const links=document.getElementById("links");links&&(links.contacts=_packages_nightingale_links_tests_example_tsv__WEBPACK_IMPORTED_MODULE_5__)};const MSAWithFeatures=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <nightingale-manager style="width: 100%">
    <div style="padding-left: 100px">
      <nightingale-navigation
        height="50"
        length="184"
        id="navigation"
        display-start="50"
        display-end="130"
      ></nightingale-navigation>
    </div>
    <nightingale-msa
      id="msa-2"
      height="200"
      length="184"
      display-start="50"
      display-end="130"
      color-scheme="clustal2"
      label-width="100"
      highlight="3:20"
      highlight-color="red"
    ></nightingale-msa>
  </nightingale-manager>
`;MSAWithFeatures.play=async()=>{await customElements.whenDefined("nightingale-msa");const msa=document.getElementById("msa-2");msa&&(msa.data=[...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences,...testSequences]),msa.features=[{residues:{from:50,to:100},sequences:{from:2,to:5},id:"feature1",borderColor:"#CC9933",fillColor:"transparent",mouseOverFillColor:"transparent",mouseOverBorderColor:"#CC9933"},{residues:{from:100,to:180},sequences:{from:7,to:8},id:"feature2",borderColor:"blue",fillColor:"blue",mouseOverFillColor:"purple",mouseOverBorderColor:"purple"}]};const __namedExportsOrder=["MSA","MinimalMSA","LinksAndMSA","MSAWithFeatures"];MSA.parameters={...MSA.parameters,docs:{...MSA.parameters?.docs,source:{originalSource:'args => {\n  return html`\n    <nightingale-manager style="width: 100%">\n      <div style="padding-left: 100px">\n        <nightingale-navigation\n          height="50"\n          length="184"\n          id="navigation"\n          display-start=${args.displayStart}\n          display-end=${args.displayEnd}\n        ></nightingale-navigation>\n      </div>\n      <nightingale-msa\n        id="msa"\n        height=${args.height}\n        color-scheme=${args.colorScheme}\n        length="184"\n        display-start=${args.displayStart}\n        display-end=${args.displayEnd}\n        label-width="100"\n        highlight="10:19,40:49"\n        ?overlay-conservation=${args.overlayConsevation}\n      ></nightingale-msa>\n    </nightingale-manager>\n  `;\n}',...MSA.parameters?.docs?.source}}},MinimalMSA.parameters={...MinimalMSA.parameters,docs:{...MinimalMSA.parameters?.docs,source:{originalSource:'() => html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n        display-start="50"\n        display-end="130"\n      ></nightingale-navigation>\n    </div>\n    <nightingale-msa\n      id="msa-2"\n      height="200"\n      length="184"\n      display-start="50"\n      display-end="130"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight="3:20"\n      highlight-color="red"\n    ></nightingale-msa>\n  </nightingale-manager>\n`',...MinimalMSA.parameters?.docs?.source}}},LinksAndMSA.parameters={...LinksAndMSA.parameters,docs:{...LinksAndMSA.parameters?.docs,source:{originalSource:'() => html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n      ></nightingale-navigation>\n    </div>\n    <div style="display:flex">\n      <div\n        style="width: 100px; line-height:1rem; flex-grow: 1;display: flex; align-items: center;"\n      >\n        Contacts\n      </div>\n      <div style="flex-grow: 1;">\n        <nightingale-links\n          id="links"\n          height="50"\n          length="184"\n        ></nightingale-links>\n      </div>\n    </div>\n    <nightingale-msa\n      id="msa-3"\n      height="200"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight-color="orange"\n    ></nightingale-msa>\n  </nightingale-manager>\n`',...LinksAndMSA.parameters?.docs?.source}}},MSAWithFeatures.parameters={...MSAWithFeatures.parameters,docs:{...MSAWithFeatures.parameters?.docs,source:{originalSource:'() => html`\n  <nightingale-manager style="width: 100%">\n    <div style="padding-left: 100px">\n      <nightingale-navigation\n        height="50"\n        length="184"\n        id="navigation"\n        display-start="50"\n        display-end="130"\n      ></nightingale-navigation>\n    </div>\n    <nightingale-msa\n      id="msa-2"\n      height="200"\n      length="184"\n      display-start="50"\n      display-end="130"\n      color-scheme="clustal2"\n      label-width="100"\n      highlight="3:20"\n      highlight-color="red"\n    ></nightingale-msa>\n  </nightingale-manager>\n`',...MSAWithFeatures.parameters?.docs?.source}}}},"./packages/nightingale-links/tests/example.tsv"(module){module.exports="x y a b score\n1 2 0 8 0.9999824\n2 1 0 8 0.9999824\n29 36 0 8 0.9999824\n50 28 0 8 0.9999750\n46 27 0 8 0.9999180\n47 27 0 8 0.9999129\n43 27 0 8 0.9998918\n47 21 0 8 0.9998869\n42 95 0 8 0.9998656\n50 11 0 8 0.9998630\n15 84 0 8 0.9998622\n23 21 0 8 0.9998603\n49 53 0 8 0.9998345\n42 94 0 8 0.9997534\n15 81 0 8 0.9997336\n22 61 0 8 0.9997303\n23 58 0 8 0.9997283\n49 92 0 8 0.9997106\n4 24 0 8 0.9996893\n46 54 0 8 0.9996536\n4 28 0 8 0.9996450\n54 90 0 8 0.9996014\n2 23 0 8 0.9995791\n12 28 0 8 0.9995524\n27 96 0 8 0.9995375\n3 23 0 8 0.9995042\n3 26 0 8 0.9995012"}}]);
//# sourceMappingURL=10-MSA-NightingaleMSA-stories.96cfb982.iframe.bundle.js.map