sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View2", {
        onInit() {
            that = this;
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible","setView2",this.data,this);
        },
        onAfterRendering: function(){
            var oGlobal = that.getOwnerComponent().getModel("globalfclModel");
            // oGlobal.getProperty("EMP_ID");
        },
        data: function(schannel,sEventId,oData){
            if(oData && oData.EmployeeID_EMP_ID){
                var oItem = oData.EmployeeID_EMP_ID;
                var model = that.getOwnerComponent().getModel();
                model.read("/EMPLOYEE",{
                    success:function(response){
                        var filteredData = response.results.filter(emp => emp.EMP_ID === oItem)
                        console.log(filteredData);
                        var oModel = new sap.ui.model.json.JSONModel({
                            items : filteredData
                        })
                        that.getView().byId("empForm").setModel(oModel);
                    },error:function(error){
                        sap.m.MessageToast.show("No match");
                        console.log(error);
                        sap.m.MessageToast.show("error");
                    }
                })
            }
        },
        NavToFirst: function(){
            sap.m.MessageToast.show("Button Clicked");
            this.oEventBus.publish("flexible","setView1");
        },
        NavToEnd: function(oEvent){
            sap.m.MessageToast.show("End Page Button Clicked");
            var oTable = that.byId("empForm");
            var oPlant = oEvent.getSource().getBindingContext().getProperty();
            this.oEventBus.publish("flexible","setView3",{branch: oPlant});
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView1");
        },
        onToggleFullScreen: function () {
            var oFCL = this.getView().getParent().getParent(); // Get FlexibleColumnLayout
            var oButton = this.getView().byId("btnFullScreen1"); // Get button reference
            var sCurrentLayout = oFCL.getLayout(); // Get current layout
        
            if (sCurrentLayout === sap.f.LayoutType.MidColumnFullScreen) {
                oFCL.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded); // Restore layout
                oButton.setIcon("sap-icon://full-screen"); // Update icon
            } else {
                oFCL.setLayout(sap.f.LayoutType.MidColumnFullScreen); // Expand second column
                oButton.setIcon("sap-icon://exit-full-screen"); // Update icon
            }
        },
        // onCreate: function(){
        //     if(!that.createDialog){
        //         that.createDialog = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.create",that);
        //     }
        //     that.createDialog.open();
        // },
        // onSubmit: function(){
        //     let oEmp = {
        //         EmployeeID_EMP_ID :sap.ui.getCore().byId("input1").getValue(),
        //         CompanyName :sap.ui.getCore().byId("input2").getValue(),
        //         Role :sap.ui.getCore().byId("input3").getValue(),
        //         StartDate :sap.ui.getCore().byId("input4").getValue(),
        //         EndDate: sap.ui.getCore().byId("input5").getValue(),
        //         Responsibilities :sap.ui.getCore().byId("input6").getValue(),
        //     }
        //     var oModel = that.getOwnerComponent().getModel();
        //     oModel.create("/EmployeeExperience",oEmp,{
        //         success:function(response){
        //             sap.m.MessageToast.show("successfull");
        //             oModel.refresh();
        //         },error:function(error){
        //             sap.m.MessageToast.show("Error");
        //             console.log(error);
        //         }
        //     })
        //     that.createDialog.close();
        // },
        // onFullScreen: function(){
        //     var oFCL = this.getView().getParent().getParent(); // Get the FlexibleColumnLayout
        //     oFCL.setLayout(sap.f.LayoutType.MidColumnFullScreen); // Expand second column to full-screen,
        // },
    });
});