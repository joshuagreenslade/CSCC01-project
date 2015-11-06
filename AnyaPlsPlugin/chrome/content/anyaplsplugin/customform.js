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
    //io = window.arguments[0];
};

Zotero_AnyaPls_CustomForm.add = function() {

    var field = document.getElementById("field");
    var value = document.getElementById("value");
    alert("Field: " + field.value + " Value: " + value.value);
    var sql_add = "INSERT INTO " + "customField" + " VALUES (?,?,?)";
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    alert("Number of Item Selected: " + items.length);
    //Insert new field to all selected item
    for (var i = 0; i<items.length; i++) {
        Zotero.AnyaPls.DB.query(sql_add, [items[i].id, field.value, value.value]);
    }
    //Can remove window.close() if only want to close window when click OK.
    window.close();

};

Zotero_AnyaPls_CustomForm.modify = function() {

    //Can remove window.close() if only want to close window when click OK.
    window.close();
};

Zotero_AnyaPls_CustomForm.delete = function() {

    //this.DB = new Zotero.DBConnection('anyaPls');
    var sql_delete = "DELETE FROM customField WHERE itemID=? AND fieldName=?";
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    var field = document.getElementById('field');
    var value = document.getElementById('value');

    for (var i = 0; i<items.length; i++) {
        Zotero.AnyaPls.DB.query(sql_delete, [items[i].id, field.value]);
    }

    window.close();
};
