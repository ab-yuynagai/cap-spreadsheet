sap.ui.define(["sap/ui/base/ManagedObject", "../Util", "./SpreadsheetGenerator", "./DataAssigner", "sap/base/Log"], function (ManagedObject, __Util, __SpreadsheetGenerator, __DataAssigner, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Util = _interopRequireDefault(__Util);
  const SpreadsheetGenerator = _interopRequireDefault(__SpreadsheetGenerator);
  const DataAssigner = _interopRequireDefault(__DataAssigner);
  /**
   * @namespace cc.spreadsheetimporter.download.v2_3_0
   */
  const SpreadsheetDownload = ManagedObject.extend("cc.spreadsheetimporter.download.v2_3_0.SpreadsheetDownload", {
    constructor: function _constructor(spreadsheetUploadController, component, odataHandler) {
      ManagedObject.prototype.constructor.call(this);
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.component = component;
      this.odataHandler = odataHandler;
      this.spreadsheetGenerator = new SpreadsheetGenerator(spreadsheetUploadController, component, odataHandler);
      this.dataAssigner = new DataAssigner();
    },
    // Function to extract the properties from input config and metadata
    _extractProperties: async function _extractProperties(proConfigColumns, entityMetadata, entityType) {
      const labelList = await this.odataHandler.getLabelList([], entityType, this.component.getExcludeColumns());
      let properties = [];
      for (let prop in proConfigColumns) {
        if (proConfigColumns[prop].order !== undefined && proConfigColumns[prop].data !== undefined && entityMetadata[prop]) {
          const label = labelList.get(prop);
          let headerName;
          if (label) {
            headerName = `${label.label} [${entityType.split('.').pop()}][${prop}]`;
          } else {
            headerName = `${prop} [${entityType.split('.').pop()}][${prop}]`;
          }
          properties.push({
            name: headerName,
            order: proConfigColumns[prop].order
          });
        } else if (typeof proConfigColumns[prop] === 'object') {
          properties = properties.concat(await this._extractProperties(proConfigColumns[prop], entityMetadata[prop].$XYZEntity, entityMetadata[prop].$Type));
        }
      }
      return properties;
    },
    _findAttributeByType: function _findAttributeByType(obj, typeToSearch) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const entity = obj[key];
          if (entity.$Type === typeToSearch) {
            return key;
          }
        }
      }
      return undefined; // if not found
    },
    fetchData: async function _fetchData(deepDownloadConfig) {
      const {
        mainEntity,
        expands
      } = this.odataHandler.getODataEntitiesRecursive(this.spreadsheetUploadController.getOdataType(), deepDownloadConfig.deepLevel);
      // Log the mainEntity and expands
      Log.debug('MainEntity:', mainEntity, 'SpreadsheetDownload: fetchData');
      Log.debug('Expands:', expands, 'SpreadsheetDownload: fetchData');
      const batchSize = 1000;
      const customBinding = this.odataHandler.getBindingFromBinding(this.spreadsheetUploadController.binding, expands);

      // Start fetching the batches
      const totalResults = await this.odataHandler.fetchBatch(customBinding, batchSize);
      const data = Util.extractObjects(totalResults);
      if (this.component.getDeepDownloadConfig().setDraftStatus && this.component.getDeepDownloadConfig().addKeysToExport) {
        for (const row in data) {
          // check if the row has a draft entity and IsActiveEntity is in the data row
          if (data[row].HasDraftEntity && typeof data[row].IsActiveEntity !== 'undefined') {
            data[row].IsActiveEntity = false;
          }
        }
      }

      // Use the DataAssigner for all data assignments
      this.dataAssigner.assignData(data, mainEntity);
      this.dataAssigner.assignDataRoot(deepDownloadConfig.columns, mainEntity, deepDownloadConfig.deepLevel);
      this.dataAssigner.assignColumnsRoot(deepDownloadConfig.columns, mainEntity, deepDownloadConfig.deepLevel);
      this.dataAssigner.assignColumns(deepDownloadConfig.columns, mainEntity, deepDownloadConfig.deepLevel);
      mainEntity.$XYZData = data;
      return mainEntity;
    }
  });
  return SpreadsheetDownload;
});
