// enter attribute name as you normally would
	// ex : "data-test-name"
var UI_DOM = {
	__formatJSName : function( attributeName ) {
		var camelCaseName;
		// format the attribute name for javascript
		camelCaseName = attributeName.split("-").splice( 1,1);
		if ( camelCaseName.length > 1 ) {
			camelCaseName = camelCaseName[0] + camelCaseName[1].charAt(0).toUpperCase() + camelCaseName[1].substring(1);
		} else {
			camelCaseName = camelCaseName[0];
		}
		return camelCaseName;
	},
	removeAttributeValue : function( el,attributeName,attributeValue ) {
		var __self,camelCaseName,attributeNameArray,index,newAttributeValue;
		__self = this;
		// format the attribute name for javascript
		camelCaseName = __self.__formatJSName(attributeName);
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
		camelCaseName = __self.__formatJSName(attributeName);
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
		camelCaseName = __self.__formatJSName(attributeName);
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