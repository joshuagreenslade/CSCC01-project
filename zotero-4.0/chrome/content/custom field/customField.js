/**
 * Created by Noah on 10/26/2015.
 */
Zotero.CustomFieldZotero = {

    DB: null,

    init: function () {
        // Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
        this.DB = new Zotero.DBConnection('customfield');

        if (!this.DB.tableExists('changes')) {
            this.DB.query("CREATE TABLE changes (num INT)");
            this.DB.query("INSERT INTO changes VALUES (0)");
        }

        // Register the callback in Zotero as an item observer
        //var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

        // Unregister callback when the window closes (important to avoid a memory leak)
       /* window.addEventListener('unload', function(e) {
            Zotero.Notifier.unregisterObserver(notifierID);
        }, false);*/
    }
}