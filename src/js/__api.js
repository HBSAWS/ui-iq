UI = {
	animate   : UI_animate.animate,
	animation : function(DOMelement, settings) {
		return new __Animation(DOMelement, settings);
	},
	collection : function(items,activeItem) {
		return new UI_collection(items,activeItem);
	},
	cuboid   : function(DOMelement,settings) {
		return new UI_cuboid(DOMelement,settings);
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
	table  : function(DOMelement,settings) {
		return new UI_table(DOMelement,settings);
	}
};