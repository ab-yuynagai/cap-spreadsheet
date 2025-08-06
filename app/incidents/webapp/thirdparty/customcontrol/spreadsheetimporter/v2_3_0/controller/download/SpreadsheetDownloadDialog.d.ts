declare module "cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetDownloadDialog" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import JSONModel from 'sap/ui/model/json/JSONModel';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import SpreadsheetUploadDialog from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/SpreadsheetUploadDialog';
    /**
     * @namespace cc.spreadsheetimporter.download.v2_3_0
     */
    export default class SpreadsheetDownloadDialog extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        spreadsheetDownloadDialog: any;
        spreadsheetOptionsModel: JSONModel;
        componentI18n: any;
        component: any;
        spreadsheetUploadDialog: SpreadsheetUploadDialog;
        constructor(spreadsheetUploadController: any, spreadsheetUploadDialog: SpreadsheetUploadDialog);
        createSpreadsheetDownloadDialog(): Promise<void>;
        onSave(): void;
        onCancel(): void;
    }
}
//# sourceMappingURL=SpreadsheetDownloadDialog.d.ts.map