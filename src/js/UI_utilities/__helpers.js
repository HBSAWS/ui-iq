var UI_helpers = {
	arrays : {
		// usage : var unique = array.filter( UI_helpers.arrays.filterUnique )
		filterUnique : function(value, index, self) { 
			return self.indexOf(value) === index;
		}
	},
	// useage : UI_helpers.trigger(document.getElementById('mylink'),'click');
	trigger : function (obj, evt){
		var fireOnThis = obj;
		if( document.createEvent ) {
			var evObj = document.createEvent('MouseEvents');
			evObj.initEvent( evt, true, false );
			fireOnThis.dispatchEvent( evObj );
		}
		else if( document.createEventObject ) { //IE
			var evObj = document.createEventObject();
			fireOnThis.fireEvent( 'on' + evt, evObj );
		} 
	} 

}