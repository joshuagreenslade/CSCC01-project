/**
 * Created by Noah on 10/31/2015.
 */
Zotero.AddField = {
    DB: null,
    init: function () {
        // Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
        this.DB = new Zotero.DBConnection('helloworld');

        if (!this.DB.tableExists('customFields')) {
            this.DB.query("CREATE TABLE customFields (itemId INT, fieldKey TEXT, fieldValue TEXT)");
            //this.DB.query("INSERT INTO changes VALUES (0)");
        }


    }
};


// Initialize the utility
window.addEventListener('load', function(e) { Zotero.AddField.init(); }, false);