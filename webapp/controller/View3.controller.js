sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library"
], (Controller,fioriLibrary) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View3", {
        onInit() {
            that=this;
            var oModel = that.getOwnerComponent().getModel();
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible","setView3",this.oBranch,this);
        },
        onAfterRendering: function(){
            this.oBranch();
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
                    },error: function(error){
                        sap.m.MessageToast.show("Error");
                        console.log(error);
                    }
                })
            }
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView2");
        },
        // onFullScreen: function(){
        //     var viewId = that.byId("page3");
        //     var oButton = that.byId("fullScreenButton");
        //     oFlexible.setLayout(fioriLibrary.LayoutType.EndColFullScreen);
        // },
        // onFullScreen: function () {
        //     var oFCL = this.getView().getParent().getParent(); // Get the FlexibleColumnLayout
        //     oFCL.setLayout(sap.f.LayoutType.EndColumnFullScreen); // Expand third column to full-screen

        // }
        onToggleFullScreen: function () {
            var oFCL = this.getView().getParent().getParent(); // Get FlexibleColumnLayout
            var oButton = this.getView().byId("btnFullScreen"); // Get button reference
            var sCurrentLayout = oFCL.getLayout(); // Get current layout
        
            if (sCurrentLayout === sap.f.LayoutType.EndColumnFullScreen) {
                oFCL.setLayout(sap.f.LayoutType.ThreeColumnsMidExpanded); // Restore layout
                oButton.setIcon("sap-icon://full-screen"); // Update button text
            } else {
                oFCL.setLayout(sap.f.LayoutType.EndColumnFullScreen); // Expand third column
                oButton.setIcon("sap-icon://exit-full-screen"); // Update button text
            }
        },
        forNextPage: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);    
            oRouter.navTo("View4");
        },
        // openFragment: function(){
        //     if(!that.plantDialog){
        //         that.plantDialog = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.plantcreate",that);
        //     }
        //     that.plantDialog.open();
        // },
        // onSubmit:function(){
        //     let oPlant = {
        //         PLANT_ID :sap.ui.getCore().byId("plant1").getValue(),
        //         PLANT_NAME :sap.ui.getCore().byId("plant2").getValue(),
        //         PLANT_LOC :sap.ui.getCore().byId("plant3").getValue(),
        //         PLANT_AVATAR :sap.ui.getCore().byId("plant4").getValue(),
        //         PLANT_CONT: sap.ui.getCore().byId("plant5").getValue(),
        //         PLANT_EMAIL :sap.ui.getCore().byId("plant6").getValue(),
        //         PLANT_HEAD :sap.ui.getCore().byId("plant7").getValue(),
        //         PLANT_REVENUE :sap.ui.getCore().byId("plant8").getValue(),
        //         PLANT_CUST_COUNT :sap.ui.getCore().byId("plant9").getValue(),
        //     }
        //     var oModel = that.getOwnerComponent().getModel();
        //     oModel.create("/PLANTS",oPlant,{
        //         success:function(response){
        //             sap.m.MessageToast.show("Plant Details added successfully");
        //             oModel.refresh();
        //             sap.ui.getCore().byId("plantData").getModel().refresh(true);
        //         },error:function(error){
        //             sap.m.MessageToast.show("Error while adding Plant");
        //             console.log(error);
        //         }
        //     })
        //     that.onRefresh();
        //     that.plantDialog.close();
        //     oModel.refresh();
        // },
    });
});