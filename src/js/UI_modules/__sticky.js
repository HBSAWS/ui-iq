function UI_sticky( DOMelement, settings ) {
	var __self,stickyDimensions;

	__self                = this;
	__self.stickyEl       = DOMelement;
	stickyDimensions      = __self.stickyEl.getBoundingClientRect();
	__self.stickyTop      = stickyDimensions.top; 
	__self.stickyHeight   = stickyDimensions.height; 
	__self.stickyPosition = __self.stickyEl.style.position;

	__self.siblingEl       = __self.stickyEl.nextElementSibling;
	__self.scrollingEl     = settings.scrollingElement;
	__self.widthEl         = settings.widthReference;
	__self.distanceToStick = settings.distanceToStick;

	testing = this;

	__self.initialize_module();
};

UI_sticky.prototype.initialize_module = function() {
	var __self = this;
	var stickyEl                  = __self.stickyEl;
	var stickyEl__sibling         = __self.siblingEl;
	
	__self.scrollingEl.addEventListener('scroll', function() {
		var distanceScrolled = __self.scrollingEl.scrollTop;

		if ( distanceScrolled > __self.distanceToStick ) {
			stickyEl.style.position = "fixed";
			stickyEl.style.width    = __self.widthEl.getBoundingClientRect().width + "px";
			stickyEl.setAttribute('data-ui-state', "is__stuck");
		} else {
			stickyEl.style.position = __self.stickyPosition;
			stickyEl.style.width    = "100%";
			stickyEl.setAttribute("data-ui-state", "");
		}
	});
	window.addEventListener('resize', function() {
		stickyEl.style.width    = __self.widthEl.getBoundingClientRect().width + "px";
	});
};