import React, { useState, useCallback } from "react";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-tooltip/README.md";

import "@nightingale-elements/nightingale-tooltip";

const NightingaleTooltipWrapper = () => {
  const [visible, setVisible] = useState(true);
  const [content, setContent] = useState("!");
  const [x, setX] = useState(200);
  const [y, setY] = useState(50);

  const handleToggle = useCallback((event) => {
    setX(event.pageX);
    setY(event.pageY);
    setVisible((visible) => !visible);
  }, []);

  const handleChangeContent = useCallback(() => {
    setContent("!".repeat(Math.ceil(Math.random() * 10)));
  });

  return (
    <>
      <button type="button" onClick={handleToggle} style={{ width: "100%" }}>
        Click to toggle tooltip targetting mouse click location
      </button>
      <button type="button" onClick={handleChangeContent}>
        Change tooltip content
      </button>
      <nightingale-tooltip
        title="My tooltip"
        x={x}
        y={y}
        visible={visible ? "" : undefined}
      >
        Content of the tooltip (in <code>html</code> too{content})
      </nightingale-tooltip>
      <Readme content={readmeContent} />
      <button type="button" onClick={handleToggle} style={{ width: "100%" }}>
        Click to toggle tooltip targetting mouse click location
      </button>
    </>
  );
};

export default NightingaleTooltipWrapper;
