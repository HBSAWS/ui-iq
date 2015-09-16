var UI_modal = function UI_modal(DOMelement,settings) {
	this.modal       = DOMelement;
	this.modalWindow = DOMelement.querySelector("[class^='modal-window_']");
	this.mainCanvas  = settings.mainCanvasElement;

	this.closeOnEscape       = settings.closeOnEscape || true;
	this.closeOnClickOutisde = settings.closeOnClickOutisde || true;
	this.closeBtn            = this.modal.querySelector(settings.closeSelector || "[data-js-handler~='closeModal']");

	this.__hideModal         = this.hideModal.bind(this);
	this.__escapeClose       = this.escapeClose.bind(this);
	this.__clickOutSideClose = this.clickOutSideClose.bind(this);

	__Animation.call(this,DOMelement);
};

UI_modal.prototype = Object.create(__Animation.prototype);

UI_modal.prototype.initialize_module = function(settings) {
	var _self;
	_self = this;

	if ( _self.closeOnClickOutisde ) {

	}


};

UI_modal.prototype.showModal = function() {
	var _self,modalState,modalWindowState,mainCanvasState,hideModal;
	_self 	         = this;
	modalState       = _self.animationLibrary("move-down-grow")[0];
	modalWindowState = _self.animationLibrary("move-down-grow")[1];
	mainCanvasState  = _self.animationLibrary("shrink");

	if ( _self.closeOnEscape ) {
		document.addEventListener('keydown', _self.__escapeClose);
	}
	if ( _self.closeOnClickOutisde ) {
		this.modal.addEventListener('click', _self.__clickOutSideClose);
	}
	this.closeBtn.addEventListener('click', _self.__hideModal);

	fastdom.write(function() {
		_self.modal.setAttribute("data-ui-state", modalState);
		_self.modalWindow.setAttribute("data-ui-state", modalWindowState);
		_self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
	});
};

UI_modal.prototype.hideModal = function() {
	var modalState,modalWindowState,mainCanvasState;
	_self 	         = this;
	modalState       = _self.animationLibrary("shrink-move-up")[0];
	modalWindowState = _self.animationLibrary("shrink-move-up")[1];
	mainCanvasState  = _self.animationLibrary("grow");

	fastdom.write(function() {
		_self.modal.setAttribute("data-ui-state", modalState);
		_self.modalWindow.setAttribute("data-ui-state", modalWindowState);
		_self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
	});

	if ( _self.closeOnEscape ) {
		document.removeEventListener('keydown', _self.__escapeClose);
	}
	if ( _self.closeOnClickOutisde ) {
		this.modal.removeEventListener('click', _self.__clickOutSideClose);
	}
	this.closeBtn.removeEventListener('click', _self.__hideModal);
};

UI_modal.prototype.escapeClose = function(e) {
	var _self = this;
	if (e.keyCode == 27) { // escape key maps to keycode `27`
		_self.hideModal();
	}
};

UI_modal.prototype.clickOutSideClose = function(e) {
	var _self = this;
	if ( e.target == _self.modal ) {
		_self.hideModal();
	}
};