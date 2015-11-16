var generateConfig     = require("./generate/config"),
	api                = require("./api"),

	express            = require('../node_modules/express'),
	bodyParser         = require('../node_modules/body-parser'),

	_                  = require("lodash"),
	path               = require("path"),
	app                = express(),
	fileRepository     = new api(),
	API_URL_BASE       = '/iqService/rest',
	API_URL            = API_URL_BASE + '/:type(mba|doc)/:type(bio|admit)/:subFileContent.json';


// used to parse JSON object given in the body request
app.use(bodyParser.json());
// Serve up public/ftp folder 
app.use('/static', express.static(__dirname + '/../dist/'));



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