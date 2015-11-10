describe("Support Functions for Unit Testing", function() {
	describe("resetDB", function() {
		it("should restore the DB to factory settings", function() {
			this.timeout(10000);
			var quickstart = Zotero.Items.erase(1);
			assert.equal(Zotero.Items.get(1), false);
			return resetDB().then(function() {
				assert.equal(Zotero.Items.get(1).getField("url"), "http://zotero.org/support/quick_start_guide");
			});
		});
	});
	describe("loadSampleData", function() {
		it("should load data from file", function() {
			let data = loadSampleData('journalArticle');
			assert.isObject(data, 'loaded data object');
			assert.isNotNull(data);
			assert.isAbove(Object.keys(data).length, 0, 'data object is not empty');
		});
	});
	describe("populateDBWithSampleData", function() {
		it("should populate database with data", function() {
			let data = loadSampleData('journalArticle');
			populateDBWithSampleData(data);
			
			let skipFields = ['id', 'itemType', 'creators']; // Special comparisons
			
			for (let itemName in data) {
				let item = data[itemName];
				assert.isAbove(item.id, 0, 'assigned new item ID');
				
				let zItem = Zotero.Items.get(item.id);
				assert.ok(zItem, 'inserted item into database');
				
				// Compare item type
				assert.equal(item.itemType, Zotero.ItemTypes.getName(zItem.itemTypeID), 'inserted item has the same item type');
				
				// Compare simple properties
				for (let prop in item) {
					if (skipFields.indexOf(prop) != -1) continue;
					
					// Using base-mapped fields
					assert.equal(item[prop], zItem.getField(prop, false, true), 'inserted item property has the same value as sample data');
				}
				
				if (item.creators) {
					// Compare creators
					for (let i=0; i<item.creators.length; i++) {
						let creator = item.creators[i];
						let zCreator = zItem.getCreator(i);
						assert.ok(zCreator, 'creator was added to item');
						assert.equal(creator.firstName, zCreator.ref.firstName, 'first names match');
						assert.equal(creator.lastName, zCreator.ref.lastName, 'last names match');
						assert.equal(creator.creatorType, Zotero.CreatorTypes.getName(zCreator.creatorTypeID), 'creator types match');
					}
				}
			}
		});
		it("should populate items with tags", function() {
			let data = populateDBWithSampleData({
				itemWithTags: {
					itemType: "journalArticle",
					tags: [
						{ tag: "automatic tag", type: 0 },
						{ tag: "manual tag", type: 1}
					]
				}
			});
			
			let zItem = Zotero.Items.get(data.itemWithTags.id);
			assert.ok(zItem, 'inserted item with tags into database');
			
			let tags = data.itemWithTags.tags;
			for (let i=0; i<tags.length; i++) {
				let tagID = Zotero.Tags.getID(tags[i].tag, tags[i].type);
				assert.ok(tagID, '"' + tags[i].tag + '" tag was inserted into the database');
				assert.ok(zItem.hasTag(tagID), '"' + tags[i].tag + '" tag was assigned to item');
			}
		});
	});
	describe("generateAllTypesAndFieldsData", function() {
		it("should generate all types and fields data", function() {
			let data = generateAllTypesAndFieldsData();
			assert.isObject(data, 'created data object');
			assert.isNotNull(data);
			assert.isAbove(Object.keys(data).length, 0, 'data object is not empty');
		});
		it("all types and fields sample data should be up to date", function() {
			assert.deepEqual(loadSampleData('allTypesAndFields'), generateAllTypesAndFieldsData());
		});
	});
	describe("generateItemJSONData", function() {
		it("item JSON data should be up to date", function() {
			let oldData = loadSampleData('itemJSON'),
				newData = generateItemJSONData();
			
			assert.isObject(newData, 'created data object');
			assert.isNotNull(newData);
			assert.isAbove(Object.keys(newData).length, 0, 'data object is not empty');
			
			// Ignore data that is not stable, but make sure it is set
			let ignoreFields = ['dateAdded', 'dateModified', 'key'];
			for (let itemName in oldData) {
				for (let i=0; i<ignoreFields.length; i++) {
					let field = ignoreFields[i]
					if (oldData[itemName][field] !== undefined) {
						assert.isDefined(newData[itemName][field], field + ' is set');
						delete oldData[itemName][field];
						delete newData[itemName][field];
					}
				}
			}
			
			assert.deepEqual(oldData, newData);
		});
	});
	describe("generateCiteProcJSExportData", function() {
		let citeURL = Zotero.Prefs.get("export.citePaperJournalArticleURL");
		before(function () {
			Zotero.Prefs.set("export.citePaperJournalArticleURL", true);
		});
		after(function() {
			Zotero.Prefs.set("export.citePaperJournalArticleURL", citeURL);
		});
		
		it("all citeproc-js export data should be up to date", function() {
			let oldData = loadSampleData('citeProcJSExport'),
				newData = generateCiteProcJSExportData();
			
			assert.isObject(newData, 'created data object');
			assert.isNotNull(newData);
			assert.isAbove(Object.keys(newData).length, 0, 'citeproc-js export object is not empty');
			
			// Ignore item ID
			for (let itemName in oldData) {
				delete oldData[itemName].id;
			}
			for (let itemName in newData) {
				delete newData[itemName].id;
			}
			
			assert.deepEqual(oldData, newData, 'citeproc-js export data has not changed');
		});
	});
	describe("generateTranslatorExportData", function() {
		it("legacy mode data should be up to date", function() {
			let oldData = loadSampleData('translatorExportLegacy'),
				newData = generateTranslatorExportData(true);
			
			assert.isObject(newData, 'created data object');
			assert.isNotNull(newData);
			assert.isAbove(Object.keys(newData).length, 0, 'translator export object is not empty');
			
			// Ignore data that is not stable, but make sure it is set
			let ignoreFields = ['itemID', 'dateAdded', 'dateModified', 'uri', 'key'];
			for (let itemName in oldData) {
				for (let i=0; i<ignoreFields.length; i++) {
					let field = ignoreFields[i]
					if (oldData[itemName][field] !== undefined) {
						assert.isDefined(newData[itemName][field], field + ' is set');
						delete oldData[itemName][field];
						delete newData[itemName][field];
					}
				}
			}
			
			assert.deepEqual(oldData, newData, 'translator export data has not changed');
		});
		it("data should be up to date", function() {
			let oldData = loadSampleData('translatorExport'),
				newData = generateTranslatorExportData();
			
			assert.isObject(newData, 'created data object');
			assert.isNotNull(newData);
			assert.isAbove(Object.keys(newData).length, 0, 'translator export object is not empty');
			
			// Ignore data that is not stable, but make sure it is set
			let ignoreFields = ['dateAdded', 'dateModified', 'uri'];
			for (let itemName in oldData) {
				for (let i=0; i<ignoreFields.length; i++) {
					let field = ignoreFields[i]
					if (oldData[itemName][field] !== undefined) {
						assert.isDefined(newData[itemName][field], field + ' is set');
						delete oldData[itemName][field];
						delete newData[itemName][field];
					}
				}
			}
			
			assert.deepEqual(oldData, newData, 'translator export data has not changed');
		});
	});
});