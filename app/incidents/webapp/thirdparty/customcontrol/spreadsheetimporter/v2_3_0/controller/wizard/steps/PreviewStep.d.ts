declare module "cc/spreadsheetimporter/v2_3_0/controller/wizard/steps/PreviewStep" {
    import VBox from 'sap/m/VBox';
    import Wizard from 'cc/spreadsheetimporter/v2_3_0/controller/wizard/Wizard';
    import * as XLSX from 'xlsx';
    /**
     * PreviewStep – shows a preview table with the parsed data.
     */
    export default class PreviewStep {
        readonly stepName = "previewDataStep";
        private wizard;
        private workbook;
        private sheetName;
        private processedData;
        private container;
        constructor(wizard: Wizard, workbook: XLSX.WorkBook, sheetName: string, a1Coordinates: string, processedData?: any);
        build(container: VBox, processedData?: any): Promise<void>;
        /**
         * Rebuilds the preview table with optional new data
         * This is now just a convenience method that calls build()
         */
        rebuildTable(newProcessedData?: any): Promise<void>;
        /**
         * Updates the step with new data and rebuilds the table
         */
        updateData(workbook?: XLSX.WorkBook, sheetName?: string, a1Coordinates?: string, processedData?: any): Promise<void>;
        /**
         * Create preview table from processed data with enriched information
         */
        private createProcessedDataPreview;
        /**
         * Creates a preview table for data with the selected header row
         */
        private createDataPreviewTable;
    }
}
//# sourceMappingURL=PreviewStep.d.ts.map