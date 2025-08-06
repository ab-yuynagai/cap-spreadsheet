declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandler" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { Columns, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default abstract class MetadataHandler extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        constructor(spreadsheetUploadController: any);
        parseI18nText(i18nMetadataText: string, view: any): string;
        abstract getLabelList(columns: Columns, odataType: string, odataEntityType: any, excludeColumns: Columns): ListObject;
        abstract getKeyList(odataEntityType: any): string[];
        abstract getODataEntitiesRecursive(entityName: string, deepLevel: number): any;
        abstract getKeys(binding: any, payload: any, IsActiveEntity?: boolean, excludeIsActiveEntity?: boolean): Record<string, any>;
    }
}
//# sourceMappingURL=MetadataHandler.d.ts.map