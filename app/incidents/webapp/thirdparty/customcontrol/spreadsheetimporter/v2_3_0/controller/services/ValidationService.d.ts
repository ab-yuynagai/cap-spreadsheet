declare module "cc/spreadsheetimporter/v2_3_0/controller/services/ValidationService" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { ArrayData, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    /**
     * ValidationService handles all spreadsheet data validation.
     * This service can be used independently to validate data
     * without running the full import pipeline.
     *
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class ValidationService extends ManagedObject {
        private messageHandler;
        private component;
        constructor(messageHandler: MessageHandler, component: Component);
        /**
         * Validates spreadsheet data and returns validation result
         * @param spreadsheetData The data to validate
         * @param columnNames The column names from the spreadsheet
         * @param typeLabelList The metadata type/label mapping
         * @param odataKeyList List of OData key fields
         * @returns Object with validation result and messages
         */
        validateData(spreadsheetData: ArrayData, columnNames: string[], typeLabelList: ListObject, odataKeyList: string[]): {
            isValid: boolean;
            messages: any[];
        };
        /**
         * Runs all validation checks
         */
        private runValidationChecks;
        /**
         * Validates just the header row for quick feedback
         * @param columnNames The column names to validate
         * @param typeLabelList The metadata type/label mapping
         * @returns Object with validation result
         */
        validateHeaders(columnNames: string[], typeLabelList: ListObject): {
            isValid: boolean;
            issues: string[];
        };
        /**
         * Clears all validation messages
         */
        clearMessages(): void;
        /**
         * Gets current validation messages
         */
        getMessages(): any[];
        /**
         * Shows validation messages dialog
         */
        showMessages(): Promise<void>;
    }
}
//# sourceMappingURL=ValidationService.d.ts.map