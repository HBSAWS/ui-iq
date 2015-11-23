var fs 				   = require('fs'),
	_                  = require("lodash"),
	path               = require("path"),

	express            = require('../node_modules/express'),
	bodyParser         = require('../node_modules/body-parser'),
	ejs  			   = require('ejs'),

	generateConfig     = require("./generate/config"),
	generator          = require("./generator"),
	API_schema         = JSON.parse( fs.readFileSync(path.join(__dirname + '/schema.json')) ).endpoints,
	api                = require("./api"),


	app                = express(),
	fileRepository     = new api(),
	API_URL_BASE       = '/iqService/rest',
	API_URL            = API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/:subFileContent.json';



// used to parse JSON object given in the body request
app.use(bodyParser.json());
// Serve up public/ftp folder 
app.use('/static', express.static(__dirname + '/../dist/'));


var compileSchema = function(arrayToCompile,returnType,returnAmount) {
	var compiledObject,__returnAmount,generate = generator();
	compiledObject = ( returnType === "object" )    ? {} : [];
	__returnAmount = ( returnAmount === undefined ) ? 1  : returnAmount;

	(function(count) {
		if (count < __returnAmount) {
			arrayToCompile.forEach(function (schema,index,array) {
				var toAdd;
				// defines what the 'toAdd' value is going to be
				if ( schema.type === "object" ) {
					toAdd = compileSchema( schema.content, schema.type );
				} else if ( schema.type === "array" ) {
					toAdd = compileSchema( schema.content, schema.type, ((schema.amount !== undefined) ? schema.amount : undefined) );
				} else if ( schema.type ==="field" || schema.type === "string" ) {
					toAdd = ( schema.content !== undefined ) ? schema.content : generate[schema.name];
				}

				// defines what the 'compiledObject' format is going to be
				if ( returnType === "object" ) {
					if ( schema.type !== "field" || schema.name !== undefined && schema.name !== null ) {
						compiledObject[schema.name] = toAdd;
					} else {
						compiledObject = toAdd;
					}
				} else if ( returnType === "array" ) {
					if ( schema.type !== "field" || schema.name !== undefined && schema.name !== null ) {
						compiledObject.push( toAdd );
					} else {
						compiledObject.push( toAdd );
					}
				} else if ( returnType === "field" || "string" ) {
					compiledObject = toAdd;
				} 
			});
	        var caller = arguments.callee; 
	        caller(count + 1);
		}
	})(0);

	return compiledObject;
};

//console.log( JSON.stringify( API_schema ));
API_schema.forEach(function (endpoint) {
	var endpointData = {},amount;
	if ( endpoint.type === "array" && endpoint.amount !== undefined && endpoint.amount > 0 ) {
		amount = endpoint.amount;
	} else {
		amount = undefined;
	}
	endpointData[endpoint.name] = compileSchema(endpoint.content, endpoint.type,amount);


	app.get( endpoint.URL + "test/" + endpoint.name + endpoint.ext, function (request,response) {
		//response.send( endpoint.name + endpoint.ext );
		response.json( endpointData );
	});
});

app.get('/', function (request,response) {

});

app.get('/settings/API', function (request, response) {
	response.sendFile( path.join(__dirname + '/settings.html') );
});




// HTTP GET the user config
// can break out meta from minimal config later if needed
app.get( API_URL_BASE + '/:type(config.json|config.json?meta=true)', function (request, response) {
	response.json( generateConfig );
});




// HTTP GET specific files
// Param   : you can have parameters for any of the attributes in the root level of your fileRepository object that ISN'T another object, value only
// Returns : the list of files in JSON format
app.get( API_URL, function (request, response) {
	try {
		console.log(__dirname);
		var queries,subFileContent,__response,data;
		// any queries such as '?term=s&year=1999' are stored in the '.query' object as key/value pairs
		queries = request.query;
		// the value of the 'subFileContent' not including the '.json' at the end
		// this is so we know what to return
		// for example this might be 'records' or 'exclusions'
		subFileContent             = ( request.params.subFileContent === "excl" ) ? "exclusions" : request.params.subFileContent;
		__response                 = {};
		__response[subFileContent] = fileRepository.find( subFileContent, queries );
		response.json( __response );
	} catch (exception) {
		response.sendStatus(404);
	}
});




// HTTP POST /files/
// Body Param : the JSON file you want to create
// Returns    : 200 HTTP code
app.post( API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/exclusions/create', function (request, response) {
    var newData;
    newData = request.body;

    fileRepository.save("exclusions", newData);
    response.sendStatus(200);
});




 // HTTP PUT   : for updating exclusions
 // Param      : ?personId=[6 digit person Id number] the unique identifier of the file you want to update
 // Body Param : the JSON file you want to update
 // Returns    : 200 HTTP code
 // Error      : 404 HTTP code if the file doesn't exists
app.put( API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/exclusions/update/:id', function (request, response) {
    try {
		var newData,id,persistedFile,updatedContent;
		newData        = request.body;
		id             = parseInt(request.params.id);
		persistedFile  = fileRepository.find("exclusions", {"id" : id} )[0];
		updatedContent = _.merge(persistedFile, newData);

        fileRepository.save( "exclusions", updatedContent );
        response.sendStatus(200);
    } catch (exception) {
        response.sendStatus(404);
    }
});




 // HTTP DELETE specific file in 'subFileContent'
 // Param      : ?personId=[6 digit person Id number] the unique identifier of the file you want to delete
 // Body Param : the JSON file you want to update
 // Returns    : 200 HTTP code
 // Error      : 404 HTTP code if the file doesn't exists
app.delete( API_URL, function (request, response) {
    try {
		// any queries such as '?term=s&year=1999' are stored in the '.query' object as key/value pairs
		var query = request.query;
        fileRepository.remove("files", {personId : query.personId} );
        response.sendStatus(200);
    } catch (exeception) {
        response.sendStatus(404);
    }
});

//app.listen(8080); //to port on which the express server listen
module.exports = app;