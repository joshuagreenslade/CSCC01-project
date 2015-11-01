/**
 * Created by Noah on 10/31/2015.
 */
Zotero.AddField = {
    DB: null,
    init: function () {
        // Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
        console.log("connecting to helloworld...");
        this.DB = new Zotero.DBConnection('helloworld');

        if (!this.DB.tableExists('customFields')) {
            this.DB.query("CREATE TABLE customFields (itemId INT, fieldKey TEXT, fieldValue TEXT)");
            //this.DB.query("INSERT INTO changes VALUES (0)");
        }
        console.log("connecting to zotero...");
        this.DB = new Zotero.DBConnection('zotero');

        console.log("found items: " + this.DB.query("SELECT itemID FROM items"));
        console.log("found?");
    },

    add: function() {
        console.log("trying to add...");
        this.DB = new Zotero.DBConnection('helloworld');
        //console.log("adding entry to helloworld....")

    },

    remove: function(){
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