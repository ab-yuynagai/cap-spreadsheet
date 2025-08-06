declare module "cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetGenerator" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { EntityDefinition, DeepDownloadConfig } from 'cc/spreadsheetimporter/v2_3_0/types';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    /**
     * @namespace cc.spreadsheetimporter.download.v2_3_0
     */
    export default class SpreadsheetGenerator extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        component: Component;
        odataHandler: OData;
        currentLang: string;
        constructor(spreadsheetUploadController: SpreadsheetUpload, component: Component, odataHandler: OData);
        downloadSpreadsheet(entityDefinition: EntityDefinition, spreadsheetExportConfig: DeepDownloadConfig): Promise<void>;
        private _appendRootEntitySheet;
        private _appendSiblingsSheetsRecursively;
        private _getSheet;
        private _getCellForType;
        private _extractProperties;
    }
}
//# sourceMappingURL=SpreadsheetGenerator.d.ts.map