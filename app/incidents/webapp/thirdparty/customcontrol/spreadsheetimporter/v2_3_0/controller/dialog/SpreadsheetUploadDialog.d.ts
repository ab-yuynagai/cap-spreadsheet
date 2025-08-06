declare module "cc/spreadsheetimporter/v2_3_0/controller/dialog/SpreadsheetUploadDialog" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import SpreadsheetDialog, { SpreadsheetDialog$AvailableOptionsChangedEvent, SpreadsheetDialog$DecimalSeparatorChangedEvent, SpreadsheetDialog$FileDropEvent, SpreadsheetDialog$DataPasteEvent } from '../../control/SpreadsheetDialog';
    import ResourceModel from 'sap/ui/model/resource/ResourceModel';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import Event from 'sap/ui/base/Event';
    import { FileUploader$ChangeEvent } from 'sap/ui/unified/FileUploader';
    import Preview from 'cc/spreadsheetimporter/v2_3_0/controller/Preview';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import OptionsDialog from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/OptionsDialog';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import JSONModel from 'sap/ui/model/json/JSONModel';
    import SpreadsheetDownloadDialog from 'cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetDownloadDialog';
    import SpreadsheetGenerator from 'cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetGenerator';
    import SpreadsheetDownload from 'cc/spreadsheetimporter/v2_3_0/controller/download/SpreadsheetDownload';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class SpreadsheetUploadDialog extends ManagedObject {
        spreadsheetUploadController: SpreadsheetUpload;
        spreadsheetUploadDialog: SpreadsheetDialog;
        spreadsheetDownloadDialog: SpreadsheetDownloadDialog;
        component: Component;
        previewHandler: Preview;
        util: Util;
        componentI18n: ResourceModel;
        optionsHandler: OptionsDialog;
        messageHandler: MessageHandler;
        spreadsheetOptionsModel: JSONModel;
        spreadsheetGenerator: SpreadsheetGenerator;
        spreadsheetDownload: SpreadsheetDownload;
        private odataHandler;
        private importService;
        private templateService;
        private currentFile;
        constructor(spreadsheetUploadController: SpreadsheetUpload, component: Component, componentI18n: ResourceModel, messageHandler: MessageHandler);
        createSpreadsheetUploadDialog(): Promise<void>;
        onFileDrop(event: SpreadsheetDialog$FileDropEvent): void;
        /**
         * Handle paste data event from SpreadsheetDialog
         * @param {SpreadsheetDialog$DataPasteEvent} event - The paste data event
         */
        onDataPaste(event: SpreadsheetDialog$DataPasteEvent): Promise<void>;
        /**
         * Handles file upload event.
         * @param {Event} event - The file upload event
         */
        onFileUpload(event: FileUploader$ChangeEvent): Promise<void>;
        /**
         * Process the uploaded file using the import pipeline
         * @param {Blob} file - The file to process
         */
        handleFile(file: Blob): Promise<void>;
        /**
         * Process a workbook directly (from paste functionality)
         * @param {any} workbook - The XLSX workbook to process
         * @param {string} sheetName - Sheet name to use (default: 'PastedData')
         */
        handleWorkbook(workbook: any): Promise<void>;
        /**
         * Sending extracted data to backend
         * @param {*} event
         */
        onUploadSet(event: Event): Promise<void>;
        openSpreadsheetUploadDialog(): void;
        /**
         * Closes the Spreadsheet upload dialog.
         */
        onCloseDialog(): void;
        onDecimalSeparatorChanged(event: SpreadsheetDialog$DecimalSeparatorChangedEvent): void;
        onAvailableOptionsChanged(event: SpreadsheetDialog$AvailableOptionsChangedEvent): void;
        /**
         * Reset the dialog content and clear the current file
         */
        resetContent(): void;
        /**
         * Set busy state on dialog
         */
        setBusy(state: boolean): void;
        setDataRows(length: number): void;
        getDialog(): SpreadsheetDialog;
        showPreview(): Promise<void>;
        onTempDownload(): Promise<void>;
        onOpenOptionsDialog(): void;
        setODataHandler(odataHandler: OData): void;
        /**
         * Initializes the spreadsheet download process.
         * If showOptions is enabled in the DeepDownloadConfig, opens a dialog allowing users to configure download options.
         * Otherwise, directly triggers the spreadsheet download.
         *
         * @returns {Promise<void>} A promise that resolves when the download process is initialized
         */
        onInitDownloadSpreadsheetProcess(): Promise<void>;
        onDownloadDataSpreadsheet(): Promise<void>;
        /**
         * Formatter for simplified action and data rows text
         * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
         * @param {string} createText - i18n text for create action
         * @param {string} updateText - i18n text for update action
         * @param {string} deleteText - i18n text for delete action
         * @param {string} upsertText - i18n text for upsert action
         * @param {string} recordsReadyText - i18n text for records ready for upload
         * @param {number} dataRows - Number of data rows
         * @returns {string} Simplified formatted text
         */
        formatSimplifiedText(action: string, createText: string, updateText: string, deleteText: string, upsertText: string, recordsReadyText: string, dataRows: number): string;
        /**
         * Formatter for action text display with title and description
         * @param {string} action - The current action (CREATE, UPDATE, DELETE, UPSERT)
         * @param {string} createText - i18n text for create action
         * @param {string} updateText - i18n text for update action
         * @param {string} deleteText - i18n text for delete action
         * @param {string} upsertText - i18n text for upsert action
         * @param {string} createDesc - i18n description for create action
         * @param {string} updateDesc - i18n description for update action
         * @param {string} deleteDesc - i18n description for delete action
         * @param {string} upsertDesc - i18n description for upsert action
         * @returns {string} Formatted text with title and description
         */
        formatActionText(action: string, createText: string, updateText: string, deleteText: string, upsertText: string, createDesc: string, updateDesc: string, deleteDesc: string, upsertDesc: string): string;
    }
}
//# sourceMappingURL=SpreadsheetUploadDialog.d.ts.map