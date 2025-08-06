declare module "cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/UploadStep" {
    import VBox from 'sap/m/VBox';
    import WizardController from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/Wizard';
    import Wizard from 'sap/m/Wizard';
    /**
     * UploadStep – first wizard step where the user selects the spreadsheet file.
     *
     * This step handles file upload, processes the file, and manages wizard navigation.
     */
    export default class UploadStep {
        readonly stepName = "uploadStep";
        private wizardController;
        wizard: Wizard;
        private util;
        constructor(wizardController: WizardController, wizard?: Wizard, util?: any);
        /** Build method - The UI is already defined in the fragment */
        build(container: VBox): void;
        validate(): boolean;
        /**
         * Handle file upload from FileUploader
         */
        onFileUpload(event: any): Promise<void>;
        /**
         * Reset the wizard progress to avoid circular references when uploading a new file
         */
        private resetWizardProgress;
        /**
         * Process the file and handle wizard navigation
         */
        private processFileAndNavigate;
        private createStepsControllers;
    }
}
//# sourceMappingURL=UploadStep.d.ts.map