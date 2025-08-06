declare module "cc/spreadsheetimporter/v2_3_0/controller/services/FileService" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import * as XLSX from 'xlsx';
    /**
     * FileService handles all file and workbook related operations.
     * This includes reading files, creating workbooks, and sheet selection.
     *
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class FileService extends ManagedObject {
        /**
         * Reads a file and returns an XLSX workbook
         * @param file The file to read
         * @returns Promise resolving to the workbook
         */
        readFile(file: Blob): Promise<XLSX.WorkBook>;
        /**
         * Gets the sheet name based on options
         * @param workbook The workbook
         * @param sheetOption Sheet index, name, or "XXSelectorXX" for dialog
         * @param i18nBundle Resource bundle for dialog texts
         * @returns Promise resolving to sheet name
         */
        static getSheetName(workbook: XLSX.WorkBook, sheetOption: string | number, i18nBundle?: any): Promise<string>;
        /**
         * Gets raw sheet data as array of arrays
         * @param workbook The workbook
         * @param sheetName The sheet name
         * @returns Array of arrays representing the sheet data
         */
        getRawSheetData(workbook: XLSX.WorkBook, sheetName: string): any[][];
        /**
         * Converts a ReadableStream to a buffer
         */
        private bufferRS;
        /**
         * Shows a dialog for sheet selection
         */
        private displaySheetSelectorDialog;
    }
}
//# sourceMappingURL=FileService.d.ts.map