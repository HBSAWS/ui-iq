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
	var $panel  = $("#" + id);
	var core    = "mode__" + panelSettings.mode + " size__" + panelSettings.size + " position__" + panelSettings.position;
	var state   = (panelSettings.active === true) ? "is__active" : "";

	// fastdom.write(function() {
		$panel[0].setAttribute("data-ui-core", core);
		$panel[0].setAttribute("data-ui-state", state);
	// });

	if ( panelSettings.active && this.active.indexOf(id) < 0 ) {
		this.active.push(id);
	} else if ( !panelSettings.active && this.active.indexOf(id) > -1 ) {
		var index = this.active.indexOf(id);
		this.active.splice(index,1);
	}		
	$.extend(this.panels[this.getPanelIndex(id)],panelSettings);
}; 

UI_panels.prototype.swap = function(panelOneID,panelTwoID,animate,side) {
	var panels,active,panelOneIndex,panelTwoIndex,panelOneObj,paneTwoObj,panelOneEl,panelOneEl__Content,panelTwoEl,panelTwoEl__Content;
	panels        = this.panels;
	active        = this.active;
	panelOneIndex = this.getPanelIndex(panelOneID);
	panelTwoIndex = this.getPanelIndex(panelTwoID);
	panelOneObj      = panels[panelOneIndex];
	panelTwoObj      = panels[panelTwoIndex];
	fastdom.read(function() {
		panelOneEl          = document.getElementById(panelOneID);
		panelOneEl__Content = panelOneEl.querySelector("[class^='panels-panel-content_']");
		panelTwoEl          = document.getElementById(panelTwoID);
		panelTwoEl__Content = panelTwoEl.querySelector("[class^='panels-panel-content_']");
	});

	// the active.length == 0 is simply here so this option is currently unavailable
	if ( panelOneObj.active && panelTwoObj.active && active.length == 0) {
		// BOTH PANELS ARE ACTIVE
		// both panels are currently active we ignore the side and simple switch properties
		var panelOneState,panelTwoState;
		if ( panelOneObj.position > panelTwoObj.position ) {
			// we are going to have to move panel one left and panel two right
		} else {
			// we are going to have to move panel one right and panel two left
		}
		// add data attributes here

		$("#" + panelOneID).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
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
		this.panel(panelOneObj["id"],panelTwoObj);
		this.panel(panelTwoObj["id"],panelOneObj);
	} else {
		// array, [panelTwo content setup, panelOne content animate out]
		var settings__contentAnimateOut = { timing : ["off","out"], delay  : false, modes : ["rotate","scale"], rotate : side, scale : "down" };
		var compiled__contentAnimateOut = this.__compileAnimation(settings__contentAnimateOut); 

		// array, [panelTwo panel setup, panelOne panel animate out]
		var settings__panelAnimateOut = { timing : ["off","out"], delay  : true, modes : ["move"], move : side};
		var compiled__panelAnimateOut = this.__compileAnimation(settings__panelAnimateOut);

		fastdom.write(function() {
			panelOneEl.setAttribute("data-ui-state", "was__active " + compiled__panelAnimateOut[1]);
			panelOneEl__Content.setAttribute("data-ui-state", "was__active " + compiled__contentAnimateOut[1]);

			panelTwoEl.setAttribute("data-ui-state", "is__active " + compiled__panelAnimateOut[0]);
			panelTwoEl.offsetTop;

			panelTwoEl__Content.setAttribute("data-ui-state", "is__active " + compiled__contentAnimateOut[0]);
			panelTwoEl__Content.offsetTop;

			panelTwoEl.setAttribute("data-ui-state", "is__active animate__in-delay");
			panelTwoEl__Content.setAttribute("data-ui-state", "is__active animate__in");
		});
	}


	// update the panel objects with their new values
	var panelOneObjTemp = $.extend({},this.panels[panelOneIndex],panelTwoObj);
	panelOneObjTemp["id"] = panelOneID;

	$.extend(this.panels[panelTwoIndex],panelOneObj);
	this.panels[panelTwoIndex]["id"] = panelTwoID;

	$.extend(this.panels[panelOneIndex],panelOneObjTemp);
};

UI_panels.prototype.showNotification = function(panelID, toAnimate) {
	var $panelContent,$panelNotification,notificationHeight,animateState;
	$panelContent      = this.$el.find("#" + panelID + " > [class^='panels-panel-content_']");
	$panelNotification = this.$el.find("#" + panelID + " > [class^='panels-panel-notification_']");
	notificationHeight = 0 + "px";

	animateState = ( toAnimate == true ) ? "animate__in-delay" : "animate__off";
	$panelContent.attr("data-ui-state", animateState);
	$panelContent.css("transform", "translateY(" + notificationHeight + ")");
	$panelNotification.attr("data-ui-state", animateState);

	animateState = ( toAnimate == true ) ? "animate__in" : "animate__off";	
	$panelNotification.children("[class^='panels-panel-notification-content_']").attr("data-ui-state", animateState);
};
UI_panels.prototype.hideNotification = function(panelID, toAnimate) {
	var $panelContent,$panelNotification,notificationHeight,animateState;
	$panelContent      = this.$el.find("#" + panelID + " > [class^='panels-panel-content_']");
	$panelNotification = this.$el.find("#" + panelID + " > [class^='panels-panel-notification_']");
	notificationHeight = ($panelNotification.height() + 15) * -1 + "px";


	animateState = ( toAnimate == true ) ? "animate__out-delay" : "animate__off";
	$panelContent.attr("data-ui-state", animateState);
	$panelContent.css("transform", "translateY(" + notificationHeight + ")");
	$panelNotification.attr("data-ui-state", animateState + " move__bottom");

	animateState = ( toAnimate == true ) ? "animate__out" : "animate__off";
	$panelNotification.find("[class^='panels-panel-notification-content_']").attr("data-ui-state", animateState + " rotate__bottom scale__down");
};