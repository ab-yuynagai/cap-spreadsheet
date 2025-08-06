declare module "cc/spreadsheetimporter/v2_3_0/controller/SheetHandler" {
    import ManagedObject from 'sap/ui/base/ManagedObject';
    import { Sheet2JSONOpts, WorkSheet } from 'xlsx';
    import { ArrayData } from 'cc/spreadsheetimporter/v2_3_0/types';
    /**
     * @namespace cc.spreadsheetimporter.v2_3_0
     */
    export default class SheetHandler extends ManagedObject {
        constructor();
        static sheet_to_json(sheet: WorkSheet, opts?: Sheet2JSONOpts, readSheetCoordinates?: string): ArrayData;
        static make_json_row(sheet: WorkSheet, r: any, R: any, cols: any, header: any, hdr: any, o: any): {
            row: {};
            isempty: boolean;
        };
        static fmt_is_date(fmt: any): boolean;
        static SSF_isgeneral(s: any, i: any): boolean;
        static numdate(v: any): any;
        static utc_to_local(utc: any): Date;
        static safe_decode_range(range: any): {
            s: {
                c: number;
                r: number;
            };
            e: {
                c: number;
                r: number;
            };
        };
        static renameAttributes(dataArray: any): any;
        /**
         * Applies coordinates from A1 notation to a range
         * @param range The original range to modify
         * @param cellReference The cell reference in A1 notation (e.g., "A1")
         * @returns The modified range string
         */
        static applyCoordinatesToRange(range: string | any, cellReference: string): string;
    }
}
//# sourceMappingURL=SheetHandler.d.ts.map