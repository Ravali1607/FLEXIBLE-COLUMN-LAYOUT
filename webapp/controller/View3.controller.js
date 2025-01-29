sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View3", {
        onInit() {
            that=this;
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible","setView3",this.oBranch,this);
        },
        oBranch: function(sChannel,sEvent,oData){
            if(oData && oData.branch.EMP_BRANCH){
                var Branch = oData.branch.EMP_BRANCH;
                this.getOwnerComponent().getModel().read("/PLANTS",{
                    success: function(response){
                        var filteredBranchData = response.results.filter(branch => branch.PLANT_LOC === Branch);
                        console.log(filteredBranchData);
                        var oModel = new sap.ui.model.json.JSONModel({
                            plant : filteredBranchData
                        })
                        that.byId("plantData").setModel(oModel);
                        // that.getView().byId("plantData").setModel(oModel);
                    },error: function(error){
                        sap.m.MessageToast.show("Error");
                        console.log(error);
                    }
                })
            }
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView2");
        }
    });
});