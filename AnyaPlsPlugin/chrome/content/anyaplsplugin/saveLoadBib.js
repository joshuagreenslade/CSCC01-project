Zotero_AnyaPls_SaveLoadBib = function () {};

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};

Zotero_AnyaPls_SaveLoadBib.init = function () {
    var mode = window.arguments[0];

    //hide the buttons that cannot be clicked during the specified mode
    if(mode == 'save') {
        document.getElementById('save').setAttribute('hidden', 'false');
        document.getElementById('load').setAttribute('hidden', 'true');
        document.getElementById('delete').setAttribute('hidden', 'true');
    }
    else if(mode == 'load'){
        document.getElementById('load').setAttribute('hidden', 'false');
        document.getElementById('save').setAttribute('hidden', 'true');
        document.getElementById('delete').setAttribute('hidden', 'true');
    }
    else {
        document.getElementById('delete').setAttribute('hidden', 'false');
        document.getElementById('save').setAttribute('hidden', 'true');
        document.getElementById('load').setAttribute('hidden', 'true');
    }

    //get all the bibliographies
    var ZoteroPane = Zotero.AnyaPls.getZoteroPane();
    var result = Zotero.AnyaPls.DB.query("SELECT name FROM customBib");
    var displayBox = document.getElementById('saved-bibs');

    //add each bibliography to the display window
    for(var i = 0; i < result.length; i++) {
        displayBox.appendItem(result[i].name);
    }
};


Zotero_AnyaPls_SaveLoadBib.select = function() {
    document.getElementById('name').value = document.getElementById('saved-bibs').selectedItem.label;
}


Zotero_AnyaPls_SaveLoadBib.save = function() {
    var name = document.getElementById('name').value;
    var bib = window.arguments[1];

     //if the user entered an name that has already been saved
     if(Zotero.AnyaPls.DB.query("SELECT name FROM customBib where name='" + name + "'")) {

         //a window that asks if the user wants to overwrite the old bibliography
         var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
         .getService(Components.interfaces.nsIPromptService);

         //overwrite the old bibliography if user clicked ok
         if(promptService.confirm(window, "Overwrite", "Do you want to overwrite " + name + "?"))
         Zotero.AnyaPls.DB.query("UPDATE customBib SET bib='" + bib + "' WHERE name='" + name + "'");

         //if the user clicked cancel
         else
            return;
     }

     //if name doesnt already have a value associated with it in the database
     else
        Zotero.AnyaPls.DB.query("INSERT INTO customBib VALUES ('" + name + "', '" + bib + "')");

    window.close();
};


Zotero_AnyaPls_SaveLoadBib.load = function() {
    var name = document.getElementById('name').value;
    var result = Zotero.AnyaPls.DB.query("SELECT bib FROM customBib where name='" + name + "'");

    //if a database entry with the given name exists
    if(result) {
        window.opener.document.getElementById('bibliography-textbox').value = result[0].bib;
        window.close();
    }
};

Zotero_AnyaPls_SaveLoadBib.delete = function() {
    var name = document.getElementById('name').value;
    Zotero.AnyaPls.DB.query("DELETE FROM customBib where name='" + name + "'");
    window.close();
};