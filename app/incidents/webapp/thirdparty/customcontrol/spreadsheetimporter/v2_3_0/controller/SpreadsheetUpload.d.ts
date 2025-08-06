declare module "cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import XMLView from 'sap/ui/core/mvc/XMLView';
    import { Messages, ListObject, ComponentData } from 'cc/spreadsheetimporter/v2_3_0/types';
    import ResourceModel from 'sap/ui/model/resource/ResourceModel';
    import OData from 'cc/spreadsheetimporter/v2_3_0/controller/odata/OData';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import OptionsDialog from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/OptionsDialog';
    import SpreadsheetDialog from 'cc/spreadsheetimporter/v2_3_0/control/SpreadsheetDialog';
    import SpreadsheetUploadDialog from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/SpreadsheetUploadDialog';
    import WizardDialog from 'cc/spreadsheetimporter/v2_3_0/controller/dialog/WizardDialog';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class SpreadsheetUpload extends ManagedObject {
        odataEntityType: any;
        component: Component;
        context: any;
        private _isODataV4;
        private _view;
        private _tableObject;
        private messageHandler;
        util: Util;
        private model;
        typeLabelList: ListObject;
        componentI18n: ResourceModel;
        private odataHandler;
        payload: any;
        private _odataType;
        private _binding;
        isOpenUI5: boolean;
        payloadArray: any[];
        errorState: boolean;
        errorMessage: any;
        private initialSetupPromise;
        messageArray: Messages[];
        errorsFound: boolean;
        odataKeyList: string[];
        optionsHandler: OptionsDialog;
        private _spreadsheetUploadDialogHandler;
        private _wizardDialogHandler;
        private _controller;
        /**
         * Initializes SpreadsheetUpload instance.
         * @param {Component} component - The component to be used.
         * @param {ResourceModel} componentI18n - The i18n resource model for the component.
         */
        constructor(component: Component, componentI18n: ResourceModel);
        /**
         * Executes initial setup.
         * @returns {Promise<void>} A promise that resolves when the initial setup is complete.
         */
        initialSetup(): Promise<void>;
        /**
         * Sets context for the instance.
         */
        setContext(): Promise<void>;
        /**
         * Retrieves OData handler based on UI5 version.
         * @param {number} version - UI5 version number.
         * @returns {OData} OData handler instance.
         */
        createODataHandler(spreadsheetUploadController: SpreadsheetUpload, messageHandler: MessageHandler, util: Util): OData;
        /**
         * Initializes the component and performs initial setup
         * @returns {Promise<void>}
         */
        initializeComponent(): Promise<void>;
        /**
         * Internal method to handle opening either dialog type.
         * Centralizes common logic for dialog initialization and opening.
         * @private
         * @param {boolean} useWizard - If true opens wizard, otherwise opens classic dialog
         * @param {ComponentData} [options] - Optional configuration options
         */
        openDialog(useWizard: boolean, options?: ComponentData): Promise<void>;
        setComponentOptions(options: ComponentData): void;
        _checkIfODataIsV4(binding: any): boolean;
        refreshBinding(context: any, binding: any, tableObject: any): void;
        /**
         * Dynamically loads the `sap.ui.generic.app.transaction.DraftController` module.
         * @returns {Promise<sap.ui.generic.app.transaction.DraftController>} A Promise that resolves to an instance of the `DraftController` class.
         * @throws {Error} If the `DraftController` module cannot be loaded.
         */
        _loadDraftController(): Promise<unknown>;
        resetContent(): void;
        triggerDownloadSpreadsheet(): void;
        /**
         * Returns messages from the MessageHandler.
         * @returns {Messages[]} - An array of messages.
         */
        getMessages(): Messages[];
        /**
         * Adds messages to the MessageHandler's messages.
         * @param {Messages[]} messagesArray - An array of messages to add.
         */
        addToMessages(messagesArray: Messages[]): void;
        /**
         * Sets the MessageHandler's messages array, replacing any existing messages.
         * @param {Messages[]} messagesArray - An array of messages to set.
         */
        setMessages(messagesArray: Messages[]): void;
        getSpreadsheetUploadDialog(): SpreadsheetDialog;
        getPayloadArray(): any[];
        getODataHandler(): OData;
        get isODataV4(): boolean;
        set isODataV4(value: boolean);
        get tableObject(): any;
        set tableObject(value: any);
        get binding(): any;
        set binding(value: any);
        get spreadsheetUploadDialogHandler(): SpreadsheetUploadDialog;
        set spreadsheetUploadDialogHandler(value: SpreadsheetUploadDialog);
        get controller(): import('sap/ui/core/mvc/Controller').default;
        get view(): XMLView;
        getOdataType(): string;
        private isOpenUI5Context;
        get wizardDialogHandler(): WizardDialog;
        set wizardDialogHandler(value: WizardDialog);
    }
}
//# sourceMappingURL=SpreadsheetUpload.d.ts.map