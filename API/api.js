var generateFile = require("./generate/file"),
	_            = require("lodash");

/**
 * Repositories class deals with file persistence
 */
var Repositories = function() {
	var file;

    this.repositories = {};

	file            = generateFile(1800);
    this.records    = file.records;
    this.exclusions = file.exclusions;
}




Repositories.prototype.add = function(repositoryName,repositoryData,subRepoToFilter) {
    var __self = this;

    __self.repositories[repositoryName]                 = {};
    __self.repositories[repositoryName]["content"]      = repositoryData;
    if ( subRepoToFilter !== undefined ) {
        __self.repositories[repositoryName]["toFilter"] = subRepoToFilter;
        // if we are targeting a specific object in the main array we automatically give it an ID parameter
        __self.repositories[repositoryName]["content"].forEach(function (value,index,array) {
            array[index][subRepoToFilter].id = index;
        });
    } else if ( Array.isArray(__self.repositories[repositoryName]["content"]) ) {
        // if the main endpoint is an array we add an ID parameter
        __self.repositories[repositoryName]["content"].forEach(function (value,index,array) {
            array[index].id = index;
        });
    }
};


// Query an array
	// 'toFind' = the name of the thing you want to query, ex : 'records','exceptions'
	// toFilter = an object containing the key/value pairs you want to filter - the 'response.query' object can be passed here for example
Repositories.prototype.find = function (repositoryName,toFilter) {
    var __self,repo,subRepo,filter,file;
    __self  = this;
    repo    = __self.repositories[repositoryName]["content"];
    subRepo = __self.repositories[repositoryName]["toFilter"];
    filter  = {};

    if ( subRepo !== undefined ) {
        filter[subRepo] = toFilter;
    } else {
        filter = ( toFilter !== undefined ) ? toFilter : "";
    }
    file = _.filter(repo, filter );
    if ( file == undefined || file == undefined ) {
        throw new Error("Sorry, couldn't find anything that matched your query.");
    }
    return file;
}
/**
 * Find the index of a file
 * Param: id of the file to find
 * Returns: the index of the file identified by id
 */
Repositories.prototype.findIndex = function (repositoryName, identifier) {
    var __self,repo,subRepo,__idendifier,result,index;
    __self = this;
    repo         = __self.repositories[repositoryName]["content"];
    subRepo      = __self.repositories[repositoryName]["toFilter"];
    __idendifier = {};

    if ( subRepo !== undefined ) {
        __idendifier[subRepo] = identifier;
    } else {
        __idendifier = identifier;
    }

    index = _.findIndex(repo, __idendifier);

    // if ( __self.repositories[repositoryName]["content"] !== undefined ) {
    //     _.findIndex(repo, identifyingObject)
    //     result = __self.repositories[repositoryName]["content"].find( repositoryName, identifyingObject );
    //     index  = __self.repositories[repositoryName]["content"].indexOf(result[0]); 
    // } else {
    //     result = __self.repositories[repositoryName]["content"].find( repositoryName, identifyingObject );
    //     index  = __self.repositories[repositoryName]["content"].indexOf(result[0]); 
    // }
    if ( index == -1 ) {
        throw new Error('file not found');
    }
    return index;
}
/**
 * Save a file (create or update)
 * Param: file the file to save
 */
Repositories.prototype.save = function (repositoryName,toSave) {
    var __self,index;
    __self   = this;

    if (toSave.id == null || toSave.id == 0) {
        toSave.id = __self.repositories[repositoryName]["content"].length;
        __self.repositories[repositoryName]["content"].push(toSave);
    } else {
        index = __self.findIndex(repositoryName, {"id" : toSave.id} );
        __self.repositories[repositoryName]["content"][index] = toSave;
    }
}
/**
 * Remove a file
 * Param: id the of the file to remove
 */
Repositories.prototype.remove = function ( repositoryName,identifier ) {
    var __self,index;
    __self = this;
    index  = __self.findIndex( repositoryName,identifier );
    __self.repositories[repositoryName]["content"].splice(index, 1);
}

module.exports = Repositories;