declare module "cc/spreadsheetimporter/v2_3_0/controller/services/UploadService" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import Component from 'cc/spreadsheetimporter/v2_3_0/Component';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import Util from 'cc/spreadsheetimporter/v2_3_0/controller/Util';
    /**
     * UploadService handles all upload operations.
     * Supports both traditional OData upload and direct file upload.
     *
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class UploadService extends ManagedObject {
        private component;
        private spreadsheetUploadController;
        private util;
        private directUploader;
        constructor(component: Component, spreadsheetUploadController: SpreadsheetUpload, util: Util, messageHandler: any, resourceBundle: any);
        /**
         * Determines which upload method to use and executes it
         * @param payloadArray The processed data to upload
         * @param file Optional file for direct upload
         * @returns Whether the upload was successful
         */
        uploadData(payloadArray: any[], file?: File): Promise<boolean>;
        /**
         * Performs direct file upload
         */
        private performDirectUpload;
        /**
         * Performs traditional OData upload
         */
        private performTraditionalUpload;
        /**
         * Determines if direct upload should be used
         */
        private shouldUseDirectUpload;
        /**
         * Converts file to ArrayBuffer
         */
        private fileToArrayBuffer;
        /**
         * Fires the upload button press event
         */
        private fireUploadEvent;
        /**
         * Extracts raw values from payloadArray
         */
        private extractRawValues;
        /**
         * Extracts parsed values from payloadArray
         */
        private extractParsedValues;
    }
}
//# sourceMappingURL=UploadService.d.ts.map