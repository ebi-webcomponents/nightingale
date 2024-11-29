import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import { range } from "lodash-es";
import "../../packages/nightingale-navigation/src/index";
import "../../packages/nightingale-scrollbox/src/index";
import { NightingaleScrollbox, NightingaleScrollboxItem } from "../../packages/nightingale-scrollbox/src/index";


export default {
  title: "Components/Utils/Scrollbox",
} as Meta;

const defaultData = [
  {
    accession: "feature1",
    start: 1,
    end: 2,
    color: "blue",
  },
  {
    accession: "feature1",
    start: 49,
    end: 50,
    color: "red",
  },
  {
    accession: "feature1",
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
      { fragments: [{ start: 15, end: 15 }] },
      { fragments: [{ start: 18, end: 18 }] },
    ],
    color: "#A4Aea2",
  },
  {
    accession: "feature4",
    start: 20, end: 32,
    locations: [
      { fragments: [{ start: 20, end: 23 }, { start: 26, end: 32 }] },
    ],
  },
];

const style = html`
<style>
  h1 {
    font-size: 1.5rem;
  }
  .scrollbox {
    height: 300px;
    overflow-y: scroll;
  }
  .row {
    display: flex;
    flex-direction: row;
    line-height: normal;
    width: 100%;
  }
  .track-row {
    height: 32px;
    margin-block: 3px;
  }
  .label-box {
    width: 80px;
    align-content: center;
    padding-left: 6px;
  }
  .main-box {
    flex-grow: 1;
    position: relative;
  }
  nightingale-track {
    margin-top: 7px;
  }
  .spinner {
    height: 20px;
    margin-top: 6px;
    margin-left: 50%;
  }
</style>
`;


function makeRow(id: string) {
  const contentVisible = `
    <nightingale-track
      id="${id}-track" 
      min-width="500" height="18"
      length="50" display-start="1" display-end="50"
      highlight-event="onmouseover" highlight-color="#EB3BFF22" 
      margin-color="transparent" 
      layout="default" use-ctrl-to-zoom>
    </nightingale-track>`;
  const contentHidden = `
    <svg class="spinner" viewBox="0 0 200 200">
      <style>
        .spinner-path { stroke-dasharray: 339 226; stroke-dashoffset: 0; animation: spinner linear normal infinite; animation-duration: 2s; }
        @keyframes spinner { 0% { stroke-dashoffset: 565; } 100% { stroke-dashoffset: 0; } }
      </style>
      <path class="spinner-path" fill="transparent" stroke="#72B260" stroke-width="20" d="M 100 10  A 90 90 0 1 1 100 190 A 90 90 0 1 1 100 10"></path>
    </svg>`;

  return html`
    <div class="row track-row">
      <div class="label-box" style="background-color: gainsboro">${id}</div>
      <div class="main-box">
        <nightingale-scrollbox-item id=${id} content-visible=${contentVisible} content-hidden=${contentHidden}></nightingale-scrollbox-item>
      </div>
    </div>
  `;
}


interface StoryArgs {
  "root-margin": string,
  "disable-scroll-with-ctrl": boolean,
}

const Template: Story<StoryArgs> = args => {
  const nRows = 100;
  const rows = range(nRows).map(i => makeRow(`item-${i}`));
  return html`
    ${style}
    <div id="nightingale-root">
      <nightingale-manager>
        <div style="display:flex; flex-direction: column; width: 700px; max-width: 100%; border: solid 1px gray;">
          <div style="margin-right: 15px;">
            <div class="row">
              <div class="label-box"></div>
              <div class="main-box">
                <nightingale-navigation id="navigation" min-width="500" height="50" length="50" display-start="1" display-end="50" highlight-color="#EB3BFF22" margin-color="transparent" show-highlight>
                </nightingale-navigation>
              </div>
            </div>

            <div class="row">
              <div class="label-box"></div>
              <div class="main-box">
                <nightingale-sequence id="sequence"
                  sequence="iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV"
                  min-width="500" height="30" length="50" display-start="1" display-end="50" highlight-event="onmouseover" highlight-color="#EB3BFF22" margin-color="transparent" use-ctrl-to-zoom>
                </nightingale-sequence>
              </div>
            </div>
          </div>

          <nightingale-scrollbox root-margin=${args["root-margin"]} ?disable-scroll-with-ctrl=${args["disable-scroll-with-ctrl"]} class="scrollbox">
            ${rows}
          </nightingale-scrollbox>
        </div>
      </nightingale-manager>
    </div>
  `;
};

export const Scrollbox = Template.bind({});

Scrollbox.args = {
  "root-margin": "0px",
  "disable-scroll-with-ctrl": true,
};

Scrollbox.play = async () => {
  type TData = { message: string };
  await customElements.whenDefined("nightingale-track");
  for (const scrollbox of document.getElementsByTagName("nightingale-scrollbox") as HTMLCollectionOf<NightingaleScrollbox<TData>>) {
    for (const item of scrollbox.getElementsByTagName("nightingale-scrollbox-item") as HTMLCollectionOf<NightingaleScrollboxItem<TData>>) {
      item.data = { message: `This is ${item.id}` };
    }
    scrollbox.onRegister(async item => {
      console.log("registering", item.id, item.data);
    });
    scrollbox.onEnter(async item => {
      console.log("entering", item.id, item.data);
      for (const track of item.getElementsByTagName("nightingale-track")) {
        (track as any).data = defaultData;
      }
    });
    scrollbox.onExit(item => {
      console.log("exiting", item.id, item.data);
    });
    scrollbox.onUnregister(item => {
      console.log("unregistering", item.id, item.data);
    });
  }
}
