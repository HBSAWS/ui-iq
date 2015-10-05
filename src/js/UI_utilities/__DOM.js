// enter attribute name as you normally would
	// ex : "data-test-name"
var UI_DOM = {
	__formatToCamelCase : function( attributeName ) {
		var nameSegments,camelCaseName;
		// format the attribute name for javascript
		nameSegments = attributeName.split("-");
		nameSegments.shift();
		camelCaseName = "";
		if ( nameSegments.length > 1 ) {
			for ( var segment = 0, len = nameSegments.length; segment < len; segment++ ) {
				var currentSegment = nameSegments[segment];
				if ( segment == 0 ) {
					camelCaseName += currentSegment;
				} else {
					camelCaseName += currentSegment.charAt(0).toUpperCase() + currentSegment.substring(1);
				}
			} 
		} else {
			camelCaseName = nameSegments[0];
		}
		return camelCaseName;
	},
	removeDataValue : function( el,attributeName,attributeValues ) {
		var __self,camelCaseName,activeAttributeValue,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName        = __self.__formatToCamelCase(attributeName);
		activeAttributeValue = el.dataset[camelCaseName];
		// checking to see if element actually has the attribute before attempting to manipulate it
		if ( activeAttributeValue !== undefined && activeAttributeValue !== null ) {
			attributeNameArray = activeAttributeValue.split(" ");
			compiledValues     = __self.__compileValues( "remove", attributeNameArray, attributeValues );

			// the attribute has been added, we join the array and add it back to our DOM element
			newAttributeValue = compiledValues.join(" ");
			el.setAttribute( attributeName, newAttributeValue );
		} else {
			// if the element doesn't have the attribute we do nothing as there is nothing to remove
			return;
		}
	},
	addDataValue : function( el,attributeName,attributeValues ) {
		var __self,camelCaseName,activeAttributeValue,attributeNameArray,compiledValues,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName        = __self.__formatToCamelCase(attributeName);
		activeAttributeValue = el.dataset[camelCaseName];

		// var addDataValue = function( __el ) {
		// 	var activeAttributeValue,attributeNameArray,compiledValues,newAttributeValue;
		// 	activeAttributeValue = __el.dataset[camelCaseName];

		// 	if ( activeAttributeValue !== undefined && activeAttributeValue !== null && activeAttributeValue.length > 0 ) {
		// 		// if there is an existing data attribute, and that value's length is greater than zero
		// 		// by splitting it, even if there is no space, the attributeNameArray will always be an array
		// 		attributeNameArray = activeAttributeValue.split(" ");
		// 		compiledValues     = __self.__compileValues( "add", attributeNameArray, attributeValues );

		// 		// the attribute has been added, we join the array and add it back to our DOM element
		// 		newAttributeValue = compiledValues.join(" ");
		// 	} else {
		// 		newAttributeValue = ( attributeValues instanceof Array ) ? attributeValues.filter( UI_helpers.arrays.filterUnique ).join(" ") : attributeValues;
		// 	}
		// 	__el.setAttribute( attributeName, newAttributeValue );
		// };

		// if ( el instanceof Array ) {
		// 	for ( var __el = 0, len = el.length; __el < len; __el++ ) {
		// 		var currentEl = el[__el];
		// 		addDataValue( currentEl );
		// 	}
		// } else {
		// 	addDataValue( el );
		// }

		if ( activeAttributeValue !== undefined && activeAttributeValue !== null && activeAttributeValue.length > 0 ) {
			// if there is an existing data attribute, and that value's length is greater than zero
			// by splitting it, even if there is no space, the attributeNameArray will always be an array
			attributeNameArray = activeAttributeValue.split(" ");
			compiledValues     = __self.__compileValues( "add", attributeNameArray, attributeValues );

			// the attribute has been added, we join the array and add it back to our DOM element
			newAttributeValue = compiledValues.join(" ");
		} else {
			newAttributeValue = ( attributeValues instanceof Array ) ? attributeValues.filter( UI_helpers.arrays.filterUnique ).join(" ") : attributeValues;
		}
		el.setAttribute( attributeName, newAttributeValue );
	},
	hasDataValue : function( el,attributeName,attributeValue ) {
		var __self,hasValue,camelCaseName,attributeNameArray,attributeValues;
		__self   = this;
		hasValue = false;
		// format the attribute name for javascript
		camelCaseName   = __self.__formatToCamelCase(attributeName);
		attributeValues = el.dataset[camelCaseName];

		if ( attributeValues !== undefined && attributeValues !== null ) {
			attributeNameArray = attributeValues.split(" ");
			if ( attributeNameArray.indexOf( attributeValue ) > -1 ) {
				hasValue = true;
			}
		}

		return hasValue;
	},
	toggleDataValue : function( el,attributeName,attributeValues ) {
		var __self,activeAttributeValue,toSort,camelCaseName,activeAttributeValues,toAdd,toRemove; 
		__self = this;

		if ( attributeValues instanceof Array || attributeValues.indexOf(' ') > -1 ) {
			toSort                = ( attributeValues.indexOf(' ') > -1 ) ? attributeValues.split(" ") : attributeValues;
			camelCaseName         = __self.__formatToCamelCase(attributeName);
			activeAttributeValues = el.dataset[camelCaseName];

			if ( activeAttributeValues !== null && activeAttributeValues !== undefined ) {
				toSort   = __self.__sortValues( activeAttributeValues.split(" "), toSort );
				toRemove = toSort.toRemove;
				toAdd    = toSort.toAdd;
			} else {
				toRemove = "";
				toAdd    = attributeValues;
			}
			__self.removeDataValue( el,attributeName,toRemove );
			__self.addDataValue( el,attributeName,toAdd );
		} else {
			if ( __self.hasDataValue( el,attributeName,attributeValues ) ) {
				__self.removeDataValue( el,attributeName,attributeValues );
			} else {
				__self.addDataValue( el,attributeName,attributeValues );
			}
		}
	},
	removeClass : function( el,classNames ) {
		var __self;
		__self           = this;
		activeClassNames = el.className;

		if ( activeClassNames.length > 0 ) {
			// if the length of the element's className is greater than zero there are classes present
			classNameArray = activeClassNames.split(" ");
			compiledValues = __self.__compileValues( "remove", classNameArray, classNames );

			newClassValue  = compiledValues.join(" ");
			el.className = newClassValue; 
		} else {
			// if the length of the element's className isn't greater than zero it means it has no classes and there is nothing to remove
			return;
		}
	},
	addClass : function( el,classNames ) {
		var __self,activeClassNames,classNameArray,compiledValues,newClassValue;
		__self           = this;
		activeClassNames = el.className;

		if ( activeClassNames.length > 0 ) {
			// if the length is greater than zero, it means there are already classes added
			classNameArray = activeClassNames.split(" ");
			compiledValues = __self.__compileValues( "add", classNameArray, classNames );

			newClassValue  = compiledValues.join(" ");
		} else {
			// if the className value isn't greater than zero, it means there are no values assigned to it yet and we can simply add our value(s)
			newClassValue = ( classNames instanceof Array ) ? classNames.filter( UI_helpers.arrays.filterUnique ).join(" ") : classNames;
		}
		el.className = newClassValue;
	},
	hasClass : function( el,className ) {
		var __self,hasClass,classNameArray,classNames;
		__self     = this;
		hasClass   = false;
		classNames = el.className;
		if ( classNames.length > 0 ) {
			classNameArray = classNames.split(" ");

			if ( classNameArray.indexOf( className ) > -1 ) {
				hasClass = true;
			}
		}
		return hasClass;
	},
	toggleClass : function( el,className ) {
		var __self,toSort,activeClassNames,toRemove,toAdd;
		__self = this;

		if ( className instanceof Array || className.indexOf(' ') > -1 ) {
			toSort           = ( className.indexOf(' ') > -1 ) ? className.split(" ") : className;
			activeClassNames = el.className;

			if ( activeClassNames !== null && activeClassNames !== undefined ) {
				toSort   = __self.__sortValues( activeClassNames.split(" "), toSort );
				toRemove = toSort.toRemove;
				toAdd    = toSort.toAdd;
			} else {
				toRemove = "";
				toAdd    = className;
			}
			__self.removeClass( el,toRemove );
			__self.addClass( el,toAdd );
		} else {
			if ( __self.hasClass( el,className ) ) {
				__self.removeClass( el,className );
			} else {
				__self.addClass( el,className );
			}
		}
	},
	__sortValues : function( activeValues,toSort ) {
		var __self,toAdd,toRemove;
		__self   = this;
		toAdd    = [];
		toRemove = [];
		for ( var sortValue = 0,len = toSort.length; sortValue < len; sortValue++ ) {
			var currentValue,hasValue;
			currentValue = toSort[ sortValue ];
			hasValue     = ( activeValues.indexOf( currentValue ) > -1 ) ? true : false;

			if ( hasValue ) {
				// if it already has the value we add it to the toRemove array
				toRemove.push( currentValue );
			} else {
				// if el doesn't have it we add it to the toAdd array
				toAdd.push( currentValue );
			}
		}
		return { toAdd : toAdd, toRemove: toRemove };
	},
	__compileValues : function( compileType, activeValues, newValues ) {
		var __self,compiledValues,evaluateValues; 
		__self         = this;
		compiledValues = activeValues;

		evaluateValues = function( toEvaluate ) {
			var hasValue = ( activeValues.indexOf( toEvaluate ) > -1 ) ? true : false;

			if ( !hasValue && compileType === "add") {
				// the active array doesn't have the value, and we're in add mode
				// so we add it to our compiledValues array
				compiledValues.push( toEvaluate);
			} else if ( hasValue && compileType === "remove" ) {
				// the array of activeValues does contain the value, and we're in remove mode
				// so we remove it from our compiledValues array
				var index = compiledValues.indexOf( toEvaluate );
				compiledValues.splice( index, 1 );
			}			
		}

		if ( newValues instanceof Array || newValues.indexOf(' ') > -1 ) {
			if ( newValues.indexOf(' ') > -1 ) {
				newValues = newValues.split(' ');
			}
			for ( var newValue = 0, len = newValues.length; newValue < len; newValue++ ) {
				var currentValue = newValues[newValue];
				evaluateValues( currentValue );
			}
		} else {
			// newValues is not an array, just a single item
			evaluateValues( newValues );
		}	
		return compiledValues;
	}
};