declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/ODataV2" {
    import { Columns } from 'cc/spreadsheetimporter/v2_3_0/types';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    import MetadataHandlerV2 from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV2';
    import ODataListBinding from 'sap/ui/model/odata/v2/ODataListBinding';
    import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class ODataV2 extends OData {
        customBinding: ODataListBinding;
        submitChangesResponse: any;
        private metadataHandler;
        constructor(spreadsheetUploadController: SpreadsheetUpload, messageHandler: MessageHandler, util: Util);
        create(model: any, binding: any, payload: any): Promise<unknown>;
        createAsync(model: any, binding: any, payload: any): void;
        updateAsync(model: any, binding: any, payload: any): void;
        checkForErrors(model: any, binding: any, showBackendErrorMessages: Boolean): Promise<boolean>;
        createCustomBinding(binding: any): Promise<void>;
        submitChanges(model: ODataModel): Promise<void>;
        waitForCreation(): Promise<void>;
        waitForDraft(): Promise<any[]>;
        getOdataType(binding: any, odataType: any): Promise<any>;
        getObjects(model: any, binding: any, batch: any): Promise<any>;
        getLabelList(columns: Columns, odataType: string, excludeColumns: Columns, binding?: any): Promise<ListObject>;
        getKeyList(odataType: string, binding: any): Promise<string[]>;
        resetContexts(): void;
        getMetadataHandler(): MetadataHandlerV2;
        getODataEntitiesRecursive(entityName: string, deepLevel: number): any;
        getBindingFromBinding(binding: ODataListBinding, expand?: any): ODataListBinding;
        fetchBatch(customBinding: ODataListBinding, batchSize: number): Promise<any>;
        addKeys(labelList: ListObject, entityName: string, parentEntity?: any, partner?: string): void;
    }
}
//# sourceMappingURL=ODataV2.d.ts.map