var UI_offCanvasPanel = function (DOMelement,settings) {
	var __self;

	__self        = this;
	__self.panel  = DOMelement;
	__self.active = ( settings.showOnInit !== undefined ) ? settings.showOnInit : false;

	__self.mainCanvas                 = ( settings.mainCanvasElement !== undefined )          ? settings.mainCanvasElement          : undefined;
	__self.onActiveUnfocusMainCanvas  = ( settings.onActiveUnfocusMainCanvas !== undefined )  ? settings.onActiveUnfocusMainCanvas  : false;
	__self.closeOnClickOutside        = ( settings.closeOnClickOutside !== undefined )        ? settings.closeOnClickOutside        : false;
	__self.clickOutsideException      = ( settings.clickOutsideException !== undefined)       ? settings.clickOutsideException      : function() { return false; };
	__self.clickOutsideExemptElements = ( settings.clickOutsideExemptElements !== undefined ) ? settings.clickOutsideExemptElements : [];

	__self.closeOnEscape             = ( settings.closeOnEscape !== undefined )               ? settings.closeOnEscape              : true;
	__self.closeOnEscapeException    = ( settings.closeOnEscapeException !== undefined )      ? settings.closeOnEscapeException     : function() { return false; };

	__self.side 					 = settings.side;

	__self.onShowPanel               = ( settings.onShowPanel !== undefined )                 ? settings.onShowPanel                : undefined,
	__self.onHidePanel               = ( settings.onHidePanel !== undefined )                 ? settings.onHidePanel                : undefined,

	__self.hideBtn        	         = ( settings.hideBtnSelector == undefined )   ? undefined : document.querySelectorAll(settings.hideBtnSelector);
	__self.showBtn       			 = ( settings.showBtnSelector == undefined )   ? undefined : document.querySelectorAll(settings.showBtnSelector);
	__self.toggleBtn 				 = ( settings.toggleBtnSelector == undefined ) ? undefined : document.querySelectorAll(settings.toggleBtnSelector);


	__self.mainCanvasFader           = ( __self.mainCanvasElement === undefined )  ? undefined : __self.mainCanvas.querySelector("[class^='fader']");

	__self.__togglePanel             = this.togglePanel.bind(this);
	__self.__showPanel               = this.showPanel.bind(this);
	__self.__hidePanel               = this.hidePanel.bind(this);
	__self.__escapeClose             = this.escapeClose.bind(this);
	__self.__clickOutSideClose       = this.clickOutSideClose.bind(this);

	__self.initialize_module();
};

UI_offCanvasPanel.prototype.initialize_module = function(settings) {
	var __self,panel__initialState;
	__self = this;

	if ( __self.active ) {
		__self.showPanel(false);
	}

	if ( __self.hideBtn !== undefined ) {
		// adds click event listeners for any hide buttons
		for ( var el = 0, len = __self.hideBtn.length; el < len; el++ ) {
			var currentHideBtn = __self.hideBtn[el];
			currentHideBtn.addEventListener('click', __self.__hidePanel);
		}
	}
	if ( __self.showBtn !== undefined ) {
		// adds click event listeners for any show buttons
		for ( var el = 0, len = __self.showBtn.length; el < len; el++ ) {
			var currentShowBtn = __self.showBtn[el];
			currentShowBtn.addEventListener('click', __self.__showPanel);
		}
	}
	if ( __self.toggleBtn !== undefined ) {
		// adds click event listeners for any toggle buttons
		for ( var el = 0, len = __self.toggleBtn.length; el < len; el++ ) {
			var currentToggleBtn = __self.toggleBtn[el];

			__self.updateToggleButtonState( currentToggleBtn );
			currentToggleBtn.addEventListener('click', function(e) {
				__self.togglePanel();
				__self.updateToggleButtonState( e.currentTarget );
			});
		}
	}
};

UI_offCanvasPanel.prototype.updateToggleButtonState = function(button) {
	var __self = this;
	if ( __self.active ) {
		UI.DOM.addDataValue( button, "data-ui-state", "is__open" );
	} else {
		UI.DOM.removeDataValue( button, "data-ui-state", "is__open" );
	}
};

UI_offCanvasPanel.prototype.showPanel = function(toAnimate,onComplete) {
	var __self,__toAnimate,mainCanvasState,panelState;
	__self        = this;
	__toAnimate   = toAnimate || true;
	__self.active = true;

	if ( __self.onShowPanel !== undefined ) {
		__self.onShowPanel();
	}
	if ( __toAnimate ) {
		if ( UI.utilities.isMobile ) {
			mainCanvasState = "animate__out fader__in"
		} else {
			mainCanvasState = "animate__out scale__down-sm";
		}
		panelState      = "animate__out is__showing-offCanvasPanel";
	} else {
		mainCanvasState = "animate__off scale__down-sm";
		panelState      = "animate__off is__showing-offCanvasPanel";
	}

	fastdom.write(function() {
		if ( __self.onActiveUnfocusMainCanvas ) {
			__self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
		}
		__self.panel.setAttribute("data-ui-state", panelState);
		if ( onComplete ) {
			onComplete();
		}

		if ( __self.closeOnClickOutside ) {
			document.addEventListener("click", __self.__clickOutSideClose);
		}
		if ( __self.closeOnEscape ) {
			document.addEventListener('keydown', __self.__escapeClose);
		}
	});
};

UI_offCanvasPanel.prototype.hidePanel = function(toAnimate) {
	var __self,__toAnimate,mainCanvasState,panelState;
	__self        = this;
	__toAnimate   = toAnimate || true;
	__self.active = false;

	if ( __self.onHidePanel !== undefined ) {
		__self.onHidePanel();
	}	

	if ( __toAnimate ) {
		mainCanvasState = "animate__in";
		panelState      = "animate__out move__" + __self.side;
	} else {
		mainCanvasState = "animate__off";
		panelState      = "animate__off move__" + __self.side;
	}

	fastdom.write(function() {
		if ( __self.onActiveUnfocusMainCanvas ) {
			__self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
		}
		__self.panel.setAttribute("data-ui-state", panelState);

		if ( __self.closeOnClickOutside ) {
			document.removeEventListener("click", __self.__clickOutSideClose);
		}
		if ( __self.closeOnEscape ) {
			document.removeEventListener('keydown', __self.__escapeClose);
		}
	});
};

UI_offCanvasPanel.prototype.togglePanel = function( toAnimate ) {
	var __self = this;
	if ( __self.active ) {
		__self.hidePanel( toAnimate );
	} else {
		__self.showPanel( toAnimate );
	};
};

UI_offCanvasPanel.prototype.isPanelShowing = function() {
	return this.active;
};

UI_offCanvasPanel.prototype.clickOutSideClose = function(e) {
	var __self,level;
	__self = this;
	level  = 0;
	if ( __self.active && !__self.clickOutsideException() ) {
		for (var element = e.target; element; element = element.parentNode) {
			if ( !__self.active || element == __self.panel || __self.isShowBtn(element) || __self.isHideBtn(element) || __self.isToggleBtn(element) || __self.clickOutsideExemptElements.indexOf( element ) > -1 ) {
			 	return;
			}
			level++;
		}
		__self.hidePanel();
	}
};

UI_offCanvasPanel.prototype.isShowBtn = function(comparisonEl) {
	var __self,outcome;
	__self  = this;
	outcome = false;
	if ( __self.showBtn !== undefined ) {
		for ( var el = 0, len = __self.showBtn.length; el < len; el++ ) {
			var currentShowBtn = __self.showBtn[el];
			if ( comparisonEl == currentShowBtn ) {
				return true;
			}
		}
	}
	return outcome;
};
UI_offCanvasPanel.prototype.isHideBtn = function(comparisonEl) {
	var __self,outcome;
	__self  = this;
	outcome = false;
	if ( __self.hideBtn !== undefined ) {
		for ( var el = 0, len = __self.hideBtn.length; el < len; el++ ) {
			var currentHideBtn = __self.hideBtn[el];
			if ( comparisonEl == currentHideBtn ) {
				return true;
			}
		}
	}
	return outcome;
};
UI_offCanvasPanel.prototype.isToggleBtn = function(comparisonEl) {
	var __self,outcome;
	__self  = this;
	outcome = false;
	if ( __self.toggleBtn !== undefined ) {
		for ( var el = 0, len = __self.toggleBtn.length; el < len; el++ ) {
			var currentToggleBtn = __self.toggleBtn[el];
			if ( comparisonEl == currentToggleBtn ) {
				return true;
			}
		}
	}
	return outcome;
};

UI_offCanvasPanel.prototype.escapeClose = function(e) {
	var __self;
	__self = this;

	if ( !__self.closeOnEscapeException() && e.keyCode == 27 ) { // escape key maps to keycode `27`
		__self.hidePanel();
		e.stopPropagation();
	}
};