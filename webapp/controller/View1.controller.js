sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View1", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
        },
        NavToMid: function(oEvent){
            sap.m.MessageToast.show("Successful");
            var oTable = that.byId("empData");
            var oItem = oEvent.getSource().getBindingContext().getProperty();
            that.oEventBus.publish("flexible","setView2",oItem);
        }
    });
});