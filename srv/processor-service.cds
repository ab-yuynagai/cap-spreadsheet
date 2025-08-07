using { sap.capire.incidents as my } from '../db/schema';


@odata.draft.enabled
service ProcessorService {
  entity Incidents as projection on my.Incidents;
  // entity Conversation as projection on my.Conversation;
  annotate my.Customers with @cds.autoexpose;
  // annotate Incidents.Conversation with @Capabilities.InsertRestrictions.Insertable : true;
}
