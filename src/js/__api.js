UI = {
	animation : function(DOMelement, settings) {
		return new __Animation(DOMelement, settings);
	},
	cuboid   : function(DOMelement, settings) {
		return new UI_cuboid(DOMelement,settings);
	},
	panels  : function(DOMelement,settings) {
		return new UI_panels(DOMelement,settings);
	},
	table  : function(DOMelement,settings) {
		return new UI_table(DOMelement,settings);
	}
};