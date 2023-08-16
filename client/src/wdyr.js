import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import * as ReactRedux from "react-redux";
// const whyDidYouRender = require("@welldone-software/why-did-you-render");
whyDidYouRender(React, {
  trackAllPureComponents: true,
  trackExtraHooks: [[ReactRedux, "useSelector"]],
});
