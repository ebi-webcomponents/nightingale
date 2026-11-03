"use strict";(self.webpackChunkroot=self.webpackChunkroot||[]).push([[3661],{"./stories/06.InterProTrack/NightingaleInterProTrack.stories.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{SimpleTrackNoControls:()=>SimpleTrackNoControls,Track:()=>Track,TrackAndContributorsNoControls:()=>TrackAndContributorsNoControls,TrackAndLabels:()=>TrackAndLabels,TrackWithContributorsAndResiduesNoControls:()=>TrackWithContributorsAndResiduesNoControls,TrackWithResiduesNoControls:()=>TrackWithResiduesNoControls,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit_html__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js"),_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./packages/nightingale-interpro-track/src/index.ts"),__webpack_require__("./packages/nightingale-interpro-track/tests/mockData/interpro-IPR016039.json")),_packages_nightingale_interpro_track_tests_mockData_interpro_contributors_json__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/nightingale-interpro-track/tests/mockData/interpro-contributors.json"),_packages_nightingale_interpro_track_tests_mockData_interpro_residues_json__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/nightingale-interpro-track/tests/mockData/interpro-residues.json");const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:'import { html } from "lit-html";\nimport "../../packages/nightingale-interpro-track/src/index.ts";\nimport data from "../../packages/nightingale-interpro-track/tests/mockData/interpro-IPR016039.json";\nimport contributors from "../../packages/nightingale-interpro-track/tests/mockData/interpro-contributors.json";\nimport residues from "../../packages/nightingale-interpro-track/tests/mockData/interpro-residues.json";\nexport default {\n    title: "Components/Tracks/InterPro Track"\n};\nconst Template = (args)=>{\n    const { width, height, length, highlight, layout } = args;\n    return html`<nightingale-interpro-track\n    id="track"\n    width="${width}"\n    height=${height}\n    length="${length}"\n    display-start=${args["display-start"]}\n    display-end=${args["display-end"]}\n    highlight=${highlight}\n    layout=${layout}\n  ></nightingale-interpro-track>`;\n};\nexport const Track = Template.bind({});\nTrack.args = {\n    width: 500,\n    height: 50,\n    length: 100,\n    "display-start": 1,\n    "display-end": 50,\n    highlight: "23:45",\n    layout: "default"\n};\nTrack.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track = document.getElementById("track");\n    if (track) track.data = data;\n};\nexport const SimpleTrackNoControls = ()=>html`\n  <h3>Entry</h3>\n  <nightingale-interpro-track\n    id="track1"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    show-label\n  ></nightingale-interpro-track>\n`;\nSimpleTrackNoControls.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track1 = document.getElementById("track1");\n    if (track1) {\n        track1.data = data;\n    }\n};\nexport const TrackAndContributorsNoControls = ()=>html`\n  <h3>Entry + contributors</h3>\n  <nightingale-interpro-track\n    id="track2"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`;\nTrackAndContributorsNoControls.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track2 = document.getElementById("track2");\n    if (track2) {\n        track2.data = data;\n        track2.contributors = contributors;\n    }\n};\nexport const TrackWithResiduesNoControls = ()=>html`\n  <h3>Entry + residues</h3>\n  <nightingale-interpro-track\n    id="track3"\n    width="600"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`;\nTrackWithResiduesNoControls.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track3 = document.getElementById("track3");\n    if (track3) {\n        const dataCopy = data.map(({ ...rest })=>({\n                ...rest\n            }));\n        dataCopy[0].residues = residues;\n        track3.data = dataCopy;\n    }\n};\nexport const TrackWithContributorsAndResiduesNoControls = ()=>html`\n  <h3>Entry + contributors + residues</h3>\n  <nightingale-interpro-track\n    id="track4"\n    width="600"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`;\nTrackWithContributorsAndResiduesNoControls.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track4 = document.getElementById("track4");\n    if (track4) {\n        const contributorsCopy = contributors.map(({ ...rest })=>({\n                ...rest\n            }));\n        contributorsCopy[0].residues = residues;\n        track4.data = data;\n        track4.contributors = contributorsCopy;\n    }\n};\nexport const TrackAndLabels = ()=>html`\n  <h3>Entry with Labels</h3>\n  <h5>Entry with a fix and long label</h5>\n  <nightingale-interpro-track\n    id="track5"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    show-label\n    label="A very long label that should go on all the locations"\n  ></nightingale-interpro-track>\n  <h5>Entry using default label(accession)</h5>\n  <nightingale-interpro-track\n    id="track6"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    show-label\n  ></nightingale-interpro-track>\n  <h5>Entry specifying a feature field as label (.feature.name)</h5>\n  <nightingale-interpro-track\n    id="track7"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    label=".feature.name"\n    show-label\n  ></nightingale-interpro-track>\n  <h5>Entry contributors and labels</h5>\n  <nightingale-interpro-track\n    id="track8"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    label=".feature.name"\n    show-label\n    expanded\n  ></nightingale-interpro-track>\n`;\nTrackAndLabels.play = async ()=>{\n    await customElements.whenDefined("nightingale-interpro-track");\n    const track5 = document.getElementById("track5");\n    if (track5) {\n        track5.data = data;\n    }\n    const track6 = document.getElementById("track6");\n    if (track6) {\n        track6.data = data;\n    }\n    const track7 = document.getElementById("track7");\n    if (track7) {\n        track7.data = data;\n    }\n    const track8 = document.getElementById("track8");\n    if (track8) {\n        track8.data = data;\n        track8.contributors = contributors;\n    }\n};\n',locationsMap:{track:{startLoc:{col:17,line:9},endLoc:{col:1,line:21},startBody:{col:17,line:9},endBody:{col:1,line:21}},"simple-track-no-controls":{startLoc:{col:37,line:37},endLoc:{col:1,line:48},startBody:{col:37,line:37},endBody:{col:1,line:48}},"track-and-contributors-no-controls":{startLoc:{col:46,line:56},endLoc:{col:1,line:67},startBody:{col:46,line:56},endBody:{col:1,line:67}},"track-with-residues-no-controls":{startLoc:{col:43,line:76},endLoc:{col:1,line:88},startBody:{col:43,line:76},endBody:{col:1,line:88}},"track-with-contributors-and-residues-no-controls":{startLoc:{col:58,line:100},endLoc:{col:1,line:112},startBody:{col:58,line:100},endBody:{col:1,line:112}},"track-and-labels":{startLoc:{col:30,line:125},endLoc:{col:1,line:163},startBody:{col:30,line:125},endBody:{col:1,line:163}}}}},title:"Components/Tracks/InterPro Track"},Track=(args=>{const{width,height,length,highlight,layout}=args;return lit_html__WEBPACK_IMPORTED_MODULE_0__.html`<nightingale-interpro-track
    id="track"
    width="${width}"
    height=${height}
    length="${length}"
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight=${highlight}
    layout=${layout}
  ></nightingale-interpro-track>`}).bind({});Track.args={width:500,height:50,length:100,"display-start":1,"display-end":50,highlight:"23:45",layout:"default"},Track.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track=document.getElementById("track");track&&(track.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__)};const SimpleTrackNoControls=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <h3>Entry</h3>
  <nightingale-interpro-track
    id="track1"
    length="490"
    display-start="1"
    display-end="490"
    highlight="20:50,40:80"
    shape="roundRectangle"
    show-label
  ></nightingale-interpro-track>
`;SimpleTrackNoControls.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track1=document.getElementById("track1");track1&&(track1.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__)};const TrackAndContributorsNoControls=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <h3>Entry + contributors</h3>
  <nightingale-interpro-track
    id="track2"
    length="490"
    display-start="1"
    display-end="490"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;TrackAndContributorsNoControls.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track2=document.getElementById("track2");track2&&(track2.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__,track2.contributors=_packages_nightingale_interpro_track_tests_mockData_interpro_contributors_json__WEBPACK_IMPORTED_MODULE_3__)};const TrackWithResiduesNoControls=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <h3>Entry + residues</h3>
  <nightingale-interpro-track
    id="track3"
    width="600"
    length="490"
    display-start="1"
    display-end="490"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;TrackWithResiduesNoControls.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track3=document.getElementById("track3");if(track3){const dataCopy=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__.map(({...rest})=>({...rest}));dataCopy[0].residues=_packages_nightingale_interpro_track_tests_mockData_interpro_residues_json__WEBPACK_IMPORTED_MODULE_4__,track3.data=dataCopy}};const TrackWithContributorsAndResiduesNoControls=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <h3>Entry + contributors + residues</h3>
  <nightingale-interpro-track
    id="track4"
    width="600"
    length="490"
    display-start="1"
    display-end="490"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;TrackWithContributorsAndResiduesNoControls.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track4=document.getElementById("track4");if(track4){const contributorsCopy=_packages_nightingale_interpro_track_tests_mockData_interpro_contributors_json__WEBPACK_IMPORTED_MODULE_3__.map(({...rest})=>({...rest}));contributorsCopy[0].residues=_packages_nightingale_interpro_track_tests_mockData_interpro_residues_json__WEBPACK_IMPORTED_MODULE_4__,track4.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__,track4.contributors=contributorsCopy}};const TrackAndLabels=()=>lit_html__WEBPACK_IMPORTED_MODULE_0__.html`
  <h3>Entry with Labels</h3>
  <h5>Entry with a fix and long label</h5>
  <nightingale-interpro-track
    id="track5"
    width="600"
    length="490"
    shape="roundRectangle"
    show-label
    label="A very long label that should go on all the locations"
  ></nightingale-interpro-track>
  <h5>Entry using default label(accession)</h5>
  <nightingale-interpro-track
    id="track6"
    width="600"
    length="490"
    shape="roundRectangle"
    show-label
  ></nightingale-interpro-track>
  <h5>Entry specifying a feature field as label (.feature.name)</h5>
  <nightingale-interpro-track
    id="track7"
    width="600"
    length="490"
    shape="roundRectangle"
    label=".feature.name"
    show-label
  ></nightingale-interpro-track>
  <h5>Entry contributors and labels</h5>
  <nightingale-interpro-track
    id="track8"
    width="600"
    length="490"
    shape="roundRectangle"
    label=".feature.name"
    show-label
    expanded
  ></nightingale-interpro-track>
`;TrackAndLabels.play=async()=>{await customElements.whenDefined("nightingale-interpro-track");const track5=document.getElementById("track5");track5&&(track5.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__);const track6=document.getElementById("track6");track6&&(track6.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__);const track7=document.getElementById("track7");track7&&(track7.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__);const track8=document.getElementById("track8");track8&&(track8.data=_packages_nightingale_interpro_track_tests_mockData_interpro_IPR016039_json__WEBPACK_IMPORTED_MODULE_2__,track8.contributors=_packages_nightingale_interpro_track_tests_mockData_interpro_contributors_json__WEBPACK_IMPORTED_MODULE_3__)};const __namedExportsOrder=["Track","SimpleTrackNoControls","TrackAndContributorsNoControls","TrackWithResiduesNoControls","TrackWithContributorsAndResiduesNoControls","TrackAndLabels"];Track.parameters={...Track.parameters,docs:{...Track.parameters?.docs,source:{originalSource:'args => {\n  const {\n    width,\n    height,\n    length,\n    highlight,\n    layout\n  } = args;\n  return html`<nightingale-interpro-track\n    id="track"\n    width="${width}"\n    height=${height}\n    length="${length}"\n    display-start=${args["display-start"]}\n    display-end=${args["display-end"]}\n    highlight=${highlight}\n    layout=${layout}\n  ></nightingale-interpro-track>`;\n}',...Track.parameters?.docs?.source}}},SimpleTrackNoControls.parameters={...SimpleTrackNoControls.parameters,docs:{...SimpleTrackNoControls.parameters?.docs,source:{originalSource:'() => html`\n  <h3>Entry</h3>\n  <nightingale-interpro-track\n    id="track1"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    show-label\n  ></nightingale-interpro-track>\n`',...SimpleTrackNoControls.parameters?.docs?.source}}},TrackAndContributorsNoControls.parameters={...TrackAndContributorsNoControls.parameters,docs:{...TrackAndContributorsNoControls.parameters?.docs,source:{originalSource:'() => html`\n  <h3>Entry + contributors</h3>\n  <nightingale-interpro-track\n    id="track2"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`',...TrackAndContributorsNoControls.parameters?.docs?.source}}},TrackWithResiduesNoControls.parameters={...TrackWithResiduesNoControls.parameters,docs:{...TrackWithResiduesNoControls.parameters?.docs,source:{originalSource:'() => html`\n  <h3>Entry + residues</h3>\n  <nightingale-interpro-track\n    id="track3"\n    width="600"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`',...TrackWithResiduesNoControls.parameters?.docs?.source}}},TrackWithContributorsAndResiduesNoControls.parameters={...TrackWithContributorsAndResiduesNoControls.parameters,docs:{...TrackWithContributorsAndResiduesNoControls.parameters?.docs,source:{originalSource:'() => html`\n  <h3>Entry + contributors + residues</h3>\n  <nightingale-interpro-track\n    id="track4"\n    width="600"\n    length="490"\n    display-start="1"\n    display-end="490"\n    highlight="20:50,40:80"\n    shape="roundRectangle"\n    expanded\n  ></nightingale-interpro-track>\n`',...TrackWithContributorsAndResiduesNoControls.parameters?.docs?.source}}},TrackAndLabels.parameters={...TrackAndLabels.parameters,docs:{...TrackAndLabels.parameters?.docs,source:{originalSource:'() => html`\n  <h3>Entry with Labels</h3>\n  <h5>Entry with a fix and long label</h5>\n  <nightingale-interpro-track\n    id="track5"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    show-label\n    label="A very long label that should go on all the locations"\n  ></nightingale-interpro-track>\n  <h5>Entry using default label(accession)</h5>\n  <nightingale-interpro-track\n    id="track6"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    show-label\n  ></nightingale-interpro-track>\n  <h5>Entry specifying a feature field as label (.feature.name)</h5>\n  <nightingale-interpro-track\n    id="track7"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    label=".feature.name"\n    show-label\n  ></nightingale-interpro-track>\n  <h5>Entry contributors and labels</h5>\n  <nightingale-interpro-track\n    id="track8"\n    width="600"\n    length="490"\n    shape="roundRectangle"\n    label=".feature.name"\n    show-label\n    expanded\n  ></nightingale-interpro-track>\n`',...TrackAndLabels.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=06-InterProTrack-NightingaleInterProTrack-stories.44b6f58b.iframe.bundle.js.map