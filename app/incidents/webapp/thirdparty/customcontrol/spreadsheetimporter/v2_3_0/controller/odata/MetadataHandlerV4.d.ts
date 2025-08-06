declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV4" {
    import { Columns, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import MetadataHandler from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandler';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class MetadataHandlerV4 extends MetadataHandler {
        constructor(spreadsheetUploadController: any);
        getLabelList(columns: Columns, odataType: string, excludeColumns: Columns): ListObject;
        getLabel(annotations: {
            [x: string]: {
                [x: string]: any;
            };
        }, properties: any, propertyName: string, propertyLabel: {
            [x: string]: any;
        }, odataType: string): string;
        /**
         * Creates a list of properties that are defined mandatory in the OData metadata V4
         * @param odataType
         **/
        getKeyList(odataType: string): string[];
        getODataEntitiesRecursive(entityName: string, deepLevel?: number): {
            mainEntity: any;
            expands: any;
        };
        private _findEntitiesByNavigationProperty;
        _getExpandsRecursive(mainEntity: any, expands: any, parent?: string, parentExpand?: any, currentLevel?: number, deepLevel?: number): void;
        getKeys(binding: any, payload: any, IsActiveEntity?: boolean, excludeIsActiveEntity?: boolean): Record<string, any>;
        /**
         * Adds keys from entity to labelList so it will be added to the sheet
         * @param labelList
         * @param entityName
         * @param parentEntity
         * @param partner
         */
        addKeys(labelList: ListObject, entityName: string, parentEntity?: any, partner?: string): void;
        static getAnnotationProperties(context: any, odataType: string): {
            annotations: any;
            properties: any;
        };
        static formatKeyPredicates(keys: Record<string, any>, payload: Record<string, any>): string;
        static getResolvedPath(binding: any): string;
    }
}
//# sourceMappingURL=MetadataHandlerV4.d.ts.map