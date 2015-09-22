var UI_offCanvasPanel = function UI_offCanvasPanel(DOMelement,settings) {
	var __self;

	__self        = this;
	__self.panel  = DOMelement;
	__self.active = settings.showOnInit || false;

	__self.mainCanvas                = settings.mainCanvasElement;
	__self.onActiveUnfocusMainCanvas = settings.onActiveUnfocusMainCanvas || false;
	__self.closeOnClickMainCanvas    = settings.closeOnClickMainCanvas || false;
	__self.closeOnEscape             = settings.closeOnEscape || true;
	__self.side 					 = settings.side;


	__self.mainCanvasFader = __self.mainCanvas.querySelector("[class^='fader']");
	__self.closeBtn        = document.querySelector(settings.closeSelector) || undefined;


	__self.__hidePanel   = this.hidePanel.bind(this);
	__self.__escapeClose = this.escapeClose.bind(this);

	__Animation.call(this,DOMelement);
};

UI_offCanvasPanel.prototype = Object.create(__Animation.prototype);

UI_offCanvasPanel.prototype.initialize_module = function(settings) {
	var __self,panel__initialState;
	__self = this;

	if ( __self.active ) {
		panel__initialState = "";
		if ( __self.onActiveUnfocusMainCanvas ) {
			fastdom.write(function() {
				__self.mainCanvas.setAttribute("data-ui-state", "animate__out scale__down-sm");
			});
		}
		if ( __self.closeOnClickMainCanvas ) {
			__self.mainCanvasFader.addEventListener('click', __self.__hidePanel);
		}
		if ( __self.closeOnEscape ) {
			document.addEventListener('keydown', __self.__escapeClose);
		}
	} else {
		panel__initialState = "animate__off move__" + __self.side;
	}
	fastdom.write(function() {
		__self.panel.setAttribute("data-ui-state", panel__initialState);
	});
};

UI_offCanvasPanel.prototype.showPanel = function() {
	var __self;
	__self = this;
	

	if ( __self.closeOnClickMainCanvas ) {
		__self.mainCanvasFader.addEventListener('click', __self.__hidePanel);
	}
	if ( __self.closeOnEscape ) {
		document.addEventListener('keydown', __self.__escapeClose);
	}

	fastdom.write(function() {
		if ( __self.onActiveUnfocusMainCanvas ) {
			__self.mainCanvas.setAttribute("data-ui-state", "animate__out scale__down-sm");
		}
		__self.panel.setAttribute("data-ui-state", "animate__out");
	});
	__self.active = true;
};

UI_offCanvasPanel.prototype.hidePanel = function() {
	var _self;
	__self = this;

	fastdom.write(function() {
		if ( __self.onActiveUnfocusMainCanvas ) {
			__self.mainCanvas.setAttribute("data-ui-state", "animate__out");
		}
		__self.panel.setAttribute("data-ui-state", "animate__out move__" + __self.side);
	});

	if ( __self.closeOnClickMainCanvas ) {
		__self.mainCanvasFader.removeEventListener('click', __self.__hidePanel);
	}
	if ( __self.closeOnEscape ) {
		document.removeEventListener('keydown', __self.__escapeClose);
	}
	__self.active = false;	
};

UI_offCanvasPanel.prototype.isPanelShowing = function() {
	return this.active;
};

UI_offCanvasPanel.prototype.clickOutSideClose = function(e) {
	var __self = this;
	if ( e.target == __self.modal ) {
		__self.hideModal();
	}
};

UI_offCanvasPanel.prototype.escapeClose = function(e) {
	var __self = this;
	if (e.keyCode == 27) { // escape key maps to keycode `27`
		__self.hidePanel();
	}
};