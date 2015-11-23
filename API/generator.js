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

var generator = {
	"prsnId"         : _.random(100000, 999999),
	"huId"           : _.random(10000000, 99999999),
	"term"           : ( Number( new Date().getFullYear().toString().substr(2,2) )  + _.random(0,4) ).toString() + _.sample(library.term),
	"ethncCode"      : _.random(001,064),
	"birthDay"       : Faker.date.past(),
	"gender"         : _.sample(library.gender),
	"schoolCode"     : "HBSM",
	"degPrgm"        : _.sample(library.degreeProgram),
	"degPrgmNum"     : 1,
	"effDt"          : "10/04/2015",
	"regStat"        : _.sample(library.registrationStatus),
	"firstName"      : Faker.name.firstName(),
	"lastName"       : Faker.name.lastName(),
	"middleName"     : Faker.name.firstName(),
	"usCitz"         : _.sample(library.yesORno),
	"nonCitzStat"    : "GBR",
	"addrTypeH"      : "H",
	"address1H"      : Faker.address.streetAddress(),
	"address2H"      : Faker.address.secondaryAddress(),
	"addrEffdtH"     : "2013-04-18T04:00:00.000+0000",
	"cityH"          : Faker.address.city(),
	"postalCodeH"    : Faker.address.zipCode(),
	"cntryTypeCodeH" : "HKG",
	"addrTypeP"      : "P",
	"address1P"      : Faker.address.streetAddress(),
	"address2P"      : Faker.address.secondaryAddress(),
	"cityP"          : Faker.address.city(),
	"postalCodeP"    : Faker.address.zipCode(),
	"cntryTypeCodeP" : "HKG",
	"timeStat"       : "F",
	"degCand"        : _.sample(library.yesORno),
	"yrInPrgm"       : _.sample(library.yearInProgram),
	"acadPlan"       : "MBA-BUSAD",
	"addrEffdt"      : "2013-04-18T04:00:00.000+0000",
	"estGradDate"    : "2016-05-26T04:00:00.000+0000",
	"lastRunDate"    : new Date("2015-03-25T12:00:00")
};

module.exports = function() {
	return generator;
}