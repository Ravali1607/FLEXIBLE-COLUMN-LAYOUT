sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/f/library"
], (Controller,History,fioriLibrary) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View4", { 
        onInit() {
            that=this;
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.getRoute("View4").attachPatternMatched(that.plantMethod,that);
        },
        plantMethod: function(oEvent){
            var oData = oEvent.getParameter("arguments");
            var oPlantId = oData.oPlantId;
            that.filterPlant(oPlantId);
        },
        filterPlant(oPlantId){
            that.getOwnerComponent().getModel().read("/PLANTS",{
                success: function(response){
                    var filteredPlant = response.results.filter(plantId => plantId.PLANT_ID === oPlantId);
                    console.log(filteredPlant);
                    var model = new sap.ui.model.json.JSONModel({
                        plantDetails : filteredPlant
                    })
                    that.byId("plantInfo").setModel(model);
                }
            })
        },
        onNavBack: function(){
            window.history.go(-1);
            that.getOwnerComponent().getRouter().navTo("View1");
            // var oHistory = History.getInstance();
            // var sPreviousHash = oHistory.getPreviousHash();
            // if (sPreviousHash !== undefined) {
            //     window.history.go(-1);
            // } else {
            //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //     oRouter.navTo("View1", {}, true);
            // }
                // var oApp = that.getOwnerComponent().getAggregation("rootControl");
                // var oFCL = oApp.byId("fcl"); // Get the FCL instance
    
                // if (oFCL) {
                //     oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsMidExpanded); // Restore the three-column view
                // }
    
                // Navigate to View1 and ensure the layout is restored
                // that.getOwnerComponent().getRouter().navTo("View1");
        },
    });
});