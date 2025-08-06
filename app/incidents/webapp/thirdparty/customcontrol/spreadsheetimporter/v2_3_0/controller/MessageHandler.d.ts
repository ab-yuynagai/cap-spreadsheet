declare module "cc/spreadsheetimporter/v2_3_0/controller/MessageHandler" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { Messages, ListObject, ArrayData, PayloadArray, GroupedMessage } from 'cc/spreadsheetimporter/v2_3_0/types';
    import JSONModel from 'sap/ui/model/json/JSONModel';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class MessageHandler extends ManagedObject {
        private messages;
        private spreadsheetUploadController;
        private messageDialog;
        constructor(spreadsheetUploadController: any);
        setMessages(messages: Messages[]): void;
        addArrayToMessages(messages: Messages[]): void;
        addMessageToMessages(message: Messages): void;
        getMessages(): Messages[];
        checkDuplicateColumns(columnNames: string[]): void;
        checkMandatoryColumns(data: PayloadArray, columnNames: string[], mandatoryFieldsUser: string[], mandatoryFieldsMetadata: string[], typeLabelList: ListObject): void;
        checkMandatoryFields(data: ArrayData, mandatoryFields: string[], typeLabelList: ListObject): void;
        checkFormat(data: ArrayData): void;
        checkMaxLength(data: ArrayData, typeLabelList: ListObject, fieldMatchType: string): void;
        checkColumnNames(columnNames: string[], fieldMatchType: string, typeLabelList: ListObject): void;
        checkKeyColumns(columnNames: string[], odataKeyList: string[], typeLabelList: ListObject): any[];
        checkDuplicateKeys(data: ArrayData): void;
        checkMissingKeys(data: ArrayData): void;
        checkEmptyHeaders(data: ArrayData, columnNames: string[]): void;
        areMessagesPresent(): boolean;
        /**
         * Display messages.
         */
        displayMessages(strict?: boolean): Promise<void>;
        groupMessages(messages: Messages[]): GroupedMessage[];
        getGroupedSortedJsonModelMessages(): JSONModel;
        getGroupedSortedMessages(): GroupedMessage[];
        private onCloseMessageDialog;
        private onContinue;
        onDownloadErrors(): void;
        private sortMessagesByTitle;
        private getWorstType;
        private showConfirmDialog;
    }
}
//# sourceMappingURL=MessageHandler.d.ts.map