declare module "cc/spreadsheetimporter/v2_3_0/controller/DirectUploader" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import MessageHandler from 'cc/spreadsheetimporter/v2_3_0/controller/MessageHandler';
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class DirectUploader extends ManagedObject {
        private component;
        private config;
        private util;
        /**
         * Initializes DirectUploader instance.
         * @param {Component} component - The component to be used.
         * @param {MessageHandler} messageHandler - The message handler instance.
         * @param {ResourceBundle} resourceBundle - The i18n resource bundle.
         */
        constructor(component: Component, messageHandler: MessageHandler, resourceBundle: ResourceBundle);
        /**
         * Uploads the spreadsheet file directly to the backend service.
         * @param {ArrayBuffer} fileContent - The file content as ArrayBuffer.
         * @param {string} fileName - The file name.
         * @param {string} entityNameBinding - The entity name binding or OData type.
         * @returns {Promise<any>} A promise that resolves with the server response.
         */
        uploadFile(fileContent: ArrayBuffer, fileName: string, entityNameBinding: string): Promise<any>;
        /**
         * Uploads the file using XMLHttpRequest.
         * @param {string} url - The upload URL.
         * @param {ArrayBuffer} fileContent - The file content as ArrayBuffer.
         * @param {string} fileName - The file name.
         * @returns {Promise<any>} A promise that resolves with the server response.
         */
        private uploadWithXHR;
    }
}
//# sourceMappingURL=DirectUploader.d.ts.map