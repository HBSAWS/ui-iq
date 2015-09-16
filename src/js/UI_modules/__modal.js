var UI_modal = function UI_modal(DOMelement,settings) {
	var __self;

	__self       = this;
	__self.modal = DOMelement;
	fastdom.read(function() {
		__self.modalWindow = DOMelement.querySelector("[class^='modal-window_']");
	});
	__self.mainCanvas  = settings.mainCanvasElement;

	__self.closeOnEscape       = settings.closeOnEscape || true;
	__self.closeOnClickOutisde = settings.closeOnClickOutisde || true;
	__self.closeBtn            = this.modal.querySelector(settings.closeSelector || "[data-js-handler~='closeModal']");

	// these are references to new versions of the classes function where the this reference is 
	// the UI_modal.  This means these can be passed to DOM objects without loosing that reference
	__self.__hideModal         = this.hideModal.bind(this);
	__self.__escapeClose       = this.escapeClose.bind(this);
	__self.__clickOutSideClose = this.clickOutSideClose.bind(this);

	__Animation.call(this,DOMelement);
};

UI_modal.prototype = Object.create(__Animation.prototype);

UI_modal.prototype.initialize_module = function(settings) {
};

UI_modal.prototype.showModal = function() {
	var __self,modalState,modalWindowState,mainCanvasState,hideModal;
	__self 	         = this;
	modalState       = __self.animationLibrary("move-down-grow")[0];
	modalWindowState = __self.animationLibrary("move-down-grow")[1];
	mainCanvasState  = __self.animationLibrary("shrink");

	if ( __self.closeOnEscape ) {
		document.addEventListener('keydown', __self.__escapeClose);
	}
	if ( __self.closeOnClickOutisde ) {
		__self.modal.addEventListener('click', __self.__clickOutSideClose);
	}
	__self.closeBtn.addEventListener('click', __self.__hideModal);

	fastdom.write(function() {
		__self.modal.setAttribute("data-ui-state", modalState);
		__self.modalWindow.setAttribute("data-ui-state", modalWindowState);
		__self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
	});
};

UI_modal.prototype.hideModal = function() {
	var __self,modalState,modalWindowState,mainCanvasState;
	__self 	         = this;
	modalState       = __self.animationLibrary("shrink-move-up")[0];
	modalWindowState = __self.animationLibrary("shrink-move-up")[1];
	mainCanvasState  = __self.animationLibrary("grow");

	fastdom.write(function() {
		__self.modal.setAttribute("data-ui-state", modalState);
		__self.modalWindow.setAttribute("data-ui-state", modalWindowState);
		__self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
	});

	if ( __self.closeOnEscape ) {
		document.removeEventListener('keydown', __self.__escapeClose);
	}
	if ( __self.closeOnClickOutisde ) {
		__self.modal.removeEventListener('click', __self.__clickOutSideClose);
	}
	__self.closeBtn.removeEventListener('click', __self.__hideModal);
};

UI_modal.prototype.escapeClose = function(e) {
	var __self = this;
	if (e.keyCode == 27) { // escape key maps to keycode `27`
		__self.hideModal();
	}
};

UI_modal.prototype.clickOutSideClose = function(e) {
	var __self = this;
	if ( e.target == __self.modal ) {
		__self.hideModal();
	}
};