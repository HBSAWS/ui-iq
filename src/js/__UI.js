var _UI = function(DOMelement,settings) {
	this.$el    = $(DOMelement) || undefined;
	this.initialize(settings);
};

_UI.prototype.initialize = function(settings) {
	if ( typeof settings !== "undefined" && typeof this.core !== "undefined" && typeof settings.core !== "undefined" ) {
		$.extend(this.core,settings.core);
	}
	if ( typeof settings !== "undefined" && typeof this.settings !== "undefined" && typeof settings.states !== "undefined" ) {
		$.extend(this.states,settings.states);
	}
	this.initialize_module(settings);
	this.$el.data("UI", this);
	return this;
};
_UI.prototype.updateStates = function(updatedStates) {
	var _self,states,active_state,checked_state,disabled_state,compiled_states;
	_self           = this;
	compiled_states = '';
 	states          = this.states;
 	if ( typeof updatedStates !== "undefined" ) {
		$.extend(this.states, updatedStates);
	}

	for ( var state in states ) {
		if ( states[state] === true ) {
			compiled_states += state + " ";
		}
	}
	fastdom.write(function() {
		_self.$el[0].setAttribute("data-ui-state", compiled_states);
	});
	this.$el.find("*").attr("data-ui-state", compiled_states);
};
_UI.prototype.updateCore = function(property,setting) {
	var _self,compiled_core;
	_self         = this;
	compiled_core = "";

	this.core[property] = setting;
	for (var property in this.core) {
		compiled_core += property + "__" + this.core[property] + " ";
	}

	fastdom.write(function() {
		_self.$el[0].setAttribute("data-ui-state", compiled_core);
	});	
	this.$el.find("*").attr("data-ui-core", compiled_core);
};