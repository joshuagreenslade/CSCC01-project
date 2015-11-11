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

    getZoteroPane: function() {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator);
        var enumerator = wm.getEnumerator("navigator:browser");
        while (enumerator.hasMoreElements()) {
            var win = enumerator.getNext();
            if (!win.ZoteroPane) continue;
            return win.ZoteroPane;
        }
    },

    customField: function(){
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var items = ZoteroPane.getSelectedItems();

        if (items[0] != null) {

            //stop the window from opening if the user selected a note or attachement
            var open_window = 1;
            for(var i = 0; i < items.length; i++) {
                if(items[i].isNote() || items[i].isAttachment()) {
                    open_window = 0;
                }
            }
            if(open_window) {
                window.openDialog("chrome://anyaplsplugin/content/customform.xul", "", "chrome, dialog=0, modal, centerscreen");
            }
        } else {
            return false;
        }
    },


    displayCustomField: function() {
        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var item = ZoteroPane.getSelectedItems()[0];

        if((item != null) && (!item.isNote()) && (!item.isAttachment())) {
            window.openDialog("chrome://anyaplsplugin/content/displayCustomFields.xul", "", "chrome, dialog=0, modal, centerscreen");
        }
        else {
            return false;
        }
    },

    batchEditing: function() {

        var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
        var items = ZoteroPane.getSelectedItems();

        if (items[0] != null) {
            //window.alert("item has been selected");
            window.openDialog("chrome://anyaplsplugin/content/batchediting.xul", "", "chrome, dialog=0, modal, centerscreen");
        } else {
            window.alert("item has not been selected");
            return false;
        }

};

