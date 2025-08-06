declare module "cc/spreadsheetimporter/v2_3_0/Component" {
    import UIComponent from 'sap/ui/core/UIComponent';
    import SpreadsheetUpload from 'cc/spreadsheetimporter/v2_3_0/controller/SpreadsheetUpload';
    import { ComponentData, DeepDownloadConfig, Messages } from 'cc/spreadsheetimporter/v2_3_0/types';
    import Logger from 'cc/spreadsheetimporter/v2_3_0/controller/Logger';
    import ComponentContainer from 'sap/ui/core/ComponentContainer';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class Component extends UIComponent {
        spreadsheetUpload: SpreadsheetUpload;
        private _sContentDensityClass;
        _densityClass: string;
        logger: Logger;
        oContainer: ComponentContainer;
        settingsFromContainer: $ComponentSettings;
        constructor(idOrSettings?: string | $ComponentSettings);
        constructor(id?: string, settings?: $ComponentSettings);
        static metadata: {
            manifest: string;
            properties: {
                spreadsheetFileName: {
                    type: string;
                    defaultValue: string;
                };
                action: {
                    type: string;
                    defaultValue: string;
                };
                context: {
                    type: string;
                };
                columns: {
                    type: string;
                    defaultValue: any[];
                };
                excludeColumns: {
                    type: string;
                    defaultValue: any[];
                };
                tableId: {
                    type: string;
                };
                odataType: {
                    type: string;
                };
                mandatoryFields: {
                    type: string;
                    defaultValue: any[];
                };
                fieldMatchType: {
                    type: string;
                    defaultValue: string;
                };
                activateDraft: {
                    type: string;
                    defaultValue: boolean;
                };
                batchSize: {
                    type: string;
                    defaultValue: number;
                };
                standalone: {
                    type: string;
                    defaultValue: boolean;
                };
                strict: {
                    type: string;
                    defaultValue: boolean;
                };
                decimalSeparator: {
                    type: string;
                    defaultValue: string;
                };
                hidePreview: {
                    type: string;
                    defaultValue: boolean;
                };
                previewColumns: {
                    type: string;
                    defaultValue: any[];
                };
                skipMandatoryFieldCheck: {
                    type: string;
                    defaultValue: boolean;
                };
                skipColumnsCheck: {
                    type: string;
                    defaultValue: boolean;
                };
                skipEmptyHeadersCheck: {
                    type: string;
                    defaultValue: boolean;
                };
                skipMaxLengthCheck: {
                    type: string;
                    defaultValue: boolean;
                };
                showBackendErrorMessages: {
                    type: string;
                    defaultValue: boolean;
                };
                showOptions: {
                    type: string;
                    defaultValue: boolean;
                };
                availableOptions: {
                    type: string;
                    defaultValue: any[];
                };
                hideSampleData: {
                    type: string;
                    defaultValue: boolean;
                };
                sampleData: {
                    type: string;
                };
                spreadsheetTemplateFile: {
                    type: string;
                    defaultValue: string;
                };
                useTableSelector: {
                    type: string;
                    defaultValue: boolean;
                };
                readAllSheets: {
                    type: string;
                    defaultValue: boolean;
                };
                readSheet: {
                    type: string;
                    defaultValue: number;
                };
                spreadsheetRowPropertyName: {
                    type: string;
                };
                continueOnError: {
                    type: string;
                    defaultValue: boolean;
                };
                createActiveEntity: {
                    type: string;
                    defaultValue: boolean;
                };
                i18nModel: {
                    type: string;
                };
                debug: {
                    type: string;
                    defaultValue: boolean;
                };
                componentContainerData: {
                    type: string;
                };
                bindingCustom: {
                    type: string;
                };
                showDownloadButton: {
                    type: string;
                    defaultValue: boolean;
                };
                deepDownloadConfig: {
                    type: string;
                    defaultValue: {};
                };
                readSheetCoordinates: {
                    type: string;
                    defaultValue: string;
                };
                updateConfig: {
                    type: string;
                    defaultValue: {};
                };
                directUploadConfig: {
                    type: string;
                    defaultValue: {};
                };
                useImportWizard: {
                    type: string;
                    defaultValue: boolean;
                };
                enablePaste: {
                    type: string;
                    defaultValue: boolean;
                };
            };
            aggregations: {
                rootControl: {
                    type: string;
                    multiple: boolean;
                    visibility: string;
                };
            };
            events: {
                preFileProcessing: {
                    parameters: {
                        file: {
                            type: string;
                        };
                    };
                };
                checkBeforeRead: {
                    parameters: {
                        sheetData: {
                            type: string;
                        };
                        parsedData: {
                            type: string;
                        };
                        messages: {
                            type: string;
                        };
                    };
                };
                changeBeforeCreate: {
                    parameters: {
                        payload: {
                            type: string;
                        };
                    };
                };
                requestCompleted: {
                    parameters: {
                        success: {
                            type: string;
                        };
                    };
                };
                uploadButtonPress: {
                    allowPreventDefault: boolean;
                    parameters: {
                        payload: {
                            type: string;
                        };
                        rawData: {
                            type: string;
                        };
                        parsedData: {
                            type: string;
                        };
                    };
                };
                beforeDownloadFileProcessing: {
                    parameters: {
                        data: {
                            type: string;
                        };
                    };
                };
                beforeDownloadFileExport: {
                    parameters: {
                        workbook: {
                            type: string;
                        };
                        filename: {
                            type: string;
                        };
                    };
                };
            };
        };
        init(): Promise<void>;
        createContent(): any;
        /**
         * Opens the classic spreadsheet upload dialog.
         * @public
         * @param {ComponentData} [options] - Optional configuration overrides
         */
        openSpreadsheetUploadDialog(options?: ComponentData): void;
        /**
         * Opens the wizard based spreadsheet import dialog.
         * @public
         * @param {ComponentData} [options] - Optional configuration overrides
         */
        openWizard(options?: ComponentData): void;
        triggerDownloadSpreadsheet(deepDownloadConfig?: DeepDownloadConfig): Promise<void>;
        /**
         * Attaches events to the component container based on the provided options.
         * @param context - The controller context to attach the events to.
         * @returns void
         */
        private _attachEvents;
        triggerInitContext(): Promise<void>;
        /**
         * add to error array
         * @public
         */
        addArrayToMessages(errorArray: Messages[]): void;
        /**
         * set error messages array (replaces existing messages)
         * @public
         */
        setArrayMessages(messagesArray: Messages[]): void;
        getMessages(): Messages[];
        /**
         * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
         * design mode class should be set, which influences the size appearance of some controls.
         * @private
         * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
         */
        getContentDensityClass(): any;
        _getViewControllerOfControl(control: any): any;
        /**
         * Ensures context and events are properly set up.
         * This is needed when the component is loaded via ComponentContainer.
         * @private
         */
        private _ensureContextAndEvents;
        /**
         * Internal method to open either the classic upload dialog or the wizard.
         * Handles all the common setup logic for both dialog types.
         * @private
         * @param {boolean} useWizard - If true opens the wizard, otherwise opens the classic dialog
         * @param {ComponentData} [options] - Optional configuration overrides
         */
        private _openImportDialog;
    }
}
//# sourceMappingURL=Component.d.ts.map