const heatmapStyles = `
.heatmap-main-div {
    font-family: sans-serif;
}

.heatmap-canvas-div {
    /* Set background-color here to change the background of the heatmap */
    background-color: none;
}

.heatmap-tooltip-box,
.heatmap-pinned-tooltip-box {
    z-index: 0;
    /* Avoid tooltip flickering */
    pointer-events: none;
}

.heatmap-tooltip-content,
.heatmap-pinned-tooltip-content {
    margin-left: var(--tooltip-offset-x);
    margin-bottom: var(--tooltip-offset-y);
    border: solid black 1px;
    padding-block: 0.35em;
    padding-inline: 0.7em;
    background-color: white;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);
    pointer-events: initial;
    width: max-content;
    line-height: 1;
}

.heatmap-pinned-tooltip-close {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    border-radius: 1000px;
    background-color: black;
    border: solid black 1px;
    pointer-events: initial;
    cursor: pointer;
}

.heatmap-pinned-tooltip-close svg {
    position: absolute;
    width: 100%;
    height: 100%;
    fill: white;
    stroke: white;
}

.heatmap-pinned-tooltip-pin {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: calc(var(--tooltip-offset-x) / 0.6);
    height: calc(var(--tooltip-offset-y) / 0.6);
    z-index: -1;
}

.heatmap-pinned-tooltip-pin svg {
    fill: black;
}

.heatmap-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 0;
}

.heatmap-overlay-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.4;
    z-index: -1;
}

.heatmap-overlay-message {
    margin: 5px;
    padding-block: 1em;
    padding-inline: 1.6em;
    text-align: center;
    font-size: 150%;
    font-weight: bold;
    background-color: white;
    border: solid black 1px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);
}

.heatmap-marker {
    stroke: black;
    stroke-width: 4;
    fill: none;
}

.heatmap-marker-x,
.heatmap-marker-y {
    stroke: black;
    stroke-width: 2;
    fill: none;
}`;
export default heatmapStyles;
