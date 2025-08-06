declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV2" {
    import { Columns, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import MetadataHandler from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandler';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class MetadataHandlerV2 extends MetadataHandler {
        constructor(spreadsheetUploadController: any);
        getLabelList(columns: Columns, odataType: string, odataEntityType: any, excludeColumns: Columns): ListObject;
        private getLabel;
        /**
         * Creates a list of properties that are defined mandatory in the OData metadata V2
         * @param odataType
         **/
        getKeyList(odataEntityType: any): string[];
        getODataEntitiesRecursive(entityName: string, deepLevel: number): any;
        getKeys(binding: any, payload: any, IsActiveEntity?: boolean, excludeIsActiveEntity?: boolean): Record<string, any>;
    }
}
//# sourceMappingURL=MetadataHandlerV2.d.ts.map