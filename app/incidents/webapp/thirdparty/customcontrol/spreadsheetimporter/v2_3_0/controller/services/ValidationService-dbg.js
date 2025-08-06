sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  /**
   * ValidationService handles all spreadsheet data validation.
   * This service can be used independently to validate data
   * without running the full import pipeline.
   *
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const ValidationService = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.ValidationService", {
    constructor: function _constructor(messageHandler, component) {
      ManagedObject.prototype.constructor.call(this);
      this.messageHandler = messageHandler;
      this.component = component;
    },
    /**
     * Validates spreadsheet data and returns validation result
     * @param spreadsheetData The data to validate
     * @param columnNames The column names from the spreadsheet
     * @param typeLabelList The metadata type/label mapping
     * @param odataKeyList List of OData key fields
     * @returns Object with validation result and messages
     */
    validateData: function _validateData(spreadsheetData, columnNames, typeLabelList, odataKeyList) {
      // Skip validation for standalone mode
      if (this.component.getStandalone()) {
        return {
          isValid: true,
          messages: []
        };
      }

      // Run all validation checks
      this.runValidationChecks(spreadsheetData, columnNames, typeLabelList, odataKeyList);

      // Get validation messages
      const messages = this.messageHandler.getMessages();
      const isValid = !this.messageHandler.areMessagesPresent();
      return {
        isValid,
        messages
      };
    },
    /**
     * Runs all validation checks
     */
    runValidationChecks: function _runValidationChecks(spreadsheetData, columnNames, typeLabelList, odataKeyList) {
      // Format validation
      this.messageHandler.checkFormat(spreadsheetData);

      // Mandatory fields validation
      this.messageHandler.checkMandatoryColumns(spreadsheetData, columnNames, odataKeyList, this.component.getMandatoryFields(), typeLabelList);

      // Duplicate columns check
      this.messageHandler.checkDuplicateColumns(columnNames);

      // Empty headers check
      if (!this.component.getSkipEmptyHeadersCheck()) {
        this.messageHandler.checkEmptyHeaders(spreadsheetData, columnNames);
      }

      // Max length check
      if (!this.component.getSkipMaxLengthCheck()) {
        this.messageHandler.checkMaxLength(spreadsheetData, typeLabelList, this.component.getFieldMatchType());
      }

      // Column names check
      if (!this.component.getSkipColumnsCheck()) {
        this.messageHandler.checkColumnNames(columnNames, this.component.getFieldMatchType(), typeLabelList);
      }
    },
    /**
     * Validates just the header row for quick feedback
     * @param columnNames The column names to validate
     * @param typeLabelList The metadata type/label mapping
     * @returns Object with validation result
     */
    validateHeaders: function _validateHeaders(columnNames, typeLabelList) {
      const issues = [];

      // Check for duplicate columns
      const duplicates = columnNames.filter((name, index) => columnNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        issues.push(`Duplicate columns: ${duplicates.join(', ')}`);
      }

      // Check for empty headers
      const emptyHeaders = columnNames.filter(name => !name || name.includes('__EMPTY'));
      if (emptyHeaders.length > 0) {
        issues.push('Empty column headers detected');
      }

      // Check if columns match expected fields
      if (!this.component.getSkipColumnsCheck()) {
        const fieldMatchType = this.component.getFieldMatchType();
        const unmatchedColumns = columnNames.filter(columnName => {
          if (!columnName || typeof columnName !== 'string') return false;
          let found = false;
          for (const [key, value] of typeLabelList) {
            if (fieldMatchType === 'label') {
              if (value.label === columnName) {
                found = true;
                break;
              }
            }
            if (fieldMatchType === 'labelTypeBrackets') {
              if (columnName.includes(`[${key}]`)) {
                found = true;
                break;
              }
            }
          }
          return !found;
        });
        if (unmatchedColumns.length > 0) {
          issues.push(`Unmatched columns: ${unmatchedColumns.join(', ')}`);
        }
      }
      return {
        isValid: issues.length === 0,
        issues
      };
    },
    /**
     * Clears all validation messages
     */
    clearMessages: function _clearMessages() {
      this.messageHandler.setMessages([]);
    },
    /**
     * Gets current validation messages
     */
    getMessages: function _getMessages() {
      return this.messageHandler.getMessages();
    },
    /**
     * Shows validation messages dialog
     */
    showMessages: async function _showMessages() {
      if (this.messageHandler.areMessagesPresent()) {
        await this.messageHandler.displayMessages();
      }
    }
  });
  return ValidationService;
});
