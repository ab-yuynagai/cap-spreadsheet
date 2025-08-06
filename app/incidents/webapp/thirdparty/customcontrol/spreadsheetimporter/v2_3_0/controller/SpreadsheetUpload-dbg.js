sap.ui.define(["sap/ui/base/ManagedObject", "./odata/OData", "./odata/ODataV2", "./odata/ODataV4", "./Util", "./MessageHandler", "sap/base/Log", "./dialog/SpreadsheetUploadDialog", "../enums", "sap/ui/VersionInfo", "./dialog/WizardDialog"], function (ManagedObject, __OData, __ODataV2, __ODataV4, __Util, __MessageHandler, Log, __SpreadsheetUploadDialog, ___enums, VersionInfo, __WizardDialog) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const OData = _interopRequireDefault(__OData);
  const ODataV2 = _interopRequireDefault(__ODataV2);
  const ODataV4 = _interopRequireDefault(__ODataV4);
  const Util = _interopRequireDefault(__Util);
  const MessageHandler = _interopRequireDefault(__MessageHandler);
  const SpreadsheetUploadDialog = _interopRequireDefault(__SpreadsheetUploadDialog);
  const Action = ___enums["Action"];
  const CustomMessageTypes = ___enums["CustomMessageTypes"];
  const WizardDialog = _interopRequireDefault(__WizardDialog);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const SpreadsheetUpload = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.SpreadsheetUpload", {
    /**
     * Initializes SpreadsheetUpload instance.
     * @param {Component} component - The component to be used.
     * @param {ResourceModel} componentI18n - The i18n resource model for the component.
     */
    constructor: function _constructor(component, componentI18n) {
      ManagedObject.prototype.constructor.call(this);
      this.errorState = false;
      // @ts-ignore
      this.component = component;
      this.componentI18n = componentI18n;
      // enhance i18n model with data from the component config, custom i18n model will overwrite the default one but only the texts that are present in the custom i18n model
      //https://github.com/SAP/openui5/blob/85c3fc7d61b0886a1f53babd02100ef6bb96521b/src/sap.ui.core/src/sap/ui/model/resource/ResourceModel.js#L392-L426
      if (this.component.getI18nModel()) {
        try {
          // @ts-ignore
          this.componentI18n.enhance(this.component.getI18nModel().getResourceBundle());
        } catch (error) {
          Log.error('Error enhancing i18n model', error, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
            error: error
          }));
        }
      }
      this.util = new Util(componentI18n.getResourceBundle());
      this.messageHandler = new MessageHandler(this);
      this.spreadsheetUploadDialogHandler = new SpreadsheetUploadDialog(this, component, componentI18n, this.messageHandler);
      this.wizardDialogHandler = new WizardDialog(this, component, componentI18n, this.messageHandler);
    },
    /**
     * Executes initial setup.
     * @returns {Promise<void>} A promise that resolves when the initial setup is complete.
     */
    initialSetup: async function _initialSetup() {
      // check if "sap.ui.generic" is available, if false it is OpenUI5
      this.isOpenUI5 = await this.isOpenUI5Context();
      // load version from UI5 2.0
      VersionInfo.load().catch(function (err) {
        Log.error('failed to load global version info', err);
      }).then(function (versionInfo) {
        const version = versionInfo.version;
        const text = 'UI5 Version Info: ' + versionInfo.name + ' - ' + versionInfo.version;
        Log.debug('constructor', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          ui5version: version,
          isOpenUI5: this.isOpenUI5
        }));
      }.bind(this));

      // Only create the dialog that will be used
      const useWizard = this.component.getUseImportWizard();
      if (!useWizard) {
        // Only create the standard dialog if we're going to use it
        await this.spreadsheetUploadDialogHandler.createSpreadsheetUploadDialog();
      }
      if (!this.component.getStandalone()) {
        try {
          await this.setContext();
          this.errorState = false;
        } catch (error) {
          this.errorMessage = error;
          this.errorState = true;
          Log.error("Error setting 'setContext'", error, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
            error: error
          }));
        }
      }
    },
    /**
     * Sets context for the instance.
     */
    setContext: async function _setContext() {
      this.context = this.component.getContext();
      if (this.context.base) {
        this.context = this.context.base;
      }
      this.view = OData.prototype.getView(this.context);
      if (this.component.getBindingCustom()) {
        this.binding = this.component.getBindingCustom();
        Log.debug('binding', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          binding: this.binding
        }));
      } else {
        this.tableObject = await OData.prototype.getTableObject(this.component.getTableId(), this.view, this);
        Log.debug('tableObject', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          tableObject: this.tableObject
        }));
        if (!this.tableObject) {
          throw new Error('No table object found');
        }
        this.component.setTableId(this.tableObject.getId());
        Log.debug('table Id', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          tableID: this.tableObject.getId()
        }));
        this.binding = OData.prototype.getBindingFromTable(this.tableObject);
      }
      if (!this.binding) {
        throw new Error(this.util.geti18nText('spreadsheetimporter.bindingError'));
      }
      this.isODataV4 = this._checkIfODataIsV4(this.binding);
      this.odataHandler = this.createODataHandler(this, this.messageHandler, this.util);
      this.spreadsheetUploadDialogHandler.setODataHandler(this.odataHandler);
      this.wizardDialogHandler.setODataHandler(this.odataHandler);
      this.controller = this.view.getController();
      Log.debug('View', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
        view: this.view
      }));
      this.view.addDependent(this.spreadsheetUploadDialogHandler.getDialog());
      this.view.addDependent(this.wizardDialogHandler.getDialog());
      this._odataType = await this.odataHandler.getOdataType(this.binding, this.component.getOdataType());
      Log.debug('odataType', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
        odataType: this._odataType
      }));
      this.odataKeyList = await this.odataHandler.getKeyList(this._odataType, this.binding);
      Log.debug('odataKeyList', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
        odataKeyList: this.odataKeyList
      }));
      this.typeLabelList = await this.odataHandler.getLabelList(this.component.getColumns(), this._odataType, this.component.getExcludeColumns(), this.binding);
      if (this.component.getAction() === Action.Update || this.component.getAction() === Action.Delete) {
        // keys are needed for the update/delete action in the labellist
        this.odataHandler.addKeys(this.typeLabelList, this._odataType);
      }
      Log.debug('typeLabelList', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
        typeLabelList: this.typeLabelList
      }));
      if (this.isODataV4) {
        const {
          mainEntity,
          expands
        } = this.odataHandler.getODataEntitiesRecursive(this.getOdataType(), 99);
        Log.debug('mainEntity', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          mainEntity: mainEntity
        }));
        Log.debug('expands', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
          expands: expands
        }));
      }
      this.model = this.binding.getModel();
      Log.debug('model', undefined, 'SpreadsheetUpload: SpreadsheetUpload', () => this.component.logger.returnObject({
        model: this.model
      }));
      this.odataHandler.createCustomBinding(this.binding);
      try {
        // Load the DraftController asynchronously using the loadDraftController function
        // @ts-ignore
        const DraftController = await this._loadDraftController();
        // Create an instance of the DraftController
        this.odataHandler.draftController = new DraftController(this.model, undefined);
      } catch (error) {
        Log.error('Error setting the draft controller', error, 'SpreadsheetUpload: SpreadsheetUpload');
      }
    },
    /**
     * Retrieves OData handler based on UI5 version.
     * @param {number} version - UI5 version number.
     * @returns {OData} OData handler instance.
     */
    createODataHandler: function _createODataHandler(spreadsheetUploadController, messageHandler, util) {
      if (this.isODataV4) {
        return new ODataV4(spreadsheetUploadController, messageHandler, util);
      } else {
        return new ODataV2(spreadsheetUploadController, messageHandler, util);
      }
    },
    /**
     * Initializes the component and performs initial setup
     * @returns {Promise<void>}
     */
    initializeComponent: async function _initializeComponent() {
      this.initialSetupPromise = this.initialSetup();
      await this.initialSetupPromise;
      if (this.errorState) {
        Util.showError(this.errorMessage, 'SpreadsheetUpload.ts', 'initialSetup');
        Log.error('Error during initialization', undefined, 'SpreadsheetUpload: SpreadsheetUpload');
        throw this.errorMessage;
      }
    },
    /**
     * Internal method to handle opening either dialog type.
     * Centralizes common logic for dialog initialization and opening.
     * @private
     * @param {boolean} useWizard - If true opens wizard, otherwise opens classic dialog
     * @param {ComponentData} [options] - Optional configuration options
     */
    openDialog: async function _openDialog(useWizard, options) {
      try {
        // Apply any provided options
        if (options) {
          this.setComponentOptions(options);
        }

        // Set the wizard flag on the component
        this.component.setUseImportWizard(useWizard);

        // Initialize the component (context, bindings, etc.)
        await this.initializeComponent();

        // Open the appropriate dialog
        if (useWizard) {
          // Open wizard directly - let it handle file upload from scratch
          this.wizardDialogHandler.openWizard();
        } else {
          this.spreadsheetUploadDialogHandler.openSpreadsheetUploadDialog();
        }
      } catch (error) {
        const dialogType = useWizard ? 'match wizard' : 'spreadsheet upload dialog';
        Log.error(`Error opening ${dialogType}`, error, 'SpreadsheetUpload');
        throw error;
      }
    },
    setComponentOptions: function _setComponentOptions(options) {
      if (options.hasOwnProperty('spreadsheetFileName')) {
        this.component.setSpreadsheetFileName(options.spreadsheetFileName);
      }
      if (options.hasOwnProperty('context')) {
        this.component.setContext(options.context);
      }
      if (options.hasOwnProperty('columns')) {
        this.component.setColumns(options.columns);
      }
      if (options.hasOwnProperty('excludeColumns')) {
        this.component.setExcludeColumns(options.excludeColumns);
      }
      if (options.hasOwnProperty('tableId')) {
        this.component.setTableId(options.tableId);
      }
      if (options.hasOwnProperty('odataType')) {
        this.component.setOdataType(options.odataType);
      }
      if (options.hasOwnProperty('mandatoryFields')) {
        this.component.setMandatoryFields(options.mandatoryFields);
      }
      if (options.hasOwnProperty('fieldMatchType')) {
        this.component.setFieldMatchType(options.fieldMatchType);
      }
      if (options.hasOwnProperty('activateDraft')) {
        this.component.setActivateDraft(options.activateDraft);
      }
      if (options.hasOwnProperty('batchSize')) {
        this.component.setBatchSize(options.batchSize);
      }
      if (options.hasOwnProperty('standalone')) {
        this.component.setStandalone(options.standalone);
      }
      if (options.hasOwnProperty('strict')) {
        this.component.setStrict(options.strict);
      }
      if (options.hasOwnProperty('decimalSeparator')) {
        this.component.setDecimalSeparator(options.decimalSeparator);
      }
      if (options.hasOwnProperty('hidePreview')) {
        this.component.setHidePreview(options.hidePreview);
      }
      if (options.hasOwnProperty('previewColumns')) {
        this.component.setPreviewColumns(options.previewColumns);
      }
      if (options.hasOwnProperty('skipMandatoryFieldCheck')) {
        this.component.setSkipMandatoryFieldCheck(options.skipMandatoryFieldCheck);
      }
      if (options.hasOwnProperty('skipColumnsCheck')) {
        this.component.setSkipColumnsCheck(options.skipColumnsCheck);
      }
      if (options.hasOwnProperty('skipColumnsCheck')) {
        this.component.setSkipColumnsCheck(options.useTableSelector);
      }
      if (options.hasOwnProperty('showBackendErrorMessages')) {
        this.component.setShowBackendErrorMessages(options.showBackendErrorMessages);
      }
      if (options.hasOwnProperty('showOptions')) {
        this.component.setShowOptions(options.showOptions);
      }
      if (options.hasOwnProperty('debug')) {
        this.component.setDebug(options.debug);
      }
      if (options.hasOwnProperty('availableOptions')) {
        this.component.setAvailableOptions(options.availableOptions);
      }
      if (options.hasOwnProperty('sampleData')) {
        this.component.setSampleData(options.sampleData);
      }
      if (options.hasOwnProperty('spreadsheetTemplateFile')) {
        this.component.setSpreadsheetTemplateFile(options.spreadsheetTemplateFile);
      }
      if (options.hasOwnProperty('hideSampleData')) {
        this.component.setHideSampleData(options.hideSampleData);
      }
      if (options.hasOwnProperty('spreadsheetRowPropertyName')) {
        this.component.setUseTableSelector(options.useTableSelector);
      }
      if (options.hasOwnProperty('readAllSheets')) {
        this.component.setReadAllSheets(options.readAllSheets);
      }
      if (options.hasOwnProperty('readSheet')) {
        this.component.setReadSheet(options.readSheet);
      }
      if (options.hasOwnProperty('continueOnError')) {
        this.component.setContinueOnError(options.continueOnError);
      }
      if (options.hasOwnProperty('createActiveEntity')) {
        this.component.setCreateActiveEntity(options.createActiveEntity);
      }
      if (options.hasOwnProperty('componentContainerData')) {
        this.component.setComponentContainerData(options.componentContainerData);
      }
      if (options.hasOwnProperty('i18nModel')) {
        this.component.setI18nModel(options.i18nModel);
      }
      if (options.hasOwnProperty('bindingCustom')) {
        this.component.setBindingCustom(options.bindingCustom);
      }
      if (options.hasOwnProperty('showDownloadButton')) {
        this.component.setShowDownloadButton(options.showDownloadButton);
      }
      if (options.hasOwnProperty('action')) {
        this.component.setAction(options.action);
      }
      if (options.hasOwnProperty('updateConfig')) {
        this.component.setUpdateConfig(options.updateConfig);
      }
      if (options.hasOwnProperty('deepDownloadConfig')) {
        this.component.setDeepDownloadConfig(Util.mergeDeepDownloadConfig(this.component.getDeepDownloadConfig(), options.deepDownloadConfig));
      }
      if (options.hasOwnProperty('readSheetCoordinates')) {
        this.component.setReadSheetCoordinates(options.readSheetCoordinates);
      }
      if (options.hasOwnProperty('skipEmptyHeadersCheck')) {
        this.component.setSkipEmptyHeadersCheck(options.skipEmptyHeadersCheck);
      }
      if (options.hasOwnProperty('enablePaste')) {
        this.component.setEnablePaste(options.enablePaste);
      }

      // Special case for showOptions
      if (options.availableOptions && options.availableOptions.length > 0) {
        this.component.setShowOptions(true);
      }
    },
    _checkIfODataIsV4: function _checkIfODataIsV(binding) {
      try {
        const odataVersion = binding.getModel().getMetadata().getName();
        if (odataVersion === 'sap.ui.model.odata.v2.ODataModel') {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        Log.debug('Error getting the odata version from the tableObject', error, 'SpreadsheetUpload: SpreadsheetUpload');
        return false;
      }
    },
    refreshBinding: function _refreshBinding(context, binding, tableObject) {
      const id = tableObject.getId();
      let refreshFailed = true; // Track if all refresh attempts failed

      if (context._controller?.getExtensionAPI()) {
        // refresh binding in V4 FE context
        try {
          context._controller.getExtensionAPI().refresh(binding.getPath());
          refreshFailed = false;
        } catch (error) {
          Log.error('Failed to refresh binding in V4 FE context: ' + error);
        }
      } else if (context.extensionAPI) {
        // refresh binding in V2 FE context
        if (context.extensionAPI.refresh) {
          try {
            context.extensionAPI.refresh(binding.getPath(id));
            refreshFailed = false;
          } catch (error) {
            Log.error('Failed to refresh binding in Object Page V2 FE context: ' + error);
          }
        }
        if (context.extensionAPI.refreshTable) {
          try {
            context.extensionAPI.refreshTable(id);
            refreshFailed = false;
          } catch (error) {
            Log.error('Failed to refresh binding in List Report V2 FE context: ' + error);
          }
        }
      }

      // Try direct binding refresh as last resort if all other attempts failed
      if (refreshFailed) {
        try {
          // force refresh parameter only for v2
          binding.refresh(this._checkIfODataIsV4(binding) ? undefined : true);
        } catch (error) {
          Log.error('Failed to refresh binding in other contexts: ' + error);
        }
      }
    },
    /**
     * Dynamically loads the `sap.ui.generic.app.transaction.DraftController` module.
     * @returns {Promise<sap.ui.generic.app.transaction.DraftController>} A Promise that resolves to an instance of the `DraftController` class.
     * @throws {Error} If the `DraftController` module cannot be loaded.
     */
    _loadDraftController: async function _loadDraftController() {
      return new Promise(function (resolve, reject) {
        sap.ui.require(['sap/ui/generic/app/transaction/DraftController'], function (DraftController) {
          resolve(DraftController);
        }, function (err) {
          reject(err);
        });
      });
    },
    resetContent: function _resetContent() {
      this.payloadArray = [];
      this.payload = [];
      this.odataHandler.resetContexts();
      this.spreadsheetUploadDialogHandler.resetContent();
    },
    triggerDownloadSpreadsheet: function _triggerDownloadSpreadsheet() {
      this.spreadsheetUploadDialogHandler.onInitDownloadSpreadsheetProcess();
    },
    /**
     * Returns messages from the MessageHandler.
     * @returns {Messages[]} - An array of messages.
     */
    getMessages: function _getMessages() {
      return this.messageHandler.getMessages();
    },
    /**
     * Adds messages to the MessageHandler's messages.
     * @param {Messages[]} messagesArray - An array of messages to add.
     */
    addToMessages: function _addToMessages(messagesArray) {
      messagesArray.forEach(message => {
        if (message.group) {
          message.type = CustomMessageTypes.CustomErrorGroup;
        } else {
          message.type = CustomMessageTypes.CustomError;
        }
        message.counter = 1;
      });
      this.messageHandler.addArrayToMessages(messagesArray);
    },
    /**
     * Sets the MessageHandler's messages array, replacing any existing messages.
     * @param {Messages[]} messagesArray - An array of messages to set.
     */
    setMessages: function _setMessages(messagesArray) {
      // Process messages to ensure they have the right type and counter
      messagesArray.forEach(message => {
        if (message.group) {
          message.type = CustomMessageTypes.CustomErrorGroup;
        } else {
          message.type = CustomMessageTypes.CustomError;
        }
        message.counter = 1;
      });
      this.messageHandler.setMessages(messagesArray);
    },
    getSpreadsheetUploadDialog: function _getSpreadsheetUploadDialog() {
      return this.spreadsheetUploadDialogHandler.getDialog();
    },
    getPayloadArray: function _getPayloadArray() {
      return this.payloadArray;
    },
    getODataHandler: function _getODataHandler() {
      return this.odataHandler;
    },
    get isODataV4() {
      return this._isODataV4;
    },
    set isODataV4(value) {
      this._isODataV4 = value;
    },
    get tableObject() {
      return this._tableObject;
    },
    set tableObject(value) {
      this._tableObject = value;
    },
    get binding() {
      return this._binding;
    },
    set binding(value) {
      this._binding = value;
    },
    get spreadsheetUploadDialogHandler() {
      return this._spreadsheetUploadDialogHandler;
    },
    set spreadsheetUploadDialogHandler(value) {
      this._spreadsheetUploadDialogHandler = value;
    },
    get controller() {
      return this._controller;
    },
    get view() {
      return this._view;
    },
    getOdataType: function _getOdataType() {
      return this._odataType;
    },
    isOpenUI5Context: async function _isOpenUI5Context() {
      try {
        // sap.ui.core.Messaging is only available in UI5 version 1.118 and above, prefer this over sap.ui.getCore().getMessageManager() = Util.loadUI5RessourceAsync("sap/ui/core/Messaging");
        await Util.loadUI5RessourceAsync('sap/ui/generic');
        return true;
      } catch (error) {
        Log.debug('sap/ui/generic not found', undefined, 'SpreadsheetUpload: isOpenUI5');
        return false;
      }
    },
    get wizardDialogHandler() {
      return this._wizardDialogHandler;
    },
    set wizardDialogHandler(value) {
      this._wizardDialogHandler = value;
    }
  });
  return SpreadsheetUpload;
});
