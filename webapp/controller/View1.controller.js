sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet"
], (Controller,Filter,FilterOperator,Sorter,Fragment,Spreadsheet) => {
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
        fileSelection: function(){
            if(!that.upload){
                that.upload = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.upload",that);
            }
            that.upload.open();
        },
        fileUpload: function(oEvent){
            var files = oEvent.getParameter("files");
            if(files.length>0){
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data,{
                        type : "array"
                    });
                    var tableData = [];
                    workbook.SheetNames.forEach(sheetName => {
                        var xl_row_data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        tableData = [...tableData,...xl_row_data]
                    });
                    var jModel = tableData;
                    that.jModel = jModel ;
                }
                reader.onerror= function(ex){
                    console.log(ex);
                }
                reader.readAsArrayBuffer(files[0]);
            }
        },
        uploadExcel: function(){
            var jModel = that.jModel;
            // var oData = [];
            jModel.forEach(function(entry){
                var startdate = entry.StartDate;
                startdate = new Date((startdate - 25569) * 86400 * 1000);
                var year1 = startdate.getFullYear();
                var month1 = ("0" + (startdate.getMonth() + 1)).slice(-2); 
                var day1 = ("0" + startdate.getDate()).slice(-2);
                var formattedStartDate = `${year1}-${month1}-${day1}`;
                console.log(formattedStartDate);
                var enddate = entry.EndDate;
                enddate = new Date((enddate - 25569) * 86400 * 1000);
                var year2 = enddate.getFullYear();
                var month2 = ("0" + (enddate.getMonth() + 1)).slice(-2); 
                var day2 = ("0" + enddate.getDate()).slice(-2);
                var formattedEndDate = `${year2}-${month2}-${day2}`;
                console.log(formattedEndDate);
                var oEntry={
                    ID : entry.ID,
                    CompanyName : entry.CompanyName,
                    Role : entry.Role,
                    StartDate : formattedStartDate,
                    EndDate : formattedEndDate,
                    Responsibilities : entry.Responsibilities
                }
            //     oData.push(oEntry);
            // })
            var oModel = that.getOwnerComponent().getModel();
            oModel.create("/EmployeeExperience",oEntry,{
                success: function(response){
                    sap.m.MessageToast.show("Excel Uploaded successfully!");
                    console.log("success");
                },error(error){
                    console.log(error);
                }      
            })
        })
        }
    });
});