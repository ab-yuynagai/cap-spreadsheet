sap.ui.define(["sap/ui/base/ManagedObject", "../dialog/ODataMessageHandler", "sap/base/Log", "../TableSelector", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "../Util", "sap/m/MessageBox"], function (ManagedObject, __ODataMessageHandler, Log, __TableSelector, JSONModel, Fragment, __Util, MessageBox) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ODataMessageHandler = _interopRequireDefault(__ODataMessageHandler);
  const TableSelector = _interopRequireDefault(__TableSelector);
  const Util = _interopRequireDefault(__Util);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const OData = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.OData", {
    constructor: function _constructor(spreadsheetUploadController, messageHandler, util) {
      ManagedObject.prototype.constructor.call(this);
      this._tables = [];
      this.createPromises = [];
      this.createContexts = [];
      this.odataMessageHandler = new ODataMessageHandler(spreadsheetUploadController);
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.messageHandler = messageHandler;
      this.util = util;
    },
    /**
     * Helper method to call OData service.
     * @param {*} fnResolve - The resolve function for the Promise.
     * @param {*} fnReject - The reject function for the Promise.
     */
    callOdata: async function _callOdata(fnResolve, fnReject, spreadsheetUploadController) {
      const component = spreadsheetUploadController.component;
      const tableObject = spreadsheetUploadController.tableObject;
      const payloadArray = spreadsheetUploadController.payloadArray;
      const binding = spreadsheetUploadController.binding;
      const context = spreadsheetUploadController.context;
      spreadsheetUploadController.errorsFound = false;

      // intializing the message manager for displaying the odata response messages
      try {
        // get binding of table to create rows
        const model = binding.getModel();
        await this.createBusyDialog(spreadsheetUploadController);

        // Slice the array into chunks of 'batchSize' if necessary, if UPDATE max batch size is 100
        const slicedPayloadArray = this.processPayloadArray(component.getBatchSize(), payloadArray);
        this.busyDialog.getModel('busyModel').setProperty('/progressText', `0/${payloadArray.length}`);
        let currentProgressPercent = 0;
        let currentProgressValue = 0;

        // Loop over the sliced array
        for (const batch of slicedPayloadArray) {
          // loop over data from spreadsheet file
          try {
            // default for draft scenarios we need to request the object first to get draft status otherwise the update will fail
            // with options the strategy could be changed to make the update quicker
            // request all objects in the batch first
            if (component.getAction() === 'UPDATE') {
              await this.getObjects(model, binding, batch);
              // TODO: decide to continue or break depending on component.getContinueOnError()
              // TODO: if getContinueOnError is true, continue with successfull fetched objects
            }

            // maybe move this loop to createAsync and updateAsync --> parameter will change (breaking change)
            for (let payload of batch) {
              let fireEventAsyncReturn;
              // skip draft and directly create
              if (component.getCreateActiveEntity()) {
                payload.IsActiveEntity = true;
              }
              // Extension method to manipulate payload
              try {
                fireEventAsyncReturn = await Util.fireEventAsync('changeBeforeCreate', {
                  payload: payload
                }, component);
              } catch (error) {
                Log.error('Error while calling the changeBeforeCreate event', error, 'SpreadsheetUpload: callOdata');
              }
              if (fireEventAsyncReturn.returnValue) {
                payload = fireEventAsyncReturn.returnValue;
              }
              if (component.getAction() === 'CREATE') {
                this.createAsync(model, binding, payload);
              }
              if (component.getAction() === 'UPDATE') {
                this.updateAsync(model, binding, payload);
              }
            }
            // wait for all drafts to be created
            await this.submitChanges(model);
            let errorsFoundLocal = await this.checkForErrors(model, binding, component.getShowBackendErrorMessages());
            if (errorsFoundLocal) {
              Log.error('Error while calling the odata service', 'SpreadsheetUpload: callOdata');
              if (!component.getContinueOnError()) {
                this.busyDialog.close();
                spreadsheetUploadController.errorsFound = true;
                this.resetContexts();
                fnReject('Error while calling the odata service');
                break;
              }
            } else {
              await this.waitForCreation();
            }

            // check for and activate all drafts and wait for all draft to be created
            // only if createActiveEntity is false and IsActiveEntity is not used in the payload
            if (!component.getCreateActiveEntity() && component.getActivateDraft() && !errorsFoundLocal) {
              await this.waitForDraft();
            }
            this.resetContexts();
            currentProgressPercent = currentProgressPercent + batch.length / payloadArray.length * 100;
            currentProgressValue = currentProgressValue + batch.length;
            this.busyDialog.getModel('busyModel').setProperty('/progressPercent', currentProgressPercent);
            this.busyDialog.getModel('busyModel').setProperty('/progressText', `${currentProgressValue} / ${payloadArray.length}`);
          } catch (error) {
            if (component.getContinueOnError()) {
              Log.error('Error while calling the odata service', error, 'SpreadsheetUpload: callOdata');
            } else {
              // throw error to stop processing
              throw error;
            }
          }
        }
        if (tableObject) {
          spreadsheetUploadController.refreshBinding(context, binding, tableObject);
        }
        this.busyDialog.close();
        fnResolve();
      } catch (error) {
        this.busyDialog.close();
        this.resetContexts();
        Log.error('Error while calling the odata service', error, 'SpreadsheetUpload: callOdata');
        await this.showInternalErrorDialog(error);
        await this.checkForODataErrors(component.getShowBackendErrorMessages());
        fnReject(error);
      }
    },
    getBindingFromTable: function _getBindingFromTable(tableObject) {
      if (tableObject.getMetadata().getName() === 'sap.m.Table' || tableObject.getMetadata().getName() === 'sap.m.List') {
        return tableObject.getBinding('items');
      }
      if (tableObject.getMetadata().getName() === 'sap.ui.table.Table') {
        return tableObject.getBinding('rows');
      }
      throw new Error(`Unsupported table type: ${tableObject.getMetadata().getName()}. Only sap.m.Table, sap.m.List, and sap.ui.table.Table are supported. Alternatively you can specify custom binding in option 'binding'`);
    },
    _getActionName: function _getActionName(context, sOperation) {
      const model = context?.getModel && context.getModel() || context.getView().getModel(),
        metaModel = model.getMetaModel(),
        entitySetPath = metaModel.getMetaPath(context.getPath());
      return metaModel.getObject(''.concat(entitySetPath, '@com.sap.vocabularies.Common.v1.DraftRoot/').concat(sOperation));
    },
    // Slice the array into chunks of 'batchSize' if necessary
    processPayloadArray: function _processPayloadArray(batchSize, payloadArray) {
      // For UPDATE actions, enforce max batch size of 100
      if (this.spreadsheetUploadController.component.getAction() === 'UPDATE') {
        batchSize = Math.min(batchSize > 0 ? batchSize : 100, 100);
      }
      if (batchSize > 0) {
        let slicedPayloadArray = [];
        const numOfSlices = Math.ceil(payloadArray.length / batchSize);
        const equalSize = Math.ceil(payloadArray.length / numOfSlices);
        for (let i = 0; i < payloadArray.length; i += equalSize) {
          slicedPayloadArray.push(payloadArray.slice(i, i + equalSize));
        }
        return slicedPayloadArray;
      } else {
        return [payloadArray];
      }
    },
    getTableObject: async function _getTableObject(tableId, view, spreadsheetUploadController) {
      // try get object page table
      if (!tableId) {
        this.tables = view.findAggregatedObjects(true, function (object) {
          return object.isA('sap.m.Table') || object.isA('sap.ui.table.Table');
        });
        if (this.tables.length > 1 && !spreadsheetUploadController.component.getUseTableSelector()) {
          throw new Error("Found more than one table on Object Page.\n Please specify table in option 'tableId'");
        } else if (this.tables.length > 1 && spreadsheetUploadController.component.getUseTableSelector()) {
          const tableSelector = new TableSelector(view);
          let selectedTable;
          try {
            selectedTable = await tableSelector.chooseTable();
          } catch (error) {
            // user canceled or no table found
            throw new Error(spreadsheetUploadController.util.geti18nText('spreadsheetimporter.tableSelectorDialogCancel'));
          }
          return selectedTable;
        } else if (this.tables.length === 0) {
          throw new Error("No table found on Object Page.\n Please specify table in option 'tableId'");
        } else {
          return this.tables[0];
        }
      } else {
        return view.byId(tableId);
      }
    },
    createBusyDialog: async function _createBusyDialog(spreadsheetUploadController) {
      const busyModel = new JSONModel({
        progressPercent: 0,
        progressText: '0'
      });
      if (!this.busyDialog) {
        this.busyDialog = await Fragment.load({
          name: 'cc.spreadsheetimporter.v2_3_0.fragment.BusyDialogProgress',
          controller: this
        });
      }
      this.busyDialog.setModel(busyModel, 'busyModel');
      this.busyDialog.setModel(spreadsheetUploadController.component.getModel('device'), 'device');
      this.busyDialog.setModel(spreadsheetUploadController.component.getModel('i18n'), 'i18n');
      this.busyDialog.open();
    },
    checkForODataErrors: async function _checkForODataErrors(showBackendErrorMessages) {
      if (showBackendErrorMessages) {
        try {
          // sap.ui.core.Messaging is only available in UI5 version 1.118 and above, prefer this over sap.ui.getCore().getMessageManager()saging = Util.loadUI5RessourceAsync("sap/ui/core/Messaging");
          const Messaging = await Util.loadUI5RessourceAsync('sap/ui/core/Messaging');
          const messages = Messaging.getMessageModel().getData();
          if (messages.length > 0) {
            this.odataMessageHandler.displayMessages(messages);
          }
          return;
        } catch (error) {
          Log.debug('sap/ui/core/Messaging not found', undefined, 'SpreadsheetUpload: checkForODataErrors');
        }
        // ui5lint-disable-next-line -- fallback for UI5 versions below 1.118
        const messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        if (messages.length > 0) {
          this.odataMessageHandler.displayMessages(messages);
        }
      }
    },
    showInternalErrorDialog: async function _showInternalErrorDialog(error) {
      MessageBox.error(error.message);
    },
    getView: function _getView(context) {
      return context._view || context.oView || context.getView();
    },
    get tables() {
      return this._tables;
    },
    set tables(value) {
      this._tables = value;
    }
  });
  return OData;
});
