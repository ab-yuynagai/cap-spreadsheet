declare module "cc/spreadsheetimporter/v2_3_0/controller/Util" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import type ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import type { DeepDownloadConfig, FireEventReturnType, RowData, UpdateConfig, ValueData } from 'cc/spreadsheetimporter/v2_3_0/types';
    import type Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import type { FieldMatchType } from 'cc/spreadsheetimporter/v2_3_0/enums';
    import * as XLSX from 'xlsx';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class Util extends ManagedObject {
        private resourceBundle;
        constructor(resourceBundle: ResourceBundle);
        static getValueFromRow(row: RowData, label: string, type: string, fieldMatchType: FieldMatchType): ValueData;
        geti18nText(text: string, array?: any): string;
        static changeDecimalSeperator(value: string): number;
        static showError(error: any, className: string, methodName: string): void;
        static showErrorMessage(errorMessage: string, className: string, methodName: string): void;
        static getBrowserDecimalAndThousandSeparators(componentDecimalSeparator: string): {
            thousandSeparator: string;
            decimalSeparator: string;
        };
        static normalizeNumberString(numberString: string, component: Component): string;
        static getRandomString(length: number): string;
        static stringify(obj: any): string;
        static extractObjects(objects: any[]): Record<string, any>[];
        static downloadSpreadsheetFile(arrayBuffer: ArrayBuffer, fileName: string): void;
        static getLanguage(): Promise<string>;
        static loadUI5RessourceAsync(moduleName: string): Promise<any>;
        /**
         * Asynchronously fires an event with the given name and parameters on the specified component.
         * With this method, async methods can be attached and also sync methods
         * instead of the standard generated fireEvent methods, we call the methods directly
         * using promises to wait for the event handlers to complete
         *
         * @param eventName - The name of the event to be fired.
         * @param eventParameters - The parameters to be passed to the event handlers.
         * @param component - The component on which the event is fired.
         * @returns A promise that resolves when all event handlers have completed.
         */
        static fireEventAsync(eventName: string, eventParameters: object, component: Component): Promise<FireEventReturnType>;
        static mergeDeepDownloadConfig(defaultConfig: DeepDownloadConfig, providedConfig?: DeepDownloadConfig): DeepDownloadConfig;
        static mergeUpdateConfig(defaultConfig: UpdateConfig, providedConfig?: UpdateConfig): UpdateConfig;
        /**
         * Converts coordinates from object format {s: {r: number, c: number}, e: {r: number, c: number}}
         * to A1 notation string (e.g., "A1")
         *
         * @param coordinates Object with start (s) and end (e) coordinates
         * @param includeEndCoordinate Whether to include the end coordinate in the result (e.g., "A1:C10")
         * @returns A1 notation string or null if conversion fails
         */
        static convertCoordinatesToA1Notation(coordinates: any, includeEndCoordinate?: boolean): string | null;
        /**
         * Converts A1 notation string (e.g., "A1" or "A1:C10") to coordinates object
         *
         * @param a1Notation A1 notation string
         * @returns Coordinates object or null if conversion fails
         */
        static convertA1NotationToCoordinates(a1Notation: string): any | null;
        /**
         * Validates the component configuration for potential issues or incompatibilities.
         * Logs configuration issues to the console.
         *
         * @param componentData The configuration data provided by the developer
         * @returns True if the configuration is valid, false if critical issues were found
         */
        static validateConfiguration(componentData: any): boolean;
        /**
         * Creates a deep copy of an XLSX workbook. This prevents accidental mutation of the original
         * workbook object when downstream code (e.g. import wizard) renames attributes or changes cell values.
         */
        static deepCopyWorkbook(workbook: XLSX.WorkBook): XLSX.WorkBook;
    }
}
//# sourceMappingURL=Util.d.ts.map