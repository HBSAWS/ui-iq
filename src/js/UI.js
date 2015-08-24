var _UI = function(DOMelement,settings) {
	this.$el    = $(DOMelement);
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
};
_UI.prototype.updateStates = function(updatedStates) {
	var states,active_state,checked_state,disabled_state,compiled_states;
	compiled_states    = '';
 	states             = this.states;
 	if ( typeof updatedStates !== "undefined" ) {
		$.extend(this.states, updatedStates);
	}

	for ( var state in states ) {
		if ( states[state] === true ) {
			compiled_states += state + " ";
		}
	}

	this.$el.attr("data-ui-state", compiled_states);
	this.$el.find("*").attr("data-ui-state", compiled_states);
};
_UI.prototype.updateCore = function(property,setting) {
	var compiled_core = "";

	this.core[property] = setting;
	for (var property in this.core) {
		compiled_core += property + "__" + this.core[property] + " ";
	}
	
	this.$el.attr("data-ui-core", compiled_core);
	this.$el.find("*").attr("data-ui-core", compiled_core);
};










function UI_toggler(DOMelement, settings) {
	this.$input = DOMelement.find("input");
	this.core = {
		mode : "check",
		size : "small"
	};
	this.states = {
		is__checked  : false,
		is__disabled : false
	};
	_UI.call(this,DOMelement,settings);
}

UI_toggler.prototype = Object.create(_UI.prototype);

UI_toggler.prototype.initialize_module = function(settings) {
	if ( this.$input.is(":checked") ) {
		this.states.is__checked = true;
	}
	if ( this.$input.is(":disabled") ) {
		this.states.is__disabled = true;
	}
	this.updateStates();
	this.on_change(this.$input, this);
};
UI_toggler.prototype.on_change = function($input, _self) {
	$input.on("change", function () {
		if ( $input.is(":radio") ) {
			var group = $input.attr("name");
			$("input[name='" + group + "']").each(function() {
				var $this = $(this);

				if (!$this.is($input)) {
					$this
						.parents("[class^='toggler_']")
						.data("UI")
						.updateStates({is__checked : false});
				}
			});
		}
		if ( $input.is(":checked") ) {
			_self.updateStates({is__checked : true});
		} else {
			_self.updateStates({is__checked : false});
		}
	});
};










function UI_panels(DOMelement,settings) {
	this.panels     = settings;
	this.panelIndex = [];
	this.active     = [];

	_UI.call(this,DOMelement,settings);
};

UI_panels.prototype = Object.create(_UI.prototype);

UI_panels.prototype.initialize_module = function(settings) {
	var _self       = this;
	var panels      = this.panels;
	var totalPanels = panels.length;

	for (var i = 0;i < totalPanels; i++) {
		var panel    = panels[i];
		var panelID  = panel.id;
		var isActive = panel.active;

		this.panelIndex.push(panelID);
		if (isActive) {
			this.active.push(panelID);
		}
		this.panel(panelID,panel);
	}
};

UI_panels.prototype.panel = function(id,panelSettings) {
	var $panel = $("#" + id);
	var core   = "mode__" + panelSettings.mode + " size__" + panelSettings.size + " position__" + panelSettings.position;
	var state  = (panelSettings.active === true) ? "is__active" : "";

	$panel
		.attr("data-ui-core", core)
		.attr("data-ui-state", state);
}; 

UI_panels.prototype.getPanelIndex = function(panelID) {
	return this.panelIndex.indexOf(panelID);
};

UI_panels.prototype.swap = function(panelOneID,panelTwoID,toAnimate,side) {
	var panels   = this.panels;
	var active   = this.active;
	var panelOne = panels[this.getPanelIndex(panelOneID)];
	var panelTwo = panels[this.getPanelIndex(panelTwoID)];

	//if ( panelOne.active && panelTwo.active) {
		// both panels are currently active we ignore the side and simple switch properties
		this.panel(panelOne.id,panelTwo);
		this.panel(panelTwo.id,panelOne);
	//}
};
// UI_panels.prototype.switchPanels = function(panelID,switchType,side) {
// 	var old_activeOrder,new_activeOrder,old_activeAnimationAttributes,new_activePositionAttributes,new_activeAnimationAttributes;
// 	var has__secondActivePanel   = ( this.core.mode === "full" ) ? false : true;
// 	var panels                   = this.panels.panels;

// 	var old__firstActivePanelID  = this.panels.first[0];
// 	var old__secondActivePanelID = this.panels.second[0];
// 	var new__firstActivePanelID  = panelID;
// 	var new__secondActivePanelID = panels[panels.indexOf(panelID)];

// 	// this is determine the order of the old active panel(s) in relation to the new active panel(s)
// 	if ( panels.indexOf(old__firstActivePanelID) > panels.indexOf(new__firstActivePanelID) ) {
// 		// if the current first active panel's id has a larger index than the new first active panel's id
// 		// it means the new panel comes before the current one
// 		old__activeOrder = "before";
// 		new__activeOrder = "after";
// 	} else {
// 		// if the current first active panel's id has a smaller index than the new one
// 		// it means the new panel comes after current one
// 		old__activeOrder = "after";
// 		new__activeOrder = "before";
// 	}


// 	old__firstActivePanelAnimation  = "was__active " + "is__" + this.panels.first[1] + " " + this[switchType][old__activeOrder] + side;
// 	old__secondActivePanelAnimation = ( this.core.mode === "full" ) ? "" : "was__active " + "is__" + this.panels.second[1] + " " + this[switchType][old__activeOrder] + side;

// 	new__firstActivePanelPosition   = "is__active " + "is__" + this.panels.first[1] + " " + this[switchType][new__activeOrder] + side;
// 	new__firstActivePanelAnimation  = "is__active " + "is__" + this.panels.first[1] + " " + this[switchType][new__activeOrder] + side;

// 	new__secondActivePanelPosition  = ( this.core.mode === "full" ) ? "" : "is__active " + "is__" + this.panels.second[1] + " " + this[switchType][new__activeOrder] + side;
// 	new__secondActivePanelAnimation = ( this.core.mode === "full" ) ? "" : "is__active " + "is__" + this.panels.second[1] + " " + this[switchType][new__activeOrder] + side;


// 	$("#" + old__firstActivePanelID).attr("data-ui-state", old__firstActivePanelAnimation);
// 	$("#" + old__secondActivePanelID).attr("data-ui-state", old__secondActivePanelAnimation);

// 	$("#" + new__firstActivePanelID)
// 		.attr("data-ui-state", new__firstActivePanelPosition)
// 		.attr("data-ui-state", new__firstActivePanelAnimation);
// 	$("#" + new__secondActivePanelID)
// 		.attr("data-ui-state", new__secondActivePanelPosition)
// 		.attr("data-ui-state", new__secondActivePanelAnimation);
// };










function UI_nav(DOMelement,settings) {
	this.addons = {
		rotator : false
	};
	this.states = {
		show__front  : true,
		show__bottom : false,
		show__back   : false,
		show__top    : false
	};
	_UI.call(this,DOMelement,settings);
};

UI_nav.prototype = Object.create(_UI.prototype);
UI_nav.prototype.initialize_module = function(settings) {
	var _self = this;
};
UI_nav.prototype.side = function(side) {
	switch(side) {
		case "front":
			this.updateStates({
				show__front  : true,
				show__bottom : false,
				show__back   : false,
				show__top    : false				
			});
			break;
		case "bottom":
			this.updateStates({
				show__front  : false,
				show__bottom : true,
				show__back   : false,
				show__top    : false				
			});
			break;
		case "back":
			this.updateStates({
				show__front  : false,
				show__bottom : false,
				show__back   : true,
				show__top    : false				
			});
			break;
		case "top":
			this.updateStates({
				show__front  : false,
				show__bottom : false,
				show__back   : false,
				show__top    : true				
			});
			break;
	}
};









UI = {
	nav     : function(DOMelement, settings) {
		new UI_nav(DOMelement,settings);
	},
	panels  : function(DOMelement,settings) {
		new UI_panels(DOMelement,settings);
	},
	toggler : function(DOMelement,settings) {
		new UI_toggler(DOMelement,settings);
	}
};