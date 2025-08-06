declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/OData" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import DraftController from 'sap/ui/generic/app/transaction/DraftController';
    import { Columns, ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    import ODataMessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/ODataMessageHandler';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import MetadataHandlerV2 from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV2';
    import MetadataHandlerV4 from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV4';
    import Dialog from 'sap/m/Dialog';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import ODataListBindingV2 from 'sap/ui/model/odata/v2/ODataListBinding';
    import ODataListBindingV4 from 'sap/ui/model/odata/v4/ODataListBinding';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default abstract class OData extends ManagedObject {
        draftController: DraftController;
        odataMessageHandler: ODataMessageHandler;
        private _tables;
        busyDialog: Dialog;
        spreadsheetUploadController: SpreadsheetUpload;
        createPromises: Promise<any>[];
        createContexts: any[];
        messageHandler: MessageHandler;
        util: Util;
        constructor(spreadsheetUploadController: SpreadsheetUpload, messageHandler: MessageHandler, util: Util);
        /**
         * Helper method to call OData service.
         * @param {*} fnResolve - The resolve function for the Promise.
         * @param {*} fnReject - The reject function for the Promise.
         */
        callOdata(fnResolve: any, fnReject: any, spreadsheetUploadController: SpreadsheetUpload): Promise<void>;
        getBindingFromTable(tableObject: any): any;
        _getActionName(context: any, sOperation: string): any;
        processPayloadArray(batchSize: number, payloadArray: string | any[]): any[];
        getTableObject(tableId: string, view: any, spreadsheetUploadController: SpreadsheetUpload): any;
        private createBusyDialog;
        private checkForODataErrors;
        private showInternalErrorDialog;
        getView(context: any): any;
        get tables(): any[];
        set tables(value: any[]);
        abstract create(model: any, binding: any, payload: any): any;
        abstract createAsync(model: any, binding: any, payload: any): any;
        abstract updateAsync(model: any, binding: any, payload: any): any;
        abstract submitChanges(model: any): Promise<any>;
        abstract waitForCreation(): Promise<any>;
        abstract waitForDraft(): void;
        abstract resetContexts(): void;
        abstract getMetadataHandler(): MetadataHandlerV2 | MetadataHandlerV4;
        abstract getLabelList(columns: Columns, odataType: string, excludeColumns: Columns, binding?: any): Promise<ListObject>;
        abstract getKeyList(odataType: string, tableObject: any): Promise<string[]>;
        abstract getOdataType(binding: any, odataType: any): string;
        abstract checkForErrors(model: any, binding: any, showBackendErrorMessages: Boolean): Promise<boolean>;
        abstract createCustomBinding(binding: any): any;
        abstract getODataEntitiesRecursive(entityName: string, deepLevel: number): any;
        abstract getBindingFromBinding(binding: any, expand?: any): ODataListBindingV4 | ODataListBindingV2;
        abstract fetchBatch(customBinding: ODataListBindingV4 | ODataListBindingV2, batchSize: number): Promise<any>;
        abstract addKeys(labelList: ListObject, entityName: string, parentEntity?: any, partner?: string): void;
        abstract getObjects(model: any, binding: any, batch: any): Promise<any>;
    }
}
//# sourceMappingURL=OData.d.ts.map