sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("flexiblecolumnlayout.controller.View1", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
        },
        NavToMid: function(){
            sap.m.MessageToast.show("Successful");
            this.oEventBus.publish("flexible","setView2");
        }
    });
});