sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("flexiblecolumnlayout.controller.View3", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
        },
        NavToSecond: function(){
            sap.m.MessageToast.show("Button Clicked");
            this.oEventBus.publish("flexible","setView2");
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView2");
        }
    });
});