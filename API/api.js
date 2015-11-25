var generateFile = require("./generate/file"),
	_            = require("lodash");

/**
 * Repositories class deals with file persistence
 */
var Repositories = function() {
	this.repositories = {};
}




Repositories.prototype.add = function(repositoryName,endpointData,pathToQueryArray,rootObject,relatedTo) {
    var __self = this;

    __self.repositories[repositoryName]                 = {};
    __self.repositories[repositoryName]["endpointData"] = endpointData;

    // if there is a root object we define it here
    if ( rootObject !== undefined) {
        __self.repositories[repositoryName]["rootObject"] = rootObject;
    }

    // if an array can be queried we define the pathway to that array
    if ( pathToQueryArray !== undefined && pathToQueryArray !== "_root" ) {
        __self.repositories[repositoryName]["pathToQueryArray"] = pathToQueryArray;

        // add unique id's to arrays that can be queried
        if ( rootObject !== undefined ) {
            __self.repositories[repositoryName]["endpointData"][pathToQueryArray].forEach(function (value,index,array) {
                array[index][rootObject].id = index;
            });
        } else {
            __self.repositories[repositoryName]["endpointData"][pathToQueryArray].forEach(function (value,index,array) {
                array[index].id = index;
            });           
        }
    }

    // if there is a relationship with another endpoint we establish it here
    if ( relatedTo !== undefined ) {
        __self.repositories[relatedTo]["relatedTo"]      = repositoryName;
        __self.repositories[repositoryName]["relatedTo"] = relatedTo;
    }
};


// Query an array
	// 'toFind' = the name of the thing you want to query, ex : 'records','exceptions'
	// toFilter = an object containing the key/value pairs you want to filter - the 'response.query' object can be passed here for example
Repositories.prototype.find = function (repositoryName,toFilter) {
    var __self,endpointData,repo,pathToQueryArray,rootObject,filter,file;
    __self       = this;
    endpointData = __self.repositories[repositoryName]["endpointData"];

    if ( _.isEmpty(toFilter) ) {
        file = endpointData;
    } else {
        pathToQueryArray = __self.repositories[repositoryName]["pathToQueryArray"];
        rootObject       = __self.repositories[repositoryName]["rootObject"];

        repo             = (pathToQueryArray !== undefined) ? endpointData[pathToQueryArray] : endpointData;
        if ( rootObject !== undefined ) {
            filter             = {};
            filter[rootObject] = toFilter;
        } else {
            filter = toFilter;
        }

        file = _.filter(repo, filter);
    }


    if ( file == undefined ) {
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
    var __self,repo,rootObject,__idendifier,result,index;
    __self = this;
    repo         = __self.repositories[repositoryName]["endpointData"];
    rootObject      = __self.repositories[repositoryName]["rootObject"];
    __idendifier = {};

    if ( rootObject !== undefined ) {
        __idendifier[rootObject] = identifier;
    } else {
        __idendifier = identifier;
    }

    index = _.findIndex(repo, __identifier);

    // if ( __self.repositories[repositoryName]["endpointData"] !== undefined ) {
    //     _.findIndex(repo, identifyingObject)
    //     result = __self.repositories[repositoryName]["endpointData"].find( repositoryName, identifyingObject );
    //     index  = __self.repositories[repositoryName]["endpointData"].indexOf(result[0]); 
    // } else {
    //     result = __self.repositories[repositoryName]["endpointData"].find( repositoryName, identifyingObject );
    //     index  = __self.repositories[repositoryName]["endpointData"].indexOf(result[0]); 
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
        toSave.id = __self.repositories[repositoryName]["endpointData"].length;
        __self.repositories[repositoryName]["endpointData"].push(toSave);
    } else {
        index = __self.findIndex(repositoryName, {"id" : toSave.id} );
        __self.repositories[repositoryName]["endpointData"][index] = toSave;
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
    __self.repositories[repositoryName]["endpointData"].splice(index, 1);
}

module.exports = Repositories;