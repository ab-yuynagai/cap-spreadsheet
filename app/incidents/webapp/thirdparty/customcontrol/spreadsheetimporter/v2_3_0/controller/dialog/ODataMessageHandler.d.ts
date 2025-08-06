declare module "cc/spreadsheetimporter/v2_3_0/controller/dialog/ODataMessageHandler" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class ODataMessageHandler extends ManagedObject {
        private messages;
        private spreadsheetUploadController;
        private messageDialog;
        constructor(spreadsheetUploadController: SpreadsheetUpload);
        /**
         * Display messages.
         */
        displayMessages(messageData: any): Promise<void>;
        private onCloseMessageDialog;
    }
}
//# sourceMappingURL=ODataMessageHandler.d.ts.map