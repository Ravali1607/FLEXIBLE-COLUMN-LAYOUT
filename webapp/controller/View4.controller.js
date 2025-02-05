sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/f/library"
], (Controller,History,fioriLibrary) => {
    "use strict";
    return Controller.extend("flexiblecolumnlayout.controller.View4", {
        onInit() {
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
        },
        onNavBack: function(){
            // var oHistory = History.getInstance();
            // var sPreviousHash = oHistory.getPreviousHash();
            // if (sPreviousHash !== undefined) {
            //     window.history.go(-1);
            // } else {
            //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //     oRouter.navTo("View1", {}, true);
            // }
                var oApp = this.getOwnerComponent().getAggregation("rootControl");
                var oFCL = oApp.byId("fcl"); // Get the FCL instance
    
                if (oFCL) {
                    oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsMidExpanded); // Restore the three-column view
                }
    
                // Navigate to View1 and ensure the layout is restored
                this.getOwnerComponent().getRouter().navTo("View1");
        }
    });
});