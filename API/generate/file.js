var Faker = require("faker"),
	_     = require("lodash");

var Samples = {
	citizenshipStatus  : ["C","N","P"],
	degreeProgram      : ["MBA","DOC"],
	gender             : ["F","M","T"],
	registrationStatus : ["AE","D","DF","EG","EP","GR","LA","LF","ND","NE","P","SA","SP","WR"],
	term               : ["F","S"],
	timeStatusSamples  : ["F","H","L","T"],
	yearInProgram      : ["EC","RC"],
	yesORno            : ["Y","N"],
	exception          : [true,false,false,false,false,false,false,false,false]
};


var exclusions        = [];
var generateExclusion = function(id,personId,degreeProgram,firstName,lastName) {
	return {
		"id"        : id,
		"prsnId"    : personId,
		"group"     : degreeProgram,
		"type"      : "bio",
		"firstName" : firstName,
		"lastName"  : lastName,
		"note"      : Faker.lorem.paragraph() + " " + Faker.lorem.paragraph(),
		"startDate" : "2015-11-05T15:33:02.121+0000"
	}
};
var generateRecords = function(n) {
		var city,postalCode,term;
		city               = Faker.address.city();
		postalCode         = Faker.address.zipCode();
		primaryAddress     = Faker.address.streetAddress();
		secondaryAddress   = Faker.address.secondaryAddress();

		registrationStatus = _.sample(Samples.registrationStatus);
		upToNextFiveYears  = (new Date().getFullYear() - 1) + _.random(0,5);

		if ( registrationStatus.indexOf("EG EP P SA SP") > -1 ) {
			timeStatus = _.sample(timeStatusSamples);
		} else {
			timeStatus = "F";
		}

		// this is an abbreviated year, so 2015 = 15, plus a random number between 0 - 4, so either this year or up to four years after it
		// converted to a string, and then add either 'S' or 'F', in other words a random term on to it
		currentTerm   = _.sample(Samples.term);
		term          = ( Number( new Date().getFullYear().toString().substr(2,2) )  + _.random(0,4) ).toString() + _.sample(Samples.term);
		personId      = _.random(100000, 999999);
		degreeProgram = _.sample(Samples.degreeProgram);
		firstName     = Faker.name.firstName();
		lastName      = Faker.name.lastName();

		if ( _.sample(Samples.exception) ) {
			// this for our randomly generated exceptions, which we've weighted 
			exclusions.push( generateExclusion(n,personId,degreeProgram,firstName,lastName) );
		}


		return {
			"id"       : n,
			"term"     : currentTerm,
			"year"     : upToNextFiveYears,
			"personId" : personId,
			record : {
				// for the query pattern being used inplace of API endpoints - unfortuantely term is used twice - as a query parameter to DB and as JSON record term
				// luckily for us we can just change the config meta value as they're dyanmic, but there isn't really the best way to create REST - end points should be true endpoints - not file extentions that we then query
				"prsnId"         : personId,
				"huId"           : _.random(10000000, 99999999),
				"term"           : term,
				"ethncCode"      : _.random(001,064),
				"birthDay"       : Faker.date.past(),
				"gender"         : _.sample(Samples.gender),
				"schoolCode"     : "HBSM",
				"degPrgm"        : degreeProgram,
				"degPrgmNum"     : 1,
				"effDt"          : "10/04/2015",
				"regStat"        : _.sample(registrationStatus),
				"firstName"      : firstName,
				"lastName"       : lastName,
				"middleName"     : Faker.name.firstName(),
				"usCitz"         : _.sample(Samples.yesORno),
				"nonCitzStat"    : "GBR",
				"addrTypeH"      : "H",
				"address1H"      : primaryAddress,
				"address2H"      : secondaryAddress,
				"addrEffdtH"     : "2013-04-18T04:00:00.000+0000",
				"cityH"          : city,
				"postalCodeH"    : postalCode,
				"cntryTypeCodeH" : "HKG",
				"addrTypeP"      : "P",
				"address1P"      : primaryAddress,
				"address2P"      : secondaryAddress,
				"cityP"          : city,
				"postalCodeP"    : postalCode,
				"cntryTypeCodeP" : "HKG",
				"timeStat"       : "F",
				"degCand"        : _.sample(Samples.yesORno),
				"yrInPrgm"       : _.sample(Samples.yearInProgram),
				"acadPlan"       : "MBA-BUSAD",
				"addrEffdt"      : "2013-04-18T04:00:00.000+0000",
				"estGradDate"    : "2016-05-26T04:00:00.000+0000",
				"lastRunDate"    : new Date("2015-03-25T12:00:00")
			},
			errors : [
				{
					"field": "addrEffdt",
					"message": "required field",
					"type": "E",
					"ind": "R"
				}
			]
		}
};

module.exports = function( numberOfRecords ) {
	return 	{ 
				records    : _.times(numberOfRecords, generateRecords),
			 	exclusions : exclusions
			};
};