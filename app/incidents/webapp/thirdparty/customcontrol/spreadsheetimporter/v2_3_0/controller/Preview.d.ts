declare module "cc/spreadsheetimporter/v2_3_0/controller/Preview" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Dialog from 'sap/m/Dialog';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import { ListObject } from 'cc/spreadsheetimporter/v2_3_0/types';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class Preview extends ManagedObject {
        dialog: Dialog;
        util: Util;
        constructor(util: Util);
        showPreview(payload: any, typeLabelList: ListObject, previewColumns: string[]): void;
        createDynamicTable(data: any[], typeLabelList: ListObject, previewColumns: string[]): any;
        static getAllKeys(data: any[]): string[];
    }
}
//# sourceMappingURL=Preview.d.ts.map