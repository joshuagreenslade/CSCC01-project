/**
 * Created by Noah on 10/31/2015.
 */
Zotero.AddField = new function() {
	var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
 	
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
 
     this.add = function() {
    
        console.log("trying to add...");
        // TODO: change 'field' to field name from user
		// TODO: change 'values' to values from user
    
		var sql = "INSERT INTO itemField VALUES (?,?,?)";
		//get selected item from pane, insert data
		var selected_items = ZoteroPane.getSelectedItems();
		var item = selected_items[0];
		
		if (item == null) {
			window.alert('select a item first');
		} else {
			var field; 
	    	var values;
	    	window.openDialog('chrome://helloworldzotero/content/additionalFields.xul', '', 'chrome,dialog=no,centerscreen', field, values);
	    	
			this.DB.query(sql, [item.id, 'field', 'values']);
    	}
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
