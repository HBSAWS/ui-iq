var Faker = require("faker"),
	_     = require("lodash");

var library = {
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

module.exports = function() {
	return {
		"acadPlan" : { 
			"title" : "Academic Plan",
			"value" : "MBA-BUSAD"
		},
		"address1H" : {
			"title" : "Home Address Address1",
			"value" : Faker.address.streetAddress()
		},
		"address2H" : {
			"title" : "Home Address Effdt2",
			"value" : Faker.address.secondaryAddress()
		},
		"address1P" : {
			"title" : "Permanent Address Address1",
			"value" : Faker.address.streetAddress()
		},
		"address2P" : {
			"title" : "Permanent Address Address2",
			"value" : Faker.address.secondaryAddress()
		},
		"addrEffdt" : {
			"title" : "Home Address Effdt",
			"value" : "2013-04-18T04:00:00.000+0000"
		},
		"addrEffdtH" : {
			"title" : "Home Address Effdt",
			"value" : "2013-04-18T04:00:00.000+0000"
		},
		"addrTypeH" : {
			"title" : "Home Address Type",
			"value" : "H"
		},
		"addrTypeP" : {
			"title" : "Permanent Address Type",
			"value" : "P"
		},
		"birthDay" : {
			"title" : "Birth Date",
			"value" : Faker.date.past()
		},
		"cityH" : {
			"title" : "Home Address City",
			"value" : Faker.address.city()
		},
		"cityP" : {
			"title" : "Permanent Address City",
			"value" : Faker.address.city()
		},
		"cntryTypeCodeH" : {
			"title" : "Home Address Country Code",
			"value" : "HKG"
		},
		"cntryTypeCodeP" : {
			"title" : "Permanent Address Country Code",
			"value" : "HKG"
		},
		"degCand" : {
			"title" : "Degree Candidate",
			"value" : _.sample(library.yesORno)
		},
		"degPrgm" : {
			"title" : "Degree Program",
			"value" : _.sample(library.degreeProgram)
		},
		"degPrgmNum" : {
			"title" : "Degree Program Number",
			"value" : 1
		},
		"effDt" : {
			"title" : "Effdt",
			"value" : "10/04/2015"
		},
		"estGradDate" : {
			"title" : "Expected Grad Date",
			"value" : "2016-05-26T04:00:00.000+0000"
		},
		"ethncCode" : {
			"title" : "Ethnicity Code",
			"value" : _.random(001,064)
		},
		"firstName" : {
			"title" : "First Name",
			"value" : Faker.name.firstName()
		}, 
		"lastName" : {
			"title" : "Last Name",
			"value" : Faker.name.lastName()
		},
		"lastRunDate" : {
			"title" : "Last Run Attend",
			"value" : new Date("2015-03-25T12:00:00")
		},
		"gender" : {
			"title" : "Gender",
			"value" : _.sample(library.gender)
		},
		"huid" : {
			"title" : "HUID",
			"value" : _.random(10000000, 99999999)
		},
		"middleName" : {
			"title" : "Middle Name",
			"value" : Faker.name.firstName()
		},
		"nonCitzStat" : {
			"title" : "Non-citizen Country",
			"value" : "GBR"
		},
		"postalCodeH" : {
			"title" : "Home Address Postal",
			"value" : Faker.address.zipCode()
		},
		"postalCodeP" : {
			"title" : "Permanent Address Postal",
			"value" : Faker.address.zipCode()
		},
		"prsnId" : {
			"title" : "Person Id",
			"value" : _.random(100000, 999999)
		},
		"regStat" : {
			"title" : "Registration Status",
			"value" : _.sample(library.registrationStatus)
		},
		"term" : {
			"title" : "Term",
			"value" : _.sample(library.term)
			// "value" : ( Number( new Date().getFullYear().toString().substr(2,2) )  + _.random(0,4) ).toString() + _.sample(library.term)
		},
		"timeStat" : {
			"title" : "Time Status",
			"value" : "F"
		},
		"schoolCode" : {
			"title" : "School Code",
			"value" : "HBSM"
		},
		"usCitz" : {
			"title" : "USA Citizen",
			"value" : _.sample(library.yesORno)
		},
		"year" : {
			"title" : "Year",
			"value" : 2015
			// "value" : _.random(2010, 2015)
		},
		"yrInPrgm" : {
			"title" : "Year In Program",
			"value" : _.sample(library.yearInProgram)
		}
	};
};