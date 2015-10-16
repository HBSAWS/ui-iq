var UI_actionsheet = function( DOMelement,settings ) {
	var __self;

	__self                    = this;
	__self.el                 = DOMelement;
	__self.select             = __self.el.querySelector("[data-js~='actionsheetSelect']");
	__self.list               = __self.el.querySelector("[data-js~='actionsheetList']");
	__self.selectedItem       = undefined;

	__self.initialize();
};

UI_actionsheet.prototype.initialize = function() {
	var __self,options,optionsArray = [];
	__self  = this;
	options = __self.select.options;

	for ( var option = 0, optionsLen = options.length; option < optionsLen; option++ ) {
		var currentOption;
		currentOption = options[option];
		currentValue  = currentOption.value;

		if ( currentOption.selected == true ) {
			__self.selectedItem  = currentOption;
			optionsArray[option] = '<li class="actionsheet-items-item_" data-ui-state="is__selected" data-option="' + currentValue + '">' + currentValue + '</li>';
		} else {
			optionsArray[option] = '<li class="actionsheet-items-item_" data-option="' + currentValue + '">' + currentValue + '</li>';
		}
	}
	__self.list.innerHTML = optionsArray.join("");

	__self.list.addEventListener( 'click', function(e) {
		var clicked;
		clicked = e.target;

		if ( clicked.tagName === "LI" && clicked.dataset.option !== undefined && clicked.dataset.option !== null && __self.selectedItem !== undefined && clicked.dataset.option !== __self.selectedItem.value ) {
			__self.select.querySelector("[value='" + clicked.dataset.option + "']").selected = true;
			// triggers the change event
			__self.select.dispatchEvent(UI.utilities.events.change);
		}
	});

	// all change events are handled through the dropdown select
	__self.select.addEventListener( 'change', function(e) {
		var newSelectSelected,newListSelected;
		newSelectSelected = __self.select.querySelector("option:checked");
		newListSelected   = __self.list.querySelector("[data-option~='" + newSelectSelected.value + "']");

		if ( __self.selectedItem !== undefined ) {
			var oldListSelected;
			oldListSelected = __self.list.querySelector("[data-option~='" + __self.selectedItem.value + "']");

			UI_DOM.removeDataValue( oldListSelected,"data-ui-state","is__selected" );
			UI_DOM.addDataValue( newListSelected,"data-ui-state","is__selected" );
		} else {
			UI_DOM.addDataValue( newListSelected,"data-ui-state","is__selected" );
		}

		__self.selectedItem = newSelectSelected;
		__self.close(true);
	});

	if ( !UI.utilities.isMobile ) {
		__self.list.addEventListener( 'mouseover', function(e) {
			var target = e.target;

			if ( target.tagName === "LI" && target.dataset.option !== undefined && target.dataset.option !== null ) {
				UI_DOM.addDataValue( target,"data-ui-state","is__hovered" );
			}
		});
		__self.list.addEventListener( 'mouseout', function(e) {
			var target = e.target;

			if ( target.tagName === "LI" && target.dataset.option !== undefined && target.dataset.option !== null ) {
				UI_DOM.removeDataValue( target,"data-ui-state","is__hovered" );
			}
		});
	}
};

UI_actionsheet.prototype.addItem = function() {

};
UI_actionsheet.prototype.removeItem = function() {

};

UI_actionsheet.prototype.open = function() {
	var __self;
	__self = this;

	UI_DOM.addDataValue( __self.el,"data-ui-state","animate__out" );
	UI_DOM.removeDataValue( __self.el,"data-ui-state","move__bottom" );
};
UI_actionsheet.prototype.close = function(delay) {
	var __self, wait;
	__self = this;

	if ( delay == undefined ) {
		wait = 0;
	} else {
		wait = 700;
	}

	setTimeout(function() {
		UI_DOM.addDataValue( __self.el,"data-ui-state","animate__out move__bottom" );
	}, wait);
};