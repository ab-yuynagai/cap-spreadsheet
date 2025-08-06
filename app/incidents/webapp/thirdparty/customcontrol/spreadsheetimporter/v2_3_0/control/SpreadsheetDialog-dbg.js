sap.ui.define(["sap/m/Dialog", "../enums", "./SpreadsheetDialogRenderer", "../controller/services/TextToWorkbookService", "sap/m/MessageToast", "sap/base/Log"], function (Dialog, ___enums, __SpreadsheetDialogRenderer, __TextToWorkbookService, MessageToast, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const AvailableOptions = ___enums["AvailableOptions"];
  const SpreadsheetDialogRenderer = _interopRequireDefault(__SpreadsheetDialogRenderer);
  const TextToWorkbookService = _interopRequireDefault(__TextToWorkbookService);
  /**
   * Constructor for a new <code>cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog</code> control.
   *
   * Some class description goes here.
   * @extends Dialog
   *
   * @constructor
   * @public
   * @name cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog
   */
  const SpreadsheetDialog = Dialog.extend("cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog", {
    renderer: SpreadsheetDialogRenderer,
    metadata: {
      properties: {
        decimalSeparator: {
          type: 'string'
        },
        availableOptions: {
          type: 'string[]'
        },
        component: {
          type: 'object'
        }
      },
      events: {
        fileDrop: {
          parameters: {
            files: {
              type: 'object[]'
            }
          }
        },
        dataPaste: {
          parameters: {
            workbook: {
              type: 'object'
            },
            type: {
              type: 'string'
            },
            originalData: {
              type: 'string'
            }
          }
        },
        decimalSeparatorChanged: {
          parameters: {
            decimalSeparator: {
              type: 'string'
            }
          }
        },
        availableOptionsChanged: {
          parameters: {
            availableOptions: {
              type: 'string[]'
            }
          }
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Dialog.prototype.constructor.call(this, id, settings);
      this._onPaste = event => this.handlePaste(event);
      this.dropMessageShown = false;
      this.textToWorkbookService = new TextToWorkbookService();
    },
    onAfterRendering: function _onAfterRendering(event) {
      Dialog.prototype.onAfterRendering.call(this, event);
      const domRef = this.getDomRef();

      // Drag and drop events
      domRef.addEventListener('dragover', this.handleDragOver.bind(this), false);
      domRef.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
      domRef.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
      domRef.addEventListener('drop', this.handleFileDrop.bind(this), false);

      // Paste events - use stable handler reference on DOM element
      domRef.addEventListener('paste', this._onPaste);
    },
    handleDragOver: function _handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'copy';
      if (!this.dropMessageShown) {
        this.showDropMessage(true);
      }
    },
    handleDragLeave: function _handleDragLeave(event) {
      // Check if the drag is actually leaving the dialog, not just moving between children
      if (!event.currentTarget.contains(event.relatedTarget)) {
        this.showDropMessage(false);
      }
    },
    handleFileDrop: function _handleFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      this.showDropMessage(false);
      const files = event.dataTransfer.files;
      this.fireFileDrop({
        files: files
      });
    },
    handleDragEnter: function _handleDragEnter(event) {},
    /**
     * Handle paste events - improved with better guards and busy state
     * @param event - Browser paste event
     */
    handlePaste: async function _handlePaste(event) {
      const clipboardEvent = event;

      // Early-exit guard order (check cheap conditions first)
      if (!this.isOpen() || !clipboardEvent.isTrusted) {
        return;
      }
      const clipboardData = clipboardEvent.clipboardData;
      if (!clipboardData) {
        return;
      }

      // Check if this dialog should handle the paste
      const dialogDomRef = this.getDomRef();
      const activeElement = document.activeElement;

      // Only handle if the paste is relevant to our dialog
      if (!dialogDomRef || !dialogDomRef.contains(activeElement)) {
        return;
      }

      // Prevent default paste behavior and stop immediate propagation
      clipboardEvent.preventDefault();
      clipboardEvent.stopImmediatePropagation();
      try {
        // Show busy indicator for large data processing
        this.setBusy(true);

        // Show processing message
        const resourceBundle = this.getModel('i18n')?.getResourceBundle();
        if (resourceBundle) {
          MessageToast.show(resourceBundle.getText('spreadsheetimporter.pasteDetected'));
        }

        // Process clipboard data using the service
        const result = await this.textToWorkbookService.processClipboardData(clipboardData);
        if (result.workbook) {
          // Get original data for debugging/logging purposes
          let originalData = '';
          if (result.type === 'text') {
            originalData = clipboardData.getData('text/plain');
          } else if (result.type === 'file') {
            const files = clipboardData.files;
            originalData = files.length > 0 ? files[0].name : '';
          }

          // Fire the dataPaste event
          this.fireDataPaste({
            workbook: result.workbook,
            type: result.type,
            originalData: originalData
          });

          // Show success message
          if (resourceBundle) {
            const messageKey = result.type === 'file' ? 'spreadsheetimporter.pasteFileSuccess' : 'spreadsheetimporter.pasteTextSuccess';
            MessageToast.show(resourceBundle.getText(messageKey));
          }
        } else {
          // Show error message - no valid data found
          if (resourceBundle) {
            MessageToast.show(resourceBundle.getText('spreadsheetimporter.pasteNoData'));
          }
        }
      } catch (error) {
        Log.error('Error handling paste event', error, 'SpreadsheetDialog');

        // Check for specific error types
        const resourceBundle = this.getModel('i18n')?.getResourceBundle();
        if (resourceBundle) {
          const errorMessage = error.message;
          if (errorMessage === 'pasteTooLarge') {
            MessageToast.show(resourceBundle.getText('spreadsheetimporter.pasteTooLarge'));
          } else {
            MessageToast.show(resourceBundle.getText('spreadsheetimporter.pasteError'));
          }
        }
      } finally {
        this.setBusy(false);
      }
    },
    showDropMessage: function _showDropMessage(show) {
      // Ensure the current state matches the desired visibility
      if (this.dropMessageShown === show) {
        return; // No change is needed if the state is already correct
      }
      let dropMessage = this.getDomRef().querySelector('.drop-message');
      if (!dropMessage) {
        // Create the message element if it doesn't exist
        dropMessage = document.createElement('div');
        dropMessage.className = 'drop-message';
        dropMessage.textContent = this.getModel('i18n').getResourceBundle().getText('spreadsheetimporter.dropMessage');
        this.getDomRef().appendChild(dropMessage);
      }

      // Toggle visibility class based on the 'show' parameter
      dropMessage.classList.toggle('visible', show);
      // Update the flag to reflect the new state
      this.dropMessageShown = show;
    },
    setDecimalSeparator: function _setDecimalSeparator(sDecimalSeparator) {
      if (sDecimalSeparator === ',' || sDecimalSeparator === '.') {
        this.setProperty('decimalSeparator', sDecimalSeparator);
        this.fireDecimalSeparatorChanged({
          decimalSeparator: sDecimalSeparator
        });
        return this;
      } else {
        throw new Error("Decimal separator must be either ',' or '.'");
      }
    },
    setAvailableOptions: function _setAvailableOptions(aAvailableOptions) {
      for (let option of aAvailableOptions) {
        if (!Object.values(AvailableOptions).includes(option)) {
          throw new Error('Invalid option: ' + option);
        }
      }
      this.setProperty('availableOptions', aAvailableOptions);
      this.fireAvailableOptionsChanged({
        availableOptions: aAvailableOptions
      });
      return this;
    },
    /**
     * Fire the dataPaste event
     * @param parameters - Event parameters
     * @returns this
     */
    fireDataPaste: function _fireDataPaste(parameters) {
      return this.fireEvent('dataPaste', parameters);
    },
    exit: function _exit() {
      // Remove event listeners to clean up
      const domRef = this.getDomRef();
      if (domRef) {
        domRef.removeEventListener('dragover', this.handleDragOver.bind(this), false);
        domRef.removeEventListener('dragleave', this.handleDragLeave.bind(this), false);
        domRef.removeEventListener('drop', this.handleFileDrop.bind(this), false);

        // Remove paste event listener using stable reference
        domRef.removeEventListener('paste', this._onPaste);
      }

      // Clean up the drop message element if needed
      let dropMessage = domRef?.querySelector('.drop-message');
      if (dropMessage) {
        dropMessage.remove();
      }
      this.dropMessageShown = false; // Reset visibility flag
      Dialog.prototype.exit.call(this);
    }
  });
  return SpreadsheetDialog;
});
