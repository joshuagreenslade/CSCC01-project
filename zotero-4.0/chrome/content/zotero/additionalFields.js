/**
 * 
 */

var ZoteroAdditionalFields = new function() {
	this.DB = new Zotero.DBConnection('customfield');
	var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"] .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
	if (!this.DB.tableExists('itemField')) {
		this.DB.query("CREATE TABLE itemField (itemID INTEGER,fieldName TEXT, label TEXT)");
	}
	
	this.addField = function() {
		// TODO: change 'field' to field name from user
		// TODO: change 'values' to values from user 
		
		var sql = "INSERT INTO itemField VALUES (?,?,?)";
		//get selected item from pane, insert data 
		var selected_items = ZoteroPane.getSelectedItems();
		var item = selected_items[0]; 
		if (item != null) {
			this.DB.query(sql, [item.id, 'field', 'values']);	
		}
	
		
	}
	
}	