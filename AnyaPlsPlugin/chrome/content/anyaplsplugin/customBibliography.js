Zotero_AnyaPls_CustomBibliography = function () {};

    var fields = [];

logger = function(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
};

Zotero_AnyaPls_CustomBibliography.init = function () {

    //set the instructions
    document.getElementById('instructions').setAttribute('value', '&(field) will be replaced by the field value when "Fill in Bibliography" is clicked');

    //get the selected item
    var item = Zotero.AnyaPls.getZoteroPane().getSelectedItems()[0];

    //put all the default fields into item-select and into the array of fields
    for (var fieldID in item._itemData){
        var name = Zotero.ItemFields.getName(fieldID);
        var val = item.getField(fieldID);
        document.getElementById("item-select").appendItem(name, "&(" + name + ")");
        fields.push([name, val]);
    }

    //add each of the items custom field to item-select and into the array of fields
    var result = Zotero.AnyaPls.DB.query("SELECT DISTINCT fieldName,fieldValue FROM customField WHERE itemID='" + item.id + "'");
    for(var i=0; i < result.length; i++) {
        document.getElementById("item-select").appendItem(result[i].fieldName, "&(" + result[i].fieldName + ")");
        fields.push([result[i].fieldName, result[i].fieldValue]);
    }
};


Zotero_AnyaPls_CustomBibliography.add = function() {

    //add the selected field to the textbox
    var string = document.getElementById("item-select").selectedItem.value;
    document.getElementById("item-select").setAttribute('label', 'Select a field to add');
    document.getElementById("bibliography-textbox").value += string;
};


Zotero_AnyaPls_CustomBibliography.save = function() {

    //open a window to save the bibliography
    var win = window.open("chrome://anyaplsplugin/content/saveLoadBib.xul", "", "chrome, centerscreen");
    win.arguments = ['save', document.getElementById('bibliography-textbox').value];
};

Zotero_AnyaPls_CustomBibliography.load = function() {

    //open a window to load a bibliography
    var win = window.open("chrome://anyaplsplugin/content/saveLoadBib.xul", "", "chrome, centerscreen");
    win.arguments = ['load', document.getElementById('bibliography-textbox').value];
};


Zotero_AnyaPls_CustomBibliography.delete = function() {

    //open a window to delete a bibliography
    var win = window.open("chrome://anyaplsplugin/content/saveLoadBib.xul", "", "chrome, centerscreen");
    win.arguments = ['delete'];
};


Zotero_AnyaPls_CustomBibliography.fillIn = function() {

    var field = "";
    var result = "";
    var text = document.getElementById('bibliography-textbox').value;

    //parse the string text
    for(var i=0; i < text.length; i++) {

        //if the next 2 elements of text are '&(' put the rest of the characters into field until ')'
        if((text[i] == "&") && (text[i+1] == "(")) {
            i += 2;
            field = "";

            //get the name of the specified field
            while(text[i] != ")") {
                field += text[i];
                i++;

                //if there is no closing bracket just return
                if(text.length == i)
                    return;
            }

            //look for field in the array of fields and add the corresponding value to the result string, if the field isn't there put (undefined)
            var j=0;
            while((fields.length != j) && (fields[j][0] != field))
                j++;

            if(fields.length == j)
                result += "(undefined)";
            else
                result += fields[j][1];
        }

        //add the next character from text to result
        else
            result += text[i];
    }

    //put the result string in the textbox
    document.getElementById('bibliography-textbox').value = result;

};