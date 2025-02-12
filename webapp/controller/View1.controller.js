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
        /*  -------------    Navigate to master page to detail page   ---------------- */
        NavToMid: function(oEvent){
            var oModel = that.getOwnerComponent().getModel("globalfclModel");
            var oItem = oEvent.getSource().getBindingContext().getProperty();
            that.oEventBus.publish("flexible","setView2",oItem);
        },
        /* --------------  Changing the date format using formatter -----------------*/
        dateFormat: function(date){
            if (date) {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "YYYY-MM-dd"});
                    return oDateFormat.format(new Date(date));
            }  
        },
        /*  -----------------  Downloading an excel file with Data in view 1 -----------------*/
        excelDownload: function(){
            var rows = [];
            var table = that.getView().byId("empExpTable").getItems();
            var table1 = that.getView().byId("empForm").getItems();
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
        /* ---------------------- Downloading an excel file which contains the headers of three views ------------------------*/
        emptyDownload: function(){
            var rows= [];
            var headers = 
            ["EmployeeID_EMP_ID","CompanyName","Role","StartDate","EndDate","Responsibilities","EMP_ID","EMP_NAME","EMP_BLODD_GRP","EMP_DESIG","EMP_EMAIL","EMP_CONT","EMP_ADDRESS","EMP_BRANCH",
                "PLANT_ID","PLANT_NAME","PLANT_LOC","PLANT_CONT","PLANT_EMAIL","PLANT_HEAD","PLANT_REVENUE","PLANT_CUST_COUNT"];
            rows.push(headers);
            // const worksheet = XLSX.utils.json_to_sheet(rows);
            var oSheet = XLSX.utils.aoa_to_sheet(rows);
            var oWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(oWorkbook, oSheet, "Employee Data");  
            XLSX.writeFile(oWorkbook, "EmployeeData.xlsx");
        },
        /*  ------------------- for opening the fragment to upload file --------------*/
        fileSelection: function(){
            if(!that.upload){
                that.upload = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.upload",that);
            }
            that.upload.open();
        },
        /* ---------------------  storing the selected excel file data into an array ------------- */
        fileUpload: function(oEvent){
            var files = oEvent.getParameter("files");
            if(files.length>0){
                for(var i= 0 ;i<files.length;i++){
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
                }

                reader.onerror= function(ex){
                    console.log(ex);
                }
                reader.readAsArrayBuffer(files[0]);
            }
        }
        },
        /*  ----------------------- to upload an excel file ------------------ */
        uploadExcel: function(){
            var empExp = [];
            var emp = [];
            var plant = [];
            tableData.forEach(entry => {
                if (entry.EmployeeID_EMP_ID) {
                    var startdate = entry.StartDate;
                    startdate = new Date((startdate - 25569) * 86400 * 1000);
                    var year1 = startdate.getFullYear();
                    var month1 = ("0" + (startdate.getMonth() + 1)).slice(-2); 
                    var day1 = ("0" + startdate.getDate()).slice(-2);
                    var formattedStartDate = `${year1}-${month1}-${day1}`;
                    var enddate = entry.EndDate;
                    enddate = new Date((enddate - 25569) * 86400 * 1000);
                    var year2 = enddate.getFullYear();
                    var month2 = ("0" + (enddate.getMonth() + 1)).slice(-2); 
                    var day2 = ("0" + enddate.getDate()).slice(-2);
                    var formattedEndDate = `${year2}-${month2}-${day2}`;
                    empExp.push({
                        EmployeeID_EMP_ID: entry.EmployeeID_EMP_ID,
                        CompanyName: entry.CompanyName,
                        Role: entry.Role,
                        StartDate: formattedStartDate,
                        EndDate: formattedEndDate,
                        Responsibilities: entry.Responsibilities
                    });
                }
                if (entry.EMP_ID) {
                    emp.push({
                        EMP_ID: entry.EMP_ID,
                        EMP_NAME: entry.EMP_NAME,
                        EMP_BLODD_GRP: entry.EMP_BLODD_GRP,
                        EMP_DESIG: entry.EMP_DESIG,
                        EMP_EMAIL: entry.EMP_EMAIL,
                        EMP_CONT: entry.EMP_CONT + "",
                        EMP_ADDRESS: entry.EMP_ADDRESS,
                        EMP_BRANCH: entry.EMP_BRANCH
                    });
                }
                if(entry.PLANT_ID){
                    plant.push({
                        PLANT_ID:entry.PLANT_ID,
                        PLANT_NAME:entry.PLANT_NAME,
                        PLANT_LOC:entry.PLANT_LOC,
                        // PLANT_AVATAR:entry.PLANT_AVATAR,
                        PLANT_CONT:entry.PLANT_CONT,
                        PLANT_EMAIL:entry.PLANT_EMAIL,
                        PLANT_HEAD:entry.PLANT_HEAD,
                        PLANT_REVENUE:entry.PLANT_REVENUE,
                        PLANT_CUST_COUNT:entry.PLANT_CUST_COUNT
                    })
                }
            });
            that.empExp = empExp;
            that.emp = emp;
            that.plant = plant;
            that.empExp.forEach(function(oEntry){
                var oModel = that.getOwnerComponent().getModel();
                oModel.create("/EmployeeExperience",oEntry,{
                    success: function(response){
                        sap.m.MessageToast.show("Excel Uploaded successfully!");
                        console.log("employee experience");
                    },error(error){
                        console.log(error);
                    }      
                })
            })
            that.emp.forEach(function(oEmployee){
                var oModel = that.getOwnerComponent().getModel();
                oModel.create("/EMPLOYEE",oEmployee,{
                    success: function(response){
                        sap.m.MessageToast.show("Employee details entered successfully!");
                        console.log("employee");
                    },else(error){
                        console.log(error);
                    }
                })
            })
            that.plant.forEach(function(oPlant){
                var oModel = that.getOwnerComponent().getModel();
                oModel.create("/PLANTS",oPlant,{
                    success: function(response){
                        sap.m.MessageToast.show("Plant details entered successfully");
                        console.log("plant");
                    },else(error){
                        console.log(error);
                    }
                })
            })
            that.upload.close();
        },
        onDeleteEmp: function(oEvent){
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext();
                var oModel = that.getOwnerComponent().getModel();
                var sPath = oContext.getPath();
                oModel.remove(sPath,{
                    success:function()
                    {
                         sap.m.MessageToast.show("Employee Deleted");
                    },
                    error:function(error)
                    {
                        console.log(error)
                        sap.m.MessageToast.show("Error");
                    }
                })
            },
    });
});