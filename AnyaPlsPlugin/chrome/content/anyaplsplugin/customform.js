Zotero_AnyaPls_CustomForm = function () {};

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};
Zotero_AnyaPls_CustomForm.init = function () {
    updateDisplay();
    //updatePossessiveDisplay();
};

updateDisplay = function() {

    var displayBox = document.getElementById('field-display-box');
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var item = ZoteroPane.getSelectedItems()[0];
    //queries fields that does not pertain with current item
    var sql_search = "SELECT DISTINCT fieldName,fieldValue FROM customField WHERE itemID!='" + item.id + "'";
    //queries fields that pertains with current item
    var sql_search_with_item = "SELECT DISTINCT fieldName,fieldValue FROM customField WHERE itemID='" + item.id + "'";

    //remove all custom fields from the listbox
    var total_rows = displayBox.getRowCount();
    for(var i = 0; i < total_rows; i++) {
        displayBox.removeItemAt(0);
    }

    //column indicator/separator
    displayBox.appendItem("\n<----Current item's fields---->");

    var result = Zotero.AnyaPls.DB.query(sql_search_with_item);

    //if column has no fields, display (none)
    if(!result.length)
        displayBox.appendItem("(insert new fields)");
    else
        for(var i = 0; i < result.length; i++) {
            displayBox.appendItem(result[i].fieldName + ": " + result[i].fieldValue);
        }

    //column indicator/separator
    displayBox.appendItem("<----Other custom fields---->");
    //put each custom field into the listbox
    //this updates the listbox to show the current list of custom fields
    var result = Zotero.AnyaPls.DB.query(sql_search);

    if(!result.length)
        displayBox.appendItem("(none)");
    else
        for(var i = 0; i < result.length; i++) {
            displayBox.appendItem(result[i].fieldName + ": " + result[i].fieldValue);
        }
};

//function to be used for bottom right box in custom field window

//updatePossessiveDisplay = function() {
//
//    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
//    var item = ZoteroPane.getSelectedItems()[0];
//    var displayBox = document.getElementById('display-box');
//    var sql_search = "SELECT DISTINCT fieldName,fieldValue FROM customField WHERE itemID='" + item.id + "'";
//    console.log("searching possesive: itemID is: "+ item.id);
//    //remove all custom fields from the listbox
//    var total_rows = displayBox.getRowCount();
//    for(var i = 0; i < total_rows; i++) {
//        displayBox.removeItemAt(0);
//    }
//
//    //put each custom field into the listbox
//    //this updates the listbox to show the current list of custom fields
//    var result = Zotero.AnyaPls.DB.query(sql_search);
//    for(var i = 0; i < result.length; i++) {
//        displayBox.appendItem(result[i].fieldName + ": " + result[i].fieldValue);
//    }
//};

Zotero_AnyaPls_CustomForm.selectField = function() {
    var displayBox = document.getElementById('field-display-box');
    var displayBox2 = document.getElementById('display-box');

    //the item selected from the display box
    var selected_field = displayBox.selectedItem || displayBox2.selectedItem;

    //put the selected field and value into the field and value textboxes
    document.getElementById("field").value = selected_field.label.split(": ")[0];
    document.getElementById("value").value = selected_field.label.split(": ")[1];
};

Zotero_AnyaPls_CustomForm.add = function() {

    var field = document.getElementById("field");
    var value = document.getElementById("value");
    var sql_add = "INSERT INTO " + "customField" + " VALUES (?,?,?)";
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();

    //Insert new field to all selected item
    for (var i = 0; i < items.length; i++) {
        Zotero.AnyaPls.DB.query(sql_add, [items[i].id, field.value, value.value]);
    }

    //reset the text boxes
    field.value = '';
    value.value = '';

    //update the list of fields
    updateDisplay();
};

Zotero_AnyaPls_CustomForm.modify = function() {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    var field = document.getElementById('field');
    var value = document.getElementById('value');
    var sql_modify = "UPDATE customField SET fieldValue=? WHERE itemID=? AND fieldName=?";
    for (var i = 0; i<items.length; i++) {
        Zotero.AnyaPls.DB.query(sql_modify, [value.value, items[i].id, field.value]);
    }

    //reset the text boxes
    field.value = '';
    value.value = '';

    //update the list of fields
    updateDisplay();
};

Zotero_AnyaPls_CustomForm.delete = function() {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    var field = document.getElementById('field');
    var value = document.getElementById('value');
    var sql_delete = "DELETE FROM customField WHERE itemID=? AND fieldName=? AND fieldValue=?";

    for (var i = 0; i<items.length; i++) {
        Zotero.AnyaPls.DB.query(sql_delete, [items[i].id, field.value, value.value]);
    }

    //reset the text boxes
    field.value = '';
    value.value = '';

    //update the list of fields
    updateDisplay();
};
