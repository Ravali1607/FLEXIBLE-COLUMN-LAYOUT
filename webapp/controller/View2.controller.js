sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View2", {
        onInit() {
            that = this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
            that.oEventBus.subscribe("flexible","setView2",that.data,that);
        },
        data: function(schannel,sEventId,oData){
            var oItem = oData.EMP_ID;
            that.getOwnerComponent().getModel().read("/EMPLOYEE",{
                success:function(response){
                    var filteredData = response.results.filter(emp => emp.EMP_ID === oItem)
                    console.log(filteredData);
                    var oModel = new sap.ui.model.json.JSONModel({
                        items : filteredData
                    })
                    that.byId("empForm").setModel(oModel);
                },error:function(error){
                    console.log(error);
                    sap.m.MessageToast.show("error");
                }
            })
        },
        NavToFirst: function(){
            sap.m.MessageToast.show("Button Clicked");
            that.oEventBus.publish("flexible","setView1");
        },
        NavToEnd: function(oEvent){
            sap.m.MessageToast.show("End Page Button Clicked");
            var oPlant = oEvent.getSource().getBindingContext().getProperty()
            that.oEventBus.publish("flexible","setView3",oPlant);
        },
        onClose: function(){
            that.oEventBus.publish("flexible","setView1");
        }
    });
});