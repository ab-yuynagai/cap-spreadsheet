declare module "cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetDownload" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { EntityObject, PropertyWithOrder, DeepDownloadConfig } from 'cc/spreadsheetimporter/v2_3_0/types';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    /**
     * @namespace cc.spreadsheetimporter.download.v2_3_0
     */
    export default class SpreadsheetDownload extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        component: Component;
        odataHandler: OData;
        private spreadsheetGenerator;
        private dataAssigner;
        constructor(spreadsheetUploadController: SpreadsheetUpload, component: Component, odataHandler: OData);
        _extractProperties(proConfigColumns: any, entityMetadata: any, entityType: string): Promise<PropertyWithOrder[]>;
        _findAttributeByType(obj: Record<string, EntityObject>, typeToSearch: string): string | undefined;
        fetchData(deepDownloadConfig: DeepDownloadConfig): Promise<any>;
    }
}
//# sourceMappingURL=SpreadsheetDownload.d.ts.map