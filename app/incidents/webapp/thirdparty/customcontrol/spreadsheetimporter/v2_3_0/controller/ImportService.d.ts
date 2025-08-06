declare module "cc/spreadsheetimporter/v2_3_0/controller/ImportService" {
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import * as XLSX from 'xlsx';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import { ArrayData } from 'cc/spreadsheetimporter/v2_3_0/types';
    import FileService from 'cc/spreadsheetimporter/v2_3_0/controller/services/FileService';
    import DataExtractorService from 'cc/spreadsheetimporter/v2_3_0/controller/services/DataExtractorService';
    import ValidationService from 'cc/spreadsheetimporter/v2_3_0/controller/services/ValidationService';
    import UploadService from 'cc/spreadsheetimporter/v2_3_0/controller/services/UploadService';
    /**
     * ImportService provides a simple interface for importing spreadsheet data.
     *
     * This service orchestrates the import process using specialized services:
     * - FileService: Handles file reading and workbook operations
     * - DataExtractorService: Extracts data from spreadsheets
     * - ValidationService: Validates data (can be used separately)
     * - UploadService: Handles upload to backend
     *
     * The service is designed to be easy to use and understand, with clear
     * separation between different stages of the import process.
     */
    export default class ImportService {
        protected component: Component;
        protected util: Util;
        protected spreadsheetUploadController: SpreadsheetUpload;
        protected messageHandler: MessageHandler;
        protected i18nResource: ResourceBundle;
        private fileService;
        private dataExtractorService;
        private validationService;
        private uploadService;
        constructor(spreadsheetUploadController: SpreadsheetUpload, component: Component, i18nResourceBundle: ResourceBundle, messageHandler: MessageHandler);
        /**
         * Simple method to read and process a file
         * @param file The file to process
         * @param sheetOption Sheet selection option
         * @param coordinates Optional coordinates for header row
         * @returns Processed data with workbook, sheet data, and validation results
         */
        processFile(file: File | Blob, sheetOption?: string | number, coordinates?: string): Promise<any>;
        /**
         * Validates data separately (for wizard flow)
         * @param spreadsheetData The data to validate
         * @param columnNames Column names from the spreadsheet
         * @returns Validation result
         */
        validateData(spreadsheetData: ArrayData, columnNames: string[]): Promise<{
            isValid: boolean;
            messages: any[];
        }>;
        /**
         * Shows validation messages if any
         */
        showValidationMessages(): Promise<void>;
        /**
         * Parses spreadsheet data according to OData types
         */
        parseData(spreadsheetData: ArrayData): Promise<any[]>;
        /**
         * Basic file processing without validation or upload
         * @param fileOrWorkbook File/Blob or workbook to process
         * @param sheetOptionOrSheetName Sheet selection option or name
         * @param coordinates Optional coordinates for header row
         * @returns Processed data for further use
         */
        processFileData(fileOrWorkbook: File | Blob | XLSX.WorkBook, sheetOptionOrSheetName?: string | number, coordinates?: string): Promise<any>;
        /**
         * Validates processed data and returns validation result
         * @param processedData The result from processFileData
         * @param showMessages Whether to show validation messages immediately
         * @returns Validation result with messages
         */
        validateProcessedData(processedData: any, showMessages?: boolean): Promise<{
            isValid: boolean;
            messages: any[];
            processedData: any;
        }>;
        /**
         * Executes the final upload operation
         * @param payloadArray The data to upload
         * @param file Optional file for direct upload
         * @returns Whether upload was successful
         */
        executeUpload(payloadArray: any[], file?: File): Promise<boolean>;
        /**
         * Simple workflow: Process + Validate (wizard pattern)
         * @param fileOrWorkbook File/Blob or workbook to process
         * @param sheetOptionOrSheetName Sheet selection option or name
         * @param coordinates Optional coordinates for header row
         * @param options Processing options
         * @returns Processed and validated data
         */
        processAndValidate(fileOrWorkbook: File | Blob | XLSX.WorkBook, sheetOptionOrSheetName?: string | number, coordinates?: string, options?: {
            resetMessages?: boolean;
            validate?: boolean;
            showMessages?: boolean;
        }): Promise<any>;
        /**
         * Complete workflow: Process + Validate + Upload (dialog pattern with callbacks)
         * @param fileOrWorkbook File/Blob or workbook to process
         * @param sheetOptionOrSheetName Sheet selection option or name
         * @param coordinates Optional coordinates for header row
         * @param options Processing options
         * @param callbacks UI feedback callbacks
         * @returns Complete result with upload status
         */
        processValidateAndUpload(fileOrWorkbook: File | Blob | XLSX.WorkBook, sheetOptionOrSheetName?: string | number, coordinates?: string, options?: {
            resetMessages?: boolean;
            validate?: boolean;
            showMessages?: boolean;
            upload?: boolean;
        }, callbacks?: {
            onBusy?: (state: boolean) => void;
            onMessagesPresent?: () => void;
            onImportSuccess?: (rowCount: number) => void;
        }): Promise<any>;
        /**
         * @deprecated Use processAndValidate() instead for wizard flows or processValidateAndUpload() for dialog flows
         *
         * Complete import flow for default dialog (renamed from runImportFlow)
         * Reads, extracts, validates, parses, and optionally uploads data
         * Can accept either a File/Blob or a workbook with sheet name
         */
        runImportPipeline(fileOrWorkbook: File | Blob | XLSX.WorkBook, sheetOptionOrSheetName?: string | number, coordinates?: string, pipelineOptions?: {
            upload?: boolean;
            resetMessages?: boolean;
            validate?: boolean;
            showMessages?: boolean;
        }, callbacks?: {
            onBusy?: (state: boolean) => void;
            onMessagesPresent?: () => void;
            onImportSuccess?: (rowCount: number) => void;
        }): Promise<any>;
        /**
         * Wrapper method for executeUpload to match existing usage
         * @param payloadArray The data to upload
         * @param file Optional file for direct upload
         * @returns Whether upload was successful
         */
        determineAndExecuteUpload(payloadArray: any[], file?: File): Promise<boolean>;
        /**
         * Gets only the workbook and basic info (for wizard initial step)
         */
        getWorkbookInfo(file: File | Blob, sheetOption?: string | number): Promise<{
            workbook: XLSX.WorkBook;
            sheetName: string;
            rawSheetData: any[][];
        }>;
        /**
         * Validates just headers for quick feedback
         */
        validateHeaders(columnNames: string[]): {
            isValid: boolean;
            issues: string[];
        };
        /**
         * Gets the specialized services for advanced use cases
         */
        getServices(): {
            fileService: FileService;
            dataExtractorService: DataExtractorService;
            validationService: ValidationService;
            uploadService: UploadService;
        };
    }
}
//# sourceMappingURL=ImportService.d.ts.map