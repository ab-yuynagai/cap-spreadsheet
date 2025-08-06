declare module "cc/spreadsheetimporter/v2_3_0/controller/download/DataAssigner" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    /**
     * @namespace cc.spreadsheetimporter.download.v2_3_0
     */
    export default class DataAssigner extends ManagedObject {
        /**
         * Recursively assigns data to entities and their sub-entities
         * @param data - The data to be assigned
         * @param entity - The entity to assign data to
         */
        assignData(data: any, entity: any): void;
        /**
         * Assigns data to the root entity
         * @param data - The data to be assigned
         * @param entity - The root entity
         * @param deepLevel - The level of deep download
         */
        assignDataRoot(data: any, entity: any, deepLevel: number): void;
        /**
         * Assigns columns to the root entity
         * @param data - The data containing column information
         * @param entity - The root entity
         * @param deepLevel - The level of deep download
         */
        assignColumnsRoot(data: any, entity: any, deepLevel: number): void;
        /**
         * Recursively assigns columns to sub-entities
         * @param data - The data containing column information
         * @param entity - The entity to assign columns to
         * @param deepLevel - The level of deep download (if 0, we expect data to be a string array, not an object)
         */
        assignColumns(data: any, entity: any, deepLevel: number): void;
    }
}
//# sourceMappingURL=DataAssigner.d.ts.map