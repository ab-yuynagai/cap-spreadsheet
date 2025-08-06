declare module "cc/spreadsheetimporter/v2_3_0/controller/odata/ODataV4RequestObjects" {
    import Context from 'sap/ui/model/odata/v4/Context';
    import MetadataHandlerV4 from 'cc/spreadsheetimporter/v2_3_0/controller/odata/MetadataHandlerV4';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    interface BatchContext {
        context: Context;
        path: string;
        keyPredicates: string;
        keys: string[];
        payload: any;
    }
    interface MatchResult {
        index: number;
        keys: Record<string, any>;
        requestedStatus: boolean;
        foundIn: 'objectsTrue' | 'objectsFalse' | 'notFound';
        object: any;
    }
    class ODataV4RequestObjects {
        private metadataHandler;
        private messageHandler;
        private util;
        private contexts;
        constructor(metadataHandler: MetadataHandlerV4, messageHandler: MessageHandler, util: Util);
        getContexts(): BatchContext[];
        getObjects(model: any, binding: any, spreadsheetData: any): Promise<any[]>;
        private _getFilteredContexts;
        private findEntitiesFromSpreadsheet;
        private getContextsFromPayload;
        private validateObjectsAndRemoveNotFound;
        private validateObjectsAndDraftStates;
        private addDraftMismatchError;
    }
}
//# sourceMappingURL=ODataV4RequestObjects.d.ts.map