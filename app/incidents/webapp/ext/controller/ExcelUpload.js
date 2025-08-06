// sap.ui.define([
//     "sap/m/MessageToast"
// ], function(MessageToast) {
//     'use strict';

//     return {
//         Upload: function(oEvent) {
//             MessageToast.show("Custom handler invoked.");
//         }
//     };
// });



sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
  ], function(MessageToast) {
    'use strict';
    console.log("start")
    return {
      Upload: async function(oEvent) {
        // Viewの取得
        // const oView = oEvent.getSource().getParent().getParent(); // 必要に応じて調整
        // const oView = this.getView();

        // const oView = sap.ui.getCore().byId("ns.incidents::IncidentsObjectPage");
        const oView = sap.ui.getCore().byId("ns.incidents::IncidentsObjectPage--fe::FacetSection::Conversation");


        if (!oView) {
            console.error("Viewが取得できませんでした");
            return;
        }

        oView.setBusyIndicatorDelay(0);
        oView.setBusy(true);
        console.log("view 取得完了")
  
        // AppComponent取得
        const oComponent = oView.getController().getAppComponent();
        console.log("App Component 取得完了")
  
        // Spreadsheet Importerのダイアログを生成
        const spreadsheetUpload = await oComponent.createComponent({
          usage: "spreadsheetImporter",
          async: true,
          componentData: {
            context: oView.getController(),
            tableId: "ns.incidents::IncidentsObjectPage--fe::table::conversation::LineItem::Conversation-innerTable"
          },
        });
        console.log("Spreadseet Importerダイアログ 生成完了")
  
        // ダイアログを開く
        spreadsheetUpload.openSpreadsheetUploadDialog();
        oView.setBusy(false);
        console.log("ダイアログ開けた")
      }
    };
  });
  