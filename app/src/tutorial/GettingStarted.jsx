import React, { useEffect, useRef } from "react";

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

import "./GettingStarted.css";

import htmlContent from "../../../GETTING_STARTED.md";

hljs.registerLanguage("javascript", javascript);

const dangerouslySetInnerHTML = { __html: htmlContent };

const GettingStarted = () => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    for (const codeBlock of ref.current.querySelectorAll("pre code")) {
      hljs.highlightBlock(codeBlock);
    }
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
};

export default GettingStarted;
