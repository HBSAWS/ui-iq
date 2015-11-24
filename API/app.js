var fs 				   = require('fs'),
	_                  = require("lodash"),
	path               = require("path"),

	express            = require('../node_modules/express'),
	bodyParser         = require('../node_modules/body-parser'),
	ejs  			   = require('ejs'),

	generateConfig     = require("./generate/config"),
	generate           = require("./generator"),
	API_schema         = JSON.parse( fs.readFileSync(path.join(__dirname + '/schema.json')) ).endpoints,
	api                = require("./api"),


	app                = express(),
	repository         = new api(),
	API_URL_BASE       = '/iqService/rest',
	API_URL            = API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/:subFileContent.json';



// used to parse JSON object given in the body request
app.use(bodyParser.json());
// Serve up public/ftp folder 
app.use('/static', express.static(__dirname + '/../dist/'));

var compileSchema = function(schemaContentArray,schemaReturnType,schemaReturnAmount,relatedSchemaContent) {
	var compiledSchema,returnAmount;
	if ( schemaReturnType === "object" ) {
		compiledSchema = {};
	} else if ( schemaReturnType === "array" ) {
		compiledSchema = [];
	}
	returnAmount   = ( schemaReturnAmount === undefined ) ? 1  : schemaReturnAmount;

	(function(count) {
		var generator = generate();
		if (count < returnAmount) { 
			// forEach ** START **
			schemaContentArray.forEach(function (schemaContentValue,schemaContentIndex) {
				if ( schemaReturnType === "object" ) {
					if ( schemaContentValue.__type === "object" || schemaContentValue.__type === "array" ) {
						// a object can only have another object inside of it if it has a name
						compiledSchema[schemaContentValue.name] = compileSchema(schemaContentValue.content,schemaContentValue.__type,schemaContentValue.amount);
					} else if ( schemaContentValue.__type === "field" ) {
						// the only other child an object can have is a field name/value pair
						// a field value can either be given (hardcoded), generated or sampled from another schema it has a relationship to
						if ( relatedSchemaContent !== undefined && schemaContentValue.sample !== undefined ) {
							compiledSchema[schemaContentValue.name] = relatedSchemaContent[count][schemaContentValue.sample];
						} else if ( schemaContentValue.content === undefined ) {
							compiledSchema[schemaContentValue.name] = generator[schemaContentValue.name];
						} else if ( schemaContentValue.content !== undefined ) {
							compiledSchema[schemaContentValue.name] = schemaContentValue.content;
						}
					}
				} else if ( schemaReturnType === "array" ) {
					if ( schemaContentValue.__type === "object" ) {
						// arrays can only have nameless objects as children
						compiledSchema.push( compileSchema(schemaContentValue.content,schemaContentValue.__type,schemaContentValue.amount) );
					} else if ( schemaContentValue.__type === "field" ) {
						var schemaContentValueName = schemaContentValue.name;
						// a field value can either be given (hardcoded), generated or sampled from another schema it has a relationship to
						if ( schemaContentValue.content === undefined && schemaContentValue.sample !== undefined ) {
							compiledSchema.push( {schemaContentValueName : relatedSchemaContent[count][schemaContentValue.sample]} );
						} else if ( schemaContentValue.content === undefined ) {
							compiledSchema.push( {schemaContentValueName : generator[schemaContentValue.sample]} );
						} else if ( schemaContentValue.content !== undefined ) {
							compiledSchema.push( {schemaContentValueName : schemaContentValue.content} );
						}				
					} else if ( schemaContentValue.__type === "string" ) {
						compiledSchema.push( schemaContentValue.content );
					}
				} else if ( schemaReturnType === "field" ) {
					console.log("is this even possible??");
				}
			});
			// forEach ** END **
			var caller = arguments.callee;
			caller(count + 1);
		}
	})(0);

	return compiledSchema;
};




API_schema.forEach(function (endpoint) {
	var endpointData = {};
	if ( endpoint.relatedTo !== undefined ) {
		var sampleSource,sampler;
		sampleSource = repository.repositories[ endpoint["relatedTo"] ]["content"];
		sampler      = _.sample(sampleSource, endpoint.amount);
		if ( repository.repositories[ endpoint["relatedTo"] ]["toFilter"] !== undefined ) {
			var filter = repository.repositories[endpoint.relatedTo]["toFilter"];
			sampler    = sampler.forEach(function (value,index,array) {
				return value[filter];
			});
		}
	}
	endpointData[endpoint.name] = compileSchema(endpoint.content, endpoint.__type, endpoint.amount, sampler);
	repository.add( endpoint.name, endpointData[ endpoint.name ], endpoint.toFilter, endpoint.relatedTo );

	if ( endpoint.methods.indexOf("get") > -1 ) {
		app.get( endpoint.URL + ":APIendpoint" + endpoint.ext, function (request,response) {
			try {
				var queries,APIendpoint,__response,data;
				// any queries such as '?term=s&year=1999' are stored in the '.query' object as key/value pairs
				queries = request.query;
				// the value of the 'subFileContent' not including the '.json' at the end
				// this is so we know what to return
				// for example this might be 'records' or 'exclusions'
				APIendpoint                = request.params.APIendpoint;
				__response                 = {};
				__response[APIendpoint] = repository.find( APIendpoint, queries );
				response.json( __response );
			} catch (exception) {
				response.sendStatus(404);
			}
		});
	}
	if ( endpoint.methods.indexOf("put") > -1 ) {
		app.put( endpoint.URL + ":APIendpoint" + '/update/:id', function (request, response) {
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
	if ( endpoint.methods.indexOf("post") > -1 ) {
		app.post( endpoint.URL + ":APIendpoint" + '/create', function (request, response) {
			var newData,APIendpoint;
			newData     = request.body;
			APIendpoint = request.params.APIendpoint;

			repository.save(APIendpoint, newData);
			response.sendStatus(200);
		});
	}
	if ( endpoint.methods.indexOf("delete") > -1 ) {
		app.delete( endpoint.URL + ":APIendpoint" + '/delete/:id', function (request, response) {
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