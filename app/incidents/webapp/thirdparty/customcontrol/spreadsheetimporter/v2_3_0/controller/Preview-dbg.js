sap.ui.define(["sap/ui/base/ManagedObject", "sap/m/Button", "sap/m/Column", "sap/m/ColumnListItem", "sap/m/Dialog", "sap/m/Table", "sap/ui/model/json/JSONModel", "sap/m/Text"], function (ManagedObject, Button, Column, ColumnListItem, Dialog, Table, JSONModel, Text) {
  "use strict";

  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const Preview = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.Preview", {
    constructor: function _constructor(util) {
      ManagedObject.prototype.constructor.call(this);
      this.util = util;
    },
    showPreview: function _showPreview(payload, typeLabelList, previewColumns) {
      const table = this.createDynamicTable(payload, typeLabelList, previewColumns);
      if (typeof table === 'undefined') {
        return;
      }
      this.dialog = new Dialog({
        title: this.util.geti18nText('spreadsheetimporter.previewTableName'),
        content: [table],
        buttons: [new Button({
          text: this.util.geti18nText('spreadsheetimporter.messageDialogButtonClose'),
          press: () => {
            this.dialog.close();
          }
        })],
        afterClose: () => {
          this.dialog.destroy();
        }
      });
      this.dialog.open();
    },
    createDynamicTable: function _createDynamicTable(data, typeLabelList, previewColumns) {
      const table = new Table();

      // get all column names from the data to show all columns with data in the pr
      const aColumns = Preview.getAllKeys(data);
      aColumns.forEach(column => {
        // check if column is in previewColumns
        if (previewColumns && previewColumns.length > 0 && previewColumns.indexOf(column) === -1) {
          return;
        }
        const type = typeLabelList.get(column);
        const label = type && type.label ? type.label : column;
        const sapMColumn = new Column({
          header: new Text({
            text: label
          })
        });
        table.addColumn(sapMColumn);
      });

      // Create a template for table rows
      const template = new ColumnListItem();
      aColumns.forEach(column => {
        let oCell;
        if (typeof data[0][column] === 'object' && data[0][column] instanceof Date) {
          // show date in the format dd.mm.yyyy
          oCell = new Text({
            text: `{path: '${column}', type: 'sap.ui.model.type.Date'}`
          });
        } else {
          oCell = new Text({
            text: '{' + column + '}'
          });
        }
        template.addCell(oCell);
      });

      // Bind the data to the table
      const model = new JSONModel();
      model.setData(data);
      table.setModel(model);
      table.bindItems({
        path: '/',
        template: template
      });
      return table;
    }
  });
  Preview.getAllKeys = function getAllKeys(data) {
    const allKeys = new Set();
    data.forEach(obj => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => allKeys.add(key));
      }
    });
    return Array.from(allKeys);
  };
  return Preview;
});
