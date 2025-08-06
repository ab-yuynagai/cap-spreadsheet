declare module "cc/spreadsheetimporter/v2_3_0/control/SpreadsheetDialog" {
    import Dialog from 'sap/m/Dialog';
    import type { MetadataOptions } from 'sap/ui/core/Element';
    import SpreadsheetDialogRenderer from 'cc/spreadsheetimporter/v2_3_0/control/SpreadsheetDialogRenderer';
    /**
     * Constructor for a new <code>cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog</code> control.
     *
     * Some class description goes here.
     * @extends Dialog
     *
     * @constructor
     * @public
     * @name cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog
     */
    export default class SpreadsheetDialog extends Dialog {
        dropMessageShown: boolean;
        private textToWorkbookService;
        private readonly _onPaste;
        constructor(id?: string | $SpreadsheetDialogSettings);
        constructor(id?: string, settings?: $SpreadsheetDialogSettings);
        static readonly metadata: MetadataOptions;
        onAfterRendering(event: any): void;
        private handleDragOver;
        private handleDragLeave;
        private handleFileDrop;
        private handleDragEnter;
        /**
         * Handle paste events - improved with better guards and busy state
         * @param event - Browser paste event
         */
        private handlePaste;
        private showDropMessage;
        exit(): void;
        static renderer: typeof SpreadsheetDialogRenderer;
    }
}
//# sourceMappingURL=SpreadsheetDialog.d.ts.map