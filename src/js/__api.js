UI = {
	actionsheet : function(DOMelement,settings) {
		return new UI_actionsheet(DOMelement,settings);
	},
	animate   : function(DOMelement,settings) {
		new UI_animate(DOMelement,settings);
	},
	APIschema : function(DOMelement) {
		return new UI_APIschema(DOMelement);
	},
	collection : function(items,activeItem) {
		return new UI_collection(items,activeItem);
	},
	cuboid   : function(DOMelement,settings) {
		return new UI_cuboid(DOMelement,settings);
	},
	glyphs   : glyphs,
	keyboard : function( settings ) {
		return new UI_keyboard( settings );
	},
	loader   : function(DOMelement,settings) {
		return new UI_loader(DOMelement,settings);
	},
	offCanvasPanel : function(DOMelement,settings) {
		return new UI_offCanvasPanel(DOMelement,settings);
	},
	modal    : function(DOMelement,settings) {
		return new UI_modal(DOMelement,settings);
	},
	notification : function(DOMelement,settings) {
		return new UI_notification(DOMelement,settings);
	},
	panels  : function(DOMelement,settings) {
		return new UI_panels(DOMelement,settings);
	},
	request : function(settings) {
		return new UI_request(settings);
	},
	splash : function(DOMelement) {
		return new UI_splash(DOMelement);
	},
	sticky : function(DOMelement,settings) {
		return new UI_sticky(DOMelement,settings);
	},
	tabs   : UI_tabs.init,
	table  : function(DOMelement,settings) {
		return new UI_table(DOMelement,settings);
	},
	// usage of UI.DOM for data-attribute manipulation should be as follows
		// var DOMelement = document.getElementById("sampleElement");
		// UI.DOM.hasAttributeValue(DOMelement,"data-js","appSuite");
	DOM : UI_DOM,
	utilities : {
		events : {
			// usage : element.dispatchEvent(UI.utilities.events.change);
			click : new MouseEvent('click', {
				"view"       : window,
				"bubbles"    : true,
				"cancelable" : false
			}),
			change : new Event('change')
		},
		isMobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		trigger : function (obj, evt) {
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
};

UI.tabs();