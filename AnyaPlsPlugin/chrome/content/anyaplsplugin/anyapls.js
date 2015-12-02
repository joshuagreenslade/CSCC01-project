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
        //TODO: fix the following code so that it won't display items that have already been displayed.
        if ((item != null) && (!item.isNote()) && (!item.isAttachment())) {
            var itemBox = document.getElementById('dynamic-fields');
				//alert('aaa');
				var sql = "SELECT * FROM customField WHERE itemID=?"
				var itemField = this.DB.query(sql, [item.id]);
				for (var i = 0; i < itemField.length; i++) {
					var flabel = document.createElement('label');
					flabel.className = 'fieldNames';
					var field = itemField[i].fieldName;
					flabel.setAttribute('value', field);
					var vlabel = document.createElement('label');
					vlabel.className = "fieldValue";
					var value = itemField[i].fieldValue;
					vlabel.textContent = value;
					var row = document.createElement('row');
					row.appendChild(flabel);
					row.appendChild(vlabel);
					itemBox.appendChild(row);
				}
            //return true;
        } else {
        	   return false;	
        }
        
          	
    },
    
    batchEditing: function () {
        window.open("chrome://anyaplsplugin/content/batchediting.xul", "", "chrome, centerscreen");
    },

    checkboxClicked: function () {

        var checkbox = document.getElementById('custom-field-search-checkbox');
        var searchbar = document.getElementById('zotero-tb-search');

        //reset the searchbar and erase the search results
        searchbar.value = '';
        Zotero.AnyaPls.searchCustomFields();

        if(checkbox.hasAttribute('checked')) {

            //change the oncommand value of the search box to go to searchCustomFields function, and remove the
            //onkeypress and oninput fields to disable pressing enter because it will call the original search method
            searchbar.setAttribute('onkeypress', '');
            searchbar.setAttribute('oninput', '');
            searchbar.setAttribute('oncommand', 'Zotero.AnyaPls.searchCustomFields()');
        }
        else {

            //reset the oncommand value to the original command
            searchbar.setAttribute('oncommand', 'ZoteroPane_Local.search()');
            searchbar.setAttribute('onkeypress', 'ZoteroPane_Local.handleSearchKeypress(this, event)');
            searchbar.setAttribute('oninput', 'ZoteroPane_Local.handleSearchInput(this, event)');
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

        for(var i=0; i < results.length; i++) {
            ids.push(results[i].itemID);
        }

        //collapse rows to only show items
        ZoteroPane.itemsView.collapseAllRows();

        //reset the itemView
        ZoteroPane.itemsView.refresh();
        ZoteroPane.itemsView.sort();

        //hide an item if its id is not in the list of ids
        for(var i=0; i < ZoteroPane.getSortedItems().length; i++) {
            if(ids.indexOf(ZoteroPane.getSortedItems()[i]._id) == -1) {
                ZoteroPane.itemsView._hideItem(i);
                i--;
            }
        }

        ZoteroPane.itemsView.sort();
    }
};
