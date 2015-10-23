function UI_sticky( DOMelement, settings ) {
	var __self,stickyDimensions;

	__self                    = this;
	__self.stickyEl           = DOMelement;
	stickyDimensions          = __self.stickyEl.getBoundingClientRect();
	__self.stickyTop          = stickyDimensions.top; 
	__self.stickyHeight       = stickyDimensions.height; 
	__self.stickyPosition     = __self.stickyEl.style.position;

	__self.siblingEl          = __self.stickyEl.nextElementSibling;
	__self.scrollingEl        = settings.scrollingElement;
	__self.widthEl            = settings.widthReference;
	__self.distanceToStick    = settings.distanceToStick;
	__self.onActivateSticky   = ( settings.onActivateSticky === undefined ) ? undefined : settings.onActivateSticky;
	__self.onDeactivateSticky = ( settings.onDeactivateSticky === undefined ) ? undefined : settings.onDeactivateSticky;

	__self.initialize_module();
};

UI_sticky.prototype.initialize_module = function() {
	var __self,stickyEl,stickyEl__sibling;
	__self               = this;
	stickyEl             = __self.stickyEl;
	stickyElPositionInit = getComputedStyle( __self.stickyEl ).position;
	stickyEl__sibling    = __self.siblingEl;
	
	__self.scrollingEl.addEventListener('scroll', function() {
		var distanceScrolled = __self.scrollingEl.scrollTop;

		if ( distanceScrolled > __self.distanceToStick ) {
			stickyEl.style.position = "fixed";
			stickyEl.style.width    = __self.widthEl.getBoundingClientRect().width + "px";
			UI.DOM.addDataValue( stickyEl, "data-ui-state", "is__stuck");

			if ( __self.onActivateSticky !== undefined ) {
				__self.onActivateSticky();
			}
		} else {
			stickyEl.style.position = stickyElPositionInit;
			stickyEl.style.width    = "100%";
			UI.DOM.removeDataValue( stickyEl, 'data-ui-state', "is__stuck" );

			if ( __self.onDeactivateSticky !== undefined ) {
				__self.onDeactivateSticky();
			}
		}
	});
	window.addEventListener('resize', function() {
		stickyEl.style.width = __self.widthEl.getBoundingClientRect().width + "px";
	});
};