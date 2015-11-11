Zotero_AnyaPls_DisplayCustomForm = function () {};

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};
Zotero_AnyaPls_DisplayCustomForm.init = function () {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var item = ZoteroPane.getSelectedItems()[0];
    var sql_search = "SELECT fieldName,fieldValue FROM customField WHERE itemID='" + item.id + "'";
    var result = Zotero.AnyaPls.DB.query(sql_search);
    var displayBox = document.getElementById('display-box');

    //add each field for the selected item to the window
    for(var i = 0; i < result.length; i++) {
        displayBox.appendItem(result[i].fieldName + ": " + result[i].fieldValue);
    }
};
