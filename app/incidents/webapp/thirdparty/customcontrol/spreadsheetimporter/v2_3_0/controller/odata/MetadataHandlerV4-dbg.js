sap.ui.define(["sap/base/Log", "./MetadataHandler"], function (Log, __MetadataHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const MetadataHandler = _interopRequireDefault(__MetadataHandler);
  /**
   * @namespace cc.spreadsheetimporter.v2_3_0
   */
  const MetadataHandlerV4 = MetadataHandler.extend("cc.spreadsheetimporter.v2_3_0.MetadataHandlerV4", {
    constructor: function _constructor(spreadsheetUploadController) {
      MetadataHandler.prototype.constructor.call(this, spreadsheetUploadController);
    },
    getLabelList: function _getLabelList(columns, odataType, excludeColumns) {
      let listObject = new Map();
      let entityTypeLabel;
      const {
        annotations,
        properties
      } = MetadataHandlerV4.getAnnotationProperties(this.spreadsheetUploadController.context, odataType);
      Log.debug('SpreadsheetUpload: Annotations', undefined, 'SpreadsheetUpload: MetadataHandler', () => this.spreadsheetUploadController.component.logger.returnObject(annotations));
      Log.debug('SpreadsheetUpload: Properties', undefined, 'SpreadsheetUpload: MetadataHandler', () => this.spreadsheetUploadController.component.logger.returnObject(properties));
      // try get facet label
      try {
        entityTypeLabel = annotations[odataType]['@com.sap.vocabularies.UI.v1.Facets'][0].Label;
      } catch (error) {
        Log.debug(`SpreadsheetUpload: Facet Label not found`, undefined, 'SpreadsheetUpload: MetadataHandler');
      }

      // check if file name is not set
      if (!this.spreadsheetUploadController.component.getSpreadsheetFileName() && entityTypeLabel) {
        this.spreadsheetUploadController.component.setSpreadsheetFileName(`${entityTypeLabel}.xlsx`);
      } else if (!this.spreadsheetUploadController.component.getSpreadsheetFileName() && !entityTypeLabel) {
        this.spreadsheetUploadController.component.setSpreadsheetFileName(`Template.xlsx`);
      }

      // excludeColumns will remove the columns from the list if columns are present
      if (columns.length > 0 && excludeColumns.length > 0) {
        columns = columns.filter(column => !excludeColumns.includes(column));
      }
      if (columns.length > 0) {
        for (const propertyName of columns) {
          const property = properties[propertyName];
          if (property) {
            const propertyLabel = annotations[`${odataType}/${propertyName}`];
            let propertyObject = {};
            propertyObject.label = this.getLabel(annotations, properties, propertyName, propertyLabel, odataType);
            if (!propertyObject.label) {
              propertyObject.label = propertyName;
            }
            propertyObject.type = property.$Type;
            propertyObject.maxLength = property.$MaxLength;
            propertyObject.precision = property.$Precision;
            listObject.set(propertyName, propertyObject);
          } else {
            Log.warning(`SpreadsheetUpload: Property ${propertyName} not found`, undefined, 'SpreadsheetUpload: MetadataHandler');
          }
        }
      } else if (columns.length === 0 && excludeColumns.length > 0) {
        const propertiesFiltered = [];
        for (const propertyName in properties) {
          const propertyValue = properties[propertyName];
          if (propertyValue['$kind'] === 'Property') {
            propertiesFiltered.push([propertyName, propertyValue]);
          }
        }
        for (const [propertyName, propertyValue] of propertiesFiltered) {
          // if property is in excludeColumns, skip it
          if (excludeColumns.includes(propertyName)) {
            continue;
          }
          const propertyLabel = annotations[`${odataType}/${propertyName}`];
          if (propertyLabel && !propertyLabel['@com.sap.vocabularies.UI.v1.Hidden'] && !propertyName.startsWith('SAP__')) {
            let propertyObject = {};
            propertyObject.label = this.getLabel(annotations, properties, propertyName, propertyLabel, odataType);
            if (!propertyObject.label) {
              propertyObject.label = propertyName;
            }
            propertyObject.type = propertyValue.$Type;
            propertyObject.maxLength = propertyValue.$MaxLength;
            listObject.set(propertyName, propertyObject);
          }
          // if no annotation is found, still try to add the property
          if (!propertyLabel && !propertyName.startsWith('SAP__')) {
            let propertyObject = {};
            propertyObject.label = this.getLabel(annotations, properties, propertyName, propertyLabel, odataType);
            if (!propertyObject.label) {
              propertyObject.label = propertyName;
            }
            propertyObject.type = propertyValue.$Type;
            propertyObject.maxLength = propertyValue.$MaxLength;
            listObject.set(propertyName, propertyObject);
          }
        }
      } else {
        const propertiesFiltered = [];
        for (const propertyName in properties) {
          const propertyValue = properties[propertyName];
          if (propertyValue['$kind'] === 'Property') {
            propertiesFiltered.push([propertyName, propertyValue]);
          }
        }
        for (const [propertyName, propertyValue] of propertiesFiltered) {
          const propertyLabel = annotations[`${odataType}/${propertyName}`];
          if (propertyLabel && !propertyLabel['@com.sap.vocabularies.UI.v1.Hidden'] && !propertyName.startsWith('SAP__')) {
            let propertyObject = {};
            propertyObject.label = this.getLabel(annotations, properties, propertyName, propertyLabel, odataType);
            if (!propertyObject.label) {
              propertyObject.label = propertyName;
            }
            propertyObject.type = propertyValue.$Type;
            propertyObject.maxLength = propertyValue.$MaxLength;
            listObject.set(propertyName, propertyObject);
          }
          // if no annotation is found, still try to add the property
          if (!propertyLabel && !propertyName.startsWith('SAP__')) {
            let propertyObject = {};
            propertyObject.label = this.getLabel(annotations, properties, propertyName, propertyLabel, odataType);
            if (!propertyObject.label) {
              propertyObject.label = propertyName;
            }
            propertyObject.type = propertyValue.$Type;
            propertyObject.maxLength = propertyValue.$MaxLength;
            listObject.set(propertyName, propertyObject);
          }
        }
      }
      return listObject;
    },
    getLabel: function _getLabel(annotations, properties, propertyName, propertyLabel, odataType) {
      let label = '';
      if (propertyLabel && propertyLabel['@com.sap.vocabularies.Common.v1.Label']) {
        label = propertyLabel['@com.sap.vocabularies.Common.v1.Label'];
      }
      if (label === '') {
        try {
          const lineItemsAnnotations = annotations[odataType]['@com.sap.vocabularies.UI.v1.LineItem'];
          label = lineItemsAnnotations.find(dataField => dataField.Value.$Path === propertyName).Label;
        } catch (error) {
          Log.debug(`v: ${propertyName} not found as a LineItem Label`, undefined, 'SpreadsheetUpload: MetadataHandlerV4');
        }
      }
      if (typeof label === 'string' && label.startsWith('{') && label.endsWith('}')) {
        try {
          label = this.parseI18nText(label, this.spreadsheetUploadController.view);
        } catch (error) {
          Log.debug(`SpreadsheetUpload: ${label} not found as a Resource Bundle and i18n text`, undefined, 'SpreadsheetUpload: MetadataHandlerV4');
        }
      }
      if (label === '') {
        label = propertyName;
      }
      return label;
    },
    /**
     * Creates a list of properties that are defined mandatory in the OData metadata V4
     * @param odataType
     **/
    getKeyList: function _getKeyList(odataType) {
      let keys = [];
      if (this.spreadsheetUploadController.component.getSkipMandatoryFieldCheck()) {
        return keys;
      }
      const {
        annotations,
        properties
      } = MetadataHandlerV4.getAnnotationProperties(this.spreadsheetUploadController.context, odataType);
      const messagesPath = annotations[odataType]?.['@com.sap.vocabularies.Common.v1.Messages'] ?? undefined;
      const propertiesFiltered = Object.entries(properties).filter(([propertyName, propertyValue]) => propertyValue['$kind'] === 'Property');
      for (const [propertyName, propertyValue] of propertiesFiltered) {
        const propertyLabel = annotations[`${odataType}/${propertyName}`];
        if (!propertyLabel) {
          continue;
        }
        // skip messages property
        if (propertyName === messagesPath?.$Path || propertyName.startsWith('SAP__')) {
          continue;
        }
        // if property is mandatory, field should be in spreadsheet file
        if (!this.spreadsheetUploadController.component.getSkipMandatoryFieldCheck() && propertyLabel['@com.sap.vocabularies.Common.v1.FieldControl'] && propertyLabel['@com.sap.vocabularies.Common.v1.FieldControl']['$EnumMember'] && propertyLabel['@com.sap.vocabularies.Common.v1.FieldControl']['$EnumMember'] === 'com.sap.vocabularies.Common.v1.FieldControlType/Mandatory') {
          keys.push(propertyName);
        }
      }
      return keys;
    },
    getODataEntitiesRecursive: function _getODataEntitiesRecursive(entityName, deepLevel = 99) {
      const entities = this.spreadsheetUploadController.binding.getModel().getMetaModel().getData();
      if (!entities || !entities[entityName]) {
        throw new Error(`Entity '${entityName}' not found`); // Add appropriate error message and handling
      }
      const mainEntity = entities[entityName];
      // Find all entities by navigation properties and add them to the mainEntity, only till the deepLevel (i.e. only mainEntity if deepLevel is 0)
      this._findEntitiesByNavigationProperty(entities, entityName, deepLevel);
      const expands = {};
      // Get the expands for the mainEntity till the deepLevel
      this._getExpandsRecursive(mainEntity, expands, undefined, undefined, 0, deepLevel);
      return {
        mainEntity,
        expands
      };
    },
    _findEntitiesByNavigationProperty: function _findEntitiesByNavigationProperty(entities, rootEntityName, deepLevel = 99) {
      const queue = [];
      const traversedEntities = new Set();
      const rootEntity = entities[rootEntityName];

      // Add level tracking to queue items
      queue.push({
        entity: rootEntity,
        entityName: rootEntityName,
        parentEntityName: '',
        level: 0
      });
      traversedEntities.add(rootEntityName);
      while (queue.length > 0) {
        const {
          entity,
          entityName,
          parentEntityName,
          level
        } = queue.shift();

        // Skip if we've reached the maximum depth level
        if (level >= deepLevel) {
          continue;
        }
        for (const property in entity) {
          const navProperty = entity[property];
          if (navProperty.$kind === 'NavigationProperty' && navProperty.$Partner &&
          // TODO: that does not work on 1:1 relationships
          !navProperty.$ReferentialConstraint

          // && !this.isReverseRelationship(entities, navProperty, entityName)
          // && !traversedEntities.has(navProperty.$Type)
          ) {
            navProperty.$XYZEntity = entities[navProperty.$Type];
            navProperty.$XYZFetchableEntity = true;

            // Only add to queue if we haven't traversed this entity type yet
            if (!traversedEntities.has(navProperty.$Type)) {
              queue.push({
                entity: navProperty.$XYZEntity,
                entityName: navProperty.$Type,
                parentEntityName: entityName,
                level: level + 1
              });
              traversedEntities.add(navProperty.$Type);
            }
          }
        }
      }
    },
    _getExpandsRecursive: function _getExpandsRecursive(mainEntity, expands, parent, parentExpand, currentLevel = 0, deepLevel = 99) {
      if (currentLevel >= deepLevel) return;
      for (const entity in mainEntity) {
        if (mainEntity[entity].$XYZFetchableEntity) {
          if (parent) {
            parentExpand.$expand = entity;
          } else {
            if (!expands[entity]) {
              expands[entity] = {};
            }
            parentExpand = expands[entity];
          }
          this._getExpandsRecursive(mainEntity[entity].$XYZEntity, expands, entity, parentExpand, currentLevel + 1, deepLevel);
        }
      }
    },
    // move to metadata handler
    getKeys: function _getKeys(binding, payload, IsActiveEntity, excludeIsActiveEntity = false) {
      // Get the resolved path
      let path = MetadataHandlerV4.getResolvedPath(binding);

      // Get the key properties for this entity type
      const keyNames = MetadataHandlerV4.getAnnotationProperties(this.spreadsheetUploadController.context, this.spreadsheetUploadController.getOdataType()).properties.$Key;

      // Create a map of key names to their values from the payload
      const keyMap = {};
      keyNames.forEach(key => {
        if (excludeIsActiveEntity && key === 'IsActiveEntity') {
          return;
        }
        if (key === 'IsActiveEntity') {
          // If IsActiveEntity is explicitly provided as a parameter, use it
          // Otherwise, use the value from the payload
          keyMap[key] = IsActiveEntity !== undefined ? IsActiveEntity : payload[key];
        } else {
          keyMap[key] = payload[key];
        }
      });
      return keyMap;
    },
    /**
     * Adds keys from entity to labelList so it will be added to the sheet
     * @param labelList
     * @param entityName
     * @param parentEntity
     * @param partner
     */
    addKeys: function _addKeys(labelList, entityName, parentEntity, partner) {
      const {
        annotations,
        properties
      } = MetadataHandlerV4.getAnnotationProperties(this.spreadsheetUploadController.context, entityName);
      const keys = [];
      // if parentEntity is set, we need to get the key from the parent Entity
      if (parentEntity) {
        const propertyObject = {};
        const refConstraint = properties[partner]['$ReferentialConstraint'];
        propertyObject.propertyName = Object.keys(refConstraint)[0];
        const parentPropertyName = refConstraint[propertyObject.propertyName];
        propertyObject.propertyValue = parentEntity[parentPropertyName];
        propertyObject.propertyLabel = annotations[`${entityName}/${propertyObject.propertyName}`];
        keys.push(propertyObject);
      }
      // if parentEntity is not set, we need to get the key from the entity itself
      const entityKeys = properties.$Key;
      for (const key in entityKeys) {
        const propertyObject = {};
        propertyObject.propertyName = entityKeys[key];
        propertyObject.propertyValue = properties[entityKeys[key]];
        propertyObject.propertyLabel = annotations[`${entityName}/${propertyObject.propertyName}`];
        keys.push(propertyObject);
      }

      // Create a new Map to make sure the are in the beginning of the spreadsheet
      const newLabelList = new Map();

      // Add keys to the new Map
      for (const key of keys) {
        const propertyObject = {};
        propertyObject.label = this.getLabel(annotations, properties, key.propertyName, key.propertyLabel, entityName);
        if (!propertyObject.label) {
          propertyObject.label = key.propertyName;
        }
        propertyObject.type = key.propertyValue.$Type;
        propertyObject.maxLength = key.propertyValue.$MaxLength;
        propertyObject.$XYZKey = true;
        newLabelList.set(key.propertyName, propertyObject);
      }

      // Merge existing entries after the keys
      labelList.forEach((value, key) => {
        newLabelList.set(key, value);
      });

      // Replace the content of labelList with the new ordered entries
      labelList.clear();
      newLabelList.forEach((value, key) => {
        labelList.set(key, value);
      });
    }
  });
  MetadataHandlerV4.getAnnotationProperties = function getAnnotationProperties(context, odataType) {
    const model = context?.getModel && context.getModel() || context.getView().getModel();
    const annotations = model.getMetaModel().getData()['$Annotations'];
    const properties = model.getMetaModel().getData()[odataType];
    return {
      annotations,
      properties
    };
  };
  MetadataHandlerV4.formatKeyPredicates = function formatKeyPredicates(keys, payload) {
    // If IsActiveEntity is a key but not in payload, add it with true value as ODataV4 is not able to create draft entities
    if ('IsActiveEntity' in keys && !('IsActiveEntity' in payload)) {
      payload = {
        ...payload,
        IsActiveEntity: true
      };
    }
    const aKeyProperties = Object.keys(keys).map(key => {
      // Check if the key exists in our payload
      if (!(key in payload)) {
        throw new Error(`Required key property '${key}' not found in payload`);
      }

      // Encode the key and value
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(payload[key]);

      // Return the formatted key-value pair
      return Object.keys(keys).length > 1 ? `${encodedKey}=${encodedValue}` : encodedValue;
    });
    return `${aKeyProperties.join(',')}`;
  };
  MetadataHandlerV4.getResolvedPath = function getResolvedPath(binding) {
    let path = binding.getPath();
    if (binding.getResolvedPath) {
      path = binding.getResolvedPath();
    } else {
      // workaround for getResolvedPath only available from 1.88
      path = binding.getModel().resolve(binding.getPath(), binding.getContext());
    }
    return path;
  };
  return MetadataHandlerV4;
});
