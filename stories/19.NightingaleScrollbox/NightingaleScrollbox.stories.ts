import { Meta, Story } from "@storybook/web-components";
import { rgb } from "d3";
import { html } from "lit-html";
import { range } from "lodash-es";
import "../../packages/nightingale-navigation/src/index";
import "../../packages/nightingale-scrollbox/src/index";
import { NightingaleScrollbox, NightingaleScrollboxItem } from "../../packages/nightingale-scrollbox/src/index";
import { BehaviorSubject, AsyncSubject, firstValueFrom, Subject, of, concatMap, delay } from 'rxjs';

export default {
  title: "Components/Utils/Scrollbox",
} as Meta;

const defaultData = [
  {
    accession: "feature1a",
    start: 1,
    end: 2,
    color: "blue",
  },
  {
    accession: "feature1b",
    start: 49,
    end: 50,
    color: "red",
  },
  {
    accession: "feature1c",
    start: 10,
    end: 20,
    color: "#342ea2",
  },
  {
    accession: "feature2",
    start: 30, end: 45,
    locations: [{ fragments: [{ start: 30, end: 45 }] }],
    color: "#A42ea2",
  },
  {
    accession: "feature3",
    start: 15, end: 18,
    locations: [
      {
        fragments: [{ start: 15, end: 15 }],
      },
      { fragments: [{ start: 18, end: 18 }] },
    ],
    color: "#A4Aea2",
  },
  {
    accession: "feature4",
    start: 20, end: 32,
    locations: [
      {
        fragments: [
          { start: 20, end: 23 },
          { start: 26, end: 32 },
        ],
      },
    ],
  },
];

function makeDemoData() {
  const ResidueColorsShades = ["#eeeeff", "#ddddff", "#ccccff", "#bbbbff", "#aaaaff", "#8888ff", "#6666ff", "#4444ff", "#2222ff", "#0000ff",];
  function colors(color: string) { return { color: rgb(color).darker(), fill: color }; }
  return [
    ...range(70).map(i => ({
      accession: `feature${i}`,
      start: i + 1,
      end: i + 1,
      color: rgb(ResidueColorsShades[Math.floor(i / 5) % ResidueColorsShades.length]).darker(),
      fill: ResidueColorsShades[Math.floor(i / 5) % ResidueColorsShades.length],
    })),
    { start: 90, end: 130, ...colors("#4169e1"), shape: "rectangle" },
    { start: 131, end: 131, ...colors("#ff7900"), shape: "rectangle" },
    { start: 132, end: 132, ...colors("#ff7900"), shape: "rectangle" },
    { start: 133, end: 139, ...colors("#d3d3d3"), shape: "rectangle" },
    { start: 140, end: 155, ...colors("#4169e1"), shape: "rectangle" },

    { start: 170, end: 190, ...colors("#1b9e77"), shape: "roundRectangle" },
    { start: 195, end: 204, ...colors("#d95f02"), shape: "discontinuosEnd" },
    { start: 206, end: 214, ...colors("#7570b3"), shape: "discontinuos" },
    { start: 216, end: 225, ...colors("#e7298a"), shape: "discontinuosStart" },

    { start: 235, end: 244, ...colors("#9e9e9e"), shape: "line" },
    { start: 245, end: 265, ...colors("#ff64a4"), shape: "helix" },
    { start: 266, end: 269, ...colors("#9e9e9e"), shape: "line" },
    { start: 270, end: 290, ...colors("#ffcc02"), shape: "strand" },
    { start: 291, end: 295, ...colors("#9e9e9e"), shape: "line" },

    { start: 310, end: 310, ...colors("#1b9e77"), shape: "circle" },
    { start: 320, end: 320, ...colors("#d95f02"), shape: "triangle" },
    { start: 330, end: 330, ...colors("#7570b3"), shape: "diamond" },
    { start: 340, end: 340, ...colors("#e7298a"), shape: "pentagon" },
    { start: 350, end: 350, ...colors("#66a61e"), shape: "hexagon" },
    { start: 360, end: 360, ...colors("#e6ab02"), shape: "chevron" },
    { start: 370, end: 370, ...colors("#a6761d"), shape: "catFace" },
    { start: 380, end: 380, ...colors("#1b9e77"), shape: "arrow" },
    { start: 390, end: 390, ...colors("#d95f02"), shape: "wave" },
    { start: 400, end: 400, ...colors("#7570b3"), shape: "doubleBar" },
  ];
}
const demoData = makeDemoData();


const style = html`
<style>
  h1 {
    font-size: 1.5rem;
  }
  nightingale-track {
    margin-top: 7px;
  }
  .scrollbox {
    height: 300px;
    overflow-y: scroll;
  }
  .track-box {
    height: 32px;
    margin-top: 3px;
    width: 100%;
  }
  .row-box {
    display: flex;
    flex-direction: row;
    line-height: normal;
  }
  .label-box {
    width: 80px;
    align-content: center;
    padding-left: 4px;
  }
  .label {
    background-color: gainsboro;
  }
  .main-box {
    flex-grow: 1;
    position: relative;
  }
  .spinner {
    height: 20px;
    margin-top: 6px;
    margin-left: 50%;
  }
</style>
`;


function makeRow(id: string) {
  return html`
    <div class="track-box row-box" id="track-box-${id}">
      <div class="label-box label">
        ${id}
      </div>
      <div class="main-box">
        <nightingale-scrollbox-item id="${id}" class="target"></nightingale-scrollbox-item>
      </div>
    </div>
  `;
}

const nTracks = 20;

const Template: Story<{
}> = (args) => {
  const tracks = range(nTracks).map(i => makeRow(`target-${i}`));
  return html`
    ${style}
    <div id="nightingale-root">
      <nightingale-manager>
        <div style="display:flex; flex-direction: column; width: 700px;">
          <div style="margin-right: 15px;">
            <div class="row-box">
              <div class="label-box"></div>
              <div class="main-box">
                <nightingale-navigation id="navigation" min-width="500" height="50" length="400" display-start="1" display-end="400" highlight-color="#EB3BFF22" margin-color="transparent" show-highlight>
                </nightingale-navigation>
              </div>
            </div>

            <div class="row-box">
              <div class="label-box"></div>
              <div class="main-box">
                <nightingale-sequence id="sequence"
                  sequence="iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV"
                  min-width="500" height="30" length="400" display-start="1" display-end="400" highlight-event="onmouseover" highlight-color="#EB3BFF22" margin-color="transparent" use-ctrl-to-zoom>
                </nightingale-sequence>
              </div>
            </div>
          </div>

          <nightingale-scrollbox root-margin="-32">
            <div id="tracks" class="scrollbox">
              ${tracks}
            </div>
          </nightingale-scrollbox>
        </div>
      </nightingale-manager>
    </div>
  `;
};

export const Scrollbox = Template.bind({});
Scrollbox.args = {};
Scrollbox.play = async () => {
  await customElements.whenDefined("nightingale-track");

  const placeholderHtml = '<img class="spinner" src="https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/assets/img/loader.gif"></img>';

  type TData = { id: string };

  for (const scrollbox of document.getElementsByTagName("nightingale-scrollbox") as HTMLCollectionOf<NightingaleScrollbox<TData>>) {
    for (const item of scrollbox.getElementsByTagName("nightingale-scrollbox-item") as HTMLCollectionOf<NightingaleScrollboxItem<TData>>) {
      // console.log('scrollbox', scrollbox, 'item', item);
      item.data = { id: item.id }
    }
    // await sleep(2000);
    scrollbox.onRegister(async target => {
      console.log('onRegister', target.data?.id)
      // await sleep(1000);
      console.log('onRegister done', target.data?.id)
    });
    // await sleep(2000);
    scrollbox.onEnter(async target => {
      console.log('onEnter', target.id)
      target.innerHTML = `<nightingale-track
          id="${target.data?.id}" 
          min-width="500" height="18"
          length="400" display-start="1" display-end="400"
          highlight-event="onmouseover" highlight-color="#EB3BFF22" 
          margin-color="transparent" 
          layout="default" use-ctrl-to-zoom>
        </nightingale-track>`;
      for (const track of target.getElementsByTagName("nightingale-track")) {
        (track as any).data = demoData;
      }
    });
    scrollbox.onExit(target => {
      console.log('onExit', target.id)
      target.innerHTML = placeholderHtml;
    });
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}