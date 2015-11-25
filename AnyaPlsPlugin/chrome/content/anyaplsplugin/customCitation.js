/**
 * Created by Maged on 2015-11-10.
 */

Zotero_AnyaPls_CustomCitation = function () {};

    var string='';


logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};

Zotero_AnyaPls_CustomCitation.init = function () {
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();

    //hide the add tag stuff if an item was not selected
    if (items.length) {
        document.getElementById('add-citation').setAttribute("hidden", "false");
    }
    else {
        document.getElementById('add-citation').setAttribute("hidden", "true");
    }

    updateDisplay();
};


Zotero_AnyaPls_CustomCitation.updatelist = function(){

    var io = {singleSelection:true};
    window.openDialog('chrome://zotero/content/selectItemsDialog.xul', '', 'chrome, modal, centerscreen', io);
    var selectedItemID = io.dataOut[0];
    selectedItem = Zotero.Items.get(selectedItemID);
    var fieldID;
    document.getElementById('item-select').setAttribute("hidden", "false");

    for (fieldID in selectedItem._itemData){
        var name = Zotero.ItemFields.getName(fieldID);
        var val = selectedItem.getField(fieldID);
        document.getElementById("item-select").appendItem(name, val);
    }

};
Zotero_AnyaPls_CustomCitation.add = function() {
    //var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    //var items = ZoteroPane.getSelectedItems();
    string = document.getElementById("item-select").selectedItem.value;
    document.getElementById("citation-textbox").value += string;
};
/**
 * Created by Maged on 2015-11-20.
 */
