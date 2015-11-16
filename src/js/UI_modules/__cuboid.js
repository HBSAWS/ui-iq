function UI_cuboid( DOMelement,settings ) {
	var __self = this;
	__self.rotator    = DOMelement.querySelector("[data-js~='cuboid__updateSide']");
	__self.activeSide = ( settings.sideToShowOnInit !== undefined ) ? settings.sideToShowOnInit : "front";
};

UI_cuboid.prototype.initialize_module = function(settings) {
	var __self = this;
};
// side values : front|back|top|bottom
UI_cuboid.prototype.show = function(side,callback) {
	var __self,targetFace; 
	__self = this;
	UI.DOM.removeDataValue( __self.rotator, "data-ui-state", "show__" + __self.activeSide );
	UI.DOM.addDataValue( __self.rotator, "data-ui-state", "show__" + side );
	__self.activeSide = side;

	if ( callback !== undefined && callback !== null ) {
		targetFace = __self.rotator.querySelector("[class^='cuboid-faces-" + side + "_']");
		var onComplete = function(e) {
			if ( e.target == e.currentTarget ) {
				targetFace.removeEventListener( 'webkistTransitionEnd', onComplete );
				console.log(targetFace + " cuboid callback called");
				callback();
				e.stopPropagation();
			}
		};

		targetFace.addEventListener( 'webkitTransitionEnd', onComplete);
	}
};
UI_cuboid.prototype.activeSide = function() {
	var __self = this;
	return __self.activeSide;
};