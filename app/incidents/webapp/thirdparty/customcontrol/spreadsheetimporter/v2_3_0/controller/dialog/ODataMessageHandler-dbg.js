sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "../Util", "sap/base/Log"], function (ManagedObject, Fragment, JSONModel, __Util, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Util = _interopRequireDefault(__Util);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const ODataMessageHandler = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.ODataMessageHandler", {
    constructor: function _constructor(spreadsheetUploadController) {
      ManagedObject.prototype.constructor.call(this);
      this.messages = [];
      this.messages = [];
      this.spreadsheetUploadController = spreadsheetUploadController;
    },
    /**
     * Display messages.
     */
    displayMessages: async function _displayMessages(messageData) {
      const messageModel = new JSONModel(messageData);
      if (!this.messageDialog) {
        this.messageDialog = await Fragment.load({
          name: 'cc.spreadsheetimporter.v2_3_0.fragment.ODataMessagesDialog',
          type: 'XML',
          controller: this
        });
      }
      this.messageDialog.setModel(this.spreadsheetUploadController.componentI18n, 'i18n');
      this.messageDialog.setModel(messageModel, 'message');
      // this.messageDialog.setModel(Message, "message");
      this.messageDialog.open();
    },
    onCloseMessageDialog: async function _onCloseMessageDialog() {
      this.messageDialog.close();
      // reset message manager messages
      try {
        // sap.ui.core.Messaging is only available in UI5 version 1.118 and above, prefer this over sap.ui.getCore().getMessageManager() = Util.loadUI5RessourceAsync("sap/ui/core/Messaging");
        const Messaging = await Util.loadUI5RessourceAsync('sap/ui/core/Messaging');
        Messaging.removeAllMessages();
        return;
      } catch (error) {
        Log.debug('sap/ui/core/Messaging not found', undefined, 'SpreadsheetUpload: checkForODataErrors');
      }
      // ui5lint-disable-next-line -- fallback for UI5 versions below 1.118
      sap.ui.getCore().getMessageManager().removeAllMessages();
    }
  });
  return ODataMessageHandler;
});
