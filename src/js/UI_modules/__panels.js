function UI_panels(DOMelement,settings) {
	this.panels     = settings;
	this.panelIndex = [];
	this.active     = [];

	__Animation.call(this,DOMelement);
};

UI_panels.prototype = Object.create(__Animation.prototype);

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

UI_panels.prototype.getPanelIndex = function(panelID) {
	return this.panelIndex.indexOf(panelID);
};

UI_panels.prototype.panel = function(id,panelSettings) {
	var $panel = $("#" + id);
	var core    = "mode__" + panelSettings.mode + " size__" + panelSettings.size + " position__" + panelSettings.position;
	var state   = (panelSettings.active === true) ? "is__active" : "";

	fastdom.write(function() {
		$panel[0].setAttribute("data-ui-core", core);
		$panel[0].setAttribute("data-ui-state", state);
	});

	if ( panelSettings.active && this.active.indexOf(id) < 0 ) {
		this.active.push(id);
	} else if ( !panelSettings.active && this.active.indexOf(id) > -1 ) {
		var index = this.active.indexOf(id);
		this.active.splice(index,1);
	}		
	$.extend(this.panels[this.getPanelIndex(id)],panelSettings);
}; 

UI_panels.prototype.swap = function(panelOneID,panelTwoID,animate,side) {
	var panels        = this.panels;
	var active        = this.active;
	var panelOneIndex = this.getPanelIndex(panelOneID);
	var panelTwoIndex = this.getPanelIndex(panelTwoID);
	var panelOne      = panels[panelOneIndex];
	var panelTwo      = panels[panelTwoIndex];
	var $panelOne     = $("#" + panelOneID);
	var $panelTwo     = $("#" + panelTwoID);

	// the active.length == 0 is simply here so this option is currently unavailable
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

	if ( !animate ) {
		this.panel(panelOne.id,panelTwo);
		this.panel(panelTwo.id,panelOne);
	} else {
		// array, [panelTwo content setup, panelOne content animate out]
		var settings__contentAnimateOut = { timing : ["off","out"], delay  : false, modes : ["rotate","scale"], rotate : "top", scale : "down" };
		var compiled__contentAnimateOut = this.__compileAnimation(settings__contentAnimateOut); 

		// array, [panelTwo panel setup, panelOne panel animate out]
		var settings__panelAnimateOut = { timing : ["off","out"], delay  : true, modes : ["move"], move : "top"};
		var compiled__panelAnimateOut = this.__compileAnimation(settings__panelAnimateOut);

		fastdom.write(function() {
			$panelOne[0].setAttribute("data-ui-state", "was__active " + compiled__panelAnimateOut[1]);
			$panelOne.find("> [class^='panels-panel-content']")[0].setAttribute("data-ui-state", "was__active " + compiled__contentAnimateOut[1]);
		});

		requestAnimationFrame(function() {

			$panelTwo
				.attr("data-ui-state", "is__active " + compiled__panelAnimateOut[0])
				.css("height");
			$panelTwo.find("> [class^='panels-panel-content']")
				.attr("data-ui-state", "is__active " + compiled__contentAnimateOut[0])
				.css("height");

			$panelTwo.attr("data-ui-state", "is__active animate__in-delay");
			$panelTwo.find("> [class^='panels-panel-content']").attr("data-ui-state", "is__active animate__in");
		});
	}


	// update the panel objects with their new values
	var panelOneTemp = $.extend({},this.panels[panelOneIndex],panelTwo);
	panelOneTemp.id = panelOneID;

	$.extend(this.panels[panelTwoIndex],panelOne);
	this.panels[panelTwoIndex].id = panelTwoID;

	$.extend(this.panels[panelOneIndex],panelOneTemp);
};

UI_panels.prototype.showModal = function(id,side) {
	var active       = this.active;
	var activeLength = active.length;

	for (var i = 0;i < active.length;i++) {
		$("#" + active[i]).attr("data-ui-state", "is__active animate__out scale__out");
	}
	$("#" + id)
		.attr("data-ui-state", "is__active animate__off rotate_out-" + side + "  scale__out move__out-" + side)
		.css("height");
	$("#" + id).attr("data-ui-state", "is__active animate__in rotate__in-" + side + " scale__in");
};

UI_panels.prototype.hideModal = function(id,side) {
	var active       = this.active;
	var activeLength = active.length;

	for (var i = 0;i < active.length;i++) {
		$("#" + active[i]).attr("data-ui-state", "is__active animate__in scale__in");
	}
	$("#" + id)
		.attr("data-ui-state", "is__active animate__out rotate_out-" + side + "  scale__out move__out-" + side);
};