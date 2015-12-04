
Zotero_AnyaPls_BatchEdit = function () {};

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};

Zotero_AnyaPls_BatchEdit.init = function () {
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
//    document.getElementById('instructions').setAttribute('value', );

    //hide the add tag stuff if an item was not selected
    if (items.length) {
        document.getElementById('add-tags').setAttribute("hidden", "false");
    }
    else {
        document.getElementById('add-tags').setAttribute("hidden", "true");
    }

    updateDisplay();
};

updateDisplay = function() {

    var displayBox = document.getElementById('tag-display-box');
    displayBox.clearSelection();

    //remove all tags from the listbox
    var total_rows = displayBox.getRowCount();
    for(var i = 0; i < total_rows; i++) {
        displayBox.removeItemAt(0);
    }

    //put each tag into the listbox
    //this updates the listbox to show the current list of tags
    var all_tags = Zotero.Tags.search();
    for (var id in all_tags) {
        displayBox.appendItem(all_tags[id].name, id);
    }

};

Zotero_AnyaPls_BatchEdit.add = function() {
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var items = ZoteroPane.getSelectedItems();
    var tag = document.getElementById('tag-name');

    //add the new tag to each of the selected items
    for (var i = 0; i < items.length; i++) {
        items[i].addTag(tag.value, "0")
    }

    tag.value = '';
    updateDisplay();

};

Zotero_AnyaPls_BatchEdit.merge = function() {
    Zotero_AnyaPls_BatchEdit.rename();
};

Zotero_AnyaPls_BatchEdit.rename = function() {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var selected_tags = document.getElementById('tag-display-box').selectedItems;
    var tags = [];

    if(selected_tags == undefined)
        document.getElementById('tag-display-box').clearSelection();

    //if atleast one tag was selected
    if(selected_tags) {

        var message = "Please enter the new name for the following tags:\n";
        var oldName = selected_tags[0].label;

        //add the labels of the selected tags to the message and get the ids of the selected tags
        for(var i = 0; i < selected_tags.length; i++) {
            message = message + selected_tags[i].label + ", ";
            tags.push(selected_tags[i].value);
        }

        //remove the last comma and add the remaining message
        message = message.substring(0, message.length - 2);
        message = message + ".\nThe window will be closed and tags will be changed in all associated items.";

        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService);

        var newName = {value: oldName};
        var result = promptService.prompt(window, "Rename Tags", message, newName, '', {});

        if (!result || !newName.value) {
            return;
        }

        if (tags.length) {
            var promises = [];
            Zotero.DB.beginTransaction();

            //rename the selected tags
            for (var i = 0; i < tags.length; i++) {
                promises.push(Zotero.Tags.rename(tags[i], newName.value));
            }

            Zotero.DB.commitTransaction();
        }
        // Colored tags don't need to exist, so in that case
        // just rename the color setting
        else {
            var self = this;
            Zotero.Tags.getColor(this.libraryID, oldName)
                .then(function (color) {
                    if (color) {
                        return Zotero.Tags.setColor(
                            self.libraryID, oldName, false
                        )
                            .then(function () {
                                return Zotero.Tags.setColor(
                                    self.libraryID, newName, color
                                )
                            });
                    }
                    else {
                        throw new Error("Can't rename missing tag");
                    }
                })
                .done();
        }
    }

    //update the list of tags
    updateDisplay();
};

Zotero_AnyaPls_BatchEdit.delete = function() {

    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var selected_tags = document.getElementById('tag-display-box').selectedItems;
    var tags = [];

    if(selected_tags == undefined)
        document.getElementById('tag-display-box').clearSelection();

    //a message for the confirmation window
    var message = "Are you sure you want to delete the following tags:\n";

    //add the labels of the selected tags to the message and get the ids of the selected tags
    for(var i = 0; i < selected_tags.length; i++) {
        message = message + selected_tags[i].label + ", ";
        tags.push(selected_tags[i].value);
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
        if (tags.length) {
            Zotero.Tags.erase(tags);
            Zotero.Tags.purge(tags);
        }

        Zotero.DB.commitTransaction();

        // If only a tag color setting, remove that
        if (!tags.length) {
            Zotero.Tags.setColor(this.libraryID, name, false);
        }
    }
    else
        return;

    //update the list of tags
    updateDisplay();
};
