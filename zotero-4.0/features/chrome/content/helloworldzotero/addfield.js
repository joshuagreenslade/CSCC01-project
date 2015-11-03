/**
 * Created by Noah on 10/31/2015.
 */
Zotero.AddField = new function() {
	var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;

	this.addField = addField;
	this.deleteField = deleteField;
	this.onLoad = onLoad;
	this.onUnload = onUnload;

	var field;
	var value;

	this.init = function () {
	    this.DB = new Zotero.DBConnection('customfield');
	   
		if (!this.DB.tableExists('itemField')) {
			this.DB.query("CREATE TABLE itemField (itemID INTEGER,fieldName TEXT, label TEXT)");
		}
		console.log("connecting to customfield...");
		//this.DB = new Zotero.DBConnection('zotero');
	
		console.log("found items: " + this.DB.query("SELECT itemID FROM itemField"));
		console.log("found?");
	}


	function onLoad() {

	}

	function onUnload() {

	}


	function deleteField() {

	}
 
     this.add = function() {
    
        console.log("trying to add...");
        // TODO: change 'field' to field name from user
		// TODO: change 'values' to values from user
    

		//get selected item from pane, insert data
		var item = ZoteroPane.getSelectedItems()[0];
		
		if (item == null) {
			window.alert('select a item first');
		} else {
	    	window.openDialog('chrome://helloworldzotero/content/additionalFields.xul', '', 'chrome,dialog=no,centerscreen', field, value);
    	}
	}

	function addField() {
		var sql = "INSERT INTO itemField VALUES (?,?,?)";

		field = document.getElementById('field');
		value = document.getElementById('value');

		var item = ZoteroPane.getSelectedItems()[0];
		var fields = field.value;
		var values = value.value;

		console.log("Field: " + fields + "Value: " + values);
		this.DB.query(sql, [item.id, fields, values]);
		window.close();
	}


	this.remove = function(){
        console.log("tryig to remove...");
        
    }


  
};

//To insert into customFields
//this.DB = new Zotero.DBConnection('helloworld');
//this.DB.query("INSERT INTO customFields VALUES ([int itemID], [string fieldKey], [fieldValue])");

//To retrieve
//this.DB = new Zotero.DBConnection('helloworld');
//this.DB.query("SELECT")


// Initialize the utility
window.addEventListener('load', function(e) { Zotero.AddField.init(); }, false);
