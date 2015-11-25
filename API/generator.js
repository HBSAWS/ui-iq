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
		"year" : {
			"title" : "Year",
			"value" : _.random(1900, 2015)
		},
		"prsnId" : {
			"title" : "Person Id",
			"value" : _.random(100000, 999999)
		},
		"huid" : {
			"title" : "HUID",
			"value" : _.random(10000000, 99999999)
		},
		"huId" : {
			"title" : "HUID",
			"value" : _.random(10000000, 99999999)
		},
		"term" : {
			"title" : "Term",
			"value" : ( Number( new Date().getFullYear().toString().substr(2,2) )  + _.random(0,4) ).toString() + _.sample(library.term)
		},
		"ethncCode" : {
			"title" : "Ethnicity Code",
			"value" : _.random(001,064)
		},
		"birthDay" : {
			"title" : "Birth Date",
			"value" : Faker.date.past()
		},
		"gender" : {
			"title" : "Gender",
			"value" : _.sample(library.gender)
		},
		"schoolCode" : {
			"title" : "School Code",
			"value" : "HBSM"
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
		"regStat" : {
			"title" : "Registration Status",
			"value" : _.sample(library.registrationStatus)
		},
		"firstName" : {
			"title" : "First Name",
			"value" : Faker.name.firstName()
		},
		"lastName" : {
			"title" : "Last Name",
			"value" : Faker.name.lastName()
		},
		"middleName" : {
			"title" : "Middle Name",
			"value" : Faker.name.firstName()
		},
		"usCitz" : {
			"title" : "USA Citizen",
			"value" : _.sample(library.yesORno)
		},
		"nonCitzStat" : {
			"title" : "Non-citizen Country",
			"value" : "GBR"
		},
		"addrTypeH" : {
			"title" : "Home Address Type",
			"value" : "H"
		},
		"address1H" : {
			"title" : "Home Address Address1",
			"value" : Faker.address.streetAddress()
		},
		"address2H" : {
			"title" : "Home Address Effdt2",
			"value" : Faker.address.secondaryAddress()
		},
		"addrEffdtH" : {
			"title" : "Home Address Effdt",
			"value" : "2013-04-18T04:00:00.000+0000"
		},
		"cityH" : {
			"title" : "Home Address City",
			"value" : Faker.address.city()
		},
		"postalCodeH" : {
			"title" : "Home Address Postal",
			"value" : Faker.address.zipCode()
		},
		"cntryTypeCodeH" : {
			"title" : "Home Address Country Code",
			"value" : "HKG"
		},
		"addrTypeP" : {
			"title" : "Permanent Address Type",
			"value" : "P"
		},
		"address1P" : {
			"title" : "Permanent Address Address1",
			"value" : Faker.address.streetAddress()
		},
		"address2P" : {
			"title" : "Permanent Address Address2",
			"value" : Faker.address.secondaryAddress()
		},
		"cityP" : {
			"title" : "Permanent Address City",
			"value" : Faker.address.city()
		},
		"postalCodeP" : {
			"title" : "Permanent Address Postal",
			"value" : Faker.address.zipCode()
		},
		"cntryTypeCodeP" : {
			"title" : "Permanent Address Country Code",
			"value" : "HKG"
		},
		"timeStat" : {
			"title" : "Time Status",
			"value" : "F"
		},
		"degCand" : {
			"title" : "Degree Candidate",
			"value" : _.sample(library.yesORno)
		},
		"yrInPrgm" : {
			"title" : "Year In Program",
			"value" : _.sample(library.yearInProgram)
		},
		"acadPlan" : {
			"title" : "Academic Plan",
			"value" : "MBA-BUSAD"
		},
		"addrEffdt" : {
			"title" : "Home Address Effdt",
			"value" : "2013-04-18T04:00:00.000+0000"
		},
		"estGradDate" : {
			"title" : "Expected Grad Date",
			"value" : "2016-05-26T04:00:00.000+0000"
		},
		"lastRunDate" : {
			"title" : "Last Run Attend",
			"value" : new Date("2015-03-25T12:00:00")
		} 
	};
};