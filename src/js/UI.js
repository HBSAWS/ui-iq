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

UI_panels.prototype.showModal = function(id,side) {
	var active       = this.active;
	var activeLength = active.length;

	for (var i = 0;i < active.length;i++) {
		$("#" + active[i]).attr("data-ui-animate", "scale__back");
	}
	$("#" + id)
		.attr("data-ui-state", "is__active swap__in-" + side)
		.css("height");
	$("#" + id).attr("data-ui-animate", "swap__in-" + side);
};

UI_panels.prototype.hideModal = function(id,side) {
	var active       = this.active;
	var activeLength = active.length;

	for (var i = 0;i < active.length;i++) {
		$("#" + active[i]).attr("data-ui-animate", "scale__forward");
	}
	$("#" + id)
		.attr("data-ui-state", "is__active swap__out-" + side)
		.css("height");
	$("#" + id).attr("data-ui-animate", "swap__out-" + side);
};

UI_panels.prototype.getPanelIndex = function(panelID) {
	return this.panelIndex.indexOf(panelID);
};

UI_panels.prototype.panel = function(id,panelSettings) {
	var $panel = $("#" + id);
	var core    = "mode__" + panelSettings.mode + " size__" + panelSettings.size + " position__" + panelSettings.position;
	var state   = (panelSettings.active === true) ? "is__active" : "";

	$panel
		.attr("data-ui-animate","")
		.attr("data-ui-core", core)
		.attr("data-ui-state", state);

	if ( panelSettings.active && this.active.indexOf(id) < 0 ) {
		this.active.push(id);
	} else if ( !panelSettings.active && this.active.indexOf(id) > -1 ) {
		var index = this.active.indexOf(id);
		this.active.splice(index,1);
	}		
	$.extend(this.panels[this.getPanelIndex(id)],panelSettings);
}; 

UI_panels.prototype.swap = function(panelOneID,panelTwoID,toAnimate,side) {
	var panels        = this.panels;
	var active        = this.active;
	var panelOneIndex = this.getPanelIndex(panelOneID);
	var panelTwoIndex = this.getPanelIndex(panelTwoID);
	var panelOne      = panels[panelOneIndex];
	var panelTwo      = panels[panelTwoIndex];
	var $panelOne     = $("#" + panelOneID);
	var $panelTwo     = $("#" + panelTwoID);

	if ( panelOne.active && panelTwo.active && active.length == 0) {
		// BOTH PANELS ARE ACTIVE
		// both panels are currently active we ignore the side and simple switch properties
		var panelOneState,panelTwoState;
		if ( panelOne.position > panelTwo.position ) {
			// we are going to have to move panel one left and panel two right
		} else {
			// we are going to have to move panel one right and panel two left
		}
		// add data attributes here

		$panelOne.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
			console.log(e);
		});		
		
		// we have to update the active array for both panels
		active[active.indexOf(panelOneID)] = panelTwoID;
		active[active.indexOf(panelTwoID)] = panelOneID;
	} else {
		// ONE PANEL IS INACTIVE
		active[active.indexOf(panelOneID)] = panelTwoID;


	}

	if ( !toAnimate ) {
		this.panel(panelOne.id,panelTwo);
		this.panel(panelTwo.id,panelOne);
	} else {
		var swapOut = "swap__out-" + side;
		var swapIn = "swap__in-" + side;

		$panelOne
			.attr("data-ui-state", "is__active")
			.attr("data-ui-animate", swapOut);
		$panelTwo
			.attr("data-ui-state", "is__active " + swapIn)
			.css("height");
		$panelTwo.attr("data-ui-animate", swapIn);
	}


	// update the panel objects with their new values
	var panelOneTemp = $.extend({},this.panels[panelOneIndex],panelTwo);
	panelOneTemp.id = panelOneID;

	$.extend(this.panels[panelTwoIndex],panelOne);
	this.panels[panelTwoIndex].id = panelTwoID;

	$.extend(this.panels[panelOneIndex],panelOneTemp);
};










function UI_cuboid(DOMelement,settings) {
	this.states = {
		show__front  : true,
		show__bottom : false,
		show__back   : false,
		show__top    : false
	};
	_UI.call(this,DOMelement,settings);
};

UI_cuboid.prototype = Object.create(_UI.prototype);
UI_cuboid.prototype.initialize_module = function(settings) {
	var _self = this;
};
UI_cuboid.prototype.side = function(side) {
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
	cuboid   : function(DOMelement, settings) {
		new UI_cuboid(DOMelement,settings);
	},
	panels  : function(DOMelement,settings) {
		new UI_panels(DOMelement,settings);
	},
	toggler : function(DOMelement,settings) {
		new UI_toggler(DOMelement,settings);
	}
};