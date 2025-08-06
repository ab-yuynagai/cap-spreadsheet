declare module "cc/spreadsheetimporter/v2_3_0/controller/wizard/Wizard" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import JSONModel from 'sap/ui/model/json/JSONModel';
    import * as XLSX from 'xlsx';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import Preview from 'cc/spreadsheetimporter/v2_3_0/controller/Preview';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import ImportService from 'cc/spreadsheetimporter/v2_3_0/controller/ImportService';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import UploadStep from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/UploadStep';
    import HeaderSelectionStep from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/HeaderSelectionStep';
    import PreviewStep from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/PreviewStep';
    import MessagesStep from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/MessagesStep';
    import WizardControl from 'sap/m/Wizard';
    import VBox from 'sap/m/VBox';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class Wizard extends ManagedObject {
        /**
         * Wizard contains utility methods for the wizard functionality,
         * extracted from WizardDialog to separate data processing from UI.
         *
         * This class handles:
         * - Step management (creation, configuration, visibility)
         * - Table data preparation
         * - Header row selection
         * - File processing
         * - Workbook and sheet handling
         */
        private component;
        private util;
        previewHandler: Preview;
        private messageHandler;
        private importService;
        protected resourceBundle: ResourceBundle;
        private spreadsheetUploadController;
        wizard: WizardControl;
        private stepControllers;
        private steps;
        private wizardStepControls;
        stepsBuilt: Set<string>;
        private wizardModel;
        private stepDefinitions;
        workbook: XLSX.WorkBook;
        sheetName: string;
        rawSheetData: any[][];
        processedData: any;
        currentFile: File | null;
        private dialogController;
        /**
         * Creates a new instance of Wizard
         */
        constructor(component: Component, resourceBundle: ResourceBundle, messageHandler: MessageHandler, spreadsheetUploadController: SpreadsheetUpload, dialogController: any);
        /**
         * Gets the wizard model
         */
        getWizardModel(): JSONModel;
        /**
         * Gets step definitions
         */
        getStepDefinitions(): Array<{
            stepName: string;
            index: number;
        }>;
        createUploadStep(): UploadStep;
        createHeaderSelectionStep(): HeaderSelectionStep;
        createPreviewStep(): PreviewStep;
        createMessagesStep(): MessagesStep;
        /**
         * Configures the step sequence in the wizard using the setNextStep approach
         */
        configureStepSequence(wizard: any): void;
        /**
         * Gets the first step in the sequence based on configuration
         */
        getFirstStep(): string;
        getStep(stepName: string): any;
        /**
         * Sets a UI5 WizardStep control reference
         */
        setStepControl(stepName: string, stepControl: any): void;
        /**
         * Gets a UI5 WizardStep control reference
         */
        getStepControl(stepName: string): any;
        /**
         * Gets the step index in the sequence
         */
        getStepIndex(stepName: string): number;
        /**
         * Sets data from a file upload
         */
        setFileData(file: File, processedData: any): void;
        /**
         * Gets the current coordinates from the wizard model
         */
        getCurrentCoordinates(): string;
        resetCurrentCoordinates(): void;
        /**
         * Sets the coordinates in the wizard model
         */
        setCurrentCoordinates(coordinates: string, objectCoordinates?: any): void;
        /**
         * Gets the current object coordinates from the wizard model
         */
        getCurrentObjectCoordinates(): any;
        /**
         * Reprocesses the file data with the currently selected coordinates from the model
         */
        reprocessWithCurrentCoordinates(): Promise<any>;
        /**
         * Checks if headers are valid using the current coordinates from the model
         */
        checkHeaderValidityWithCurrentCoordinates(): Promise<{
            isValid: boolean;
            messages?: any[];
        }>;
        /**
         * Gets workbook data
         */
        getWorkbookData(): {
            workbook: XLSX.WorkBook;
            sheetName: string;
            rawSheetData: any[][];
        } | null;
        /**
         * Gets processed data
         */
        getProcessedData(): any;
        /**
         * Gets the current file
         */
        getCurrentFile(): File | null;
        /**
         * Sets the upload button enabled state directly
         */
        setUploadButtonEnabled(enabled: boolean): void;
        /**
         * Resets all wizard data including coordinates
         */
        reset(): void;
        /**
         * Prepares data for a table by transforming the raw data into a structured format
         */
        prepareTableData(rawData: any[][], startIndex?: number, endIndex?: number): {
            data: any[];
            columns: any[];
            maxColumns: number;
        };
        /**
         * Calculates the read coordinates when a header row is selected and updates the model
         */
        calculateAndSetReadCoordinates(selectedRowIndex: number, rowData: any, totalRows: number): {
            a1Coordinates: string;
            objectCoordinates: any;
        } | null;
        /**
         * @deprecated Use calculateAndSetReadCoordinates() instead for centralized coordinate management
         */
        calculateReadCoordinates(selectedRowIndex: number, rowData: any, totalRows: number): {
            a1Coordinates: string;
            objectCoordinates: any;
        };
        /**
         * Processes a file using ImportService's enhanced methods with current coordinates
         */
        processFileWithCurrentCoordinates(file: Blob, validate?: boolean, showMessages?: boolean): Promise<any>;
        /**
         * Processes a file using ImportService's enhanced methods
         */
        processFile(file: Blob, coordinates?: string, validate?: boolean, showMessages?: boolean): Promise<any>;
        /**
         * Reprocesses the file data with the selected coordinates
         * @deprecated Use reprocessWithCurrentCoordinates() instead for centralized coordinate management
         */
        reprocessWithCoordinates(coordinates: string): Promise<any>;
        /**
         * Checks if headers are valid using the given coordinates
         * @deprecated Use checkHeaderValidityWithCurrentCoordinates() instead for centralized coordinate management
         */
        checkHeaderValidityWithCoordinates(coordinates: string): Promise<{
            isValid: boolean;
            messages?: any[];
        }>;
        /**
         * Gets the import service instance
         */
        getImportService(): ImportService;
        /**
         * Gets the util instance
         */
        getUtil(): Util;
        /**
         * Gets the dialog controller reference
         */
        getDialogController(): any;
        getStepController(stepName: string): any;
        setWizardToSteps(wizard: WizardControl): void;
        /**
         * Sets a wizard step control reference
         */
        setWizardStepControl(stepName: string, stepControl: any): void;
        /**
         * Gets a wizard step control reference
         */
        getWizardStepControl(stepName: string): any;
        /**
         * Clears all wizard step control references
         */
        clearWizardStepControls(): void;
        /**
         * Collects wizard step references
         */
        collectStepReferences(wizard: any): void;
        /**
         * Activate a step by building its UI if needed
         */
        activateStep(stepName: string): Promise<UploadStep | HeaderSelectionStep | MessagesStep | PreviewStep>;
        /**
         * Get or create a specific step controller
         */
        getOrCreateStepController(stepName: string): any;
        /**
         * Find the container for a specific step
         */
        findStepContainer(stepName: string): VBox | null;
    }
}
//# sourceMappingURL=Wizard.d.ts.map