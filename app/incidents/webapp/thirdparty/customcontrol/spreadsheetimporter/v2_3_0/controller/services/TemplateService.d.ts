declare module "cc/spreadsheetimporter/v2_3_0/controller/services/TemplateService" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    /**
     * TemplateService handles spreadsheet template generation and download.
     * This service creates Excel templates based on component configuration
     * and provides both custom template download and dynamic template generation.
     *
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class TemplateService extends ManagedObject {
        private component;
        private spreadsheetUploadController;
        private util;
        constructor(component: Component, spreadsheetUploadController: SpreadsheetUpload, resourceBundle: ResourceBundle);
        /**
         * Downloads template - either custom template file or generates one dynamically
         */
        downloadTemplate(): Promise<void>;
        /**
         * Downloads a custom template file (from URL or local path)
         */
        private downloadCustomTemplate;
        /**
         * Generates and downloads a dynamic template based on component configuration
         */
        private generateAndDownloadTemplate;
        /**
         * Generates template for standalone mode using component columns
         */
        private generateStandaloneTemplate;
        /**
         * Generates template for OData mode using metadata information
         */
        private generateODataTemplate;
        /**
         * Creates a cell object based on OData type
         */
        private createCellByType;
    }
}
//# sourceMappingURL=TemplateService.d.ts.map