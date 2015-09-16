var UI_offCanvasPanel = function UI_offCanvasPanel(DOMelement,settings) {
	var __self;

	__self        = this;
	__self.panel  = DOMelement;
	__self.active = settings.showOnInit || false;

	__self.closeOnClickOutisde = settings.closeOnClickOutisde || true;
	__self.closeBtn            = document.querySelector(settings.closeSelector) || undefined;

	__Animation.call(this,DOMelement);
};

UI_offCanvasPanel.prototype = Object.create(__Animation.prototype);

UI_offCanvasPanel.prototype.initialize_module = function(settings) {
	var __self,initialState;
	__self = this;

	if ( __self.active ) {
		initialState = "";
	} else {
		initialState = "animate__off move__right";
	}
	__self.panel.setAttribute("data-ui-state", initialState);
};

UI_offCanvasPanel.prototype.showPanel = function() {
	var __self;
	__self = this;
	
	if ( __self.closeOnClickOutisde ) {
		//__self.modal.addEventListener('click', __self.__clickOutSideClose);
	}

	fastdom.write(function() {
		__self.panel.setAttribute("data-ui-state", "animate__out");
	});
	__self.active = true;
};

UI_offCanvasPanel.prototype.hidePanel = function() {
	var _self;
	__self = this;

	fastdom.write(function() {
		__self.panel.setAttribute("data-ui-state", "animate__out move__right");
	});

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