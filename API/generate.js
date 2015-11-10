module.exports = function() {
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
	var config = {
			"config"  : {
			"PDM_URL" : "https://secure-stage.hbs.edu/pdm/sis/"
		},
		"userInfo" : {
			"firstName" : "Peter",
			"lastName"  : "Kloss",
			"roles" : [
				"HBSW_ITG",
				"IQ_ADMIN",
				"IQ_IQ_ADMIN"
			]
		},
		"metadata": {
			"bioFields": [
				"prsnId",
				"huId",
				"term",
				"ethncCode",
				"birthDay",
				"gender",
				"schoolCode",
				"degPrgm",
				"degPrgmNum",
				"effDt",
				"regStat",
				"firstName",
				"lastName",
				"middleName",
				"usCitz",
				"citzStat",
				"nonCitzStat",
				"addrTypeH",
				"address1H",
				"address2H",
				"addrEffdtH",
				"cityH",
				"stateH",
				"postalCodeH",
				"cntryTypeCodeH",
				"addrTypeP",
				"address1P",
				"address2P",
				"cityP",
				"stateP",
				"postalCodeP",
				"cntryTypeCodeP",
				"timeStat",
				"degCand",
				"yrInPrgm",
				"acadPlan",
				"addrEffdt",
				"estGradDate",
				"lastDateAttend",
				"lastRunDate"
			],
			"bioMeta" : {
				"prsnId" : {
					"title" : "Person Id"
				},
				"huId" : {
					"title": "HUID"
				},
				"term" : {
					"title" : "Term"
				},
				"ethncCode" : {
					"title" : "Ethnicity Code"
				},
				"birthDay" : {
					"title" : "Birth Date",
					"type"  : "date"
				},
				"gender" : {
					"title" : "Gender"
				},
				"schoolCode"	: {
					"title" : "School Code"
				},
				"degPrgm" : {
					"title" : "Degree Program"
				},
				"degPrgmNum" : {
					"title" : "Degree Program Number"
				},
				"effDt" : {
					"title" : "Effdt",
					"type"  : "date"
				},
				"regStat" : {
					"title" : "Registration Status"
				},
				"firstName" : {
					"title" : "First Name"
				},
				"lastName" : {
					"title" : "Last Name"
				},
				"middleName" : {
					"title" : "Middle Name"
				},
				"usCitz" : {
					"title" : "USA Citizen"
				},
				"citzStat": {
					"title" : "Citizenship Status"
				},
				"nonCitzStat" : {
					"title" : "Non-citizen Country"
				},
				"addrTypeH" : {
					"title" : "Home Address Type"
				},
				"address1H" : {
					"title" : "Home Address Address1"
				},
				"address2H" : {
					"title" : "Home Address Address2"
				},
				"addrEffdtH" : {
					"title" : "Home Address Effdt",
					"type"  : "date"
				},
				"cityH" : {
					"title" : "Home Address City"
				},
				"stateH" : {
					"title" : "Home Address State"
				},
				"postalCodeH" : {
					"title" : "Home Address Postal"
				},
				"cntryTypeCodeH" : {
					"title" : "Home Address Country Code"
				},
				"addrTypeP" : {
					"title" : "Permanent Address Type"
				},
				"address1P" : {
					"title" : "Permanent Address Address1"
				},
				"address2P" : {
					"title" : "Permanent Address Address2"
				},
				"cityP" : {
					"title" : "Permanent Address City"
				},
				"stateP" : {
					"title":  "Permanent Address State"
				},
				"postalCodeP" : {
					"title" : "Permanent Address Postal"
				},
				"cntryTypeCodeP" : {
					"title" : "Permanent Address Country Code"
				},
				"timeStat" : {
					"title" : "Time Status"
				},
				"degCand" : {
					"title" : "Degree Candidate"
				},
				"yrInPrgm" : {
					"title" : "Year In Program"
				},
				"acadPlan" : {
					"title" : "Academic Plan"
				},
				"addrEffdt" : {
					"title" : "Address Effdt",
					"type"  : "date"
				},
				"estGradDate" : {
					"title" : "Expected Grad Date",
					"type"  : "date"
				},
				"lastDateAttend" : {
					"title" : "Last Date Attend",
					"type"  : "date"
				},
				"lastRunDate" : {
					"title" : "Last Run Attend",
					"type"  : "date"
				}
			},
			"admitFields" : [
				"huid",
				"personalEmailAddr",
				"schoolApplicantId",
				"schoolCode",
				"createDate",
				"person.birthDate",
				"person.birthState",
				"person.birthCountry",
				"person.gender",
				"person.ssn",
				"person.itin",
				"person.disabledVeteran",
				"person.maritalStatus",
				"person.militaryStatus",
				"name.lastName",
				"name.firstName",
				"name.middleName",
				"name.otherLastName",
				"name.prefix",
				"name.suffix",
				"name.preferredName",
				"name.formerLastName",
				"citizenship.usaCitizen",
				"citizenship.citizenshipStatus",
				"citizenship.nonUsaCitizenshipCountry",
				"citizenship.visa",
				"ethnicity.ethnicityValue",
				"ethnicity.ethnicityCode",
				"addresses.address[0].addrType",
				"addresses.address[0].countryCode",
				"addresses.address[0].address1",
				"addresses.address[0].address2",
				"addresses.address[0].city",
				"addresses.address[0].state",
				"addresses.address[0].postal",
				"application.applicationNumber",
				"application.termApplyingFor",
				"application.expectedGradTerm",
				"application.fullPartTime",
				"application.applicationMethod",
				"application.admitType",
				"application.applicationCenter",
				"application.applicationDate",
				"application.application1.applicationStatus",
				"application.application1.applicationStatusDate",
				"application.application1.statusReason",
				"application.application2.applicationStatus",
				"application.application2.applicationStatusDate",
				"application.application2.statusReason",
				"application.termDeferringTo",
				"application.notificationPlan",
				"application.internationalApplicant",
				"application.degreeProgram",
				"application.majorTrack",
				"application.specialization",
				"application.jointProgram",
				"application.previouslyApplied",
				"application.financialAid",
				"application.referralSource",
				"application.legacy",
				"application.firstGeneration",
				"application.declinationReason",
				"highSchool.hsSchoolId",
				"highSchool.hsName",
				"highSchool.hsState",
				"highSchool.hsCountry",
				"highSchool.hsGpa",
				"highSchool.hsGpaSource",
				"highSchool.hsGraduationDt"
			],
			"admitMeta" : {
				"huid" : {
					"title" : "HUID"
				},
				"personalEmailAddr" : {
					"title" : "Personal Email Address"
				},
				"schoolApplicantId" : {
					"title" : "School Applicant Id"
				},
				"schoolCode" : {
					"title" : "School Code"
				},
				"createDate" : {
					"title" : "Create Date",
					"type"  : "date"
				},
				"person.birthDate" : {
					"title" : "Birth Date",
					"type"  : "date"
				},
				"person.birthState" : {
					"title" : "Birth State"
				},
				"person.birthCountry" : {
					"title" : "Birth Country"
				},
				"person.gender" : {
					"title" : "Gender"
				},
				"person.ssn" : {
					"title" : "SSN"
				},
				"person.itin" : {
					"title" : "ITIN"
				},
				"person.disabledVeteran" : {
					"title" : "Disabled Veteran"
				},
				"person.maritalStatus" : {
					"title" : "Marital Status"
				},
				"person.militaryStatus" : {
					"title" : "Military Status"
				},
				"name.lastName" : {
					"title" : "Last Name"
				},
				"name.firstName" : {
					"title" : "First Name"
				},
				"name.middleName" : {
					"title" : "Middle Name"
				},
				"name.otherLastName" : {
					"title" : "Other Last Name"
				},
				"name.prefix" : {
					"title" : "Prefix"
				},
				"name.suffix" : {
					"title" : "Suffix"
				},
				"name.preferredName": {
					"title" : "Preferred Name"
				},
				"name.formerLastName" : {
					"title" : "Former Last Name"
				},
				"citizenship.usaCitizen" : {
					"title" : "USA Citizen"
				},
				"citizenship.citizenshipStatus": {
					"title" : "Citizenship Status"
				},
				"citizenship.nonUsaCitizenshipCountry" : {
					"title" : "non-USA Citizenship Country"
				},
				"citizenship.visa" : {
					"title" : "Visa"
				},
				"ethnicity.ethnicityValue" : {
					"title" : "Ethnicity Value"
				},
				"ethnicity.ethnicityCode" : {
					"title" : "Ethnicity Code"
				},
				"addresses.address[0].addrType" : {
					"title" : "Address Type"
				},
				"addresses.address[0].countryCode" : {
					"title" : "Country Code"
				},
				"addresses.address[0].address1" : {
					"title" : "Address1"
				},
				"addresses.address[0].address2" : {
					"title" : "Address2"
				},
				"addresses.address[0].city" : {
					"title" : "City"
				},
				"addresses.address[0].state" : {
					"title" : "State"
				},
				"addresses.address[0].postal" : {
					"title" : "Postal"
				},
				"application.applicationNumber" : {
					"title" : "Application Number"
				},
				"application.termApplyingFor" : {
					"title" : "Term Applying For"
				},
				"application.expectedGradTerm" : {
					"title" : "Expected Grad Term"
				},
				"application.fullPartTime" : {
					"title" : "Full Part Time"
				},
				"application.applicationMethod" : {
					"title" : "Application Method"
				},
				"application.admitType" : {
					"title" : "Admit Type"
				},
				"application.applicationCenter" : {
					"title" : "Application Center"
				},
				"application.applicationDate" : {
					"title" : "Application Date",
					"type"  : "date"
				},
				"application.application1.applicationStatus" : {
					"title" : "Application1 Status"
				},
				"application.application1.applicationStatusDate" : {
					"title" : "Application1 Status Date",
					"type"  : "date"
				},
				"application.application1.statusReason" : {
					"title" : "Application1 Status Reason"
				},
				"application.application2.applicationStatus" : {
					"title" : "Application2 Status"
				},
				"application.application2.applicationStatusDate" : {
					"title" : "Application2 Status Date",
					"type"  : "date"
				},
				"application.application2.statusReason" : {
					"title" : "Application2 Status Reason"
				},
				"application.termDeferringTo" : {
					"title" : "Term Deferring To"
				},
				"application.notificationPlan" : {
					"title" : "Notification Plan"
				},
				"application.internationalApplicant" : {
					"title" : "International Applicant"
				},
				"application.degreeProgram" : {
					"title" : "Degree Program"
				},
				"application.majorTrack" : {
					"title" : "Major Track"
				},
				"application.specialization" : {
					"title" : "Specialization"
				},
				"application.jointProgram" : {
					"title" : "Joint Program"
				},
				"application.previouslyApplied" : {
					"title" : "Previously Applied"
				},
				"application.financialAid" : {
					"title" : "Financial Aid"
				},
				"application.referralSource" : {
					"title" : "Referral Source"
				},
				"application.legacy" : {
					"title" : "Legacy"
				},
				"application.firstGeneration" : {
					"title" : "First Generation"
				},
				"application.declinationReason" : {
					"title" : "Declination Reason"
				},
				"highSchool.hsSchoolId" : {
					"title" : "High School Id"
				},
				"highSchool.hsName" : {
					"title" : "High School Name"
				},
				"highSchool.hsState" : {
					"title" : "High School State"
				},
				"highSchool.hsCountry" : {
					"title" : "High School Country"
				},
				"highSchool.hsGpa" : {
					"title" : "High School GPA"
				},
				"highSchool.hsGpaSource" : {
					"title" : "High School GPA Source"
				},
				"highSchool.hsGraduationDt" : {
					"title" : "High School Graduation Date",
					"type"  : "date"
				}
			}
		}
	};



	return {
		"bio.json" : {
			"records" :  _.times(1800, generateRecords)
		},
		"admit.json" : {          
			"records" : _.times(1800, generateRecords)
		},
		"config.json?meta=true" : config,
		"config.json"           : config,
		"admit/excl.json" : {
			"exclusions" : exclusions
		},
		"bio/excl.json" : {
			"exclusions" : exclusions
		}
	}
};	