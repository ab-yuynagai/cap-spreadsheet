declare module "cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/HeaderSelectionStep" {
    import VBox from 'sap/m/VBox';
    import Wizard from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/Wizard';
    /**
     * HeaderSelectionStep – lets user pick the header row from the sheet preview.
     */
    export default class HeaderSelectionStep {
        readonly stepName = "headerSelectionStep";
        private wizard;
        private isValidated;
        constructor(wizard: Wizard);
        build(container: VBox): void;
        /**
         * Handles header selection with validation and automatic step navigation
         */
        private handleHeaderSelection;
        /**
         * Validates this step and shows the next button
         */
        private validateStep;
        /**
         * Creates a table for header selection
         */
        private createHeaderSelectionTable;
    }
}
//# sourceMappingURL=HeaderSelectionStep.d.ts.map