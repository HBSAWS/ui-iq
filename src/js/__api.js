UI = {
	animation : function(DOMelement, settings) {
		return new __Animation(DOMelement, settings);
	},
	collection : function(items,activeItem) {
		return new UI_collection(items,activeItem);
	},
	cuboid   : function(DOMelement,settings) {
		return new UI_cuboid(DOMelement,settings);
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
	table  : function(DOMelement,settings) {
		return new UI_table(DOMelement,settings);
	}
};