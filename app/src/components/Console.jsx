import React from "react";

const Console = ({ children }) => {
  return (
    <div class="console">
      <pre>{children}</pre>
      <div class="anchor"></div>
    </div>
  );
};
export default Console;
