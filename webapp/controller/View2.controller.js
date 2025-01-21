sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("flexiblecolumnlayout.controller.View2", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
        },
        NavToFirst: function(){
            sap.m.MessageToast.show("Button Clicked");
            this.oEventBus.publish("flexible","setView1");
        },
        NavToEnd: function(){
            sap.m.MessageToast.show("End Page Button Clicked");
            this.oEventBus.publish("flexible","setView3");
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView1");
        }
    });
});