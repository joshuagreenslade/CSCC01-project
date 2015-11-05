var Zotero = Components.classes["@zotero.org/Zotero;1"]
	.getService(Components.interfaces.nsISupports)
	.wrappedJSObject;

if (!Zotero.AnyaPls) {
	const loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
			.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://helloworldzotero/content/anyapls.js");
	Zotero.AnyaPls.init();
}
