sap.ui.define(["sap/m/DialogRenderer"], function (DialogRenderer) {
  "use strict";

  /**
   * @name cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog
   */
  // ui5lint-disable-next-line --  can´t use apiVersion: 2, because of support for 1.71, remove when out of support
  var __exports = {
    //apiVersion: 2,
    render: function (rm, control) {
      // @ts-ignore
      DialogRenderer.render.apply(this, arguments);
    }
  };
  return __exports;
});
