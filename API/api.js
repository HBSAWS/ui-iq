var generateFile = require("./generate/file"),
	_            = require("lodash");

/**
 * FileRepository class deals with file persistence
 */
var FileRepository = function() {
	var file;

	file            = generateFile(1800);
    this.records    = file.records;
    this.exclusions = file.exclusions;
    this.nextId     = 1;
}

// Query an array
	// 'toFind' = the name of the thing you want to query, ex : 'records','exceptions'
	// toFilter = an object containing the key/value pairs you want to filter - the 'response.query' object can be passed here for example
FileRepository.prototype.find = function (toFind,toFilter) {
    var file = this[toFind].filter(function(item) {
    	var toAdd,totalFilters,matchedFilters;
    	toAdd          = false;
    	totalFilters   = 0;
    	matchedFilters = 0;
    	for ( var filter in toFilter ) {
    		totalFilters ++;
    		if ( item[filter] == toFilter[filter] ) {
    			matchedFilters++;
    		}
    	}
    	// if the item has the same number of key/value pairs as the toFilter we add it to our file
    	if ( totalFilters == matchedFilters ) {
    		toAdd = true;
    	}
        return toAdd;
    });
    if (null == file) {
        throw new Error("Sorry, couldn't find anything that matched your query.");
    }
    return file;
}
/**
 * Find the index of a file
 * Param: id of the file to find
 * Returns: the index of the file identified by id
 */
FileRepository.prototype.findIndex = function (toFind, identifyingObject) {
    var index;
    //index = _.findIndex( this[toFind],identifyingObject );
    var result = this.find( toFind, identifyingObject );
    index      = this[toFind].indexOf(result[0]); 
    if ( index == -1 ) {
        throw new Error('file not found');
    }
    return index;
}
/**
 * Save a file (create or update)
 * Param: file the file to save
 */
FileRepository.prototype.save = function (toSaveIn,data) {
    var index;
    if (data.id == null || data.id == 0) {
        data.id = this.nextId;
        this[toSaveIn].push(data);
        this.nextId++;
    } else {
        if ( toSaveIn === "exclusions" ) {
            index = this.findIndex(toSaveIn, {"id" : data.id} );
        } else {
            index = this.findIndex(toSaveIn, {"id" : data.id} );
        }
        this[toSaveIn][index] = data;
    }
}
/**
 * Remove a file
 * Param: id the of the file to remove
 */
FileRepository.prototype.remove = function ( toRemoveFrom,identifyingObject ) {
    var index = this.findIndex( toRemoveFrom,identifyingObject );
    this[toRemoveFrom].splice(index, 1);
}

module.exports = FileRepository;