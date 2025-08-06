sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "../Util"], function (ManagedObject, Fragment, JSONModel, __Util) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Util = _interopRequireDefault(__Util);
  /**
   * @namespace cc.spreadsheetimporter.download.v2_3_0
   */
  const SpreadsheetDownloadDialog = ManagedObject.extend("cc.spreadsheetimporter.download.v2_3_0.SpreadsheetDownloadDialog", {
    constructor: function _constructor(spreadsheetUploadController, spreadsheetUploadDialog) {
      ManagedObject.prototype.constructor.call(this);
      this.spreadsheetUploadDialog = spreadsheetUploadDialog;
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.componentI18n = this.spreadsheetUploadController.componentI18n;
      this.component = this.spreadsheetUploadController.component;
    },
    createSpreadsheetDownloadDialog: async function _createSpreadsheetDownloadDialog() {
      this.spreadsheetUploadController.view.setBusyIndicatorDelay(0);
      this.spreadsheetUploadController.view.setBusy(true);
      if (!this.spreadsheetDownloadDialog) {
        this.spreadsheetOptionsModel = new JSONModel(this.component.getDeepDownloadConfig());
        const modelData = this.spreadsheetOptionsModel.getData();
        this.spreadsheetOptionsModel.setProperty('/filename', modelData.filename || this.spreadsheetUploadController.getOdataType());
        this.spreadsheetDownloadDialog = await Fragment.load({
          name: 'cc.spreadsheetimporter.v2_3_0.fragment.SpreadsheetDownload',
          type: 'XML',
          controller: this
        });
        this.spreadsheetDownloadDialog.setBusyIndicatorDelay(0);
        this.spreadsheetDownloadDialog.setModel(this.componentI18n, 'i18n');
        this.spreadsheetDownloadDialog.setModel(this.spreadsheetOptionsModel, 'spreadsheetOptions');
        this.spreadsheetDownloadDialog.setModel(this.component.getModel('device'), 'device');
      }
      this.spreadsheetUploadController.view.setBusy(false);
    },
    onSave: function _onSave() {
      const deepDownloadConfig = this.spreadsheetDownloadDialog.getModel('spreadsheetOptions').getData();
      const mergedConfig = Util.mergeDeepDownloadConfig(this.component.getDeepDownloadConfig(), deepDownloadConfig);
      this.component.setDeepDownloadConfig(mergedConfig);
      this.spreadsheetUploadDialog.onDownloadDataSpreadsheet();
      this.spreadsheetDownloadDialog.close();
    },
    onCancel: function _onCancel() {
      this.spreadsheetDownloadDialog.close();
    }
  });
  return SpreadsheetDownloadDialog;
});
