/**
 * Created by Kaida on 05/11/2015.
 */

Zotero_AnyaPls_CustomForm = function () {};

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};
Zotero_AnyaPls_CustomForm.init = function () {
    updateDisplay();
};

updateDisplay = function() {

    var displayBox = document.getElementById('field-display-box');
    var sql_search = "SELECT DISTINCT fieldName,fieldValue FROM customField";

    //remove all custom fields from the listbox
    var total_rows = displayBox.getRowCount();
    for(var i = 0; i < total_rows; i++) {
        displayBox.removeItemAt(0);
    }

    //put each custom field into the listbox
    //this updates the listbox to show the current list of custom fields
    var result = Zotero.AnyaPls.DB.query(sql_search);
    for(var i = 0; i < result.length; i++) {
        displayBox.appendItem(result[i].fieldName + ": " + result[i].fieldValue);
    }
}

Zotero_AnyaPls_CustomForm.selectField = function() {
    var displayBox = document.getElementById('field-display-box');

    //the item selected from the display box
    var selected_field = displayBox.selectedItem;

    //put the selected field and value into the field and value textboxes
    document.getElementById("field").value = selected_field.label.split(": ")[0];
    document.getElementById("value").value = selected_field.label.split(": ")[1];
}

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
