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
	removeAttributeValue : function( el,attributeName,attributeValue ) {
		var __self,camelCaseName,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatToCamelCase(attributeName);
		// checking to see if element actually has the attribute before attempting to manipulate it
		if ( el.dataset[camelCaseName] !== null ) {
			attributeNameArray = el.dataset[camelCaseName].split(" ");

			if ( attributeNameArray.indexOf( attributeValue ) > -1 ) {
				// the value is present we can remove it
				index = attributeNameArray.indexOf( attributeValue );
				attributeNameArray.splice( index, 1 );

				// the attribute has been remove, we join the array and add it back to our DOM element
				newAttributeValue = attributeNameArray.join(" ");
				el.setAttribute( attributeName, newAttributeValue );
			} else {
				// the value doesn't exist on the item, we do nothing
				return;
			}
		} else {
			// if the element doesn't have the attribute we do nothing as there is nothing to remove
			return;
		}
	},
	addAttributeValue : function( el,attributeName,attributeValue ) {
		var __self,camelCaseName,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatToCamelCase(attributeName);
		if ( el.dataset[camelCaseName] !== null && el.dataset[camelCaseName].length > 0 ) {
			attributeNameArray = el.dataset[camelCaseName].split(" ");

			if ( attributeNameArray.indexOf( attributeValue ) > -1 ) {
				// value already exists in data attribute, so we do nothing
				return;
			} else {
				attributeNameArray.push( attributeValue );

				// the attribute has been added, we join the array and add it back to our DOM element
				newAttributeValue = attributeNameArray.join(" ");
				el.setAttribute( attributeName, newAttributeValue );
			}
		} else {
			el.setAttribute( attributeName, attributeValue );
		}
	},
	hasAttributeValue : function( el,attributeName,attributeValue ) {
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
	toggleAttributeValue : function( el,attributeName,attributeValue ) {
		var __self,camelCaseName,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatJSName(attributeName);

		if ( __self.hasAttributeValue( el,attributeName,attributeValue ) ) {
			__self.removeAttributeValue( el,attributeName,attributeValue );
		} else {
			__self.addAttributeValue( el,attributeName,attributeValue );
		}

	}
};