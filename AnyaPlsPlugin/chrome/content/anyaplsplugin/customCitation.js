/**
 * Created by Maged on 2015-11-10.
 */

Zotero_AnyaPls_CustomCitation = function () {};

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

updateDisplay = function() {

    var displayBox = document.getElementById('citation-display-box');

    //remove all tags from the listbox
    var total_rows = displayBox.getRowCount();
    for(var i = 0; i < total_rows; i++) {
        displayBox.removeItemAt(0);
    }

    //put each tag into the listbox
    //this updates the listbox to show the current list of tags
    var all_tags = Zotero.Bibliography.search();
    for (var id in all_tags) {
        displayBox.appendItem(all_tags[id].name, id);
    }

};

Zotero_AnyaPls_CustomCitation.add = function() {
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    var tag = document.getElementById('citation-name');

    //add the new tag to each of the selected items
    for (var i = 0; i < items.length; i++) {
        items[i].addBibliography(tag.value, "0")
    }

    tag.value = '';
    updateDisplay();

};

Zotero_AnyaPls_CustomCitation.delete = function() {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var selected_tags = document.getElementById('citation-display-box').selectedItems;

    //a message for the confirmation window
    var message = "Are you sure you want to delete the following Bib:\n";

    //add the labels of the selected tags to the message and get the ids of the selected tags
    for(var i = 0; i < selected_tags.length; i++) {
        message = message + selected_tags[i].label + ", ";
        selected_tags[i] = selected_tags[i].value;
    }

    //remove the last comma and add the remaining message
    message = message.substring(0, message.length - 2);
    message = message + "?\nThey will be removed from all items.";

    //a window that confirms that the user wants to delete the selected tags
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Components.interfaces.nsIPromptService);

    var confirmed = promptService.confirm(window, "Delete Tags", message);

    if (confirmed) {
        Zotero.DB.beginTransaction();

        //delete the tags and update the database
        if (selected_tags.length) {
            Zotero.Bibliography.erase(selected_tags);
            Zotero.Bibliography.purge(selected_tags);
        }

        Zotero.DB.commitTransaction();

        // If only a tag color setting, remove that
        if (!selected_tags.length) {
            Zotero.Bibliography.setColor(this.libraryID, name, false);
        }
    }

    //update the list of tags
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
        document.getElementById("item-select").appendItem(name + val);
    }
};
/**
 * Created by Maged on 2015-11-20.
 */
