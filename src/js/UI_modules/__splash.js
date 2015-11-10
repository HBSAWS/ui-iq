function UI_splash(DOMelement) {
	var __self    = this;

	__self.el              = DOMelement;
	__self.errorMessageEl  = __self.el.querySelector("[data-js~='splashErrorMessage']");
	__self.loaderMessageEl = __self.el.querySelector("[data-js~='splashLoaderMessage']");
	__self.errorOptions    = __self.el.querySelectorAll(".splash-loader-options-option");

	__self.initialize();
};

UI_splash.prototype.initialize = function() {
	var __self = this,splashErrorButtons;

	// chrome is the only browser right now handling this effect well
	if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
		UI.DOM.addDataValue( document.querySelector(".splash-loader-options"), "data-ui-state", "use__UIfilter" );
	}
};

UI_splash.prototype.addHoverListeners = function() {
	var __self = this;
	if ( !UI.utilities.isMobile && __self.errorOptions !== null && __self.errorOptions !== undefined ) {
		for ( var button = 0, totalButtons = __self.errorOptions.length; button < totalButtons; button++ ) {
			var currentButton = __self.errorOptions[button];
			currentButton.addEventListener( 'mouseover', __self.hoverIn );
			currentButton.addEventListener( 'mouseout', __self.hoverOut );
		}
	}
};
UI_splash.prototype.removeHoverListeners = function() {
	var __self = this;
	if ( !UI.utilities.isMobile && __self.errorOptions !== null && __self.errorOptions !== undefined ) {
		for ( var button = 0, totalButtons = __self.errorOptions.length; button < totalButtons; button++ ) {
			var currentButton = __self.errorOptions[button];
			currentButton.removeEventListener( 'mouseover', __self.hoverIn, false );
			currentButton.removeEventListener( 'mouseout', __self.hoverOut, false );
		}
	}
};
UI_splash.prototype.hoverIn = function(e) {
	UI.DOM.addDataValue( e.currentTarget, "data-ui-state", "is__hovered" );
};
UI_splash.prototype.hoverOut = function(e) {
	UI.DOM.removeDataValue( e.currentTarget, "data-ui-state", "is__hovered" );
};

UI_splash.prototype.updateLoaderMessage = function(loaderMessage) {
	var __self = this;
	__self.loaderMessage.innerHTML = loaderMessage;
};

UI_splash.prototype.addError = function(message) {
	var __self = this;

	__self.addHoverListeners();
	__self.errorMessageEl.innerHTML = message;
	UI.DOM.addDataValue( __self.el,"data-ui-state","has__error" );
};

UI_splash.prototype.removeError = function(callback) {
	var __self = this,loaderContainer;
	loaderContainer = document.querySelector(".splash-loader-status");

	for ( var button = 0, totalButtons = __self.errorOptions.length; button < totalButtons; button++ ) {
		var currentButton = __self.errorOptions[button];
		UI.DOM.removeDataValue( currentButton, "data-ui-state", "is__hovered" );
	}
	__self.removeHoverListeners();
	errorRemoved = function(e) {
		if ( e.target == e.currentTarget ) {
			loaderContainer.removeEventListener( "webkitTransitionEnd", errorRemoved );
			if ( callback !== undefined ) {
				callback();
			}
		}
	};
	loaderContainer.addEventListener( "webkitTransitionEnd", errorRemoved );
	UI.DOM.removeDataValue( __self.el,"data-ui-state","has__error" );
};

UI_splash.prototype.hide = function(destroyAfterHide,callback) {
	var __self,hideCallback;
	__self = this;

	hideCallback = function(e) {
		if ( e.target == e.currentTarget ) {
			__self.el.removeEventListener( "webkitTransitionEnd", hideCallback );
			if ( typeof callback === "function" ) {
				callback();
			}
			if ( destroyAfterHide ) {
				__self.destroy();
			}
		};
	};
	__self.el.addEventListener( "webkitTransitionEnd", hideCallback );

	__self.el.style.transform = "translateY(-100px)";
	__self.el.style.opacity   = 0;
};

UI_splash.prototype.destroy = function() {
	var __self = this;

	__self.el.remove();
};