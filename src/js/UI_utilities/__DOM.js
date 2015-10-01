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
		var __self,camelCaseName,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatToCamelCase(attributeName);
		// checking to see if element actually has the attribute before attempting to manipulate it
		if ( el.dataset[camelCaseName] !== null ) {
			attributeNameArray = el.dataset[camelCaseName].split(" ");
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
		var __self,camelCaseName,attributeNameArray,compiledValues,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatToCamelCase(attributeName);
		if ( el.dataset[camelCaseName] !== null && el.dataset[camelCaseName].length > 0 ) {
			// if there is an existing data attribute, and that value's length is greater than zero
			// by splitting it, even if there is no space, the attributeNameArray will always be an array
			attributeNameArray = el.dataset[camelCaseName].split(" ");
			compiledValues     = __self.__compileValues( "add", attributeNameArray, attributeValues );

			// the attribute has been added, we join the array and add it back to our DOM element
			newAttributeValue = compiledValues.join(" ");
		} else {
			newAttributeValue = attributeValue;
		}
		el.setAttribute( attributeName, newAttributeValue );
	},
	hasDataValue : function( el,attributeName,attributeValue ) {
		var __self,hasValue,camelCaseName,attributeNameArray;
		__self   = this;
		hasValue = false;
		// format the attribute name for javascript
		camelCaseName = __self.__formatToCamelCase(attributeName);
		attributeNameArray = el.dataset[camelCaseName].split(" ");

		if ( attributeNameArray.indexOf( attributeValue ) > -1 ) {
			hasValue = true;
		}
		return hasValue;
	},
	toggleDataValue : function( el,attributeName,attributeValue ) {
		var __self = this;

		if ( __self.hasDataValue( el,attributeName,attributeValue ) ) {
			__self.removeDataValue( el,attributeName,attributeValue );
		} else {
			__self.addDataValue( el,attributeName,attributeValue );
		}
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

		if ( newValues instanceof Array ) {
			for ( var newValue = 0, len = newValues.length; newValue < len; newValue++ ) {
				var currentValue,hasValue; 
				currentValue = newValues[newValue];
				evaluateValues( currentValue );
			}
		} else {
			// newValues is not an array, just a single item
			evaluateValues( newValues );
		}	
		return compiledValues;
	}
};