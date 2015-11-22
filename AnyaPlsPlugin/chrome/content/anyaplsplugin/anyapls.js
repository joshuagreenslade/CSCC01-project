/**
 * Created by Kaida on 05/11/2015.
 *
 * This is the main class of our "AnyaPls" plugin which have feature customField, BatchEditing, etc
 * Every time a new feature is added, please create a new "featurename.js" and "featurename.xul"
 */

//global variables needed for the custom field search
var initialized = false;
var oldItemGroup;

Zotero.AnyaPls = {
    DB: null,
    init: function () {
        this.DB = new Zotero.DBConnection('anyaPls');
        if (!this.DB.tableExists("customField")) {
            this.DB.query("CREATE TABLE " + "customField" + " (itemID INTEGER, fieldName TEXT, fieldValue TEXT)");
        }
    },

    getZoteroPane: function () {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator);
        var enumerator = wm.getEnumerator("navigator:browser");
        while (enumerator.hasMoreElements()) {
            var win = enumerator.getNext();
            if (!win.ZoteroPane) continue;
            return win.ZoteroPane;
        }
    },

    customField: function () {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var items = ZoteroPane.getSelectedItems();

        if (items[0] != null) {

            //stop the window from opening if the user selected a note or attachement
            var open_window = 1;
            for (var i = 0; i < items.length; i++) {
                if (items[i].isNote() || items[i].isAttachment()) {
                    open_window = 0;
                }
            }
            if (open_window) {
                window.openDialog("chrome://anyaplsplugin/content/customform.xul", "", "chrome, dialog=0, modal, centerscreen");
            }
        } else {
            return false;
        }
    },


    displayCustomField: function () {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var item = ZoteroPane.getSelectedItems()[0];

        if ((item != null) && (!item.isNote()) && (!item.isAttachment())) {
            window.openDialog("chrome://anyaplsplugin/content/displayCustomFields.xul", "", "chrome, dialog=0, modal, centerscreen");
        }
        else {
            return false;
        }
    },

    batchEditing: function () {

        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var items = ZoteroPane.getSelectedItems();

        if (items[0] != null) {
            //window.alert("item has been selected");
            window.openDialog("chrome://anyaplsplugin/content/batchediting.xul", "", "chrome, dialog=0, modal, centerscreen");
        } else {
            window.alert("item has not been selected");
            return false;
        }
    },

    checkboxClicked: function () {

        var checkbox = document.getElementById('custom-field-search-checkbox');
        var searchbar = document.getElementById('zotero-tb-search');

        //save the original ZoteroPane.itemsView._itemGroup (this solved an error)
        if(!initialized){
            oldItemGroup = ZoteroPane.itemsView._itemGroup;
            initialized = true;
        }

        //reset the searchbar and erase the search results
        searchbar.value = '';
        Zotero.AnyaPls.searchCustomFields();

        if(checkbox.hasAttribute('checked')) {

            //change the oncommand value of the search box to go to searchCustomFields function, and remove the
            //onkeypress and oninput fields because they caused errors
            searchbar.setAttribute('onkeypress', '');
            searchbar.setAttribute('oninput', '');
            searchbar.setAttribute('oncommand', 'Zotero.AnyaPls.searchCustomFields()');
        }
        else {

            //reset the itemGroup to the original value (this resolved errors)
            ZoteroPane.itemsView._itemGroup = oldItemGroup;
            searchbar.setAttribute('oncommand', 'ZoteroPane_Local.search()');
        }
    },


    searchCustomFields: function () {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var ids = [];

        //search the custom field table in the database for an entry with the fieldName or fieldValue that contains
        //the value specified in the search bar
        var input = document.getElementById('zotero-tb-search').value;
        var sql_search = "SELECT Distinct itemID FROM customField WHERE fieldName LIKE '%" + input + "%' OR fieldValue LIKE '%" + input + "%'";
        var results = this.DB.query(sql_search);

        //put the ids in a single array
        for(var i=0; i < results.length; i++) {
            ids.push(results[i].itemID);
        }

        var _libraryID;
        ZoteroPane.itemsView = false;

        //put the group of selected items into the itemGroup
        var itemGroup = {
             ref: {
                 libraryID: _libraryID
             },
             isSearchMode: function() { return true; },
             getItems: function () { return Zotero.Items.get(ids); },
             isLibrary: function () { return false; },
             isCollection: function () { return false; },
             isSearch: function () { return true; },
             isShare: function () { return false; },
             isTrash: function () { return false; }
        }

        //refresh the itemView
        if (ZoteroPane.itemsView) {
         ZoteroPane.itemsView.unregister();
        }
        ZoteroPane.itemsView = new Zotero.ItemTreeView(itemGroup, false);
        document.getElementById('zotero-items-tree').view = ZoteroPane.itemsView;
    }
};