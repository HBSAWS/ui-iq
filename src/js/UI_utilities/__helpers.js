var UI_helpers = {
	arrays : {
		// usage : var unique = array.filter( UI_helpers.arrays.filterUnique )
		filterUnique : function(value, index, self) { 
			return self.indexOf(value) === index;
		}
	}
}