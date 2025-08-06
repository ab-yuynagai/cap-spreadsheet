declare module "cc/spreadsheetimporter/v2_3_0/controller/dialog/WizardDialog" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import SpreadsheetDialog from 'cc/spreadsheetimporter/v2_3_0/control/SpreadsheetDialog';
    import { SpreadsheetDialog$FileDropEvent, SpreadsheetDialog$DataPasteEvent } from '../../control/SpreadsheetDialog';
    import WizardControl, { Wizard$StepActivateEvent } from 'sap/m/Wizard';
    import ResourceModel from 'sap/ui/model/resource/ResourceModel';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class WizardDialog extends ManagedObject {
        /**
         * WizardDialog orchestrates the wizard steps for the import process.
         * It manages the dialog lifecycle, step navigation, and coordination between steps.
         */
        private dialog;
        private component;
        private spreadsheetUploadController;
        private wizard;
        private wizardController;
        private util;
        private resolvePromise;
        private rejectPromise;
        private componentI18n;
        private messageHandler;
        private importService;
        private odataHandler;
        private templateService;
        /**
         * Creates a new instance of WizardDialog
         */
        constructor(spreadsheetUploadController: SpreadsheetUpload, component: Component, componentI18n: ResourceModel, messageHandler: MessageHandler);
        /**
         * Opens the match wizard dialog
         */
        openWizard(): Promise<void>;
        /**
         * Creates the wizard dialog
         */
        private createDialog;
        /**
         * Navigate to a specific step in the wizard
         */
        private navigateToStep;
        /**
         * Handler for wizard step change
         */
        onWizardStepChanged(event: Wizard$StepActivateEvent): Promise<void>;
        /**
         * Handler for wizard completion
         */
        onWizardComplete(): void;
        /**
         * Handler for wizard finish button
         */
        onWizardFinish(): Promise<void>;
        /**
         * Handler for wizard cancel button
         */
        onWizardCancel(): void;
        /**
         * Handler for wizard dialog close
         */
        onWizardClose(): void;
        /**
         * Reset dialog content and resources
         */
        resetContent(): void;
        /**
         * Set busy state on dialog
         */
        setBusy(state: boolean): void;
        /**
         * Gets the wizard control instance
         */
        getWizard(): WizardControl;
        /**
         * Properly destroy this controller instance
         */
        destroy(): void;
        /**
         * Handler for file drop event from drag and drop
         */
        onFileDrop(event: SpreadsheetDialog$FileDropEvent): void;
        /**
         * Handle file from drag and drop
         */
        private handleFileFromDrop;
        /**
         * Handler for file upload event from the fragment
         * Delegates to the UploadStep controller
         */
        onFileUpload(event: any): Promise<void>;
        setODataHandler(odataHandler: OData): void;
        getDialog(): SpreadsheetDialog;
        /**
         * Formatter for simple action text display
         * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
         * @param {string} createText - i18n text for create action
         * @param {string} updateText - i18n text for update action
         * @param {string} deleteText - i18n text for delete action
         * @param {string} upsertText - i18n text for upsert action
         * @returns {string} Simple action title
         */
        formatSimpleActionText(action: string, createText: string, updateText: string, deleteText: string, upsertText: string): string;
        /**
         * Template download handler using TemplateService
         */
        onTempDownload(): Promise<void>;
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
        formatActionText(action: string, createText: string, updateText: string, deleteText: string, upsertText: string, createDesc: string, updateDesc: string, deleteDesc: string, upsertDesc: string): string;
        /**
         * Handler for data paste event
         * Only allows paste functionality when on the upload step
         */
        onDataPaste(event: SpreadsheetDialog$DataPasteEvent): void;
        /**
         * Handle workbook from paste functionality
         */
        private handleWorkbookFromPaste;
        /**
         * Create steps controllers - moved from UploadStep
         */
        private createStepsControllers;
    }
}
//# sourceMappingURL=WizardDialog.d.ts.map