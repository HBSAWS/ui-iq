var _UI = function(DOMelement,settings) {
	this.$el    = $(DOMelement);
	this.states = {
		is__active   : false,
		is__checked  : false,
		is__disabled : false
	};

	this.initialize(settings);
};

_UI.prototype.initialize = function(settings) {
	if ( typeof settings !== "undefined" ) {
		if ( typeof settings.states !== "undefined" ) {
			this.states = {
				is__active   : ( typeof settings.states.is__active === 'undefined' ) ? false : settings.states.is_active,
				is__checked  : ( typeof settings.states.is__checked === 'undefined' ) ? false : settings.states.is_checked,
				is__disabled : ( typeof settings.states.is__disabled === 'undefined' ) ? false : settings.states.is_disabled
			};		
		}
	}
	this.initialize_module(settings);
	this.$el.data("UI", this);
};
_UI.prototype.updateState = function(state,status) {
	var active_state,checked_state,disabled_state,compiled_states;

	this.states[state] = status;

	active_state    = ( this.states.is__active == false ) ? "" : "is__active ";
	checked_state   = ( this.states.is__checked == false ) ? "" : " is__checked ";
	disabled_state  = ( this.states.is__disabled == false ) ? "" : " is__disabled";

	compiled_states = active_state + checked_state + disabled_state;
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
	_UI.call(this,DOMelement,settings);
	this.core = {
		mode : "check",
		size : "small"
	};
}

UI_toggler.prototype = Object.create(_UI.prototype);

UI_toggler.prototype.initialize_module = function() {
	this.on_change();
};
UI_toggler.prototype.on_change = function() {
	var self, $input; 
	self   = this;
	$input = this.$el.find('input');

	$input.on("change", function () {
		if ( $input.is(":radio") ) {
			var group = $input.attr("name");
			$("input[name='" + group + "']").each(function() {
				var $this = $(this);

				if (!$this.is($input)) {
					$this
						.parents("[class^='toggler_']")
						.data("UI")
						.updateState("is__checked", false);
				}
			});
		}
		if ( $input.is(":checked") ) {
			self.updateState("is__checked", true);
		} else {
			self.updateState("is__checked", false);
		}
	});
};





function UI_panels(DOMelement,settings) {
	this.core = {
		mode : "full"
	};
	this.panels = {
		panels : [],
		first  : [],
		second : []
	};
	this.breakpoint = 1200;
	this.swap     = {
		before : "swap__in-",
		after  : "swap__out-"
	};
	this.stack      = {
		before : "push__back-",
		after  : "slide__out-"
	};
	this.modal      = {
		active : {
			before : null,
			after  : null
		},
		before : "modal__push-back",
		after  : "slide__out-"
	};

	_UI.call(this,DOMelement,settings);
}

UI_panels.prototype = Object.create(_UI.prototype);

UI_panels.prototype.initialize_module = function(settings) {
	var _self = this;
	this.states.is__full = false;
	$.extend(this.core,settings.core);
	$.extend(this.panels,settings.panels);
	if ( this.core.mode === "full") {
		$("#" + this.panels.first[0]).attr("data-ui-state", "is__active " + "is__" + this.panels.first[1]);
	}  else {
		$("#" + this.panels.first[0]).attr("data-ui-state", "is__active " + "is__" + this.panels.first[1]);
		$("#" + this.panels.second[0]).attr("data-ui-state", "is__active " + "is__" + this.panels.second[1]);
	}

};

UI_panels.prototype.switchPanels = function(panelID,switchType,side) {
	var old_activeOrder,new_activeOrder,old_activeAnimationAttributes,new_activePositionAttributes,new_activeAnimationAttributes;
	var has__secondActivePanel   = ( this.core.mode === "full" ) ? false : true;
	var panels                   = this.panels.panels;

	var old__firstActivePanelID  = this.panels.first[0];
	var old__secondActivePanelID = this.panels.second[0];
	var new__firstActivePanelID  = panelID;
	var new__secondActivePanelID = panels[panels.indexOf(panelID)];

	// this is determine the order of the old active panel(s) in relation to the new active panel(s)
	if ( panels.indexOf(old__firstActivePanelID) > panels.indexOf(new__firstActivePanelID) ) {
		// if the current first active panel's id has a larger index than the new first active panel's id
		// it means the new panel comes before the current one
		old__activeOrder = "before";
		new__activeOrder = "after";
	} else {
		// if the current first active panel's id has a smaller index than the new one
		// it means the new panel comes after current one
		old__activeOrder = "after";
		new__activeOrder = "before";
	}


	old__firstActivePanelAnimation  = "was__active " + "is__" + this.panels.first[1] + " " + this[switchType][old__activeOrder] + side;
	old__secondActivePanelAnimation = ( this.core.mode === "full" ) ? "" : "was__active " + "is__" + this.panels.second[1] + " " + this[switchType][old__activeOrder] + side;

	new__firstActivePanelPosition   = "is__active " + "is__" + this.panels.first[1] + " " + this[switchType][new__activeOrder] + side;
	new__firstActivePanelAnimation  = "is__active " + "is__" + this.panels.first[1] + " " + this[switchType][new__activeOrder] + side;

	new__secondActivePanelPosition  = ( this.core.mode === "full" ) ? "" : "is__active " + "is__" + this.panels.second[1] + " " + this[switchType][new__activeOrder] + side;
	new__secondActivePanelAnimation = ( this.core.mode === "full" ) ? "" : "is__active " + "is__" + this.panels.second[1] + " " + this[switchType][new__activeOrder] + side;


	$("#" + old__firstActivePanelID).attr("data-ui-state", old__firstActivePanelAnimation);
	$("#" + old__secondActivePanelID).attr("data-ui-state", old__secondActivePanelAnimation);

	$("#" + new__firstActivePanelID)
		.attr("data-ui-state", new__firstActivePanelPosition)
		.attr("data-ui-state", new__firstActivePanelAnimation);
	$("#" + new__secondActivePanelID)
		.attr("data-ui-state", new__secondActivePanelPosition)
		.attr("data-ui-state", new__secondActivePanelAnimation);
};










UI = {
	panels  : function(DOMelement,settings) {
		new UI_panels(DOMelement,settings);
	},
	toggler : function(DOMelement,settings) {
		new UI_toggler(DOMelement,settings);
	}
};