/**
 * Created by Kaida on 05/11/2015.
 *
 * This is the main class of our "AnyaPls" plugin which have feature customField, BatchEditing, etc
 * Every time a new feature is added, please create a new "featurename.js" and "featurename.xul"
 */

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

        //maybe only do this if tags and fields or everything is selected

        var checkbox = document.getElementById('custom-field-search-checkbox');
        var searchbar = document.getElementById('zotero-tb-search');

        if(checkbox.hasAttribute('checked')) {
            searchbar.setAttribute('oncommand', 'Zotero.AnyaPls.searchCustomFields()');
            console.log("checked");
        }
        else {
            searchbar.setAttribute('oncommand', 'ZoteroPane_Local.search()');
            console.log("unchecked");
        }
    },

    searchCustomFields: function () {

        //search the custom field table in the database for an entry with the fieldName or fieldValue thats contains the value specified in the search bar
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var input = document.getElementById('zotero-tb-search').value;
        var sql_search = "SELECT Distinct itemID FROM customField WHERE fieldName LIKE '%" + input + "%' OR fieldValue LIKE '%" + input + "%'";
        var results = this.DB.query(sql_search);

        //get the items that correspond to the selected itemID's selected from the customField table
        var ids = [];
        for(var i=0; i < results.length; i++) {
            console.log(i);
            ids.push(results[i].itemID);
        }
        console.log(ids);

        //display the items in the zotero display window

        //figure out how to display the items that were selected

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//first figure out how to add the normal search results to the database searched results then figure out how to not crash it//
//doesnt work on full screen at all                                                                                         //
//                                                                                                                          //
//if all else fails will have to open a window which displays the titles of the objects with the specified field            //
//so maybe make a backup first                                                                                              //
//          search custom fields button that opens a window where you enter text and in the window the title is displayed   //
//          (not the tree thing because thats really hard) and possibly the field/value that was found in the database      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //maybe use ZoteroPane.itemsView.setFilter('search', 's'), setFiter is in itemTreeView.js


        //currently works but crashes with error
        //"NS_ERROR_UNEXPECTED: Component returned failure code: 0x8000ffff (NS_ERROR_UNEXPECTED) [nsITreeSelection.select]"
        //if you try to click on something
        //after you search once for custom fields

        //once you search a custom field you can nolonger click on something or do a normal search again
        //once this function is run aleast once clicking items and normal search is no longer avaliable

        var _libraryID;
        this.itemsView = false;

         var itemGroup = {
             ref: {
                 libraryID: _libraryID
             },
        isSearchMode: function() { return true; },
         getItems: function (items) { return Zotero.Items.get(ids); },
         isLibrary: function () { return false; },
        isCollection: function () { return false; },
        isSearch: function () { return true; },
        isShare: function () { return false; },
        isTrash: function () { return false; }
        }
  //       if (this.itemsView) {
  //           this.itemsView.unregister();
  //       }
         this.itemsView = new Zotero.ItemTreeView(itemGroup, false);
         document.getElementById('zotero-items-tree').view = this.itemsView;
    }
};