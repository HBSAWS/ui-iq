UI = {
	animate   : UI_animate.animate,
	collection : function(items,activeItem) {
		return new UI_collection(items,activeItem);
	},
	cuboid   : function(DOMelement,settings) {
		return new UI_cuboid(DOMelement,settings);
	},
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
	panels  : function(DOMelement,settings) {
		return new UI_panels(DOMelement,settings);
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
			// usage : element.dispatchEvent(clickEvent);
			click : new MouseEvent('click', {
				"view"       : window,
				"bubbles"    : true,
				"cancelable" : false
			}),
			change : new Event('change')
		}
	}
};