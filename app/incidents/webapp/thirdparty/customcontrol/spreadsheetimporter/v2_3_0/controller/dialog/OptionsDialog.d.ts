declare module "cc/spreadsheetimporter/v2_3_0/controller/dialog/OptionsDialog" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Dialog from 'sap/m/Dialog';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class OptionsDialog extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        optionsDialog: Dialog;
        availableOptions: string[];
        constructor(spreadsheetUploadController: any);
        openOptionsDialog(): Promise<void>;
        onSave(): void;
        onCancel(): void;
    }
}
//# sourceMappingURL=OptionsDialog.d.ts.map