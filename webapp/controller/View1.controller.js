sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], (Controller,Filter,FilterOperator,Sorter) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View1", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
        },
        onAfterRendering(){
            var oModel = that.getOwnerComponent().getModel("globalfclModel");

        },
        NavToMid: function(oEvent){
            var oModel = that.getOwnerComponent().getModel("globalfclModel");
            var oItem = oEvent.getSource().getBindingContext().getProperty();
            that.oEventBus.publish("flexible","setView2",oItem);
        },
        dateFormat: function(date){
            if (date) {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "YYYY-MM-dd"});
                    return oDateFormat.format(new Date(date));
            }  
        },
        excelDownload: function(){
            var rows = [];
            var table = that.getView().byId("empExpTable").getItems();      // to get the data in the table
            table.forEach(val => {
                var data = val.getBindingContext().getObject();             // to get values in the each row
                delete data['__metadata'];                                  // to delete the column metadata which is not required for us
                rows.push(data);                                            // push the data into the array
            })
            const worksheet = XLSX.utils.json_to_sheet(rows);               //store the array data into a sheet
            const workbook = XLSX.utils.book_new();                         //creating a excel workbook
            XLSX.utils.book_append_sheet(workbook,worksheet,"EMPLOYEE INFO");   //storing the worksheet data into workbook with the given name
            XLSX.writeFile(workbook,"EMPLOYEE.xlsx");                       //download the file with the given name with extension
        },
        excelUpload: function(){
            if(!that.upload){
                that.upload = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.upload",that);
            }
            that.upload.open();
        }
    });
});