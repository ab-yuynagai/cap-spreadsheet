sap.ui.define(["sap/ui/base/ManagedObject", "cc/spreadsheetimporter/v2_3_0/thirdparty/xlsx", "../SheetHandler"], function (ManagedObject, XLSX, __SheetHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SheetHandler = _interopRequireDefault(__SheetHandler);
  /**
   * DataExtractorService handles extracting data from spreadsheet sheets.
   * This service is responsible for reading sheet data with coordinates
   * and preparing it for further processing.
   *
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const DataExtractorService = ManagedObject.extend("cc.spreadsheetimporter.v2_3_0.DataExtractorService", {
    /**
     * Extracts data from a single sheet
     * @param workbook The workbook
     * @param sheetName The sheet name
     * @param coordinates Optional A1 notation coordinates for header row
     * @returns Object with spreadsheet data and column names
     */
    extractSheetData: function _extractSheetData(workbook, sheetName, coordinates) {
      // Extract data using SheetHandler
      const spreadsheetSheetsData = SheetHandler.sheet_to_json(workbook.Sheets[sheetName], undefined, coordinates);

      // Get column names using header=1 option with the same coordinates
      const headerOptions = {
        header: 1
      };
      const firstRow = SheetHandler.sheet_to_json(workbook.Sheets[sheetName], headerOptions, coordinates)[0];

      // Ensure column names are strings
      const rawColumns = Array.isArray(firstRow) ? firstRow : Object.values(firstRow || {});
      const columnNames = rawColumns.map(column => {
        if (typeof column === 'object' && column !== null && 'rawValue' in column) {
          return column.rawValue || '';
        }
        return String(column || '');
      });

      // Validate that the sheet has data
      if (!spreadsheetSheetsData || spreadsheetSheetsData.length === 0) {
        throw new Error('The file contains no data');
      }

      // Trim values
      for (const object of spreadsheetSheetsData) {
        for (const key in object) {
          object[key].rawValue = typeof object[key].rawValue === 'string' ? object[key].rawValue.trim() : object[key].rawValue;
        }
      }
      return {
        spreadsheetSheetsData,
        columnNames
      };
    },
    /**
     * Extracts data from all sheets (for standalone mode)
     * @param workbook The workbook
     * @returns Object with combined data and column names
     */
    extractAllSheetsData: function _extractAllSheetsData(workbook) {
      let spreadsheetSheetsData = [];
      let columnNames = [];
      for (const sheet of Object.keys(workbook.Sheets)) {
        let currSheetData = SheetHandler.sheet_to_json(workbook.Sheets[sheet]);

        // Tag each data item with the sheet name
        for (const dataVal of currSheetData) {
          Object.keys(dataVal).forEach(key => {
            dataVal[key].sheetName = sheet;
          });
        }
        spreadsheetSheetsData = spreadsheetSheetsData.concat(currSheetData);

        // Add column names from this sheet
        const sheetColumnNames = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
          header: 1
        })[0];
        columnNames = columnNames.concat(sheetColumnNames);
      }
      return {
        spreadsheetSheetsData,
        columnNames
      };
    },
    /**
     * Gets raw sheet data as array of arrays (for wizard preview)
     * @param workbook The workbook
     * @param sheetName The sheet name
     * @returns Array of arrays representing the sheet data
     */
    getRawSheetData: function _getRawSheetData(workbook, sheetName) {
      return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
    },
    /**
     * Extracts raw values from payloadArray
     * @param data The payload array
     * @returns Array of objects with raw values only
     */
    extractRawValues: function _extractRawValues(data) {
      return data.map(item => {
        const newObj = {};
        for (const key in item) {
          if (item[key].hasOwnProperty('rawValue')) {
            newObj[key] = item[key].rawValue;
          }
        }
        return newObj;
      });
    },
    /**
     * Extracts parsed/formatted values from payloadArray
     * @param data The payload array
     * @returns Array of objects with formatted values only
     */
    extractParsedValues: function _extractParsedValues(data) {
      return data.map(item => {
        const newObj = {};
        for (const key in item) {
          if (item[key].hasOwnProperty('formattedValue')) {
            newObj[key] = item[key].formattedValue;
          }
        }
        return newObj;
      });
    }
  });
  return DataExtractorService;
});
//# sourceMappingURL=DataExtractorService-dbg.js.map
