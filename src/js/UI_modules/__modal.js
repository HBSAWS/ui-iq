var UI_modal = function UI_modal(DOMelement,settings) {
	var __self;

	__self       = this;
	__self.modal = DOMelement;
	fastdom.read(function() {
		__self.modalWindow = DOMelement.querySelector("[class^='modal-window_']");
	});
	__self.mainCanvas  = settings.mainCanvasElement;

	__self.closeOnEscape              = ( settings.closeOnEscape !== undefined)               ? settings.closeOnEscape              : true;
	__self.closeOnClickOutisde        = ( settings.closeOnClickOutisde !== undefined )        ? settings.closeOnClickOutisde        : true;
	__self.clickOutsideExemptElements = ( settings.clickOutsideExemptElements !== undefined ) ? settings.clickOutsideExemptElements : undefined;
	__self.closeBtn                   = this.modal.querySelector(settings.closeSelector || "[data-js~='closeModal']");

	// these are references to new versions of the classes function where the this reference is 
	// the UI_modal.  This means these can be passed to DOM objects without loosing that reference
	__self.__hideModal         = this.hideModal.bind(this);
	__self.__escapeClose       = this.escapeClose.bind(this);
	__self.__clickOutSideClose = this.clickOutSideClose.bind(this);


	__self.states = {
		show : {
			modal       : "animate__in-delay-sm is__showing-modal",
			modalWindow : "animate__in-delay-lg",
			modalCanvas : "animate__out scale__down"
		},
		hide : {
			modal       : "animate__out-delay move__top",
			modalWindow : "animate__out scale__down rotate__top",
			modalCanvas : "animate__in-delay-lg"
		}
	};

	__self.active              = false;
};


UI_modal.prototype.initialize_module = function(settings) {
};

UI_modal.prototype.isModalShowing = function() {
	return this.active;
};

// modal is the entire modal module, refering to the backing
// modal window is the actually 'modal' element
UI_modal.prototype.showModal = function() {
	var __self,modalState,modalWindowState,mainCanvasState,hideModal;
	__self 	         = this;
	// modalState       = "animate__in-delay-sm is__showing-modal";
	// modalWindowState = "animate__in-delay-lg";
	// mainCanvasState  = "animate__out scale__down";

	if ( __self.closeOnEscape ) {
		document.addEventListener('keydown', __self.__escapeClose);
	}
	if ( __self.closeOnClickOutisde ) {
		__self.modal.addEventListener('click', __self.__clickOutSideClose);
	}
	__self.closeBtn.addEventListener('click', __self.__hideModal);

	UI.DOM.removeDataValue( __self.modal,       "data-ui-state", __self.states.hide.modal );
	UI.DOM.removeDataValue( __self.modalWindow, "data-ui-state", __self.states.hide.modalWindow );
	UI.DOM.removeDataValue( __self.mainCanvas,  "data-ui-state", __self.states.hide.modalCanvas );

	UI.DOM.addDataValue( __self.modal,       "data-ui-state", __self.states.show.modal );
	UI.DOM.addDataValue( __self.modalWindow, "data-ui-state", __self.states.show.modalWindow );
	UI.DOM.addDataValue( __self.mainCanvas,  "data-ui-state", __self.states.show.modalCanvas );
	// __self.modal.setAttribute("data-ui-state", modalState);
	// __self.modalWindow.setAttribute("data-ui-state", modalWindowState);
	// __self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);

	__self.active = true;
};

UI_modal.prototype.hideModal = function(callback) {
	var __self,modalState,modalWindowState,mainCanvasState,modalClosed;
	__self 	         = this;
	// modalState       = "animate__out-delay move__top";
	// modalWindowState = "animate__out scale__down rotate__top";
	// mainCanvasState  = "animate__in-delay-lg";

	// we need to make sure these functions don't fire until the modal has actually finished closing
	modalClosed = function() {
		__self.modal.removeEventListener( 'webkitTransitionEnd', modalClosed );

		if ( __self.closeOnEscape ) {
			document.removeEventListener('keydown', __self.__escapeClose);
		}
		if ( __self.closeOnClickOutisde ) {
			__self.modal.removeEventListener('click', __self.__clickOutSideClose);
		}
		__self.closeBtn.removeEventListener('click', __self.__hideModal);

		__self.active = false;	
		if ( callback !== undefined ) {
			callback();
		}	
	}

	__self.modal.addEventListener( 'webkitTransitionEnd', modalClosed, false );
	UI.DOM.removeDataValue( __self.modal,       "data-ui-state", __self.states.show.modal );
	UI.DOM.removeDataValue( __self.modalWindow, "data-ui-state", __self.states.show.modalWindow );
	UI.DOM.removeDataValue( __self.mainCanvas,  "data-ui-state", __self.states.show.modalCanvas );

	UI.DOM.addDataValue( __self.modal,       "data-ui-state", __self.states.hide.modal );
	UI.DOM.addDataValue( __self.modalWindow, "data-ui-state", __self.states.hide.modalWindow );
	UI.DOM.addDataValue( __self.mainCanvas,  "data-ui-state", __self.states.hide.modalCanvas );

	// fastdom.write(function() {
	// 	__self.modal.setAttribute("data-ui-state", modalState);
	// 	__self.modalWindow.setAttribute("data-ui-state", modalWindowState);
	// 	__self.mainCanvas.setAttribute("data-ui-state", mainCanvasState);
	// });
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