sap.ui.define([], function () {
  "use strict";

  var AvailableOptions = /*#__PURE__*/function (AvailableOptions) {
    /**
     * Option for `strict` mode
     * @public
     */
    AvailableOptions["Strict"] = "strict";
    /**
     * Changing the field match type
     * @public
     */
    AvailableOptions["FieldMatchType"] = "fieldMatchType";
    /**
     * Changing the decimal seperator for number fields
     * @public
     */
    AvailableOptions["DecimalSeperator"] = "decimalSeperator";
    return AvailableOptions;
  }(AvailableOptions || {});
  var FieldMatchType = /*#__PURE__*/function (FieldMatchType) {
    /**
     * Default match type, property names in square brackets
     * @public
     */
    FieldMatchType["LabelTypeBrackets"] = "labelTypeBrackets";
    /**
     * match type with only labels
     * @public
     */
    FieldMatchType["Label"] = "label";
    return FieldMatchType;
  }(FieldMatchType || {});
  const CustomMessageTypes = {
    MandatoryFieldNotFilled: {
      title: 'MandatoryFieldNotFilled',
      group: true
    },
    ColumnNotFound: {
      title: 'ColumnNotFound',
      group: false
    },
    ParsingError: {
      title: 'ParsingError',
      group: true
    },
    CustomErrorGroup: {
      title: 'CustomErrorGroup',
      group: true
    },
    CustomError: {
      title: 'CustomError',
      group: false
    },
    Formatting: {
      title: 'Formatting',
      group: true
    },
    DuplicateColumns: {
      title: 'DuplicateColumns',
      group: false
    },
    MaxLengthExceeded: {
      title: 'MaxLengthExceeded',
      group: true
    },
    ObjectNotFound: {
      title: 'ObjectNotFound',
      group: true,
      update: true
    },
    DraftEntityMismatch: {
      title: 'DraftEntityMismatch',
      group: true,
      update: true
    },
    DuplicateKeys: {
      title: 'DuplicateKeys',
      group: true
    },
    MissingKeys: {
      title: 'MissingKeys',
      group: true,
      update: true
    },
    EmptyHeaders: {
      title: 'EmptyHeaders',
      group: false
    }
  };
  var MessageType = /*#__PURE__*/function (MessageType) {
    /**
     * Message is an error
     */
    MessageType["Error"] = "Error";
    /**
     * Message should be just an information
     */
    MessageType["Information"] = "Information";
    /**
     * Message has no specific level
     */
    MessageType["None"] = "None";
    /**
     * Message is a success message
     */
    MessageType["Success"] = "Success";
    /**
     * Message is a warning
     */
    MessageType["Warning"] = "Warning";
    return MessageType;
  }(MessageType || {});
  var Action = /*#__PURE__*/function (Action) {
    Action["Create"] = "CREATE";
    Action["Update"] = "UPDATE";
    Action["Delete"] = "DELETE";
    Action["Upsert"] = "UPSERT";
    return Action;
  }(Action || {});
  const DefaultConfigs = {
    DeepDownload: {
      addKeysToExport: false,
      setDraftStatus: true,
      deepExport: false,
      deepLevel: 0,
      showOptions: true,
      columns: []
    },
    Update: {
      fullUpdate: false,
      columns: []
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.AvailableOptions = AvailableOptions;
  __exports.FieldMatchType = FieldMatchType;
  __exports.CustomMessageTypes = CustomMessageTypes;
  __exports.MessageType = MessageType;
  __exports.Action = Action;
  __exports.DefaultConfigs = DefaultConfigs;
  return __exports;
});
