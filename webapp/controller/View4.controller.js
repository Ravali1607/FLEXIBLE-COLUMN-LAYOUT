sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
], (Controller,History) => {
    "use strict";
    return Controller.extend("flexiblecolumnlayout.controller.View4", {
        onInit() {
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
        },
        onNavBack: function(){
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1", {}, true);
            }
        }
    });
});