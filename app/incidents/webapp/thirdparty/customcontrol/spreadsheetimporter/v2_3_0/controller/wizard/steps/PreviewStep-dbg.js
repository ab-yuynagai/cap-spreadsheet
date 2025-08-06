sap.ui.define(["sap/m/MessageStrip", "sap/base/Log"], function (MessageStrip, Log) {
  "use strict";

  /**
   * PreviewStep – shows a preview table with the parsed data.
   */
  class PreviewStep {
    stepName = 'previewDataStep';
    // Store container reference for rebuilding

    constructor(wizard, workbook, sheetName, a1Coordinates, processedData) {
      this.wizard = wizard;
      this.workbook = workbook;
      this.sheetName = sheetName;
      this.processedData = processedData;

      // Set coordinates in the centralized model if provided
      if (a1Coordinates) {
        this.wizard.setCurrentCoordinates(a1Coordinates);
      }
    }
    async build(container, processedData) {
      // Store container reference and optionally update data
      this.container = container;
      if (processedData) {
        // Update coordinates in the centralized model if provided
        if (processedData.coordinates) {
          this.wizard.setCurrentCoordinates(processedData.coordinates);
        }
        this.workbook = processedData.workbook;
        this.sheetName = processedData.sheetName;
        this.processedData = processedData;
      }
      Log.debug('Building/rebuilding preview step', undefined, 'PreviewStep');

      // Clear existing content
      container.removeAllItems();
      try {
        // Show either the comprehensive data or basic preview
        let previewContent;
        if (this.processedData && this.processedData.payloadArray) {
          // Create preview from processed data
          previewContent = this.createProcessedDataPreview();
        } else {
          // Fallback to basic preview - now using centralized coordinates
          previewContent = await this.createDataPreviewTable(this.workbook, this.sheetName, this.wizard.getCurrentCoordinates(), true // Enable validation
          );
        }
        if (previewContent) {
          container.addItem(previewContent);
        }
        Log.debug('Preview step built/rebuilt successfully', undefined, 'PreviewStep');
      } catch (error) {
        // Add an error message to the container
        const errorMessage = error instanceof Error ? error.message : String(error);
        container.addItem(new MessageStrip({
          text: 'Error creating preview: ' + errorMessage,
          type: 'Error',
          showIcon: true
        }));
        Log.error('Error building/rebuilding preview step', error, 'PreviewStep');
      }
    }

    /**
     * Rebuilds the preview table with optional new data
     * This is now just a convenience method that calls build()
     */
    async rebuildTable(newProcessedData) {
      if (!this.container) {
        Log.warning('Container not available for table rebuild', undefined, 'PreviewStep');
        return;
      }
      await this.build(this.container, newProcessedData);
    }

    /**
     * Updates the step with new data and rebuilds the table
     */
    async updateData(workbook, sheetName, a1Coordinates, processedData) {
      // Update properties if provided
      if (workbook) this.workbook = workbook;
      if (sheetName) this.sheetName = sheetName;
      if (a1Coordinates) this.wizard.setCurrentCoordinates(a1Coordinates);
      if (processedData) this.processedData = processedData;
    }

    /**
     * Create preview table from processed data with enriched information
     */
    createProcessedDataPreview() {
      // Get processed data from ImportService
      const data = this.processedData.payloadArray || this.processedData.payload;

      // Use the processed data to create a table with advanced features
      // The data here is already parsed according to field types and validated
      return this.wizard.previewHandler.createDynamicTable(data, new Map(), []);
    }

    /**
     * Creates a preview table for data with the selected header row
     */
    async createDataPreviewTable(workbook, sheetName, coordinates, validate = false) {
      try {
        if (!workbook || !sheetName || !coordinates) {
          Log.error('Missing parameters for data preview', undefined, 'PreviewStep');
          return null;
        }

        // Use ImportService's pipeline to get consistent data processing
        const result = await this.wizard.getImportService().processAndValidate(workbook, sheetName, coordinates, {
          resetMessages: false,
          validate: validate
        });

        // Get the appropriate data from result
        // If validation ran, use payloadArray (processed data)
        // Otherwise use the raw data
        const data = validate && result.payloadArray ? result.payloadArray : result.spreadsheetSheetsData;

        // Use the Preview's createDynamicTable to create a table
        return this.wizard.previewHandler.createDynamicTable(data, new Map(), []);
      } catch (error) {
        Log.error('Error creating data preview', error, 'PreviewStep');
        return null;
      }
    }
  }
  return PreviewStep;
});
