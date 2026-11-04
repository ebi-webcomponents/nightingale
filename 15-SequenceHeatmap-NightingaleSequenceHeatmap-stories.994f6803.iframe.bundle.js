"use strict";(self.webpackChunkroot=self.webpackChunkroot||[]).push([[3919],{"./stories/15.SequenceHeatmap/NightingaleSequenceHeatmap.stories.ts"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{SequenceHeatmap:()=>SequenceHeatmap,__namedExportsOrder:()=>__namedExportsOrder,default:()=>NightingaleSequenceHeatmap_stories});var lit_html=__webpack_require__("./node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js"),tslib_es6=__webpack_require__("./node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs"),src=__webpack_require__("./packages/nightingale-new-core/src/index.ts"),d3_src=__webpack_require__("./node_modules/.pnpm/d3@7.9.0/node_modules/d3/src/index.js"),main=__webpack_require__("./node_modules/.pnpm/heatmap-component@1.2.0/node_modules/heatmap-component/lib/main.js"),lit=__webpack_require__("./node_modules/.pnpm/lit@3.1.3/node_modules/lit/index.js"),style_map=__webpack_require__("./node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/style-map.js"),decorators=__webpack_require__("./node_modules/.pnpm/lit@3.1.3/node_modules/lit/decorators.js");const DEFAULT_COLORS="#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529".split(" ");let NightingaleSequenceHeatmap=class NightingaleSequenceHeatmap extends((0,src.withManager)((0,src.withZoom)((0,src.withResizable)((0,src.withMargin)((0,src.withPosition)((0,src.withDimensions)((0,src.withHighlight)(src.default)))))))){constructor(){super(...arguments),this["hm-highlight-width"]=0}updateHighlight(){if(!this.highlighted)return;const highlights=this.highlighted.selectAll("rect").data(this.highlightedRegion.segments);highlights.enter().append("rect").style("pointer-events","none").merge(highlights).attr("fill",this["highlight-color"]).attr("y",0).attr("height",this.height).attr("x",d=>this.getXFromSeqPosition(d.start)-this["margin-left"]).attr("width",d=>Math.max(0,this.getSingleBaseWidth()*(d.end-d.start+1))),highlights.exit().remove()}attributeChangedCallback(name,_old,value){super.attributeChangedCallback(name,_old,value),"highlight"!==name&&"highlight-color"!==name||this.updateHighlight(),"display-start"!==name&&"display-end"!==name||this.triggerHeatmapZoom()}render(){const heatmapStyles={width:this.getWidthWithMargins()+"px",height:this.height+"px",zIndex:1,marginLeft:this["margin-left"]+"px",marginRight:this["margin-right"]+"px",paddingTop:this["margin-top"]+"px",paddingBottom:this["margin-bottom"]+"px"},loadingStyles={width:this.getWidthWithMargins()+"px",textAlign:"center"};return this.heatmapData?lit.html` <style>
          /* Default heatmap-component CSS */
          ${'\n/**\n * heatmap-component\n * @version 1.2.0\n * @link https://github.com/PDBeurope/heatmap-component\n * @license Apache-2.0\n */\n\n:root {\n    /** Position of bottom-left corner of tooltip box relative to the mouse position */\n    --tooltip-offset-x: 5px;\n    /** Position of bottom-left corner of tooltip box relative to the mouse position */\n    --tooltip-offset-y: 8px;\n}\n\n.heatmap-main-div {\n    font-family: sans-serif;\n}\n\n.heatmap-canvas-div {\n    /* Set background-color here to change the background of the heatmap */\n    background-color: none;\n}\n\n.heatmap-svg[pointing-data] {\n    /** Show "pointer" cursor when hovering over a cell with data */\n    cursor: pointer;\n}\n\n\n/* Marker extension */\n\n.heatmap-marker {\n    stroke: black;\n    stroke-width: 4;\n    fill: none;\n    pointer-events: none;\n}\n\n.heatmap-marker-x,\n.heatmap-marker-y {\n    stroke: black;\n    stroke-width: 2;\n    fill: none;\n    pointer-events: none;\n}\n\n\n/* Tooltip extension */\n\n.heatmap-tooltip-box,\n.heatmap-pinned-tooltip-box {\n    z-index: 0;\n    /* Avoid tooltip flickering */\n    pointer-events: none;\n}\n\n.heatmap-tooltip-content,\n.heatmap-pinned-tooltip-content {\n    margin-left: var(--tooltip-offset-x);\n    margin-bottom: var(--tooltip-offset-y);\n    border: solid black 1px;\n    padding-block: 0.35em;\n    padding-inline: 0.7em;\n    background-color: white;\n    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);\n    pointer-events: initial;\n    width: max-content;\n}\n\n.heatmap-pinned-tooltip-close {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    width: 16px;\n    height: 16px;\n    border-radius: 1000px;\n    background-color: black;\n    border: solid black 1px;\n    pointer-events: initial;\n    cursor: pointer;\n}\n\n.heatmap-pinned-tooltip-close svg {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    fill: white;\n    stroke: white;\n}\n\n.heatmap-pinned-tooltip-pin {\n    position: absolute;\n    left: 0px;\n    bottom: 0px;\n    width: calc(var(--tooltip-offset-x) / 0.6);\n    height: calc(var(--tooltip-offset-y) / 0.6);\n    z-index: -1;\n}\n\n.heatmap-pinned-tooltip-pin svg {\n    fill: black;\n}\n\n\n/* Overlay (Zoom extension) */\n\n.heatmap-overlay {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    z-index: 0;\n}\n\n.heatmap-overlay-shade {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background-color: black;\n    opacity: 0.4;\n    z-index: -1;\n}\n\n.heatmap-overlay-message {\n    margin: 5px;\n    padding-block: 1em;\n    padding-inline: 1.6em;\n    text-align: center;\n    font-size: 150%;\n    font-weight: bold;\n    background-color: white;\n    border: solid black 1px;\n    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);\n}\n\n\n/* Brush extension */\n\n.heatmap-brush-close {\n    cursor: pointer;\n}\n\n.heatmap-brush-close .cross {\n    fill: black;\n    stroke: black;\n}\n\n.heatmap-brush-close .circle {\n    fill: white;\n    stroke: white;\n}\n'}

          /* Nightingale CSS */
          .heatmap-tooltip-content,
          .heatmap-pinned-tooltip-content {
            line-height: 1;
          }
          .heatmap-marker-x,
          .heatmap-marker-y {
            display: none;
          }
          .heatmap-svg[pointing-data] {
            cursor: default;
          }
        </style>

        <div id="container">
          <div id="${this["heatmap-id"]}" style=${(0,style_map.styleMap)(heatmapStyles)} />
        </div>`:lit.html` <div id="${this["heatmap-id"]}_loading" style=${(0,style_map.styleMap)(loadingStyles)}>
        ${loaderSvg}
      </div>`}updated(_changedProperties){super.updated(_changedProperties),this.heatmapData&&!this.heatmapInstance&&(this.renderHeatmap(),this.svg=(0,d3_src.select)(this).select("div#container"),this.highlighted=(0,d3_src.select)(this).select("svg.heatmap-svg").append("g").classed("highlighted",!0),this.bindHeatmapEvents(),this.updateHighlight())}setHeatmapData(xDomain,yDomain,data){var _a;this.heatmapDomainX=xDomain,this.heatmapDomainY=yDomain,this.heatmapData=data,null===(_a=this.heatmapInstance)||void 0===_a||_a.setData({xDomain,yDomain,data,x:d=>d.xValue,y:d=>{var _a;return null!==(_a=d.yValue)&&void 0!==_a?_a:"none"}}),this.requestUpdate()}createRandomFromLength(){const xDomain=[...Array(this.length).keys()].map(i=>i+1),yDomain=["A","B","C"],data=[];for(const xVal of xDomain)for(const yVal of yDomain){const scoreVal=Math.random();data.push({xValue:xVal,yValue:yVal,score:scoreVal})}this.setHeatmapData(xDomain,yDomain,data)}renderHeatmap(){var _a,_b,_c,_d,_e,_f;const hm=main.Heatmap.create({xDomain:this.heatmapDomainX,yDomain:this.heatmapDomainY,data:this.heatmapData,x:d=>d.xValue,y:d=>{var _a;return null!==(_a=d.yValue)&&void 0!==_a?_a:"none"}}),dataMin=null!==(_c=(0,d3_src.min)(null!==(_b=null===(_a=this.heatmapData)||void 0===_a?void 0:_a.map(d=>d.score))&&void 0!==_b?_b:[]))&&void 0!==_c?_c:0,dataMax=null!==(_f=(0,d3_src.max)(null!==(_e=null===(_d=this.heatmapData)||void 0===_d?void 0:_d.map(d=>d.score))&&void 0!==_e?_e:[]))&&void 0!==_f?_f:1,scaleValues=DEFAULT_COLORS.map((_,i)=>dataMin+(dataMax-dataMin)*i/(DEFAULT_COLORS.length-1)),colorScale=main.ColorScale.continuous(scaleValues,DEFAULT_COLORS);hm.setColor(d=>colorScale(d.score)),hm.setTooltip((d,_x,_y,_xIndex,_yIndex)=>`\n        <b>You are at</b> <br />\n        x,y: <b>${d.xValue},${d.yValue}</b><br />\n        score: <b>${d.score.toFixed(3)}</b>`),hm.setVisualParams({xGapPixels:0,yGapPixels:0}),this.heatmapInstance=hm,this.heatmapInstance.render(this["heatmap-id"]),this.heatmapInstance.events.render.subscribe(()=>{this.requestUpdate()})}bindHeatmapEvents(){this.heatmapInstance&&(this.heatmapInstance.events.hover.subscribe(d=>{var _a;"onmouseover"===this.getAttribute("highlight-event")&&this.dispatchHighlight(null===(_a=d.cell)||void 0===_a?void 0:_a.x)}),this.heatmapInstance.events.select.subscribe(d=>{var _a;"onclick"===this.getAttribute("highlight-event")&&this.dispatchHighlight(null===(_a=d.cell)||void 0===_a?void 0:_a.x)}))}dispatchHighlight(seqPosition){const highlight=void 0!==seqPosition?`${seqPosition}:${seqPosition}`:null;this.dispatchEvent(new CustomEvent("change",{detail:{type:"highlight",value:highlight},bubbles:!0,cancelable:!0}))}triggerHeatmapZoom(){const toStart=this["display-start"],toEnd=this["display-end"]+1;this.heatmapInstance&&this.heatmapInstance.zoom({xMin:toStart,xMax:toEnd})}};(0,tslib_es6.__decorate)([(0,decorators.property)({type:String})],NightingaleSequenceHeatmap.prototype,"heatmap-id",void 0),(0,tslib_es6.__decorate)([(0,decorators.property)({type:Number})],NightingaleSequenceHeatmap.prototype,"hm-highlight-width",void 0),(0,tslib_es6.__decorate)([(0,decorators.property)({type:Boolean})],NightingaleSequenceHeatmap.prototype,"use-ctrl-to-zoom",void 0),NightingaleSequenceHeatmap=(0,tslib_es6.__decorate)([(0,src.customElementOnce)("nightingale-sequence-heatmap")],NightingaleSequenceHeatmap);const loaderSvg=lit.html`
  <svg
    width="200px"
    height="200px"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style="background: none;"
  >
    <circle cx="75" cy="50" fill="#363a3c" r="6.39718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.875s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="67.678" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.75s"
      ></animate>
    </circle>
    <circle cx="50" cy="75" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.625s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="67.678" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.5s"
      ></animate>
    </circle>
    <circle cx="25" cy="50" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.375s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="32.322" fill="#363a3c" r="4.80282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.25s"
      ></animate>
    </circle>
    <circle cx="50" cy="25" fill="#363a3c" r="6.40282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.125s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="32.322" fill="#363a3c" r="7.99718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0s"
      ></animate>
    </circle>
  </svg>
`,xDomain=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],yDomain=["A","B","C"],data=[{xValue:1,yValue:"A",score:.8714993819727879},{xValue:1,yValue:"B",score:.22997107777060055},{xValue:1,yValue:"C",score:.5206715318186015},{xValue:2,yValue:"A",score:.133232309275658},{xValue:2,yValue:"B",score:.3191599803487697},{xValue:2,yValue:"C",score:.7748279226740526},{xValue:3,yValue:"A",score:.13078495421402292},{xValue:3,yValue:"B",score:.1392723044976525},{xValue:3,yValue:"C",score:.10912860613391961},{xValue:4,yValue:"A",score:.748950306303716},{xValue:4,yValue:"B",score:.9919072807408578},{xValue:4,yValue:"C",score:.6452311163219191},{xValue:5,yValue:"A",score:.9535570949592682},{xValue:5,yValue:"B",score:.5432555499199871},{xValue:5,yValue:"C",score:.596290815461817},{xValue:6,yValue:"A",score:.5615611804937026},{xValue:6,yValue:"B",score:.9261432860280974},{xValue:6,yValue:"C",score:.5748416120134185},{xValue:7,yValue:"A",score:.06200688419808231},{xValue:7,yValue:"B",score:.11140841266469059},{xValue:7,yValue:"C",score:.9478391269211779},{xValue:8,yValue:"A",score:.25195952440988867},{xValue:8,yValue:"B",score:.8607019700344924},{xValue:8,yValue:"C",score:.3656865066358417},{xValue:9,yValue:"A",score:.32716248279754745},{xValue:9,yValue:"B",score:.5444579744886657},{xValue:9,yValue:"C",score:.6802322224296815},{xValue:10,yValue:"A",score:.07706334766468359},{xValue:10,yValue:"B",score:.8625587677982376},{xValue:10,yValue:"C",score:.3159180430423878},{xValue:11,yValue:"A",score:.07406373264750798},{xValue:11,yValue:"B",score:.2644207485225467},{xValue:11,yValue:"C",score:.7419853120633513},{xValue:12,yValue:"A",score:.3229180187501408},{xValue:12,yValue:"B",score:.5349597221558606},{xValue:12,yValue:"C",score:.29587490200316124},{xValue:13,yValue:"A",score:.5199891656284934},{xValue:13,yValue:"B",score:.9777055033100104},{xValue:13,yValue:"C",score:.2563994224032131},{xValue:14,yValue:"A",score:.8084645816677003},{xValue:14,yValue:"B",score:.2926856008013665},{xValue:14,yValue:"C",score:.2231870578697368},{xValue:15,yValue:"A",score:.22473851325042582},{xValue:15,yValue:"B",score:.8093925489209124},{xValue:15,yValue:"C",score:.2723402618508075},{xValue:16,yValue:"A",score:.4580311774289805},{xValue:16,yValue:"B",score:.6064382399308788},{xValue:16,yValue:"C",score:.3763375944287237},{xValue:17,yValue:"A",score:.8938942103379606},{xValue:17,yValue:"B",score:.7869105702035579},{xValue:17,yValue:"C",score:.09635439005433111},{xValue:18,yValue:"A",score:.705757069147245},{xValue:18,yValue:"B",score:.6705347335349394},{xValue:18,yValue:"C",score:.5604119973494497},{xValue:19,yValue:"A",score:.11261668430849925},{xValue:19,yValue:"B",score:.5294530023662547},{xValue:19,yValue:"C",score:.7142937498518349},{xValue:20,yValue:"A",score:.6911901839193915},{xValue:20,yValue:"B",score:.6408441821777016},{xValue:20,yValue:"C",score:.24160303601492394},{xValue:21,yValue:"A",score:.799784104065149},{xValue:21,yValue:"B",score:.16720305181432438},{xValue:21,yValue:"C",score:.4650696001440979},{xValue:22,yValue:"A",score:.8909419448318026},{xValue:22,yValue:"B",score:.5767306092873232},{xValue:22,yValue:"C",score:.4333491443532631},{xValue:23,yValue:"A",score:.16553519255031635},{xValue:23,yValue:"B",score:.38511266098413155},{xValue:23,yValue:"C",score:.04015460735816845},{xValue:24,yValue:"A",score:.2038106159269979},{xValue:24,yValue:"B",score:.36183945964672937},{xValue:24,yValue:"C",score:.011393835025820698},{xValue:25,yValue:"A",score:.5976152153277121},{xValue:25,yValue:"B",score:.9378047483120229},{xValue:25,yValue:"C",score:.14138606790109187},{xValue:26,yValue:"A",score:.8239930899931405},{xValue:26,yValue:"B",score:.5073679048263184},{xValue:26,yValue:"C",score:.8004912883029394},{xValue:27,yValue:"A",score:.06950466184397786},{xValue:27,yValue:"B",score:.32704240764464054},{xValue:27,yValue:"C",score:.08785966972909964},{xValue:28,yValue:"A",score:.16490488497199984},{xValue:28,yValue:"B",score:.5316712503868728},{xValue:28,yValue:"C",score:.42335555623498844},{xValue:29,yValue:"A",score:.6635405186810053},{xValue:29,yValue:"B",score:.2501749422951389},{xValue:29,yValue:"C",score:.11304485292618338},{xValue:30,yValue:"A",score:.3009032094781128},{xValue:30,yValue:"B",score:.07888499171276675},{xValue:30,yValue:"C",score:.9266943577927929},{xValue:31,yValue:"A",score:.9003731158822985},{xValue:31,yValue:"B",score:.42894868857294455},{xValue:31,yValue:"C",score:.9369787445409512},{xValue:32,yValue:"A",score:.4310449270032486},{xValue:32,yValue:"B",score:.6189901977546124},{xValue:32,yValue:"C",score:.14008579586880243},{xValue:33,yValue:"A",score:.9607515671978306},{xValue:33,yValue:"B",score:.7156131719775576},{xValue:33,yValue:"C",score:.4575373194542709},{xValue:34,yValue:"A",score:.29527122225728886},{xValue:34,yValue:"B",score:.12789846865442223},{xValue:34,yValue:"C",score:.4535265114126654},{xValue:35,yValue:"A",score:.6462674074978854},{xValue:35,yValue:"B",score:.7021395428247779},{xValue:35,yValue:"C",score:.18184736010728453},{xValue:36,yValue:"A",score:.4928426607953602},{xValue:36,yValue:"B",score:.9875605909465905},{xValue:36,yValue:"C",score:.012162030629773168},{xValue:37,yValue:"A",score:.4080401173430812},{xValue:37,yValue:"B",score:.7994482106310754},{xValue:37,yValue:"C",score:.0009855798511426705},{xValue:38,yValue:"A",score:.05453309468739986},{xValue:38,yValue:"B",score:.024399524340850576},{xValue:38,yValue:"C",score:.19692387880685658},{xValue:39,yValue:"A",score:.7531682199790855},{xValue:39,yValue:"B",score:.40753693643288913},{xValue:39,yValue:"C",score:.8089591746908145},{xValue:40,yValue:"A",score:.39012667751491303},{xValue:40,yValue:"B",score:.8047050697675073},{xValue:40,yValue:"C",score:.5309263985871078},{xValue:41,yValue:"A",score:.7988660439367425},{xValue:41,yValue:"B",score:.09308712032382815},{xValue:41,yValue:"C",score:.003989440541634304},{xValue:42,yValue:"A",score:.07182598332797174},{xValue:42,yValue:"B",score:.15925624763496038},{xValue:42,yValue:"C",score:.023769883766145083},{xValue:43,yValue:"A",score:.4462521508927455},{xValue:43,yValue:"B",score:.10802894065214774},{xValue:43,yValue:"C",score:.9587075249141006},{xValue:44,yValue:"A",score:.06565749552926015},{xValue:44,yValue:"B",score:.342092954641227},{xValue:44,yValue:"C",score:.8157867898895435},{xValue:45,yValue:"A",score:.04330379344485458},{xValue:45,yValue:"B",score:.5196083033369192},{xValue:45,yValue:"C",score:.326667412040075},{xValue:46,yValue:"A",score:.3245423462652417},{xValue:46,yValue:"B",score:.8640514451675845},{xValue:46,yValue:"C",score:.2985191057900072},{xValue:47,yValue:"A",score:.5421385893425188},{xValue:47,yValue:"B",score:.450300539793955},{xValue:47,yValue:"C",score:.08459924727374601},{xValue:48,yValue:"A",score:.9602670163050311},{xValue:48,yValue:"B",score:.6024295660989056},{xValue:48,yValue:"C",score:.46230341201122505},{xValue:49,yValue:"A",score:.6049444036261917},{xValue:49,yValue:"B",score:.8357032805014823},{xValue:49,yValue:"C",score:.36880946963980743},{xValue:50,yValue:"A",score:.19873985344420197},{xValue:50,yValue:"B",score:.9454640888198478},{xValue:50,yValue:"C",score:.6311161972003472}];const NightingaleSequenceHeatmap_stories={parameters:{storySource:{source:'import { html } from "lit-html";\nimport "../../packages/nightingale-sequence-heatmap/src/index.ts";\nimport { xDomain, yDomain, data } from "../../packages/nightingale-sequence-heatmap/tests/mockData/mockdata";\nexport default {\n    title: "Components/Tracks/SequenceHeatmap"\n};\nconst Template = (args)=>{\n    const { width, height } = args;\n    return html`<nightingale-sequence-heatmap\n    heatmap-id=${args["element-id"]}\n    width="${width}"\n    height=${height}\n    display-start=${args["display-start"]}\n    display-end=${args["display-end"]}\n    highlight-event="onmouseover"\n    highlight-color=${args["highlight-color"]}\n  ></nightingale-sequence-heatmap>`;\n};\nexport const SequenceHeatmap = Template.bind({});\nSequenceHeatmap.args = {\n    width: 500,\n    height: 500,\n    "element-id": "heatmapId1",\n    "display-start": 1,\n    "display-end": 50\n};\nSequenceHeatmap.play = async ()=>{\n    await customElements.whenDefined("nightingale-sequence-heatmap");\n    const heatmapElement = document.getElementsByTagName("nightingale-sequence-heatmap")[0];\n    if (heatmapElement) heatmapElement.setHeatmapData(xDomain, yDomain, data);\n};\n',locationsMap:{"sequence-heatmap":{startLoc:{col:17,line:7},endLoc:{col:1,line:18},startBody:{col:17,line:7},endBody:{col:1,line:18}}}}},title:"Components/Tracks/SequenceHeatmap"},SequenceHeatmap=(args=>{const{width,height}=args;return lit_html.html`<nightingale-sequence-heatmap
    heatmap-id=${args["element-id"]}
    width="${width}"
    height=${height}
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight-event="onmouseover"
    highlight-color=${args["highlight-color"]}
  ></nightingale-sequence-heatmap>`}).bind({});SequenceHeatmap.args={width:500,height:500,"element-id":"heatmapId1","display-start":1,"display-end":50},SequenceHeatmap.play=async()=>{await customElements.whenDefined("nightingale-sequence-heatmap");const heatmapElement=document.getElementsByTagName("nightingale-sequence-heatmap")[0];heatmapElement&&heatmapElement.setHeatmapData(xDomain,yDomain,data)};const __namedExportsOrder=["SequenceHeatmap"];SequenceHeatmap.parameters={...SequenceHeatmap.parameters,docs:{...SequenceHeatmap.parameters?.docs,source:{originalSource:'args => {\n  const {\n    width,\n    height\n  } = args;\n  return html`<nightingale-sequence-heatmap\n    heatmap-id=${args["element-id"]}\n    width="${width}"\n    height=${height}\n    display-start=${args["display-start"]}\n    display-end=${args["display-end"]}\n    highlight-event="onmouseover"\n    highlight-color=${args["highlight-color"]}\n  ></nightingale-sequence-heatmap>`;\n}',...SequenceHeatmap.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=15-SequenceHeatmap-NightingaleSequenceHeatmap-stories.994f6803.iframe.bundle.js.map