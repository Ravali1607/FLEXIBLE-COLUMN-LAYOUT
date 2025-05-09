sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageToast"
], (Controller,Filter,FilterOperator,Sorter,Fragment,Spreadsheet,MessageToast) => {
    "use strict";
    var that;
    return Controller.extend("flexiblecolumnlayout.controller.View1", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
            var jQueryScript = document.createElement('script');
 
            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js');
 
            document.head.appendChild(jQueryScript);

            var jQueryScript1 = document.createElement('script');
            jQueryScript1.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js');
            document.head.appendChild(jQueryScript1);

            var jQueryScript2 = document.createElement('script');
            jQueryScript2.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js');
            document.head.appendChild(jQueryScript2);

            // that.getView().setModel(new sap.ui.model.json.JSONModel({
            //     currentDate : new Date()
            // }))
        },
        onAfterRendering(){
            var oModel = that.getOwnerComponent().getModel("globalfclModel");
        },
        /*  -------------    Navigate to master page to detail page   ---------------- */
        NavToMid: function(oEvent){
            // var oModel = that.getOwnerComponent().getModel("globalfclModel");
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
        /*  -----------------  Downloading an excel file with Data in view 1 -----------------  */
        // excelDownload: function(){
        //     var rows = [];
        //     var table = that.getView().byId("empExpTable").getItems();
        //     table.forEach(val => {
        //         var data = val.getBindingContext().getObject();                     // to get values in the each row
        //         delete data['__metadata'];                                          // to delete the column metadata which is not required for us
        //         rows.push(data);                                                    // push the data into the array
        //     })
        //     const worksheet = XLSX.utils.json_to_sheet(rows);                       //store the array data into a sheet
        //     const workbook = XLSX.utils.book_new();                                 //creating a excel workbook
        //     XLSX.utils.book_append_sheet(workbook,worksheet,"EMPLOYEE INFO");       //storing the worksheet data into workbook with the given name
        //     XLSX.writeFile(workbook,"EMPLOYEE.xlsx");                               //download the file with the given name with extension
        // },
        /*   --------------------  Combining the columns when downloading an excel file with Data ------------------ */
        excelDownload: function() {
            var rows = [];
            var table = that.getView().byId("empExpTable").getItems();
            table.forEach(val => {
                var data = val.getBindingContext().getObject();
                delete data['__metadata'];
                if (data.Role && data.CompanyName) {
                    data.Designation = `${data.CompanyName} - ${data.Role}`;
                    delete data.Role;                     //delete data['ID'];
                    delete data.CompanyName;            //delete data['CompanyName'];
                }
                // data.ID = data.ID + " " + data.CompanyName;
                
                rows.push(data);
            })
            
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "EMPLOYEE INFO");
            XLSX.writeFile(workbook, "EMPLOYEE.xlsx");
        },
        /* ---------------------- Downloading an excel file which contains the headers of three views ------------------------*/
        emptyDownload: function(){
            var rows= [];
            var headers = 
            ["EmployeeID_EMP_ID","CompanyName","Role","StartDate","EndDate","Responsibilities","EMP_NAME","EMP_BLODD_GRP","EMP_DESIG","EMP_EMAIL","EMP_CONT","EMP_ADDRESS","EMP_BRANCH",
                "PLANT_ID","PLANT_NAME","PLANT_LOC","PLANT_CONT","PLANT_EMAIL","PLANT_HEAD","PLANT_REVENUE","PLANT_CUST_COUNT"];
            rows.push(headers);
            // const worksheet = XLSX.utils.json_to_sheet(rows);
            var oSheet = XLSX.utils.aoa_to_sheet(rows);
            var oWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(oWorkbook, oSheet, "Employee Data");  
            XLSX.writeFile(oWorkbook, "EmployeeData.xlsx");
        },
        /*  ------------------- for opening the fragment to upload file --------------*/
        fileSelection: function(oEvent){
            if(!that.upload){
                that.upload = sap.ui.xmlfragment("flexiblecolumnlayout.fragments.upload",that);
            }
            that.upload.open();
        },
        /* ---------------------  storing the selected excel file data into an array ------------- */
        fileUpload: function(oEvent){
            var files = oEvent.getParameter("files");
            if(files.length>0){
                for(var i=0; i<files.length; i++){
                    var oFiles = files[i];
                    var reader = new FileReader();
                    var tableData = [];
                    reader.onload = function(e){
                        var data = e.target.result;
                        var workbook = XLSX.read(data,{
                            type : "array"
                        });
                        
                        workbook.SheetNames.forEach(sheetName => {
                            var xl_row_data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            tableData = [...tableData,...xl_row_data]
                        });
                        that.tableData = tableData
                    }
                    reader.onerror= function(ex){
                        console.log(ex);
                    }
                    reader.readAsArrayBuffer(oFiles);
                }
            }
        },
        /*  ----------------------- to upload an excel file --------------------------- */
        uploadExcel: function(){
            var tableData = that.tableData;
            var empExp = [];
            var emp = [];
            var plant = [];
            // var tableData = that.tableData[i];
            tableData.forEach(entry => {
                if (entry.EmployeeID_EMP_ID) {
                    if(entry.EmployeeID_EMP_ID && entry.CompanyName && entry.Role && entry.StartDate && entry.EndDate && entry.Responsibilities){
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
                    }else{
                        sap.m.MessageToast.show("enter valid employee experience details ");
                    }
                }
                if (entry.EmployeeID_EMP_ID) {
                    if(entry.EmployeeID_EMP_ID && entry.EMP_NAME && entry.EMP_BLODD_GRP && entry.EMP_DESIG && entry.EMP_EMAIL && entry.EMP_CONT && entry.EMP_ADDRESS && entry.EMP_BRANCH){
                        emp.push({
                            EMP_ID: entry.EmployeeID_EMP_ID,
                            EMP_NAME: entry.EMP_NAME,
                            EMP_BLODD_GRP: entry.EMP_BLODD_GRP,
                            EMP_DESIG: entry.EMP_DESIG,
                            EMP_EMAIL: entry.EMP_EMAIL,
                            EMP_CONT: entry.EMP_CONT + "",
                            EMP_ADDRESS: entry.EMP_ADDRESS,
                            EMP_BRANCH: entry.EMP_BRANCH
                        });
                    }else{
                        sap.m.MessageToast.show("Enter all the fields ");
                    }
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
            empExp.forEach(function(oEntry){
                that.getOwnerComponent().getModel().read("/EmployeeExperience",{
                    filters : [new sap.ui.model.Filter("ID",sap.ui.model.FilterOperator.EQ,oEntry.ID)],
                    success: function(id){
                        if(id.results.length>0){
                            // var updatePath = "/EmployeeExperience(" + oEntry.EmployeeID_EMP_ID + ")"
                            var updatePath = `/EmployeeExperience('${id.ID}')`
                            that.getOwnerComponent().getModel().update(updatePath, oEntry, {
                                success: function(response) {
                                    sap.m.MessageToast.show("Employee updated successfully!");
                                },
                                error: function(error) {
                                    console.log(error);
                                    sap.m.MessageToast.show("Error updating employee");
                                }
                            });
                        }
                        else{
                            that.getOwnerComponent().getModel().create("/EmployeeExperience",oEntry,{
                                success: function(response){
                                    sap.m.MessageToast.show("Employee Experience information created successfully");
                                }
                            })
                        }
                    }
                })
            })
            emp.forEach(function(oEmployee){
                that.getOwnerComponent().getModel().read("/EMPLOYEE",{
                    filters : [new sap.ui.model.Filter("EMP_ID",sap.ui.model.FilterOperator.EQ,oEmployee.EMP_ID)],
                    success: function(id){
                        if(id.results.length>0){
                            // var updatePath = "/EMPLOYEE(" + oEmployee.EMP_ID + ")"
                            var updatePath = `/EMPLOYEE('${oEmployee.EMP_ID}')`
                            that.getOwnerComponent().getModel().update(updatePath, oEmployee, {
                                success: function(response) {
                                    sap.m.MessageToast.show("Employee updated successfully!");
                                },
                                error: function(error) {
                                    console.log(error);
                                    sap.m.MessageToast.show("Error updating employee");
                                }
                            });
                        }
                        else{
                            that.getOwnerComponent().getModel().create("/EMPLOYEE",oEmployee,{
                                success: function(response){
                                    sap.m.MessageToast.show("Employee information created successfully");
                                }
                            })
                        }
                    }
                })
            })
            plant.forEach(function(oPlant){
                that.getOwnerComponent().getModel().read("/PLANTS",{
                    filters : [new sap.ui.model.Filter("PLANT_ID",sap.ui.model.FilterOperator.EQ,oPlant.PLANT_ID)],
                    success: function(id){
                        if(id.results.length>0){
                            // var updatePath = "/PLANTS(" + oPlant.PLANT_ID + ")"
                            var updatePath = `/PLANTS('${id.results.PLANT_ID}')`
                            that.getOwnerComponent().getModel().update(updatePath, oPlant, {
                                success: function(response) {
                                    sap.m.MessageToast.show("Employee updated successfully!");
                                },
                                error: function(error) {
                                    console.log(error);
                                    sap.m.MessageToast.show("Error updating employee");
                                }
                            });
                        }else{
                            that.getOwnerComponent().getModel().create("/PLANTS",oPlant,{
                                success: function(response){
                                    sap.m.MessageToast.show("Employee Experience information created successfully");
                                }
                            })
                        }
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
   
        // pdfDownload: function() {
        //     var oTable = this.getView().byId("empExpTable");
        //     var oColumns = oTable.getColumns();
        //     var oItems = oTable.getItems();
        //     var tableBody = [];
        //     var headerRow = [];
        //     var columnWidths = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
            
        //     oColumns.forEach(function(oColumn) {
        //         headerRow.push({ text: oColumn.getHeader().getText(), style: 'tableHeader' });
        //     });
        //     tableBody.push(headerRow);
            
        //     oItems.forEach(function(oItem) {

        //         var dataRow = [];
        //         var oCells = oItem.getCells();
        //         oCells.forEach(function(oCell) {
        //             dataRow.push({ text: oCell.getText(), style: 'tableContent' });
        //         });
        //         tableBody.push(dataRow);
        //     });
            
        //     var docDefinition = {
        //         content: [
        //             { text: 'Employee Experience Report', style: 'header' },
        //             { text: '\n' }, 
        //             {
        //                 table: {
        //                     headerRows: 1,
        //                     // widths: Array(oColumns.length).fill('*'),
        //                     widths: columnWidths,
        //                     body: tableBody
        //                 },
        //             }
        //         ],
        //         styles: {
        //             header: {
        //                 fontSize: 14,
        //                 bold: true,
        //                 alignment: 'center',
        //                 margin: [0, 0, 0, 10]
        //             },
        //             tableHeader: {
        //                 bold: true,
        //                 fontSize: 9,
        //                 color: 'black'
        //             },
        //             tableContent: {
        //                 fontSize: 8 
        //             }
        //         },
        //         pageSize: 'A4',
        //         pageOrientation: 'potrait'
        //     };
        //     pdfMake.createPdf(docDefinition).download('Employee_Experience.pdf');
        //     sap.m.MessageToast.show("PDF Downloaded Successfully!");
        // }
        pdfDownload: function() {
            var oTable = this.getView().byId("empExpTable");
            var oColumns = oTable.getColumns();
            var oItems = oTable.getItems();
            var tableBody = [];
            var columnWidths = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
            var aData = [];
            var iRoleColumnIndex = 2; 
            oItems.forEach(function(oItem) {
                var oCells = oItem.getCells();
                var rowData = {
                    role: oCells[iRoleColumnIndex].getText(),
                    cells: []
                };
                oCells.forEach(function(oCell) {
                    rowData.cells.push(oCell.getText());
                });
                aData.push(rowData);
            });
            aData.sort(function(a, b) {
                return a.role.localeCompare(b.role); 
                // return b.role.localeCompare(a.role); // Descending
            });
            var headerRow = oColumns.map(function(oColumn) {
                return { text: oColumn.getHeader().getText(), style: 'tableHeader' };
            });
            tableBody.push(headerRow);
            aData.forEach(function(oRow) {
                var dataRow = oRow.cells.map(function(sCellText) {
                    return { text: sCellText, style: 'tableContent' };
                });
                tableBody.push(dataRow);
            });
            var docDefinition = {
                content: [
                    { text: 'Employee Experience Report', style: 'header' },
                    { text: '\n' }, 
                    { 
                        table: {
                            headerRows: 1,
                            widths: columnWidths,
                            body: tableBody
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 14,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: 'black'
                    },
                    tableContent: {
                        fontSize: 8 
                    }
                },
                pageSize: 'A4',
                pageOrientation: 'portrait'
            };
            pdfMake.createPdf(docDefinition).download('Employee_Experience.pdf');
            sap.m.MessageToast.show("PDF Downloaded Successfully!");
        }
    });
});
// <!---------------- layout for the table in the pdf -----------------!>
// layout: {
//     hLineWidth: function(i, node) { return 0.5; },
//     vLineWidth: function(i, node) { return 0.5; },
//     hLineColor: function(i, node) { return '#aaa'; },
//     vLineColor: function(i, node) { return '#aaa'; },
//     paddingLeft: function(i, node) { return 4; },
//     paddingRight: function(i, node) { return 4; },
//     paddingTop: function(i, node) { return 2; },
//     paddingBottom: function(i, node) { return 2; }
// }
// pdfDownload: function(){
//     if (!window.pdfMake) {
//         sap.m.MessageToast.show("pdfMake library is not loaded!");
//         return;
//       }
//     var oTable = that.getView().byId("empExpTable");
//     var oColumns = oTable.getColumns();
//     var oItems = oTable.getItems();

//     var pdfContent = "Table Content:\n\n";
//     oColumns.forEach(function(oColumn){
//         pdfContent += oColumn.mAggregations.header.getProperty("text") + "\t";
//     });
//     pdfContent += "\n";

//     oItems.forEach(function(oItem) {
//         var oCells = oItem.getCells();
//         oCells.forEach(function(oCell){
//             pdfContent += oCell.getText() + "\t";
//         });
//         pdfContent += "\n";
//     });
//     var pdfDocGenerator = pdfMake.createPdf(pdfContent);
//     pdfDocGenerator.download("table.pdf");
//     sap.m.MessageToast.show("File Downloaded Successfully!");
// // }
// <!---------------- another way for sorting the column in the pdf document (manual sorting)  -------------------------!>
//  Get all items and their binding contexts
//  var aItems = [];
//  oItems.forEach(function(oItem) {
//      aItems.push({
//          context: oItem.getBindingContext(),
//          cells: oItem.getCells()
//      });
//  });
 
//  Sort items by role (assuming role is in the 3rd column - adjust index as needed)
//  aItems.sort(function(a, b) {
//      var roleA = a.cells[2].getText().toLowerCase(); // Change index to your role column
//      var roleB = b.cells[2].getText().toLowerCase();
//      return roleA.localeCompare(roleB);
     
//       For descending order:
//       return roleB.localeCompare(roleA);
//  });