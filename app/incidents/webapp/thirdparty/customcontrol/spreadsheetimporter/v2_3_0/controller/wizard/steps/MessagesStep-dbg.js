sap.ui.define(["sap/m/MessageView", "sap/m/MessageItem", "sap/m/Button", "sap/m/FlexBox", "sap/m/FlexItemData", "sap/ui/core/IconPool", "sap/base/Log", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "sap/ui/core/library"], function (MessageView, MessageItem, Button, FlexBox, FlexItemData, IconPool, Log, JSONModel, MessageToast, sap_ui_core_library) {
  "use strict";

  const ValueState = sap_ui_core_library["ValueState"];
  /**
   * MessagesStep – shows validation messages when there are errors but no header issues
   */
  class MessagesStep {
    stepName = 'messagesStep';
    isValidated = false;
    isInitialBuildComplete = false;
    constructor(wizard) {
      this.wizard = wizard;
    }
    build(container) {
      // Unvalidate step initially
      this.isValidated = false;
      this.wizard.getStep('messagesStep')?.setValidated(false);

      // Get message handler from Wizard
      const messageHandler = this.wizard.getDialogController()?.messageHandler;
      if (!messageHandler) {
        Log.error('Message handler not found', undefined, 'MessagesStep');
        return;
      }

      // Check if this is the initial build or a rebuild
      if (!this.isInitialBuildComplete) {
        // Initial build - create all UI elements
        this.performInitialBuild(container, messageHandler);
        this.isInitialBuildComplete = true;
      } else {
        // Rebuild - only update the message data
        this.updateMessageData(messageHandler);
      }
      Log.debug('MessagesStep built with validation messages', undefined, 'MessagesStep');
    }

    /**
     * Performs the initial build of the step with all UI elements
     */
    performInitialBuild(container, messageHandler) {
      // Clear existing content
      container.removeAllItems();

      // Create message template first
      const messageTemplate = new MessageItem({
        type: '{ui5type}',
        title: '{title}',
        description: '{description}',
        subtitle: '{subtitle}',
        counter: '{counter}'
      });

      // Create back button similar to the sample
      this.backButton = new Button({
        icon: IconPool.getIconURI('nav-back'),
        visible: false,
        press: () => {
          this.messageView.navigateBack();
          this.backButton.setVisible(false);
        }
      });

      // Create message view with proper binding - following the sample pattern
      this.messageView = new MessageView({
        itemSelect: () => {
          this.backButton.setVisible(true);
        },
        items: {
          path: '/',
          template: messageTemplate
        },
        layoutData: new FlexItemData({
          growFactor: 1
        })
      });

      // Create info model
      const infoModel = new JSONModel({
        dialogState: this.getDialogState(messageHandler.getMessages()),
        strict: this.getIsStrict(),
        strictParameter: false
      });

      // Create messages model
      const messagesModel = messageHandler.getGroupedSortedJsonModelMessages();

      // Debug: Log the data to see what we have
      Log.debug('MessagesStep: Messages data', undefined, 'MessagesStep', () => JSON.stringify(messagesModel.getData()));

      // Set models - MessageView gets the messages model directly
      this.messageView.setModel(messagesModel);
      container.setModel(infoModel, 'info');

      // Set i18n model if not already set
      if (!container.getModel('i18n')) {
        const componentI18n = this.wizard.getDialogController()?.componentI18n;
        if (componentI18n) {
          container.setModel(componentI18n, 'i18n');
          this.messageView.setModel(componentI18n, 'i18n');
        }
      }
      const parent = container.getParent();
      if (parent) {
        parent.addItem(this.messageView);
      }

      // Add back button and message view to container
      // container.addItem(this.backButton);

      // Create action buttons
      const buttonContainer = this.createActionButtons();
      container.addItem(buttonContainer);
      Log.debug('MessagesStep built with validation messages', undefined, 'MessagesStep');
    }

    /**
     * Get strict mode setting from component
     */
    getIsStrict() {
      return this.wizard.getWizardModel().getProperty('/strict') || false;
    }

    /**
     * Creates action buttons similar to MessagesDialog.fragment.xml
     */
    createActionButtons() {
      const util = this.wizard.getUtil();
      const buttonContainer = new FlexBox({
        justifyContent: 'End',
        alignItems: 'Center',
        wrap: 'Wrap'
      });

      // Add style class separately
      buttonContainer.addStyleClass('sapUiSmallMarginTop');

      // Continue button (only if not in strict mode)
      const continueButton = new Button({
        text: "{= ${info>/dialogState} === 'Error' ? ${i18n>spreadsheetimporter.messageDialogButtonContinueAnyway} : ${i18n>spreadsheetimporter.messageDialogButtonContinue} }",
        type: 'Emphasized',
        visible: '{= !${info>/strict} && !${info>/strictParameter}}',
        press: () => this.onContinue()
      });

      // Download errors button
      const downloadButton = new Button({
        text: '{i18n>spreadsheetimporter.downloadButton}',
        press: () => this.onDownloadErrors()
      });
      buttonContainer.addItem(continueButton);
      buttonContainer.addItem(downloadButton);
      return buttonContainer;
    }

    /**
     * Handler for Continue button press
     */
    onContinue() {
      try {
        // Mark step as validated to allow navigation to next step
        this.isValidated = true;
        this.validateStep(true);
        this.wizard.setUploadButtonEnabled(true);
        this.wizard.getWizardModel().setProperty('/forceUpload', true);
        const messageStep = this.wizard.getStep('messagesStep');
        const previewStep = this.wizard.getStep('previewDataStep');
        if (messageStep && previewStep && messageStep.getNextStep() !== previewStep.getId()) {
          messageStep.setNextStep(previewStep);
        }

        // Rebuild preview step
        const previewStepControl = this.wizard.getStepControl('previewDataStep');
        previewStepControl.build(this.wizard.findStepContainer('previewDataStep'), this.wizard.processedData);
        this.wizard.wizard.nextStep();
      } catch (error) {
        Log.error('Error in MessagesStep continue action', error, 'MessagesStep');
      }
    }

    /**
     * Handler for Download Errors button press
     */
    onDownloadErrors() {
      try {
        // Get message handler from Wizard and trigger download
        const messageHandler = this.wizard.getDialogController()?.messageHandler;
        if (messageHandler && typeof messageHandler.onDownloadErrors === 'function') {
          messageHandler.onDownloadErrors();
        } else {
          const downloadMessage = this.wizard.getUtil().geti18nText('spreadsheetimporter.downloadNotAvailable') || 'Download functionality not available';
          MessageToast.show(downloadMessage);
        }
        Log.debug('MessagesStep: Download errors triggered', undefined, 'MessagesStep');
      } catch (error) {
        Log.error('Error downloading errors from MessagesStep', error, 'MessagesStep');
      }
    }

    /**
     * Handler for Close button press
     */
    onCloseMessages() {
      try {
        // Close the wizard dialog
        const dialogController = this.wizard.getDialogController();
        if (dialogController && typeof dialogController.onWizardCancel === 'function') {
          dialogController.onWizardCancel();
        }
        Log.debug('MessagesStep: Wizard closed from messages step', undefined, 'MessagesStep');
      } catch (error) {
        Log.error('Error closing wizard from MessagesStep', error, 'MessagesStep');
      }
    }

    /**
     * Validates this step and shows the next button
     */
    validateStep(validated) {
      try {
        // Get the wizard step control and set it as validated
        const messagesStepControl = this.wizard.getStep('messagesStep');
        if (messagesStepControl) {
          messagesStepControl.setValidated(validated);
          Log.debug('MessagesStep validation state changed', undefined, 'MessagesStep');
        }
      } catch (error) {
        Log.error('Error validating MessagesStep', error, 'MessagesStep');
      }
    }

    /**
     * Validates the step and returns whether it's ready for next step
     */
    validate() {
      return this.isValidated;
    }

    /**
     * Sort messages by title (copied from MessageHandler)
     */
    sortMessagesByTitle(messages) {
      return messages.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    }

    /**
     * Get dialog state based on message severity (adapted from MessageHandler)
     */
    getDialogState(messages) {
      if (!messages || messages.length === 0) {
        return ValueState.None;
      }

      // Check for error messages
      if (messages.some(msg => msg.ui5type === 'Error')) {
        return ValueState.Error;
      }

      // Check for warning messages
      if (messages.some(msg => msg.ui5type === 'Warning')) {
        return ValueState.Warning;
      }

      // Check for information messages
      if (messages.some(msg => msg.ui5type === 'Information')) {
        return ValueState.Information;
      }

      // Check for success messages
      if (messages.some(msg => msg.ui5type === 'Success')) {
        return ValueState.Success;
      }
      return ValueState.None;
    }

    /**
     * Updates only the message data without rebuilding the entire UI
     */
    updateMessageData(messageHandler) {
      // Create messages model
      const messagesModel = messageHandler.getGroupedSortedJsonModelMessages();

      // Debug: Log the data to see what we have
      Log.debug('MessagesStep: Updated messages data', undefined, 'MessagesStep', () => JSON.stringify(messagesModel.getData()));

      // Update the MessageView model
      this.messageView.setModel(messagesModel);

      // Update info model for button states
      const infoModel = new JSONModel({
        dialogState: this.getDialogState(messageHandler.getMessages()),
        strict: this.getIsStrict(),
        strictParameter: false
      });

      // Update info model on container
      const container = this.messageView.getParent();
      if (container) {
        container.setModel(infoModel, 'info');
      }
    }
  }
  return MessagesStep;
});
