declare module "cc/spreadsheetimporter/v2_3_0/enums" {
    import { CustomMessageType } from 'cc/spreadsheetimporter/v2_3_0/types';
    enum AvailableOptions {
        /**
         * Option for `strict` mode
         * @public
         */
        Strict = "strict",
        /**
         * Changing the field match type
         * @public
         */
        FieldMatchType = "fieldMatchType",
        /**
         * Changing the decimal seperator for number fields
         * @public
         */
        DecimalSeperator = "decimalSeperator"
    }
    enum FieldMatchType {
        /**
         * Default match type, property names in square brackets
         * @public
         */
        LabelTypeBrackets = "labelTypeBrackets",
        /**
         * match type with only labels
         * @public
         */
        Label = "label"
    }
    const CustomMessageTypes: {
        [key: string]: CustomMessageType;
    };
    enum MessageType {
        /**
         * Message is an error
         */
        Error = "Error",
        /**
         * Message should be just an information
         */
        Information = "Information",
        /**
         * Message has no specific level
         */
        None = "None",
        /**
         * Message is a success message
         */
        Success = "Success",
        /**
         * Message is a warning
         */
        Warning = "Warning"
    }
    enum Action {
        Create = "CREATE",
        Update = "UPDATE",
        Delete = "DELETE",
        Upsert = "UPSERT"
    }
    const DefaultConfigs: {
        readonly DeepDownload: {
            readonly addKeysToExport: false;
            readonly setDraftStatus: true;
            readonly deepExport: false;
            readonly deepLevel: 0;
            readonly showOptions: true;
            readonly columns: readonly [];
        };
        readonly Update: {
            readonly fullUpdate: false;
            readonly columns: readonly [];
        };
    };
}
//# sourceMappingURL=enums.d.ts.map