import React from "react";

const Console = ({ children }) => {
  return (
    <div className="console">
      <pre>{children}</pre>
      <div className="anchor"></div>
    </div>
  );
};
export default Console;
