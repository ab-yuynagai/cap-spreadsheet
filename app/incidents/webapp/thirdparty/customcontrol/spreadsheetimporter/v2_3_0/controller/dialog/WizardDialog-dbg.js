sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "sap/base/Log", "../Util", "sap/m/MessageToast", "../ImportService", "../wizard/Wizard", "../../enums", "../services/TemplateService"], function (ManagedObject, Fragment, JSONModel, Log, __Util, MessageToast, __ImportService, __WizardController, ____enums, __TemplateService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Util = _interopRequireDefault(__Util);
  const ImportService = _interopRequireDefault(__ImportService);
  const WizardController = _interopRequireDefault(__WizardController);
  const Action = ____enums["Action"];
  const TemplateService = _interopRequireDefault(__TemplateService);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const WizardDialog = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.WizardDialog", {
    /**
     * Creates a new instance of WizardDialog
     */
    constructor: function _constructor(spreadsheetUploadController, component, componentI18n, messageHandler) {
      ManagedObject.prototype.constructor.call(this);
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.component = component;
      this.componentI18n = componentI18n;
      this.messageHandler = messageHandler;
      this.util = new Util(componentI18n.getResourceBundle());

      // Initialize the core components
      this.wizardController = new WizardController(component, componentI18n.getResourceBundle(), messageHandler, spreadsheetUploadController, this);
      this.importService = new ImportService(spreadsheetUploadController, component, componentI18n.getResourceBundle(), messageHandler);

      // Initialize template service
      this.templateService = new TemplateService(component, spreadsheetUploadController, componentI18n.getResourceBundle());
    },
    /**
     * Opens the match wizard dialog
     */
    openWizard: function _openWizard() {
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
        this.createDialog().then(() => {
          this.dialog.open();
          // Collect step references
          this.wizardController.collectStepReferences(this.wizard);
          // Configure the step sequence based on visibility
          this.wizardController.configureStepSequence(this.wizard);
          this.wizardController.setWizardToSteps(this.wizard);
          this.navigateToStep('uploadStep');
        }).catch(error => {
          Log.error('Error opening match wizard', error, 'WizardDialog');
          reject(error);
        });
      });
    },
    /**
     * Creates the wizard dialog
     */
    createDialog: async function _createDialog() {
      this.dialog = await Fragment.load({
        name: 'cc.spreadsheetimporter.v2_3_0.fragment.Wizard',
        type: 'XML',
        controller: this
      });

      // Set models
      this.dialog.setModel(this.componentI18n, 'i18n');

      // Create info model similar to SpreadsheetUploadDialog
      const infoModel = new JSONModel({
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

      // Control hideGenerateTemplateButton logic
      if (this.component.getStandalone() && this.component.getColumns().length === 0 && !this.component.getSpreadsheetTemplateFile()) {
        infoModel.setProperty('/hideGenerateTemplateButton', true);
      }
      this.dialog.setModel(infoModel, 'info');

      // Add action to wizard model
      const wizardModel = this.wizardController.getWizardModel();
      wizardModel.setProperty('/action', this.component.getAction());
      this.dialog.setModel(wizardModel, 'wizard');

      // Set up drag and drop
      this.dialog.setComponent(this.component);
      this.dialog.attachFileDrop(this.onFileDrop.bind(this));
      // Only attach paste handler if paste functionality is enabled
      if (this.component.getEnablePaste()) {
        this.dialog.attachDataPaste(this.onDataPaste.bind(this));
      }

      // Get wizard reference - adjusted index due to added VBox
      this.wizard = this.dialog.getContent()[1];
      this.wizardController.wizard = this.wizard;
    },
    /**
     * Navigate to a specific step in the wizard
     */
    navigateToStep: function _navigateToStep(stepName) {
      try {
        // Get step control from our map
        const step = this.wizardController.getWizardStepControl(stepName);
        if (!step) {
          Log.warning(`Step ${stepName} not found`, undefined, 'WizardDialog');
          return;
        }

        // Navigate to the step - goToStep takes the step itself as the parameter and a boolean for focus
        this.wizard.goToStep(step, true);

        // Update the current step in the model
        this.wizardController.getWizardModel().setProperty('/currentStep', stepName);
        Log.debug(`Navigated to step: ${stepName}`, undefined, 'WizardDialog');
      } catch (error) {
        Log.error(`Error navigating to step ${stepName}`, error, 'WizardDialog');
      }
    },
    /**
     * Handler for wizard step change
     */
    onWizardStepChanged: async function _onWizardStepChanged(event) {
      try {
        const currentStepIndex = event.getParameter('index');
        const wizardSteps = this.wizard.getSteps();
        // Note: stepIndex is 1-based, but array is 0-based
        if (currentStepIndex < 1 || currentStepIndex > wizardSteps.length) return;
        const currentStep = wizardSteps[currentStepIndex - 1]; // Convert to 0-based array index
        if (!currentStep) return;
        let customData;
        const nextStepId = currentStep.getNextStep();
        if (!nextStepId) {
          customData = currentStep.getCustomData();
        } else {
          const nextStep = wizardSteps.find(wizardStep => wizardStep.getId() === nextStepId);
          customData = nextStep?.getCustomData();
        }
        if (!customData || customData.length === 0) return;
        const stepName = customData[0].getValue();
        if (!stepName) return;

        // Update current step in the model
        this.wizardController.getWizardModel().setProperty('/currentStep', stepName);
        Log.debug(`Step changed to: ${stepName}`, undefined, 'WizardDialog');
        try {
          // await this.wizardController.activateStep(stepName);
        } catch (error) {
          Log.error(`Error activating step '${stepName}'`, error, 'WizardDialog');
        }
      } catch (error) {
        Log.error('Error in wizard step change', error, 'WizardDialog');
      }
    },
    /**
     * Handler for wizard completion
     */
    onWizardComplete: function _onWizardComplete() {
      this.wizardController.getWizardModel().setProperty('/currentStep', 'previewDataStep');
    },
    /**
     * Handler for wizard finish button
     */
    onWizardFinish: async function _onWizardFinish() {
      this.setBusy(true);
      try {
        // Get data from the Wizard model and state
        const wizardModel = this.wizardController.getWizardModel();
        const a1Coordinates = wizardModel.getProperty('/readSheetCoordinates');
        const workbookData = this.wizardController.getWorkbookData();
        const currentFile = this.wizardController.getCurrentFile();
        if (!a1Coordinates || !workbookData) {
          Log.error('Missing data for finish operation', undefined, 'WizardDialog');
          this.resolvePromise({
            coordinates: null,
            canceled: true
          });
          this.dialog.close();
          return;
        }
        const {
          workbook,
          sheetName
        } = workbookData;

        // Use the already processed data if available, or process again if needed
        let result;
        const processedData = this.wizardController.getProcessedData();
        if (processedData && processedData.coordinates === a1Coordinates) {
          // We already have processed data with validation
          result = processedData;
          if (this.wizardController.getWizardModel().getProperty('/forceUpload')) {
            result.canceled = false;
          }
        } else {
          // Process the data using the import service
          result = await this.importService.processAndValidate(workbook, sheetName, a1Coordinates, {
            resetMessages: false,
            validate: false,
            showMessages: false
          });
        }
        if (result.canceled) {
          MessageToast.show(this.util.geti18nText('spreadsheetimporter.validationFailed'));
          this.resolvePromise({
            coordinates: a1Coordinates,
            canceled: true
          });
        } else {
          // Execute upload with appropriate method
          const uploadSuccess = await this.importService.executeUpload(result.payloadArray, currentFile);
          if (uploadSuccess) {
            MessageToast.show(this.util.geti18nText('spreadsheetimporter.uploadSuccessful'));
            this.resolvePromise({
              coordinates: a1Coordinates,
              canceled: false,
              workbook: workbook,
              sheetName: sheetName,
              sheetData: result.payloadArray || result.payload
            });
          } else {
            MessageToast.show(this.util.geti18nText('spreadsheetimporter.uploadFailed'));
            this.resolvePromise({
              coordinates: a1Coordinates,
              canceled: true
            });
          }
        }
      } catch (error) {
        Log.error('Error in wizard finish', error, 'WizardDialog');
        this.resolvePromise({
          coordinates: null,
          canceled: true
        });
      } finally {
        this.setBusy(false);
        this.dialog.close();
      }
    },
    /**
     * Handler for wizard cancel button
     */
    onWizardCancel: function _onWizardCancel() {
      this.resolvePromise({
        coordinates: null,
        canceled: true
      });
      this.dialog.close();
    },
    /**
     * Handler for wizard dialog close
     */
    onWizardClose: function _onWizardClose() {
      this.resetContent();
    },
    /**
     * Reset dialog content and resources
     */
    resetContent: function _resetContent() {
      try {
        // Clean up the dialog
        if (this.dialog) {
          // Clean up wizard steps
          const wizard = this.dialog.getContent()[0];
          if (wizard) {
            const steps = wizard.getSteps();
            for (const step of steps) {
              step.destroyContent();
              step.destroyCustomData();
            }
            wizard.destroySteps();
          }
          this.dialog.destroyContent();
          this.dialog.destroyButtons();
          this.dialog.detachAfterClose(this.onWizardClose, this);
          this.dialog.destroy();
        }

        // Reset the wizard data
        this.wizardController.reset();

        // Clear dialog references
        this.dialog = null;
        Log.debug('Dialog and resources fully destroyed', undefined, 'WizardDialog');
      } catch (error) {
        Log.error('Error during dialog cleanup', error, 'WizardDialog');
      }
    },
    /**
     * Set busy state on dialog
     */
    setBusy: function _setBusy(state) {
      if (this.dialog) {
        this.dialog.setBusy(state);
      }
    },
    /**
     * Gets the wizard control instance
     */
    getWizard: function _getWizard() {
      return this.wizard;
    },
    /**
     * Properly destroy this controller instance
     */
    destroy: function _destroy() {
      if (this.dialog) {
        if (this.dialog.isOpen()) {
          this.dialog.close();
        } else {
          this.onWizardClose();
        }
      }
      ManagedObject.prototype.destroy.call(this);
    },
    /**
     * Handler for file drop event from drag and drop
     */
    onFileDrop: function _onFileDrop(event) {
      const files = event.getParameter('files');
      if (files && files.length > 0) {
        const file = files[0];
        // Update the wizard model with the file name
        this.wizardController.getWizardModel().setProperty('/fileUploadValue', file.name);
        // Handle the file as if it was uploaded normally
        this.handleFileFromDrop(file);
      }
    },
    /**
     * Handle file from drag and drop
     */
    handleFileFromDrop: async function _handleFileFromDrop(file) {
      try {
        this.wizardController.getStep('uploadStep').setBusyIndicatorDelay(0);
        this.wizardController.getStep('uploadStep').setBusy(true);
        const uploadStep = await this.wizardController.activateStep('uploadStep');
        // Create a mock event object with the file
        const mockEvent = {
          getParameter: paramName => {
            if (paramName === 'files') {
              return [file];
            }
            return null;
          }
        };
        uploadStep.onFileUpload(mockEvent);
        if (this.wizardController.getStep('uploadStep')) {
          this.wizard.setCurrentStep(this.wizardController.getStep('uploadStep'));
        }
      } catch (error) {
        Log.error('Error handling dropped file', error, 'WizardDialog');
        this.wizardController.getStep('uploadStep').setBusy(false);
      }
    },
    /**
     * Handler for file upload event from the fragment
     * Delegates to the UploadStep controller
     */
    onFileUpload: async function _onFileUpload(event) {
      try {
        this.wizardController.getStep('uploadStep').setBusyIndicatorDelay(0);
        this.wizardController.getStep('uploadStep').setBusy(true);
        const uploadStep = await this.wizardController.activateStep('uploadStep');
        uploadStep.onFileUpload(event);
        if (this.wizardController.getStep('uploadStep')) {
          this.wizard.setCurrentStep(this.wizardController.getStep('uploadStep'));
        }
        // this.wizardController.getStep("uploadStep").setBusy(false);
      } catch (error) {
        Log.error('Error delegating file upload to step', error, 'WizardDialog');
        this.wizardController.getStep('uploadStep').setBusy(false);
      }
    },
    setODataHandler: function _setODataHandler(odataHandler) {
      this.odataHandler = odataHandler;
    },
    getDialog: function _getDialog() {
      return this.dialog;
    },
    /**
     * Formatter for simple action text display
     * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
     * @param {string} createText - i18n text for create action
     * @param {string} updateText - i18n text for update action
     * @param {string} deleteText - i18n text for delete action
     * @param {string} upsertText - i18n text for upsert action
     * @returns {string} Simple action title
     */
    formatSimpleActionText: function _formatSimpleActionText(action, createText, updateText, deleteText, upsertText) {
      switch (action) {
        case Action.Create:
          return createText;
        case Action.Update:
          return updateText;
        case Action.Delete:
          return deleteText;
        case Action.Upsert:
          return upsertText;
        default:
          return createText;
      }
    },
    /**
     * Template download handler using TemplateService
     */
    onTempDownload: async function _onTempDownload() {
      try {
        await this.templateService.downloadTemplate();
      } catch (error) {
        Log.error('Error downloading template', error, 'WizardDialog');
        MessageToast.show(this.util.geti18nText('spreadsheetimporter.errorDownloadingTemplate'));
      }
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
    },
    /**
     * Handler for data paste event
     * Only allows paste functionality when on the upload step
     */
    onDataPaste: function _onDataPaste(event) {
      // Check if we're on the upload step
      const currentStep = this.wizardController.getWizardModel().getProperty('/currentStep');
      if (currentStep !== 'uploadStep') {
        // Show a message that paste is only allowed on the upload step
        MessageToast.show(this.util.geti18nText('spreadsheetimporter.pasteOnlyOnUploadStep'));
        return;
      }
      const workbook = event.getParameter('workbook');
      const type = event.getParameter('type');
      const originalData = event.getParameter('originalData');

      // Update file uploader display to show paste was used
      const displayName = type === 'file' ? originalData || 'Pasted File' : 'Pasted Data';
      this.wizardController.getWizardModel().setProperty('/fileUploadValue', displayName);

      // Handle the pasted workbook similar to how file upload is handled
      this.handleWorkbookFromPaste(workbook, type, displayName);
    },
    /**
     * Handle workbook from paste functionality
     */
    handleWorkbookFromPaste: async function _handleWorkbookFromPaste(workbook, type, displayName) {
      try {
        this.wizardController.getStep('uploadStep').setBusyIndicatorDelay(0);
        this.wizardController.getStep('uploadStep').setBusy(true);
        const uploadStep = await this.wizardController.activateStep('uploadStep');

        // Process the workbook using enhanced pipeline with the sheet name
        const processedData = await this.wizardController.processFile(workbook, this.wizardController.getCurrentCoordinates(), true, false);

        // Create a mock File object for the workbook
        const mockFile = new File([], displayName, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Update Wizard with the workbook data
        this.wizardController.setFileData(mockFile, processedData);

        // Use the same logic as UploadStep.processFileAndNavigate()
        this.wizardController.setUploadButtonEnabled(false);
        this.wizardController.resetCurrentCoordinates();

        // create steps controllers
        this.createStepsControllers();

        // Check for header validation issues
        const headerValidationResult = processedData.validationMessages.find(message => message.type.title === 'EmptyHeaders');
        let navigateToStep;
        if (processedData.validationMessages.length > 0 && headerValidationResult) {
          // Wrong headers but other errors found - Navigate to MessagesStep
          const uploadStepControl = this.wizardController.getStep('uploadStep');
          const headerStepControl = this.wizardController.getStep('headerSelectionStep');
          const messagesStepControl = this.wizardController.getStep('messagesStep');
          if (uploadStepControl && messagesStepControl && uploadStepControl.getNextStep() !== messagesStepControl.getId()) {
            uploadStepControl.setNextStep(messagesStepControl);
          }
          if (headerStepControl && messagesStepControl && headerStepControl.getNextStep() !== messagesStepControl.getId()) {
            headerStepControl.setNextStep(messagesStepControl);
          }
          navigateToStep = headerStepControl;
          // if build already rebuild headerSelectionStep
          if (this.wizardController.stepsBuilt.has('headerSelectionStep')) {
            const headerSelectionController = this.wizardController.getStepControl('headerSelectionStep');
            headerSelectionController.build(this.wizardController.findStepContainer('headerSelectionStep'));
          } else {
            this.wizardController.activateStep('headerSelectionStep');
          }
        } else if (headerValidationResult) {
          // Wrong header detected - Configure wizard flow
          const uploadStepControl = this.wizardController.getStep('uploadStep');
          const headerStepControl = this.wizardController.getStep('headerSelectionStep');
          if (uploadStepControl && headerStepControl && uploadStepControl.getNextStep() !== headerStepControl.getId()) {
            uploadStepControl.setNextStep(headerStepControl);
          }
          navigateToStep = headerStepControl;
          // if build already rebuild headerSelectionStep
          if (this.wizardController.stepsBuilt.has('headerSelectionStep')) {
            const headerSelectionController = this.wizardController.getStepControl('headerSelectionStep');
            headerSelectionController.build(this.wizardController.findStepContainer('headerSelectionStep'));
          } else {
            this.wizardController.activateStep('headerSelectionStep');
          }
        } else if (processedData.validationMessages.length > 0) {
          // Valid headers but other errors found - Navigate to MessagesStep
          const uploadStepControl = this.wizardController.getStep('uploadStep');
          const messagesStepControl = this.wizardController.getStep('messagesStep');
          if (uploadStepControl && messagesStepControl && uploadStepControl.getNextStep() !== messagesStepControl.getId()) {
            uploadStepControl.setNextStep(messagesStepControl);
          }

          // Store validation messages in the message handler for use in MessagesStep
          if (this.wizardController.getDialogController()?.messageHandler) {
            this.wizardController.getDialogController().messageHandler.setMessages(processedData.validationMessages);
          }
          navigateToStep = messagesStepControl;
          // Build or rebuild messagesStep
          if (this.wizardController.stepsBuilt.has('messagesStep')) {
            const messagesController = this.wizardController.getStepControl('messagesStep');
            messagesController.build(this.wizardController.findStepContainer('messagesStep'));
          } else {
            this.wizardController.activateStep('messagesStep');
          }
        } else {
          // Valid headers - Configure direct flow to preview
          const uploadStepControl = this.wizardController.getStep('uploadStep');
          const previewStepControl = this.wizardController.getStep('previewDataStep');
          if (uploadStepControl && previewStepControl && uploadStepControl.getNextStep() !== previewStepControl.getId()) {
            uploadStepControl.setNextStep(previewStepControl);
          }
          navigateToStep = previewStepControl;
          if (this.wizardController.stepsBuilt.has('previewDataStep')) {
            const previewStepController = this.wizardController.getStepControl('previewDataStep');
            previewStepController.build(this.wizardController.findStepContainer('previewDataStep'), this.wizardController.processedData);
          } else {
            this.wizardController.activateStep('previewDataStep');
          }
        }
        this.wizardController.setUploadButtonEnabled(true);
        this.wizard.goToStep(navigateToStep, true);
        this.wizard.nextStep();
      } catch (error) {
        Log.error('Error processing pasted workbook', error, 'WizardDialog');
        this.wizardController.getWizardModel().setProperty('/fileUploaded', false);
        const errorMessage = this.util.geti18nText('spreadsheetimporter.errorProcessingFile') || 'Error processing file';
        MessageToast.show(errorMessage);
      } finally {
        this.wizardController.getStep('uploadStep').setBusy(false);
      }
    },
    /**
     * Create steps controllers - moved from UploadStep
     */
    createStepsControllers: function _createStepsControllers() {
      // init steps controllers creation and calling build method
      // both steps need the data from the upload step
      this.wizardController.activateStep('headerSelectionStep');
      // this.wizardController.activateStep("messagesStep");
      this.wizardController.activateStep('previewDataStep');
    }
  });
  return WizardDialog;
});
