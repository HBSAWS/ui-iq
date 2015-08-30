function UI_cuboid(DOMelement,settings) {
	this.states = {
		show__front  : true,
		show__bottom : false,
		show__back   : false,
		show__top    : false
	};
	_UI.call(this,DOMelement,settings);
};

UI_cuboid.prototype = Object.create(_UI.prototype);
UI_cuboid.prototype.initialize_module = function(settings) {
	var _self = this;
};
UI_cuboid.prototype.show = function(side) {
	switch(side) {
		case "front":
			this.updateStates({
				show__front  : true,
				show__bottom : false,
				show__back   : false,
				show__top    : false				
			});
			break;
		case "bottom":
			this.updateStates({
				show__front  : false,
				show__bottom : true,
				show__back   : false,
				show__top    : false				
			});
			break;
		case "back":
			this.updateStates({
				show__front  : false,
				show__bottom : false,
				show__back   : true,
				show__top    : false				
			});
			break;
		case "top":
			this.updateStates({
				show__front  : false,
				show__bottom : false,
				show__back   : false,
				show__top    : true				
			});
			break;
	}
};