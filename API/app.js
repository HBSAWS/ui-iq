var fs 				   = require('fs'),
	_                  = require("lodash"),
	path               = require("path"),

	express            = require('../node_modules/express'),
	bodyParser         = require('../node_modules/body-parser'),
	ejs  			   = require('ejs'),

	generateConfig     = require("./generate/config"),
	generate           = require("./generator"),
	API_schema         = JSON.parse( fs.readFileSync(path.join(__dirname + '/schema.json')) ),
	api                = require("./api"),


	app                = express(),
	repository         = new api(),
	API_URL_BASE       = '/iqService/rest',
	API_URL            = API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/:subFileContent.json';



// used to parse JSON object given in the body request
app.use(bodyParser.json());
// Serve up public/ftp folder 
app.use('/static', express.static(__dirname + '/../dist/'));

var compileSchema = function(schemaContentArray,schemaReturnType,schemaReturnAmount,relatedSchemaContent,compileMode,generateCounter) {
	var compiledSchema,returnAmount,compileMode;
	if ( schemaReturnType === "object" ) {
		compiledSchema = {};
	} else if ( schemaReturnType === "array" ) {
		compiledSchema = [];
	}
	returnAmount   = ( schemaReturnAmount == undefined ) ? 1  : schemaReturnAmount;
	compileMode    = ( compileMode !== undefined)        ? compileMode : "data";

	if ( returnAmount > 1 && relatedSchemaContent !== undefined ) {
		var check = true;
		relatedSchemaContent = _.sample(relatedSchemaContent,returnAmount);
	}
	(function(count) {
		var generator = generate();
		if (count < returnAmount) { 
			// forEach ** START **
			schemaContentArray.forEach(function (schemaContentValue,schemaContentIndex) {
				var schemaContentValueData, schemaContentValueName,schemaCompileMode;
				schemaContentValueName = schemaContentValue.name
				schemaContentValueData = (schemaContentValue.template == undefined) ? schemaContentValue.content : API_schema.templates[schemaContentValue.template.name];
				schemaCompileMode      = (schemaContentValue.template == undefined) ? "data" : schemaContentValue.template.compileMode;

				if ( schemaReturnType === "object" ) {
					if ( schemaContentValue.type === "object" || schemaContentValue.type === "array" ) {
						if ( schemaContentValueName !== undefined ) {
							compiledSchema[schemaContentValueName] = compileSchema(schemaContentValueData,schemaContentValue.type,schemaContentValue.amount,relatedSchemaContent,schemaCompileMode,count);
						} else {
							compiledSchema = compileSchema(schemaContentValueData,schemaContentValue.type,schemaContentValue.amount,relatedSchemaContent,schemaCompileMode,count);
						}
					} else if ( schemaContentValue.type === "field" ) {
						if ( relatedSchemaContent !== undefined && schemaContentValue.sample !== undefined ) {
							compiledSchema[schemaContentValueName] = relatedSchemaContent[generateCounter][schemaContentValue.sample];
						} else if ( schemaContentValue.content === undefined ) {
							if ( compileMode === "data" ) {
								compiledSchema[schemaContentValueName] = generator[schemaContentValueName]["value"];
							} else if ( compileMode === "blueprint") {
								compiledSchema[schemaContentValueName] = {
									"title" : generator[schemaContentValueName]["title"]
								};
							}
						} else if ( schemaContentValue.content !== undefined ) {
							compiledSchema[schemaContentValueName] = schemaContentValue.content;
						}
					}
				} else if ( schemaReturnType === "array" ) {
					if ( schemaContentValue.type === "object" ) {
						// arrays can only have nameless objects as children
						compiledSchema.push( compileSchema(schemaContentValueData,schemaContentValue.type,schemaContentValue.amount,relatedSchemaContent,schemaCompileMode,count) );
					} else if ( schemaContentValue.type === "field" ) {
						// a field value can either be given (hardcoded), generated or sampled from another schema it has a relationship to
						if ( relatedSchemaContent !== undefined && schemaContentValue.sample !== undefined ) {
							compiledSchema.push( {schemaContentValueName : relatedSchemaContent[generateCounter][schemaContentValue.sample]} );
						} else if ( schemaContentValue.content === undefined ) {
							if ( compileMode === "data" ) {
								compiledSchema.push( {schemaContentValueName : generator[schemaContentValueName]["value"]} );
							} else if ( compileMode === "blueprint" ) {
								compiledSchema.push( {schemaContentValueName : { "title" : generator[schemaContentValueName]["title"] }} );
							}
						} else if ( schemaContentValue.content !== undefined ) {
							compiledSchema.push( {schemaContentValueName : schemaContentValue.content} );
						}
					} else if ( schemaContentValue.type === "string" ) {
						compiledSchema.push( schemaContentValue.content );
					}
				} 
			});
			// forEach ** END **
			var caller = arguments.callee;
			caller(count + 1);
		}
	})(0);

	return compiledSchema;
};




API_schema.endpoints.forEach(function (endpoint) {
	var endpointData = {},relatedSchemaData;
	if ( endpoint["relatedSchema"] !== undefined ) {
		relatedSchemaData = repository.getRawData( endpoint["relatedSchema"],true,true );
	}
	// we take the endpoint's schema and compile it into the endpoint's data
	endpointData = compileSchema( endpoint.content, "object", 1, relatedSchemaData,undefined, 1 );
	repository.add( endpoint.name, endpointData, endpoint.pathToQueryArray, endpoint.rootObject, endpoint.relatedSchema, endpoint.queryable );

	if ( _.has(endpoint.methods, 'get') ) {
		app.get( endpoint.URL_BASE + ":APIendpoint" + (( endpoint.methods.get.ext !== undefined ) ? endpoint.methods.get.ext : ""), function (request,response) {
			try {
				var queries,APIendpoint,__response,data;
				// any queries such as '?term=s&year=1999' are stored in the '.query' object as key/value pairs
				queries = request.query;
				// the value of the 'subFileContent' not including the '.json' at the end
				// this is so we know what to return
				// for example this might be 'records' or 'exclusions'
				APIendpoint = request.params.APIendpoint;
				__response  = {};
				__response  = repository.find( APIendpoint, queries );
				response.json( __response );
			} catch (exception) {
				response.sendStatus(404);
			}
		});
	}
	if ( _.has(endpoint.methods, 'put') ) {
		app.put( endpoint.URL_BASE + ":APIendpoint" + (( endpoint.methods.put.ext !== undefined ) ? endpoint.methods.put.ext : "") + (( endpoint.methods.put.URL_SUFFIX !== undefined ) ? endpoint.methods.put.URL_SUFFIX : "") + '/:id', function (request, response) {
			try {
				var newData,id,APIendpoint,persistedFile,updatedContent;
				newData        = request.body;
				id             = parseInt(request.params.id);
				APIendpoint    = request.params.APIendpoint;
				persistedFile  = repository.find(APIendpoint, {"id" : id} )[0];
				updatedContent = _.merge(persistedFile, newData);

				repository.save( "exclusions", updatedContent );
				response.sendStatus(200);
			} catch (exception) {
			    response.sendStatus(404);
			}
		});
	}
	if ( _.has(endpoint.methods, 'post') ) {
		app.post( endpoint.URL + ":APIendpoint" + (( endpoint.methods.post.ext !== undefined ) ? endpoint.methods.post.ext : "") + (( endpoint.methods.post.URL_SUFFIX !== undefined ) ? endpoint.methods.post.URL_SUFFIX : ""), function (request, response) {
			var newData,APIendpoint;
			newData     = request.body;
			APIendpoint = request.params.APIendpoint;

			repository.save(APIendpoint, newData);
			response.sendStatus(200);
		});
	}
	if ( _.has(endpoint.methods, 'delete') ) {
		app.delete( endpoint.URL + ":APIendpoint" + (( endpoint.methods.delete.ext !== undefined ) ? endpoint.methods.delete.ext : "") + (( endpoint.methods.delete.URL_SUFFIX !== undefined ) ? endpoint.methods.delete.URL_SUFFIX : "") + '/:id', function (request, response) {
			try {
				var id,APIendpoint;
				id           = parseInt(request.params.id);
				APIendpoint  = request.params.APIendpoint;
				repository.remove(APIendpoint, {id : id} );
				response.sendStatus(200);
			} catch (exeception) {
				response.sendStatus(404);
			}
		});
	}
});

app.get('/', function (request,response) {

});




// URL for the mock API settings UI
app.get('/settings/API', function (request, response) {
	response.sendFile( path.join(__dirname + '/settings.html') );
});




// HTTP POST /files/
// Body Param : the JSON file you want to create
// Returns    : 200 HTTP code
// app.post( API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/exclusions/create', function (request, response) {
// 	var newData;
// 	newData = request.body;

// 	repository.save("exclusions", newData);
// 	response.sendStatus(200);
// });




 // HTTP PUT   : for updating exclusions
 // Param      : ?personId=[6 digit person Id number] the unique identifier of the file you want to update
 // Body Param : the JSON file you want to update
 // Returns    : 200 HTTP code
 // Error      : 404 HTTP code if the file doesn't exists
// app.put( API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/exclusions/update/:id', function (request, response) {
//     try {
// 		var newData,id,persistedFile,updatedContent;
// 		newData        = request.body;
// 		id             = parseInt(request.params.id);
// 		persistedFile  = repository.find("exclusions", {"id" : id} )[0];
// 		updatedContent = _.merge(persistedFile, newData);

//         repository.save( "exclusions", updatedContent );
//         response.sendStatus(200);
//     } catch (exception) {
//         response.sendStatus(404);
//     }
// });




 // HTTP DELETE specific file in 'subFileContent'
 // Param      : ?personId=[6 digit person Id number] the unique identifier of the file you want to delete
 // Body Param : the JSON file you want to update
 // Returns    : 200 HTTP code
 // Error      : 404 HTTP code if the file doesn't exists
// app.delete( API_URL, function (request, response) {
// 	try {
// 		// any queries such as '?term=s&year=1999' are stored in the '.query' object as key/value pairs
// 		var query = request.query;
// 		repository.remove("files", {personId : query.personId} );
// 		response.sendStatus(200);
// 	} catch (exeception) {
// 		response.sendStatus(404);
// 	}
// });

//app.listen(8080); //to port on which the express server listen
module.exports = app;