var UI_actionsheet = function( DOMelement,settings ) {
	var __self;

	__self               = this;
	__self.el            = DOMelement;
	__self.select        = __self.el.querySelector("[data-js~='actionsheetSelect']");
	__self.list          = __self.el.querySelector("[data-js~='actionsheetList']");
	__self.values        = [];
	__self.selectedValue = undefined;
};

UI_actionsheet.prototype.initialize = function() {
	var options,optionsArray = [];
	options = __self.select.options;

	// for ( var option = 0, optionsLen = options.length; option < optionsLen; option++ ) {
	// 	var currentOption;
	// 	currentOption = options[option];
	// 	currentValue  = currentOption.value;

	// 	__self.values.push( currentValue );
	// 	optionsArray[option] = '<li class="actionsheet-items-item_">' + currentValue + '</li>';
	// }
	// __self.list.innerHTML = optionsArray.join("");
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
UI_actionsheet.prototype.close = function() {
	var __self;
	__self = this;

	UI_DOM.addDataValue( __self.el,"data-ui-state","animate__out move__bottom" );
};

UI_actionsheet.prototype.selectItem = function(e) {

};