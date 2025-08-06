declare module "cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/MessagesStep" {
    import VBox from 'sap/m/VBox';
    import Wizard from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/Wizard';
    /**
     * MessagesStep – shows validation messages when there are errors but no header issues
     */
    export default class MessagesStep {
        readonly stepName = "messagesStep";
        private wizard;
        private isValidated;
        private messageView;
        private backButton;
        private isInitialBuildComplete;
        constructor(wizard: Wizard);
        build(container: VBox): void;
        /**
         * Performs the initial build of the step with all UI elements
         */
        private performInitialBuild;
        /**
         * Get strict mode setting from component
         */
        private getIsStrict;
        /**
         * Creates action buttons similar to MessagesDialog.fragment.xml
         */
        private createActionButtons;
        /**
         * Handler for Continue button press
         */
        private onContinue;
        /**
         * Handler for Download Errors button press
         */
        private onDownloadErrors;
        /**
         * Handler for Close button press
         */
        private onCloseMessages;
        /**
         * Validates this step and shows the next button
         */
        private validateStep;
        /**
         * Validates the step and returns whether it's ready for next step
         */
        validate(): boolean;
        /**
         * Sort messages by title (copied from MessageHandler)
         */
        private sortMessagesByTitle;
        /**
         * Get dialog state based on message severity (adapted from MessageHandler)
         */
        private getDialogState;
        /**
         * Updates only the message data without rebuilding the entire UI
         */
        private updateMessageData;
    }
}
//# sourceMappingURL=MessagesStep.d.ts.map