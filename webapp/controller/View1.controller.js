sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller,Filter,FilterOperator,Sorter) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View1", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
        },
        NavToMid: function(oEvent){
            var oTable = that.byId("empData");
            var oItem = oEvent.getSource().getBindingContext().getProperty();
            that.oEventBus.publish("flexible","setView2",oItem);
        },
        searchField: function(oEvent){
            var oFilter = [];
            var oSearch = oEvent.getSource().getValue();
            if(oSearch){
                oFilter.push(new Filter({
                    path: "EMP_NAME",
					operator: FilterOperator.Contains,
					value1: oSearch,
					caseSensitive: false
                }))
            }
            var oTable = that.getView().byId("empData");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },
        onSort: function() {
            var oTable = this.getView().byId("empData");
            var oBinding = oTable.getBinding("items");
            this.bDescending= !this.bDescending; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];
            aSorter.push(new sap.ui.model.Sorter("EMP_NAME", this.bDescending, bGroup));
            oBinding.sort(aSorter);
        },
        // onAdd: function(){
        //     if(!that.createDialog){
        //         that.createDialog = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.create",that)
        //     }
        //     that.createDialog.open();
        // }
    });
});