sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const Logger = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.Logger", {
    returnObject: function _returnObject(object) {
      return object;
    }
  });
  return Logger;
});
