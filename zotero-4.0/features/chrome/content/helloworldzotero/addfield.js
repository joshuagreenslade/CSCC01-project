Zotero.AddField = {
	//var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;

	settings:{
		DB: null,
		fieldKey : "",
		fieldValue: "",
		//fieldTable: "customField"
	},

	init : function () {
		console.log("inside init");
		fieldKey = this.fieldKey;
		fieldValue = this.fieldValue;
//		fieldTable = this.fieldTable;
	    this.DB = new Zotero.DBConnection('anyaPls');

		if (!this.DB.tableExists("customField")) {
			this.DB.query("CREATE TABLE " + "customField" + " (itemID INTEGER, fieldName TEXT, fieldValue TEXT)");
		}

		console.log("found items: " + this.DB.query("SELECT fieldName FROM " + "customField"));
		console.log("found?");
	},


	onLoad : function () {

	},

	onUnload : function() {
		window.close();
	},


	deletefield : function() {

		var sql_delete = "DELETE FROM " + "customField" + " WHERE itemID=";

		field = document.getElementById('field');
		//value = document.getElementById('value');

		var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
		var item = ZoteroPane.getSelectedItems()[0];
		var fields = field.value;
		//var values = value.value;

		console.log("deleting Field: " + fields);
		this.DB.query(sql_delete + item.id + " AND fieldName='" + fields + "'");
//		window.close();
	},
 
	add: function() {
    
        console.log("inside add...");
        // TODO: change 'field' to field name from user
		// TODO: change 'values' to values from user

		var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
		//get selected item from pane, insert data
		var item = ZoteroPane.getSelectedItems()[0];
		
		if (item == null) {
			window.alert('select an item first');
		} else {
	    window.openDialog('chrome://helloworldzotero/content/additionalFields.xul', '', 'chrome,dialog=no,centerscreen');//, this.fieldKey, this.fieldValue);
    	}
	},

	addfield: function() {
		console.log("inside addfield...");
		var sql_add = "INSERT INTO " + "customField" + " VALUES (?,?,?)";

		var field = document.getElementById('field');
		var value = document.getElementById('value');

		var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
		var item = ZoteroPane.getSelectedItems()[0];
		var fields = field.value;
		var values = value.value;

		console.log("Field: " + fields + " Value: " + values);
		this.DB.query(sql_add, [item.id, fields, values]);
//		window.close();
	}/*

	this.remove = function(){
        console.log("tryig to remove...");
        
    };*/
};


//To insert into customFields
//this.DB = new Zotero.DBConnection('helloworld');
//this.DB.query("INSERT INTO customFields VALUES ([int itemID], [string fieldKey], [fieldValue])");

//To retrieve
//this.DB = new Zotero.DBConnection('helloworld');
//this.DB.query("SELECT")


// Initialize the utility
window.addEventListener('load', function(e) { Zotero.AddField.init(); }, false);
