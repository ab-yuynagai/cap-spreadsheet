sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/model/json/JSONModel", "sap/base/Log", "../Util", "../Preview", "../ImportService", "./steps/UploadStep", "./steps/HeaderSelectionStep", "./steps/PreviewStep", "./steps/MessagesStep"], function (ManagedObject, JSONModel, Log, __Util, __Preview, __ImportService, __UploadStep, __HeaderSelectionStep, __PreviewStep, __MessagesStep) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Util = _interopRequireDefault(__Util);
  const Preview = _interopRequireDefault(__Preview);
  const ImportService = _interopRequireDefault(__ImportService);
  const UploadStep = _interopRequireDefault(__UploadStep);
  const HeaderSelectionStep = _interopRequireDefault(__HeaderSelectionStep);
  const PreviewStep = _interopRequireDefault(__PreviewStep);
  const MessagesStep = _interopRequireDefault(__MessagesStep);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const Wizard = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.Wizard", {
    /**
     * Creates a new instance of Wizard
     */
    constructor: function _constructor(component, resourceBundle, messageHandler, spreadsheetUploadController, dialogController) {
      ManagedObject.prototype.constructor.call(this);
      // Registry of step controllers - Step instances for logic
      this.stepControllers = {};
      // Registry of WizardStep UI controls from fragment
      this.steps = {};
      // WizardStep controls
      // Map of step controls for quick access
      this.wizardStepControls = {};
      // Track which steps have been built
      this.stepsBuilt = new Set();
      this.stepDefinitions = [];
      this.rawSheetData = null;
      this.processedData = null;
      this.currentFile = null;
      // Dialog controller reference for step activation
      this.dialogController = null;
      this.component = component;
      this.resourceBundle = resourceBundle;
      this.messageHandler = messageHandler;
      this.util = new Util(resourceBundle);
      this.previewHandler = new Preview(this.util);
      this.spreadsheetUploadController = spreadsheetUploadController;
      this.dialogController = dialogController;

      // Initialize import service
      this.importService = new ImportService(spreadsheetUploadController, component, resourceBundle, messageHandler);

      // Initialize wizard model
      this.wizardModel = new JSONModel({
        currentStep: 'uploadStep',
        headerSelected: false,
        readSheetCoordinates: this.component.getReadSheetCoordinates() || 'A1',
        fileUploadValue: '',
        fileUploaded: false,
        uploadButtonEnabled: false,
        // Central control for upload button
        // Visibility flags for steps
        stepUploadVisible: true,
        stepHeaderSelectionVisible: true,
        stepMessagesVisible: true,
        stepPreviewDataVisible: true,
        forceUpload: false
      });

      // Define the wizard step sequence
      this.stepDefinitions = [{
        stepName: 'uploadStep',
        index: 1
      }, {
        stepName: 'headerSelectionStep',
        index: 2
      }, {
        stepName: 'messagesStep',
        index: 3
      }, {
        stepName: 'previewDataStep',
        index: 4
      }];
    },
    /**
     * Gets the wizard model
     */
    getWizardModel: function _getWizardModel() {
      return this.wizardModel;
    },
    /**
     * Gets step definitions
     */
    getStepDefinitions: function _getStepDefinitions() {
      return this.stepDefinitions;
    },
    createUploadStep: function _createUploadStep() {
      this.stepControllers['uploadStep'] = new UploadStep(this, this.wizard, this.util);
      return this.stepControllers['uploadStep'];
    },
    createHeaderSelectionStep: function _createHeaderSelectionStep() {
      this.stepControllers['headerSelectionStep'] = new HeaderSelectionStep(this);
      return this.stepControllers['headerSelectionStep'];
    },
    createPreviewStep: function _createPreviewStep() {
      this.stepControllers['previewDataStep'] = new PreviewStep(this, this.workbook, this.sheetName, this.wizardModel.getProperty('/readSheetCoordinates') || 'A1');
      return this.stepControllers['previewDataStep'];
    },
    createMessagesStep: function _createMessagesStep() {
      this.stepControllers['messagesStep'] = new MessagesStep(this);
      return this.stepControllers['messagesStep'];
    },
    /**
     * Configures the step sequence in the wizard using the setNextStep approach
     */
    configureStepSequence: function _configureStepSequence(wizard) {
      // Get references to the step controls
      const uploadStep = this.steps['uploadStep'];
      const headerSelectionStep = this.steps['headerSelectionStep'];
      const messagesStep = this.steps['messagesStep'];
      const previewDataStep = this.steps['previewDataStep'];
      if (!uploadStep || !headerSelectionStep || !messagesStep || !previewDataStep) {
        Log.error('Missing step controls', undefined, 'Wizard');
        return;
      }

      // Default flow: Upload -> Preview (when headers are valid and no validation errors)
      uploadStep.setNextStep(previewDataStep);

      // Alternative flows that will be set dynamically:
      // Upload -> Header Selection -> Preview (when headers are invalid)
      // Upload -> Messages -> Preview (when headers are valid but there are validation errors)
      headerSelectionStep.setNextStep(previewDataStep);
      messagesStep.setNextStep(previewDataStep);
      uploadStep.addSubsequentStep(headerSelectionStep);
      uploadStep.addSubsequentStep(messagesStep);
      uploadStep.addSubsequentStep(previewDataStep);
      Log.debug('Configured wizard step sequence with messagesStep', undefined, 'Wizard');
    },
    /**
     * Gets the first step in the sequence based on configuration
     */
    getFirstStep: function _getFirstStep() {
      return this.wizardModel.getProperty('/firstStep') || 'uploadStep';
    },
    getStep: function _getStep(stepName) {
      return this.steps[stepName];
    },
    /**
     * Sets a UI5 WizardStep control reference
     */
    setStepControl: function _setStepControl(stepName, stepControl) {
      this.steps[stepName] = stepControl;
    },
    /**
     * Gets a UI5 WizardStep control reference
     */
    getStepControl: function _getStepControl(stepName) {
      return this.stepControllers[stepName];
    },
    /**
     * Gets the step index in the sequence
     */
    getStepIndex: function _getStepIndex(stepName) {
      const step = this.stepDefinitions.find(s => s.stepName === stepName);
      return step ? step.index : -1;
    },
    /**
     * Sets data from a file upload
     */
    setFileData: function _setFileData(file, processedData) {
      this.currentFile = file;
      this.processedData = processedData;
      this.workbook = processedData.workbook;
      this.sheetName = processedData.sheetName;
      this.rawSheetData = processedData.rawSheetData;

      // Update wizard model
      this.wizardModel.setProperty('/fileUploaded', true);
      this.wizardModel.setProperty('/fileUploadValue', file.name);
    },
    /**
     * Gets the current coordinates from the wizard model
     */
    getCurrentCoordinates: function _getCurrentCoordinates() {
      return this.wizardModel.getProperty('/readSheetCoordinates') || 'A1';
    },
    resetCurrentCoordinates: function _resetCurrentCoordinates() {
      this.wizardModel.setProperty('/readSheetCoordinates', this.component.getReadSheetCoordinates() || 'A1');
      this.wizardModel.setProperty('/readSheetObjectCoordinates', null);
    },
    /**
     * Sets the coordinates in the wizard model
     */
    setCurrentCoordinates: function _setCurrentCoordinates(coordinates, objectCoordinates) {
      this.wizardModel.setProperty('/readSheetCoordinates', coordinates);
      if (objectCoordinates) {
        this.wizardModel.setProperty('/readSheetObjectCoordinates', objectCoordinates);
      }
      Log.debug(`Coordinates updated in wizard model: ${coordinates}`, undefined, 'Wizard');
    },
    /**
     * Gets the current object coordinates from the wizard model
     */
    getCurrentObjectCoordinates: function _getCurrentObjectCoordinates() {
      return this.wizardModel.getProperty('/readSheetObjectCoordinates');
    },
    /**
     * Reprocesses the file data with the currently selected coordinates from the model
     */
    reprocessWithCurrentCoordinates: async function _reprocessWithCurrentCoordinates() {
      try {
        const coordinates = this.getCurrentCoordinates();
        if (!this.currentFile && !this.workbook) {
          return null;
        }

        // If we have a file, use that. Otherwise use the workbook.
        if (this.currentFile) {
          this.processedData = await this.processFile(this.currentFile, coordinates, true // Validate now that we have coordinates
          );
        }
        return this.processedData;
      } catch (error) {
        Log.error('Error reprocessing with current coordinates', error, 'Wizard');
        throw error;
      }
    },
    /**
     * Checks if headers are valid using the current coordinates from the model
     */
    checkHeaderValidityWithCurrentCoordinates: async function _checkHeaderValidityWithCurrentCoordinates() {
      try {
        const coordinates = this.getCurrentCoordinates();
        if (!this.workbook || !this.sheetName) {
          return {
            isValid: false
          };
        }

        // Use ImportService to validate the data with the current coordinates
        const result = await this.importService.processAndValidate(this.workbook, this.sheetName, coordinates, {
          resetMessages: true,
          validate: true
        });

        // If validation produced messages, headers might be invalid
        const validationMessages = result.validationMessages || [];
        const isValid = !result.canceled && validationMessages.length === 0;
        return {
          isValid,
          messages: validationMessages
        };
      } catch (error) {
        Log.error('Error checking header validity with current coordinates', error, 'Wizard');
        return {
          isValid: false
        };
      }
    },
    /**
     * Gets workbook data
     */
    getWorkbookData: function _getWorkbookData() {
      if (!this.workbook || !this.sheetName) {
        return null;
      }
      return {
        workbook: this.workbook,
        sheetName: this.sheetName,
        rawSheetData: this.rawSheetData
      };
    },
    /**
     * Gets processed data
     */
    getProcessedData: function _getProcessedData() {
      return this.processedData;
    },
    /**
     * Gets the current file
     */
    getCurrentFile: function _getCurrentFile() {
      return this.currentFile;
    },
    /**
     * Sets the upload button enabled state directly
     */
    setUploadButtonEnabled: function _setUploadButtonEnabled(enabled) {
      this.wizardModel.setProperty('/uploadButtonEnabled', enabled);
      Log.debug(`Upload button manually set to: ${enabled}`, undefined, 'Wizard');
    },
    /**
     * Resets all wizard data including coordinates
     */
    reset: function _reset() {
      this.stepControllers = {};
      this.steps = {};
      this.wizardStepControls = {};
      this.stepsBuilt.clear();
      this.workbook = null;
      this.sheetName = null;
      this.rawSheetData = null;
      this.processedData = null;
      this.currentFile = null;

      // Reset wizard model including coordinates
      const defaultCoordinates = this.component.getReadSheetCoordinates() || 'A1';
      this.wizardModel.setProperty('/currentStep', 'uploadStep');
      this.wizardModel.setProperty('/headerSelected', false);
      this.wizardModel.setProperty('/readSheetCoordinates', defaultCoordinates);
      this.wizardModel.setProperty('/readSheetObjectCoordinates', null);
      this.wizardModel.setProperty('/fileUploadValue', '');
      this.wizardModel.setProperty('/fileUploaded', false);
      this.wizardModel.setProperty('/uploadButtonEnabled', false);
      this.wizardModel.setProperty('/headerValid', true);
      this.wizardModel.setProperty('/firstStep', 'uploadStep');
      Log.debug(`Wizard reset with coordinates: ${defaultCoordinates}`, undefined, 'Wizard');
    },
    /**
     * Prepares data for a table by transforming the raw data into a structured format
     */
    prepareTableData: function _prepareTableData(rawData, startIndex, endIndex) {
      try {
        // Slice the data if start and end indices are provided
        const dataToProcess = startIndex !== undefined && endIndex !== undefined ? rawData.slice(startIndex, endIndex) : rawData;

        // Create array to hold transformed data
        const tableData = dataToProcess.map((row, index) => {
          const rowData = {
            __metadata__: {
              rowNumber: startIndex !== undefined ? index + startIndex : index,
              originalRow: row
            }
          };

          // Convert array of values to object with column indexes as keys
          row.forEach((cellValue, cellIndex) => {
            // Ensure cell value is a primitive and not an object
            const formattedValue = cellValue !== null && typeof cellValue === 'object' ? JSON.stringify(cellValue) : cellValue;
            rowData[`col_${cellIndex}`] = formattedValue;
          });
          return rowData;
        });

        // Find the maximum number of columns
        const maxCols = Math.max(...dataToProcess.map(row => row.length));

        // Create column definitions
        const columns = [];
        for (let i = 0; i < maxCols; i++) {
          columns.push({
            index: i,
            key: `col_${i}`,
            title: `Column ${i + 1}`
          });
        }
        return {
          data: tableData,
          columns: columns,
          maxColumns: maxCols
        };
      } catch (error) {
        Log.error('Error preparing table data', error, 'Wizard');
        return {
          data: [],
          columns: [],
          maxColumns: 0
        };
      }
    },
    /**
     * Calculates the read coordinates when a header row is selected and updates the model
     */
    calculateAndSetReadCoordinates: function _calculateAndSetReadCoordinates(selectedRowIndex, rowData, totalRows) {
      try {
        // Calculate the read coordinates for future use
        // Assuming header row + 1 for data
        const objectCoordinates = {
          s: {
            r: selectedRowIndex,
            c: 0
          },
          // Start (header row)
          e: {
            r: totalRows - 1,
            c: Object.keys(rowData).length - 1
          } // End (last row, last column)
        };

        // Convert to A1 notation for use with SheetHandler.sheet_to_json
        const a1Coordinates = Util.convertCoordinatesToA1Notation(objectCoordinates);
        if (!a1Coordinates) {
          Log.error('Failed to convert coordinates to A1 notation', undefined, 'Wizard');
          return null;
        }

        // Update the wizard model with the new coordinates
        this.setCurrentCoordinates(a1Coordinates, objectCoordinates);
        return {
          a1Coordinates,
          objectCoordinates
        };
      } catch (error) {
        Log.error('Error calculating and setting read coordinates', error, 'Wizard');
        return null;
      }
    },
    /**
     * @deprecated Use calculateAndSetReadCoordinates() instead for centralized coordinate management
     */
    calculateReadCoordinates: function _calculateReadCoordinates(selectedRowIndex, rowData, totalRows) {
      return this.calculateAndSetReadCoordinates(selectedRowIndex, rowData, totalRows);
    },
    /**
     * Processes a file using ImportService's enhanced methods with current coordinates
     */
    processFileWithCurrentCoordinates: async function _processFileWithCurrentCoordinates(file, validate = false, showMessages = false) {
      const coordinates = this.getCurrentCoordinates();
      return this.processFile(file, coordinates, validate, showMessages);
    },
    /**
     * Processes a file using ImportService's enhanced methods
     */
    processFile: async function _processFile(file, coordinates, validate = false, showMessages = false) {
      try {
        // Use ImportService's processAndValidate method
        const result = await this.importService.processAndValidate(file, 'Tabelle1', coordinates, {
          resetMessages: true,
          // Clear previous messages
          validate: validate,
          // Only validate if requested (typically after header selection)
          showMessages: showMessages // Show messages if requested
        });
        return result;
      } catch (error) {
        Log.error('Error processing file', error, 'Wizard');
        throw error;
      }
    },
    /**
     * Reprocesses the file data with the selected coordinates
     * @deprecated Use reprocessWithCurrentCoordinates() instead for centralized coordinate management
     */
    reprocessWithCoordinates: async function _reprocessWithCoordinates(coordinates) {
      // Update the model with the new coordinates first
      this.setCurrentCoordinates(coordinates);
      return this.reprocessWithCurrentCoordinates();
    },
    /**
     * Checks if headers are valid using the given coordinates
     * @deprecated Use checkHeaderValidityWithCurrentCoordinates() instead for centralized coordinate management
     */
    checkHeaderValidityWithCoordinates: async function _checkHeaderValidityWithCoordinates(coordinates) {
      // Update the model with the new coordinates first
      this.setCurrentCoordinates(coordinates);
      return this.checkHeaderValidityWithCurrentCoordinates();
    },
    /**
     * Gets the import service instance
     */
    getImportService: function _getImportService() {
      return this.importService;
    },
    /**
     * Gets the util instance
     */
    getUtil: function _getUtil() {
      return this.util;
    },
    /**
     * Gets the dialog controller reference
     */
    getDialogController: function _getDialogController() {
      return this.dialogController;
    },
    getStepController: function _getStepController(stepName) {
      return this.stepControllers[stepName];
    },
    setWizardToSteps: function _setWizardToSteps(wizard) {
      if (this.stepControllers.uploadStep) {
        this.stepControllers.uploadStep.wizard = wizard;
      }
    },
    /**
     * Sets a wizard step control reference
     */
    setWizardStepControl: function _setWizardStepControl(stepName, stepControl) {
      this.wizardStepControls[stepName] = stepControl;
      // Also store in the steps map for backwards compatibility
      this.steps[stepName] = stepControl;
    },
    /**
     * Gets a wizard step control reference
     */
    getWizardStepControl: function _getWizardStepControl(stepName) {
      return this.wizardStepControls[stepName];
    },
    /**
     * Clears all wizard step control references
     */
    clearWizardStepControls: function _clearWizardStepControls() {
      this.wizardStepControls = {};
    },
    /**
     * Collects wizard step references
     */
    collectStepReferences: function _collectStepReferences(wizard) {
      if (!wizard) return;
      this.wizardStepControls = {};
      const wizardSteps = wizard.getSteps();
      for (const step of wizardSteps) {
        const customData = step.getCustomData();
        if (customData && customData.length > 0) {
          const stepName = customData[0].getValue();
          if (stepName) {
            // Use the unified method to store in both maps
            this.setWizardStepControl(stepName, step);
            Log.debug(`Collected step reference: ${stepName}`, undefined, 'Wizard');
          }
        }
      }
    },
    /**
     * Activate a step by building its UI if needed
     */
    activateStep: async function _activateStep(stepName) {
      // Find the step controller
      const stepController = this.getOrCreateStepController(stepName);
      if (!stepController) {
        Log.error(`Step controller for '${stepName}' not found`, undefined, 'Wizard');
        return;
      }

      // Find step container in the DOM
      const container = this.findStepContainer(stepName);
      if (!container) {
        Log.error(`Container for step '${stepName}' not found`, undefined, 'Wizard');
        return;
      }

      // Build the step UI if not already built
      if (!this.stepsBuilt.has(stepName)) {
        try {
          // Handle both async and sync build methods
          const buildResult = stepController.build(container);

          // If build returns a Promise, wait for it
          if (buildResult instanceof Promise) {
            await buildResult;
          }
          this.stepsBuilt.add(stepName);
        } catch (error) {
          Log.error(`Error building step '${stepName}'`, error, 'Wizard');
        }
      }
      return stepController;
    },
    /**
     * Get or create a specific step controller
     */
    getOrCreateStepController: function _getOrCreateStepController(stepName) {
      // Return existing controller if available
      if (this.stepControllers[stepName]) {
        return this.stepControllers[stepName];
      }

      // Create controller if needed
      if (stepName === 'uploadStep') {
        this.stepControllers[stepName] = new UploadStep(this, this.wizard, this.util);
        return this.stepControllers[stepName];
      } else if (stepName === 'headerSelectionStep' && this.rawSheetData) {
        this.stepControllers[stepName] = new HeaderSelectionStep(this);
        return this.stepControllers[stepName];
      } else if (stepName === 'messagesStep') {
        this.stepControllers[stepName] = new MessagesStep(this);
        return this.stepControllers[stepName];
      } else if (stepName === 'previewDataStep') {
        const coords = this.wizardModel.getProperty('/readSheetCoordinates') || 'A1';
        this.stepControllers[stepName] = new PreviewStep(this, this.workbook, this.sheetName, coords, this.processedData // Pass the complete processed data to the preview step
        );
        return this.stepControllers[stepName];
      }
      return null;
    },
    /**
     * Find the container for a specific step
     */
    findStepContainer: function _findStepContainer(stepName) {
      try {
        // Use the step reference to get the container
        const step = this.getWizardStepControl(stepName);
        if (!step) return null;

        // Get the container within the step
        const content = step.getContent();
        if (content && content.length > 0) {
          const vbox = content[0];
          if (vbox && vbox.getItems && vbox.getItems().length > 1) {
            return vbox.getItems()[1];
          }
        }
      } catch (error) {
        Log.error(`Error finding container for step ${stepName}`, error, 'Wizard');
      }
      return null;
    }
  });
  return Wizard;
});
