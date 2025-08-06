sap.ui.define(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../../enums", "./MetadataHandlerV4", "sap/base/Log"], function (Filter, FilterOperator, ____enums, __MetadataHandlerV4, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const CustomMessageTypes = ____enums["CustomMessageTypes"];
  const MessageType = ____enums["MessageType"];
  const MetadataHandlerV4 = _interopRequireDefault(__MetadataHandlerV4); // Add interface for match results
  class ODataV4RequestObjects {
    contexts = [];
    constructor(metadataHandler, messageHandler, util) {
      this.metadataHandler = metadataHandler;
      this.messageHandler = messageHandler;
      this.util = util;
    }
    getContexts() {
      return this.contexts;
    }
    async getObjects(model, binding, spreadsheetData) {
      Log.debug('Processing spreadsheet data', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        spreadsheetData,
        bindingPath: binding.getPath(),
        modelName: model.getMetadata().getName()
      }));
      let path = MetadataHandlerV4.getResolvedPath(binding);

      // Get both active and inactive contexts
      Log.debug('Fetching active entities...', undefined, 'SpreadsheetUpload: ODataV4RequestObjects');
      const {
        contexts: activeContexts,
        objects: activeEntities
      } = await this._getFilteredContexts(model, binding, path, spreadsheetData, true);
      Log.debug('Found active entities', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        count: activeEntities.length,
        objects: activeEntities
      }));
      Log.debug('Fetching inactive entities...', undefined, 'SpreadsheetUpload: ODataV4RequestObjects');
      const {
        contexts: inactiveContexts,
        objects: inactiveEntities
      } = await this._getFilteredContexts(model, binding, path, spreadsheetData, false);
      Log.debug('Found inactive entities', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        count: inactiveEntities.length,
        objects: inactiveEntities
      }));
      let matchedEntities = this.findEntitiesFromSpreadsheet(spreadsheetData, activeEntities, inactiveEntities, binding);
      Log.debug('Matched entities from spreadsheet', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        count: matchedEntities.length,
        objects: matchedEntities
      }));

      // Store contexts
      this.contexts = this.getContextsFromPayload(spreadsheetData, activeContexts, inactiveContexts, path, binding);
      Log.debug('Generated contexts', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        count: this.contexts.length,
        contexts: this.contexts
      }));

      // Filter out not found entities but still show errors
      const {
        errorFound,
        filteredSpreadsheetData
      } = this.validateObjectsAndRemoveNotFound(spreadsheetData, matchedEntities, binding);
      Log.debug('Validation completed', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        errorFound,
        messageCount: this.messageHandler.messages.length,
        originalDataCount: spreadsheetData.length,
        filteredDataCount: filteredSpreadsheetData.length
      }));

      // Update spreadsheetData with filtered data
      spreadsheetData.length = 0;
      spreadsheetData.push(...filteredSpreadsheetData);

      // Update matched entities to only include valid ones
      matchedEntities = this.findEntitiesFromSpreadsheet(spreadsheetData, activeEntities, inactiveEntities, binding);

      // Update contexts with filtered data
      this.contexts = this.getContextsFromPayload(spreadsheetData, activeContexts, inactiveContexts, path, binding);
      if (errorFound) {
        if (this.messageHandler.areMessagesPresent()) {
          try {
            await this.messageHandler.displayMessages();

            // Log status changes
            const statusChanges = spreadsheetData.map((spreadsheetEntry, index) => {
              const keys = this.metadataHandler.getKeys(binding, spreadsheetEntry);
              const keysWithoutIsActiveEntity = {
                ...keys
              };
              delete keysWithoutIsActiveEntity.IsActiveEntity;
              const originalStatus = spreadsheetEntry.IsActiveEntity;
              const oppositeStatusEntity = spreadsheetEntry.IsActiveEntity ? inactiveEntities.find(entity => entity && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => entity[key] === value)) : activeEntities.find(entity => entity && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => entity[key] === value));
              return {
                index,
                keys: keysWithoutIsActiveEntity,
                originalStatus,
                newStatus: oppositeStatusEntity?.IsActiveEntity,
                statusChanged: originalStatus !== oppositeStatusEntity?.IsActiveEntity
              };
            });
            Log.debug('Status changes after user confirmation', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
              total: statusChanges.length,
              changed: statusChanges.filter(change => change.statusChanged).length,
              details: statusChanges
            }));

            // Update matchedEntities with correct draft status versions
            matchedEntities = spreadsheetData.map(spreadsheetEntry => {
              const keys = this.metadataHandler.getKeys(binding, spreadsheetEntry);
              const keysWithoutIsActiveEntity = {
                ...keys
              };
              delete keysWithoutIsActiveEntity.IsActiveEntity;

              // Find the entity with opposite draft status
              const oppositeStatusEntity = spreadsheetEntry.IsActiveEntity ? inactiveEntities.find(entity => entity && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => entity[key] === value)) : activeEntities.find(entity => entity && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => entity[key] === value));

              // Update spreadsheetEntry to match actual status
              if (oppositeStatusEntity) {
                spreadsheetEntry.IsActiveEntity = oppositeStatusEntity.IsActiveEntity;
                return oppositeStatusEntity;
              }
              return spreadsheetEntry;
            });
            return matchedEntities;
          } catch (error) {
            Log.debug('Operation cancelled by user', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
              error: error.message
            }));
          }
        }
      }
      return matchedEntities;
    }
    async _getFilteredContexts(model, binding, path, spreadsheetData, isActive) {
      // Create filters for each object in the batch
      const batchFilters = spreadsheetData.map(spreadsheetEntry => {
        const keys = this.metadataHandler.getKeys(binding, spreadsheetEntry);
        keys.IsActiveEntity = isActive;
        const keyFilters = Object.entries(keys).map(([property, value]) => new Filter(property, FilterOperator.EQ, value));
        return new Filter({
          filters: keyFilters,
          and: true
        });
      });

      // Combine all batch filters with OR
      const combinedFilter = new Filter({
        filters: batchFilters,
        and: false
      });

      // Bind the list with the filter
      const listBinding = model.bindList(path, null, [], [], {
        $$updateGroupId: '$auto'
      });
      listBinding.filter(combinedFilter);

      // Request contexts and map to objects
      const contexts = await listBinding.requestContexts(0, spreadsheetData.length);
      const objects = await Promise.all(contexts.map(context => context.getObject()));
      return {
        contexts,
        objects
      };
    }
    findEntitiesFromSpreadsheet(batch, objectsTrue, objectsFalse, binding) {
      const matchResults = [];
      batch.forEach((payload, index) => {
        const keys = this.metadataHandler.getKeys(binding, payload);
        const keysWithoutIsActiveEntity = {
          ...keys
        };
        delete keysWithoutIsActiveEntity.IsActiveEntity;

        // try to find the matching object from the spreadsheet in the requested objects
        const matchingObjectTrue = objectsTrue.find(obj => obj && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => obj[key] === value));
        const matchingObjectFalse = objectsFalse.find(obj => obj && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => obj[key] === value));
        let matchingObject = payload.IsActiveEntity ? matchingObjectTrue : matchingObjectFalse;

        // if the matching object is not found, try to find it in the opposite status objects, a error will be later shown in the validation
        if (!matchingObject) {
          matchingObject = payload.IsActiveEntity ? matchingObjectFalse : matchingObjectTrue;
        }
        matchResults.push({
          index,
          keys: keysWithoutIsActiveEntity,
          requestedStatus: payload.IsActiveEntity,
          foundIn: matchingObjectTrue ? 'objectsTrue' : matchingObjectFalse ? 'objectsFalse' : 'notFound',
          object: matchingObject
        });
      });
      Log.debug('Entity matching results', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        total: matchResults.length,
        found: matchResults.filter(r => r.object).length,
        notFound: matchResults.filter(r => !r.object).length,
        details: matchResults
      }));

      // Filter out undefined objects before returning
      const validEntities = matchResults.map(result => result.object).filter(entity => entity !== undefined);
      Log.debug('Final matched entities', undefined, 'SpreadsheetUpload: ODataV4RequestObjects', () => ({
        requested: batch.length,
        matched: validEntities.length,
        missingCount: batch.length - validEntities.length
      }));
      return validEntities;
    }
    getContextsFromPayload(spreadsheetData, activeContexts, inactiveContexts, path, binding) {
      return spreadsheetData.map(spreadsheetEntry => {
        const keys = this.metadataHandler.getKeys(binding, spreadsheetEntry);
        const keyPredicates = MetadataHandlerV4.formatKeyPredicates(keys, spreadsheetEntry);
        const isActiveEntity = spreadsheetEntry.IsActiveEntity;
        const keysWithoutIsActiveEntity = {
          ...keys
        };
        delete keysWithoutIsActiveEntity.IsActiveEntity;
        const matchingActiveContext = activeContexts.find(ctx => {
          const ctxObject = ctx.getObject();
          return ctxObject && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => ctxObject[key] === value);
        });
        const matchingInactiveContext = inactiveContexts.find(ctx => {
          const ctxObject = ctx.getObject();
          return ctxObject && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => ctxObject[key] === value);
        });
        let matchingContext = isActiveEntity ? matchingActiveContext : matchingInactiveContext;
        if (!matchingContext) {
          matchingContext = isActiveEntity ? matchingInactiveContext : matchingActiveContext;
        }
        return {
          context: matchingContext,
          path,
          keyPredicates: keyPredicates,
          keys: Object.keys(keys),
          payload: spreadsheetEntry
        };
      });
    }
    validateObjectsAndRemoveNotFound(spreadsheetData, backendEntities, binding) {
      let errorFound = false;
      const filteredSpreadsheetData = [];
      spreadsheetData.forEach((spreadsheetEntry, index) => {
        const keys = this.metadataHandler.getKeys(binding, spreadsheetEntry);
        const keysWithoutIsActiveEntity = {
          ...keys
        };
        delete keysWithoutIsActiveEntity.IsActiveEntity;
        const matchingBackendEntity = backendEntities.find(entity => entity && Object.entries(keysWithoutIsActiveEntity).every(([key, value]) => entity[key] === value));

        // If entity not found, add error message but don't include in filtered data
        if (!matchingBackendEntity) {
          errorFound = true;
          this.messageHandler.addMessageToMessages({
            title: this.util.geti18nText('spreadsheetimporter.objectNotFound'),
            row: index + 1,
            type: CustomMessageTypes.ObjectNotFound,
            counter: 1,
            formattedValue: Object.entries(keys).map(([key, value]) => `${key}=${value}`).join(', '),
            ui5type: MessageType.Error
          });
          // Don't add to filtered data
          return;
        }

        // Check for valid draft states only if the entity was found
        if (spreadsheetEntry.IsActiveEntity !== undefined) {
          if (matchingBackendEntity.IsActiveEntity && !matchingBackendEntity.HasDraftEntity && !spreadsheetEntry.IsActiveEntity) {
            this.addDraftMismatchError(index, keys, 'Draft', 'Active');
            errorFound = true;
          } else if (matchingBackendEntity.IsActiveEntity && matchingBackendEntity.HasDraftEntity && spreadsheetEntry.IsActiveEntity) {
            this.addDraftMismatchError(index, keys, 'Active', 'Draft');
            errorFound = true;
          } else if (!matchingBackendEntity.IsActiveEntity && spreadsheetEntry.IsActiveEntity) {
            this.addDraftMismatchError(index, keys, 'Active', 'Draft');
            errorFound = true;
          }
        }

        // Add to filtered list since item exists
        filteredSpreadsheetData.push(spreadsheetEntry);
      });
      return {
        errorFound,
        filteredSpreadsheetData
      };
    }
    validateObjectsAndDraftStates(spreadsheetData, backendEntities, binding) {
      // This method is replaced by validateObjectsAndRemoveNotFound
      // Keeping it with a simple redirect for backward compatibility
      const {
        errorFound
      } = this.validateObjectsAndRemoveNotFound(spreadsheetData, backendEntities, binding);
      return errorFound;
    }
    addDraftMismatchError(index, keys, uploadedState, expectedState) {
      this.messageHandler.addMessageToMessages({
        title: this.util.geti18nText('spreadsheetimporter.draftEntityMismatch'),
        row: index + 1,
        type: CustomMessageTypes.DraftEntityMismatch,
        counter: 1,
        ui5type: MessageType.Error,
        formattedValue: [Object.entries(keys).map(([key, value]) => `${key}=${value}`).join(', '), uploadedState, expectedState]
      });
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ODataV4RequestObjects = ODataV4RequestObjects;
  return __exports;
});
