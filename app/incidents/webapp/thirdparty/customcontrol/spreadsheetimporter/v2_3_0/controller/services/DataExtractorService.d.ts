declare module "cc/spreadsheetimporter/v2_3_0/controller/services/DataExtractorService" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import * as XLSX from 'xlsx';
    import { ArrayData } from 'cc/spreadsheetimporter/v2_3_0/types';
    /**
     * DataExtractorService handles extracting data from spreadsheet sheets.
     * This service is responsible for reading sheet data with coordinates
     * and preparing it for further processing.
     *
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class DataExtractorService extends ManagedObject {
        /**
         * Extracts data from a single sheet
         * @param workbook The workbook
         * @param sheetName The sheet name
         * @param coordinates Optional A1 notation coordinates for header row
         * @returns Object with spreadsheet data and column names
         */
        extractSheetData(workbook: XLSX.WorkBook, sheetName: string, coordinates?: string): {
            spreadsheetSheetsData: ArrayData;
            columnNames: string[];
        };
        /**
         * Extracts data from all sheets (for standalone mode)
         * @param workbook The workbook
         * @returns Object with combined data and column names
         */
        extractAllSheetsData(workbook: XLSX.WorkBook): {
            spreadsheetSheetsData: ArrayData;
            columnNames: string[];
        };
        /**
         * Gets raw sheet data as array of arrays (for wizard preview)
         * @param workbook The workbook
         * @param sheetName The sheet name
         * @returns Array of arrays representing the sheet data
         */
        getRawSheetData(workbook: XLSX.WorkBook, sheetName: string): any[][];
        /**
         * Extracts raw values from payloadArray
         * @param data The payload array
         * @returns Array of objects with raw values only
         */
        extractRawValues(data: any[]): any[];
        /**
         * Extracts parsed/formatted values from payloadArray
         * @param data The payload array
         * @returns Array of objects with formatted values only
         */
        extractParsedValues(data: any[]): any[];
    }
}
//# sourceMappingURL=DataExtractorService.d.ts.map