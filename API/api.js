var generateFile = require("./generate/file"),
	_            = require("lodash");

/**
 * Repositories class deals with file persistence
 */
var Repositories = function() {
	this.repositories = {};
}




Repositories.prototype.add = function(repositoryName,endpointData,pathToQueryArray,rootObject,relatedTo,queryable) {
    var __self = this;

    __self.repositories[repositoryName]                 = {};
    __self.repositories[repositoryName]["endpointData"] = endpointData;
    __self.repositories[repositoryName]["queryable"]    = queryable;

    // if there is a root object we define it here
    if ( rootObject !== undefined) {
        __self.repositories[repositoryName]["rootObject"] = rootObject;
    }

    // if an array can be queried we define the pathway to that array
    if ( pathToQueryArray !== undefined ) {
        __self.repositories[repositoryName]["pathToQueryArray"] = pathToQueryArray;

        // add unique id's to arrays that can be queried
        if ( rootObject !== undefined ) {
            __self.repositories[repositoryName]["endpointData"][pathToQueryArray].forEach(function (value,index,array) {
                array[index][rootObject].id = index;
            });
        } else {
            // __self.repositories[repositoryName]["endpointData"][pathToQueryArray].forEach(function (value,index,array) {
            //     array[index].id = index;
            // });           
        }
    }
    // if there is a relationship with another endpoint we establish it here
    if ( relatedTo !== undefined ) {
        __self.repositories[relatedTo]["relatedTo"]      = repositoryName;
        __self.repositories[repositoryName]["relatedTo"] = relatedTo;
    }
};

Repositories.prototype.getRawData = function (repositoryName,rawRootObject,rawQueryArray) {
    var __self,endpointData,pathToQueryArray,rootObject,rawEndpointData;
    __self           = this;
    endpointData     = __self.repositories[repositoryName]["endpointData"];
    pathToQueryArray = __self.repositories[repositoryName]["pathToQueryArray"];
    rootObject       = __self.repositories[repositoryName]["rootObject"];
    rawEndpointData  = {};
    _.merge(rawEndpointData, endpointData);

    if ( pathToQueryArray !== undefined && rawQueryArray ) {
        rawEndpointData = rawEndpointData[pathToQueryArray];
        if ( rootObject !== undefined && rawRootObject ) {
            rawEndpointData.forEach(function (value,index,array) {
                rawEndpointData[index] = value[rootObject];
                return;
            });
        }
    } else if ( rootObject !== undefined && rawRootObject ) {
        if ( pathToQueryArray !== undefined ) {
            rawEndpointData[pathToQueryArray].forEach(function (value,index,array) {
                rawEndpointData[pathToQueryArray][index] = value[rootObject];
                return;
            });
        } else {
            rawEndpointData.forEach(function (value,index,array) {
                rawEndpointData[index] = value[rootObject];
                return;
            });
        }
    }
    
    return rawEndpointData;
};
// Query an array
	// 'toFind' = the name of the thing you want to query, ex : 'records','exceptions'
	// toFilter = an object containing the key/value pairs you want to filter - the 'response.query' object can be passed here for example
Repositories.prototype.find = function (repositoryName,toFilter) {
    var __self,queryable,endpointData,repo,pathToQueryArray,rootObject,filter,file;
    __self           = this;
    endpointData     = __self.repositories[repositoryName]["endpointData"];
    pathToQueryArray = __self.repositories[repositoryName]["pathToQueryArray"];
    rootObject       = __self.repositories[repositoryName]["rootObject"];
    queryable        = __self.repositories[repositoryName]["queryable"];


    if ( !queryable || _.isEmpty(toFilter) ) {
        file = endpointData;
    } else {
        _.forIn(toFilter, function (value,key) {
            if ( !isNaN(value) ) {
                // the string has a number and we need to convert it
                toFilter[key] = parseInt(value);
            }
        });

        if ( rootObject !== undefined ) {
            filter             = {};
            filter[rootObject] = toFilter;
        } else {
            filter = toFilter;
        }

        if ( pathToQueryArray !== undefined ) {
            file = {};
            file[pathToQueryArray] = _.filter(endpointData[pathToQueryArray], filter);
        } else {
            file = _.filter(endpointData, filter);
        }
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
Repositories.prototype.findIndex = function (repositoryName, toFind) {
    var __self,endpointData,pathToQueryArray,rootObject,__idendifier,result,index;
    __self = this;

    endpointData     = __self.repositories[repositoryName]["endpointData"];
    pathToQueryArray = __self.repositories[repositoryName]["pathToQueryArray"];
    rootObject       = __self.repositories[repositoryName]["rootObject"];

    if ( rootObject !== undefined ) {
        find             = {};
        find[rootObject] = toFind;
    } else {
        find = toFind;
    }

    if ( pathToQueryArray !== undefined ) {
        index = _.findIndex(endpointData[pathToQueryArray], find);
    } else {
        index = _.findIndex(endpointData, find);
    }

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
    var __self,pathToQueryArray,rootObject,save,index;
    __self           = this;
    pathToQueryArray = __self.repositories[repositoryName]["pathToQueryArray"];
    rootObject       = __self.repositories[repositoryName]["rootObject"];

    if ( rootObject !== undefined ) {
        save = {};
        save[rootObject] = toSave;
    } else {
        save = toSave;
    }

    if (toSave.id == null || toSave.id == 0) {
        if ( pathToQueryArray !== undefined ) {
            toSave.id = __self.repositories[repositoryName]["endpointData"][pathToQueryArray].length;
            __self.repositories[repositoryName]["endpointData"][pathToQueryArray].push(save);
        } else {
            toSave.id = __self.repositories[repositoryName]["endpointData"].length;
            __self.repositories[repositoryName]["endpointData"].push(save);
        }
    } else {
        index = __self.findIndex(repositoryName, {"id" : toSave.id} );
        if ( pathToQueryArray !== undefined ) {
            __self.repositories[repositoryName]["endpointData"][pathToQueryArray][index] = save;
        } else {
            __self.repositories[repositoryName]["endpointData"][index] = save;
        }
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