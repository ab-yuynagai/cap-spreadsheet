declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/ODataV4" {
    import { Columns, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import ODataListBinding from 'sap/ui/model/odata/v4/ODataListBinding';
    import MetadataHandlerV4 from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV4';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    type EntityObject = {
        $kind: string;
        $Type?: string;
        $NavigationPropertyBinding?: Record<string, string>;
    };
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class ODataV4 extends OData {
        customBinding: ODataListBinding;
        updateGroupId: string;
        metadataHandler: MetadataHandlerV4;
        private contexts;
        private objectRetriever;
        constructor(spreadsheetUploadController: SpreadsheetUpload, messageHandler: MessageHandler, util: Util);
        create(model: any, binding: any, payload: any): {
            context: any;
            promise: any;
        };
        createAsync(model: any, binding: any, payload: any): void;
        updateAsync(model: any, binding: any, payload: any): void;
        submitChanges(model: any): Promise<any>;
        waitForCreation(): Promise<any>;
        checkForErrors(model: any, binding: any, showBackendErrorMessages: Boolean): Promise<boolean>;
        createCustomBinding(binding: any): void;
        waitForDraft(): Promise<any[]>;
        getOdataType(binding: any, odataType: any): any;
        getLabelList(columns: Columns, odataType: string, excludeColumns: Columns): Promise<ListObject>;
        getKeyList(odataType: string, binding: any): Promise<string[]>;
        resetContexts(): void;
        getMetadataHandler(): MetadataHandlerV4;
        _findAttributeByType(obj: Record<string, EntityObject>, typeToSearch: string): string | undefined;
        static getContainerName(context: any): any;
        getODataEntitiesRecursive(entityName: string, lowestLevel: number): {
            mainEntity: any;
            expands: any;
        };
        getBindingFromBinding(binding: ODataListBinding, expand?: any): ODataListBinding;
        fetchBatch(customBinding: ODataListBinding, batchSize: number): Promise<any>;
        addKeys(labelList: ListObject, entityName: string, parentEntity?: any, partner?: string): void;
        getObjects(model: any, binding: any, batch: any): Promise<any[]>;
    }
}
//# sourceMappingURL=ODataV4.d.ts.map