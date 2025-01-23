sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("flexiblecolumnlayout.controller.View3", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible","setView3",this.oPlant,this)
        },
        oPlant: function(sChannel,sEvent,oData){
            var oDetail = oData.EMP_ID;
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