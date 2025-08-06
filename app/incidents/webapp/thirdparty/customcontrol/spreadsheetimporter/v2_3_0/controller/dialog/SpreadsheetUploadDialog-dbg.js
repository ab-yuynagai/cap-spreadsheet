sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/core/Fragment", "sap/m/MessageToast", "../Preview", "../Util", "./OptionsDialog", "sap/base/Log", "sap/ui/model/json/JSONModel", "../download/SpreadsheetDownloadDialog", "../download/SpreadsheetGenerator", "../download/SpreadsheetDownload", "../ImportService", "../../enums", "../services/TemplateService", "../services/FileService"], function (ManagedObject, Fragment, MessageToast, __Preview, __Util, __OptionsDialog, Log, JSONModel, __SpreadsheetDownloadDialog, __SpreadsheetGenerator, __SpreadsheetDownload, __ImportService, ____enums, __TemplateService, __FileService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Preview = _interopRequireDefault(__Preview);
  const Util = _interopRequireDefault(__Util);
  const OptionsDialog = _interopRequireDefault(__OptionsDialog);
  const SpreadsheetDownloadDialog = _interopRequireDefault(__SpreadsheetDownloadDialog);
  const SpreadsheetGenerator = _interopRequireDefault(__SpreadsheetGenerator);
  const SpreadsheetDownload = _interopRequireDefault(__SpreadsheetDownload);
  const ImportService = _interopRequireDefault(__ImportService);
  const Action = ____enums["Action"];
  const TemplateService = _interopRequireDefault(__TemplateService);
  const FileService = _interopRequireDefault(__FileService);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const SpreadsheetUploadDialog = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.SpreadsheetUploadDialog", {
    constructor: function _constructor(spreadsheetUploadController, component, componentI18n, messageHandler) {
      ManagedObject.prototype.constructor.call(this);
      this.currentFile = null;
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.component = component;
      this.componentI18n = componentI18n;
      this.util = new Util(componentI18n.getResourceBundle());
      this.messageHandler = messageHandler;

      // Initialize the import service
      this.importService = new ImportService(spreadsheetUploadController, component, componentI18n.getResourceBundle(), messageHandler);
      this.previewHandler = new Preview(this.util);
      this.optionsHandler = new OptionsDialog(spreadsheetUploadController);
      this.spreadsheetDownloadDialog = new SpreadsheetDownloadDialog(this.spreadsheetUploadController, this);

      // Initialize template service
      this.templateService = new TemplateService(component, spreadsheetUploadController, componentI18n.getResourceBundle());
    },
    createSpreadsheetUploadDialog: async function _createSpreadsheetUploadDialog() {
      if (!this.spreadsheetUploadDialog) {
        this.spreadsheetOptionsModel = new JSONModel({
          dataRows: 0,
          strict: this.component.getStrict(),
          hidePreview: this.component.getHidePreview(),
          showOptions: this.component.getShowOptions(),
          showDownloadButton: this.component.getShowDownloadButton(),
          hideGenerateTemplateButton: false,
          fileUploadValue: '',
          densityClass: this.component._densityClass,
          action: this.component.getAction()
        });
        this.spreadsheetUploadDialog = await Fragment.load({
          name: 'cc.spreadsheetimporter.v2_3_0.fragment.SpreadsheetUpload',
          type: 'XML',
          controller: this
        });
        this.spreadsheetUploadDialog.setComponent(this.component);
        this.spreadsheetUploadDialog.setBusyIndicatorDelay(0);
        this.spreadsheetUploadDialog.setModel(this.componentI18n, 'i18n');
        this.spreadsheetUploadDialog.setModel(this.spreadsheetOptionsModel, 'info');
        this.spreadsheetUploadDialog.setModel(this.component.getModel('device'), 'device');
        this.spreadsheetUploadDialog.attachDecimalSeparatorChanged(this.onDecimalSeparatorChanged.bind(this));
        this.spreadsheetUploadDialog.attachAvailableOptionsChanged(this.onAvailableOptionsChanged.bind(this));
        this.spreadsheetUploadDialog.attachFileDrop(this.onFileDrop.bind(this));
        // Only attach paste handler if paste functionality is enabled
        if (this.component.getEnablePaste()) {
          this.spreadsheetUploadDialog.attachDataPaste(this.onDataPaste.bind(this));
        }
      }
      if (this.component.getStandalone() && this.component.getColumns().length === 0 && !this.component.getSpreadsheetTemplateFile()) {
        this.spreadsheetOptionsModel.setProperty('/hideGenerateTemplateButton', true);
      }
    },
    onFileDrop: function _onFileDrop(event) {
      const files = event.getParameter('files');
      const file = files[0];
      this.spreadsheetUploadDialog.getModel('info').setProperty('/fileUploadValue', file.name);
      this.handleFile(file);
    },
    /**
     * Handle paste data event from SpreadsheetDialog
     * @param {SpreadsheetDialog$DataPasteEvent} event - The paste data event
     */
    onDataPaste: async function _onDataPaste(event) {
      const workbook = event.getParameter('workbook'); // Cast to any to access XLSX.WorkBook properties
      const type = event.getParameter('type');
      const originalData = event.getParameter('originalData');

      // Update file uploader display to show paste was used
      const displayName = type === 'file' ? originalData || 'Pasted File' : 'Pasted Data';
      this.spreadsheetUploadDialog.getModel('info').setProperty('/fileUploadValue', displayName);

      // Process the workbook using existing pipeline
      // For pasted data, use 'PastedData' sheet name; for pasted files, use first sheet name
      this.handleWorkbook(workbook);
    },
    /**
     * Handles file upload event.
     * @param {Event} event - The file upload event
     */
    onFileUpload: async function _onFileUpload(event) {
      const file = event.getParameter('files')[0];
      this.spreadsheetUploadDialog.getModel('info').setProperty('/fileUploadValue', file.name);
      await this.handleFile(file);
    },
    /**
     * Process the uploaded file using the import pipeline
     * @param {Blob} file - The file to process
     */
    handleFile: async function _handleFile(file) {
      try {
        this.setBusy(true);

        // Save file reference if it's a File object
        if (file instanceof File) {
          this.currentFile = file;
        }

        // Run import pipeline using the service
        const sheetOption = this.spreadsheetUploadController.component.getReadSheet();
        const result = await this.importService.processValidateAndUpload(file, sheetOption, undefined, {
          resetMessages: true
        }, {
          onBusy: state => this.setBusy(state),
          onMessagesPresent: () => this.messageHandler.displayMessages(),
          onImportSuccess: rowCount => this.setDataRows(rowCount)
        });
        if (!result.canceled && result.payloadArray) {
          // Show a success message
          MessageToast.show(this.util.geti18nText('spreadsheetimporter.fileReadyForUpload'));
        }
        this.setBusy(false);
      } catch (error) {
        this.setBusy(false);
        Log.error('Error handling file upload', error, 'SpreadsheetUploadDialog');
        this.resetContent();
      }
    },
    /**
     * Process a workbook directly (from paste functionality)
     * @param {any} workbook - The XLSX workbook to process
     * @param {string} sheetName - Sheet name to use (default: 'PastedData')
     */
    handleWorkbook: async function _handleWorkbook(workbook) {
      try {
        this.setBusy(true);

        // Clear current file reference since this is from paste
        this.currentFile = null;
        const sheetName = await FileService.getSheetName(workbook, this.component.getReadSheet(), this.componentI18n);
        // Run import pipeline using the workbook directly
        const result = await this.importService.processValidateAndUpload(workbook, sheetName,
        // Pass sheet name, not index for workbooks
        undefined, {
          resetMessages: true
        }, {
          onBusy: state => this.setBusy(state),
          onMessagesPresent: () => this.messageHandler.displayMessages(),
          onImportSuccess: rowCount => this.setDataRows(rowCount)
        });
        if (!result.canceled && result.payloadArray) {
          // Show a success message
          MessageToast.show(this.util.geti18nText('spreadsheetimporter.dataReadyForUpload'));
        }
        this.setBusy(false);
      } catch (error) {
        this.setBusy(false);
        Log.error('Error handling workbook', error, 'SpreadsheetUploadDialog');
        this.resetContent();
      }
    },
    /**
     * Sending extracted data to backend
     * @param {*} event
     */
    onUploadSet: async function _onUploadSet(event) {
      try {
        this.setBusy(true);

        // Get the button source to know which dialog to close afterwards
        const source = event.getSource();
        if (this.currentFile || this.spreadsheetUploadController.payloadArray && this.spreadsheetUploadController.payloadArray.length > 0) {
          let uploadSuccess = false;
          if (this.currentFile) {
            // If we have a file, run validation first
            const sheetOption = this.spreadsheetUploadController.component.getReadSheet();
            const result = await this.importService.processAndValidate(this.currentFile, sheetOption, undefined, {
              resetMessages: true,
              validate: true,
              showMessages: true
            });
            if (!result.canceled) {
              // If validation passed, execute upload
              uploadSuccess = await this.importService.executeUpload(result.payloadArray, this.currentFile);
            }
          } else {
            // No file, but we have payload data - execute upload directly
            uploadSuccess = await this.importService.executeUpload(this.spreadsheetUploadController.payloadArray);
          }
          if (uploadSuccess) {
            MessageToast.show(this.util.geti18nText('spreadsheetimporter.uploadSuccessful'));
          } else {
            MessageToast.show(this.util.geti18nText('spreadsheetimporter.uploadFailed'));
          }
        } else {
          MessageToast.show(this.util.geti18nText('spreadsheetimporter.selectFileUpload'));
          this.setBusy(false);
          return;
        }

        // Close dialog after upload is handled
        this.onCloseDialog();
      } catch (error) {
        Log.error('Error handling upload', error, 'SpreadsheetUploadDialog');
      } finally {
        this.setBusy(false);
      }
    },
    openSpreadsheetUploadDialog: function _openSpreadsheetUploadDialog() {
      this.spreadsheetUploadDialog.open();
    },
    /**
     * Closes the Spreadsheet upload dialog.
     */
    onCloseDialog: function _onCloseDialog() {
      this.component.fireRequestCompleted();
      this.resetContent();
      this.spreadsheetUploadDialog.close();
    },
    onDecimalSeparatorChanged: function _onDecimalSeparatorChanged(event) {
      this.component.setDecimalSeparator(event.getParameter('decimalSeparator'));
    },
    onAvailableOptionsChanged: function _onAvailableOptionsChanged(event) {
      const availableOptions = event.getParameter('availableOptions');
      if (availableOptions.length > 0) {
        this.component.setShowOptions(true);
        this.spreadsheetOptionsModel.setProperty('/showOptions', true);
      } else {
        this.component.setShowOptions(false);
        this.spreadsheetOptionsModel.setProperty('/showOptions', true);
      }
      this.component.setAvailableOptions(availableOptions);
    },
    /**
     * Reset the dialog content and clear the current file
     */
    resetContent: function _resetContent() {
      if (this.spreadsheetUploadDialog) {
        this.spreadsheetUploadDialog.getModel('info').setProperty('/dataRows', 0);

        // Clear file uploader value
        const content = this.spreadsheetUploadDialog.getContent();
        if (content && content.length > 0) {
          const flexBox = content[0];
          if (flexBox && flexBox.getItems && flexBox.getItems().length > 1) {
            const fileUploader = flexBox.getItems()[1];
            if (fileUploader) {
              fileUploader.setValue('');
            }
          }
        }
      }

      // Clear the current file reference
      this.currentFile = null;
    },
    /**
     * Set busy state on dialog
     */
    setBusy: function _setBusy(state) {
      if (this.spreadsheetUploadDialog) {
        this.spreadsheetUploadDialog.setBusy(state);
      }
    },
    setDataRows: function _setDataRows(length) {
      this.spreadsheetUploadDialog.getModel('info').setProperty('/dataRows', length);
    },
    getDialog: function _getDialog() {
      return this.spreadsheetUploadDialog;
    },
    showPreview: async function _showPreview() {
      if (this.spreadsheetUploadController.payloadArray) {
        this.previewHandler.showPreview(this.spreadsheetUploadController.payloadArray, this.spreadsheetUploadController.typeLabelList, this.component.getPreviewColumns());
      }
    },
    onTempDownload: async function _onTempDownload() {
      try {
        await this.templateService.downloadTemplate();
      } catch (error) {
        Log.error('Error downloading template', error, 'SpreadsheetUploadDialog');
        MessageToast.show(this.util.geti18nText('spreadsheetimporter.errorDownloadingTemplate'));
      }
    },
    onOpenOptionsDialog: function _onOpenOptionsDialog() {
      this.optionsHandler.openOptionsDialog();
    },
    setODataHandler: function _setODataHandler(odataHandler) {
      this.odataHandler = odataHandler;
      this.spreadsheetGenerator = new SpreadsheetGenerator(this.spreadsheetUploadController, this.component, odataHandler);
      this.spreadsheetDownload = new SpreadsheetDownload(this.spreadsheetUploadController, this.component, odataHandler);
    },
    /**
     * Initializes the spreadsheet download process.
     * If showOptions is enabled in the DeepDownloadConfig, opens a dialog allowing users to configure download options.
     * Otherwise, directly triggers the spreadsheet download.
     *
     * @returns {Promise<void>} A promise that resolves when the download process is initialized
     */
    onInitDownloadSpreadsheetProcess: async function _onInitDownloadSpreadsheetProcess() {
      const showOptionsToUser = this.component.getDeepDownloadConfig().showOptions;
      if (showOptionsToUser) {
        await this.spreadsheetDownloadDialog.createSpreadsheetDownloadDialog();
        this.spreadsheetDownloadDialog.spreadsheetDownloadDialog.open();
      } else {
        this.onDownloadDataSpreadsheet();
      }
    },
    onDownloadDataSpreadsheet: async function _onDownloadDataSpreadsheet() {
      // if deepLevel is 0, we set deepExport to false
      if (this.component.getDeepDownloadConfig().deepLevel === 0) {
        this.component.getDeepDownloadConfig().deepExport = false;
      }
      // if deepExport is false, we set deepLevel to 0
      if (this.component.getDeepDownloadConfig().deepExport === false) {
        this.component.getDeepDownloadConfig().deepLevel = 0;
      }
      // if deepLevel is greater 0, we set deepExport to true
      if (this.component.getDeepDownloadConfig().deepLevel > 0) {
        this.component.getDeepDownloadConfig().deepExport = true;
      }
      if (!this.spreadsheetUploadController.errorState) {
        try {
          const mainEntitySiblings = await this.spreadsheetDownload.fetchData(this.component.getDeepDownloadConfig());
          let isDefaultPrevented = false;
          try {
            const asyncEventBeforeDownloadFileProcessing = await Util.fireEventAsync('beforeDownloadFileProcessing', {
              data: mainEntitySiblings
            }, this.component);
            isDefaultPrevented = asyncEventBeforeDownloadFileProcessing.bPreventDefault;
          } catch (error) {
            Log.error('Error while calling the beforeDownloadFileProcessing event', error, 'SpreadsheetUploadDialog.ts');
          }
          if (!isDefaultPrevented) {
            this.spreadsheetGenerator.downloadSpreadsheet(mainEntitySiblings, this.component.getDeepDownloadConfig());
          }
        } catch (error) {}
      } else {
        Util.showError(this.spreadsheetUploadController.errorMessage, 'SpreadsheetUpload.ts', 'initialSetup');
        Log.error('Error opening the dialog', undefined, 'SpreadsheetUpload: SpreadsheetUpload');
      }
    },
    /**
     * Formatter for simplified action and data rows text
     * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
     * @param {string} createText - i18n text for create action
     * @param {string} updateText - i18n text for update action
     * @param {string} deleteText - i18n text for delete action
     * @param {string} upsertText - i18n text for upsert action
     * @param {string} recordsReadyText - i18n text for records ready for upload
     * @param {number} dataRows - Number of data rows
     * @returns {string} Simplified formatted text
     */
    formatSimplifiedText: function _formatSimplifiedText(action, createText, updateText, deleteText, upsertText, recordsReadyText, dataRows) {
      let title = '';
      switch (action) {
        case Action.Create:
          title = createText;
          break;
        case Action.Update:
          title = updateText;
          break;
        case Action.Delete:
          title = deleteText;
          break;
        case Action.Upsert:
          title = upsertText;
          break;
        default:
          title = createText;
      }

      // Format records ready message
      const recordsMessage = recordsReadyText.replace('{0}', dataRows.toString());
      return `${title}<br/>${recordsMessage}`;
    },
    /**
     * Formatter for action text display with title and description
     * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
     * @param {string} createText - i18n text for create action
     * @param {string} updateText - i18n text for update action
     * @param {string} deleteText - i18n text for delete action
     * @param {string} upsertText - i18n text for upsert action
     * @param {string} createDesc - i18n description for create action
     * @param {string} updateDesc - i18n description for update action
     * @param {string} deleteDesc - i18n description for delete action
     * @param {string} upsertDesc - i18n description for upsert action
     * @returns {string} Formatted text with title and description
     */
    formatActionText: function _formatActionText(action, createText, updateText, deleteText, upsertText, createDesc, updateDesc, deleteDesc, upsertDesc) {
      let title = '';
      let description = '';
      switch (action) {
        case Action.Create:
          title = createText;
          description = createDesc;
          break;
        case Action.Update:
          title = updateText;
          description = updateDesc;
          break;
        case Action.Delete:
          title = deleteText;
          description = deleteDesc;
          break;
        case Action.Upsert:
          title = upsertText;
          description = upsertDesc;
          break;
        default:
          title = createText;
          description = createDesc;
      }
      return `<strong>${title}</strong><br/>${description}`;
    }
  });
  return SpreadsheetUploadDialog;
});
