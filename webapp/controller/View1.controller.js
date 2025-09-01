sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("tabtable.controller.View1", {

        onInit: function() {
            // This model will hold the key of the table we want to show
            var oViewModel = new JSONModel({
                selectedTable: "ZLEDGERSet" // Set Ledger as the default table
            });
            this.getView().setModel(oViewModel, "view1");
        },

        onTableSwitch: function(oEvent) {
            // Get the key from the pressed button ("ZLEDGERSet" or "ZVEND_DETAILSSet")
            var sSelectedKey = oEvent.getParameter("key");

            // Update the model with the new key
            this.getView().getModel("view1").setProperty("/selectedTable", sSelectedKey);
        }
    });
});