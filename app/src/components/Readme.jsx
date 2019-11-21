import React, {useRef, useEffect} from 'react';

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

hljs.registerLanguage("javascript", javascript);

const Readme = ({content}) => {
    const ref = useRef();

    useEffect(() => {
      if (!ref.current) return;
      for (const codeBlock of ref.current.querySelectorAll("pre code")) {
        hljs.highlightBlock(codeBlock);
      }
    }, []);
  
    return (<div ref={ref} dangerouslySetInnerHTML={{ __html: content}}/>);
}

export default Readme;