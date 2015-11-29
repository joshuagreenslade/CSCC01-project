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
                window.open("chrome://anyaplsplugin/content/customform.xul", "", "chrome, centerscreen");
            }
        } else {
            return false;
        }
    },


    displayCustomField: function () {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var item = ZoteroPane.getSelectedItems()[0];

        if ((item != null) && (!item.isNote()) && (!item.isAttachment())) {
            window.open("chrome://anyaplsplugin/content/displayCustomFields.xul", "", "chrome, dialog=0, centerscreen");
        }
        else {
            return false;
        }
    },
    
    itemView: function() {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var item = ZoteroPane.getSelectedItems()[0];
        //check if note or attachment
        if ((item != null) && (!item.isNote()) && (!item.isAttachment())) {
            //get info tab child and gets its last child
            var itemBox = document.getElementById('dynamic-fields');
            //Remove all the additional field
            for (var i =0; i<itemBox.childNodes.length; i++) {
                var last_Child = itemBox.lastChild;
                // last_Child = last_Child.childNodes[0];
                // check if  fields is dataModified
                if (last_Child.childNodes[0].getAttribute("fieldname") != "dateModified") {
                    itemBox.removeChild(last_Child);
                }
            }


            var sql = "SELECT * FROM customField WHERE itemID=?";
            var itemField = this.DB.query(sql, [item.id]);

            for (var i = 0; i < itemField.length; i++) {
                //create label node with addition field name
                var field_label = document.createElement('label');
                field_label.className = 'fieldname';
                field_label.setAttribute('value',  itemField[i].fieldName);

                //create value node with field's value
                var value_label = document.createElement('label');
                value_label.className = "fieldname";
                value_label.textContent = itemField[i].fieldValue;

                //create row and append both field and value node to it
                var row = document.createElement('row');
                row.appendChild(field_label);
                row.appendChild(value_label);

                itemBox.appendChild(row);
            }
            //return true;
        } else {
        	   return;
        }
        
          	
    },
    
    batchEditing: function () {
        window.open("chrome://anyaplsplugin/content/batchediting.xul", "", "chrome, centerscreen");
    },

    /*
    TODO: Fix bug:
        - Click on the checkbox and do a search
        - Now do BatchEditing and items cannot be select anymore
     */
    checkboxClicked: function () {

        var checkbox = document.getElementById('custom-field-search-checkbox');
        var searchbar = document.getElementById('zotero-tb-search');

        //if it is in fullscreen dont let the user search custom fields because it crashed the program
        if(ZoteroPane.isFullScreen()) {
            return;
        }

        //save the original ZoteroPane.itemsView._itemGroup (this solved an error)
        if(!initialized){
            oldItemGroup = ZoteroPane.itemsView._itemGroup;
            initialized = true;
        }

        //reset the searchbar and erase the search results
        searchbar.value = '';
        Zotero.AnyaPls.searchCustomFields();
        ZoteroPane.itemsView._itemGroup = oldItemGroup;
        ZoteroPane_Local.search();

        if(checkbox.hasAttribute('checked')) {

            //change the oncommand value of the search box to go to searchCustomFields function, and remove the
            //onkeypress and oninput fields because they caused errors
            searchbar.setAttribute('onkeypress', '');
            searchbar.setAttribute('oninput', '');
            searchbar.setAttribute('oncommand', 'Zotero.AnyaPls.searchCustomFields()');
        }
        else {

            //reset the oncommand value to the original command
            searchbar.setAttribute('oncommand', 'ZoteroPane_Local.search()');
        }
    },


    searchCustomFields: function () {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var ids = [];

        //search the custom field table in the database for an entry with the fieldName or fieldValue that contains
        //the value specified in the search bar
        var input = document.getElementById('zotero-tb-search').value;

        //if there is no input just do a normal search
        if(input == '') {
            ZoteroPane.itemsView._itemGroup = oldItemGroup;
            ZoteroPane_Local.search();
            return;
        }

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
