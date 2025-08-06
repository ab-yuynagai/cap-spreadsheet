declare module "cc/spreadsheetimporter/v2_3_0/controller/services/TextToWorkbookService" {
    import * as XLSX from 'xlsx';
    /**
     * Service to handle text-to-workbook conversion for paste functionality
     * Supports both text data and file data from clipboard
     */
    export default class TextToWorkbookService {
        /**
         * Process clipboard data and convert to workbook
         * @param clipboardData - ClipboardData from paste event
         * @returns Promise<XLSX.WorkBook | null> - Workbook or null if no valid data
         */
        processClipboardData(clipboardData: DataTransfer): Promise<{
            workbook: XLSX.WorkBook | null;
            type: 'text' | 'file' | 'none';
        }>;
        /**
         * Check if file is a supported spreadsheet format
         * @param file - File to check
         * @returns boolean
         */
        private isSpreadsheetFile;
        /**
         * Read file as workbook
         * @param file - File to read
         * @returns Promise<XLSX.WorkBook>
         */
        private readFileAsWorkbook;
        /**
         * Convert text data to workbook format using SheetJS parsing
         * @param textData - Raw text data from clipboard
         * @returns XLSX.WorkBook
         */
        convertTextToWorkbook(textData: string): XLSX.WorkBook;
        /**
         * Get information about data format using SheetJS
         * @param textData - Text data to analyze
         * @returns object with format information
         */
        analyzeTextFormat(textData: string): {
            rowCount: number;
            estimatedColumns: number;
            firstRow: string[];
        };
    }
}
//# sourceMappingURL=TextToWorkbookService.d.ts.map