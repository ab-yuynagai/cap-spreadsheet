sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  /**
   * @namespace cc.spreadsheetimporter.download.v2_3_0
   */
  const DataAssigner = ManagedObject.extend("cc.spreadsheetimporter.download.v2_3_0.DataAssigner", {
    /**
     * Recursively assigns data to entities and their sub-entities
     * @param data - The data to be assigned
     * @param entity - The entity to assign data to
     */
    assignData: function _assignData(data, entity) {
      // Iterate through properties of the current entity
      for (const property in entity) {
        // If the property signifies a fetchable entity
        if (entity[property].$XYZFetchableEntity) {
          let subEntityDataTotal = [];
          for (const row in data) {
            const currentEntity = data[row];
            const subEntityData = currentEntity[property];
            if (subEntityData) {
              subEntityDataTotal = subEntityDataTotal.concat(subEntityData);
            }
            delete currentEntity[property]; // remove the data
          }
          entity[property].$XYZData = subEntityDataTotal;

          // Recursive call to handle deeper levels
          this.assignData(subEntityDataTotal, entity[property].$XYZEntity);
        }
      }
    },
    /**
     * Assigns data to the root entity
     * @param data - The data to be assigned
     * @param entity - The root entity
     * @param deepLevel - The level of deep download
     */
    assignDataRoot: function _assignDataRoot(data, entity, deepLevel) {
      // If deepLevel is 0 and data is an array, handle each string as a column
      if (deepLevel === 0 && Array.isArray(data)) {
        entity.$XYZData = [];
        let row = {};
        for (const column of data) {
          if (entity.hasOwnProperty(column) && !entity[column].$XYZFetchableEntity) {
            if (!entity['$XYZColumns']) entity['$XYZColumns'] = [];
            // You can customize the value below as needed
            row[column] = column;
          }
        }
        entity.$XYZData.push(row);
      } else {
        // Iterate through properties of the current entity (existing code)
        entity.$XYZData = [];
        let row = {};
        for (const column in data) {
          if (entity.hasOwnProperty(column) && !entity[column].$XYZFetchableEntity) {
            if (!entity['$XYZColumns']) entity['$XYZColumns'] = [];
            row[column] = data[column];
          }
        }
        entity.$XYZData.push(row);
      }
    },
    /**
     * Assigns columns to the root entity
     * @param data - The data containing column information
     * @param entity - The root entity
     * @param deepLevel - The level of deep download
     */
    assignColumnsRoot: function _assignColumnsRoot(data, entity, deepLevel) {
      // If deepLevel is 0 and data is an array, handle each string as a column
      if (deepLevel === 0 && Array.isArray(data)) {
        for (const column of data) {
          if (entity.hasOwnProperty(column) && !entity[column].$XYZFetchableEntity) {
            if (!entity['$XYZColumns']) entity['$XYZColumns'] = [];
            entity['$XYZColumns'].push(column);
          }
        }
      } else {
        // If deepLevel is not 0, we expect data to be an object
        for (const column in data) {
          if (entity.hasOwnProperty(column) && !entity[column].$XYZFetchableEntity) {
            if (!entity['$XYZColumns']) entity['$XYZColumns'] = [];
            entity['$XYZColumns'].push(column);
          }
        }
      }
    },
    /**
     * Recursively assigns columns to sub-entities
     * @param data - The data containing column information
     * @param entity - The entity to assign columns to
     * @param deepLevel - The level of deep download (if 0, we expect data to be a string array, not an object)
     */
    assignColumns: function _assignColumns(data, entity, deepLevel) {
      // New check: if deepLevel is 0 and "data" is an object instead of a string array, throw error
      if (deepLevel !== 0 && Array.isArray(data)) {
        throw new Error("For deepLevel=0 (no deep download), 'data' must be an object, not an string array");
      }

      // Existing code - do not remove existing comments
      for (const property in entity) {
        // If the property signifies a fetchable entity
        if (entity[property].$XYZFetchableEntity && data.hasOwnProperty(property)) {
          let subEntity = entity[property].$XYZEntity;
          for (const column in data[property]) {
            if (subEntity.hasOwnProperty(column) && !subEntity[column].$XYZFetchableEntity) {
              if (!entity[property]['$XYZColumns']) entity[property]['$XYZColumns'] = [];
              entity[property]['$XYZColumns'].push(column);
            }
          }
          this.assignColumns(data[property], entity[property].$XYZEntity, deepLevel);
        }
      }
    }
  });
  return DataAssigner;
});
