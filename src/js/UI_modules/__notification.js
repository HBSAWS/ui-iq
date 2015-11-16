var UI_notification = function(DOMelement,settings) {
	var __self,startTimer,stopTimer;
	__self = this;

	__self.el                      = DOMelement;
	__self.closeIcon               = settings.closeIcon;
	__self.statusIcon              = settings.statusIcon;
	__self.statusMessage           = settings.statusMessage;
	__self.backing                 = settings.backing;

	__self.cuboidReference         = settings.cuboidReference;
	__self.cuboidDefaultSide       = settings.cuboidDefaultSide;
	__self.cuboidNotificationSide  = settings.cuboidNotificationSide;

	__self.showNotificationDuration = ( settings.showNotificationDuration !== undefined ) ? settings.showNotificationDuration : 5000;

	startTimer = function(e) {
		__self.timer = setTimeout(function() {
			__self.hide();
		},__self.showNotificationDuration);
	};
	stopTimer = function(e) {
		var __self = this;
		clearTimeout(__self.timer);

		if ( e !== undefined && e !== null && e.target == e.currentTarget ) {
			e.currentTarget.removeEventListener( e.type, __self.clearNotificationTimeout );
			e.currentTarget.addEventListener("mouseout", __self.startTimer);
		}
	};
	__self.timer      = undefined;
	__self.startTimer = startTimer.bind(__self);
	__self.stopTimer  = stopTimer.bind(__self);

	__self.status = undefined;
	__self.initialize();
};

UI_notification.prototype.initialize = function() {
	var __self = this;

	__self.closeIcon.addEventListener("click", function() {
		__self.hide();
	});	
};

UI_notification.prototype.update = function(status,message) {
	var __self = this;

	if ( __self.status == undefined || status !== __self.status ) {
		UI.DOM.removeDataValue( __self.backing, "data-ui-state", "is__" + __self.status + " fade__out" );
		UI.DOM.addDataValue( __self.backing, "data-ui-state", "is__" + status + " is__animating" );

		UI.DOM.removeDataValue( __self.statusIcon,'data-icon', ((__self.status === 'success') ? 'ok' : 'attention') );
		UI.DOM.addDataValue( __self.statusIcon,'data-icon', ((status === 'success') ? 'ok' : 'attention') );
	}
	__self.statusMessage.innerHTML = message;
	__self.status                  = status;
};

UI_notification.prototype.show = function() {
	var __self = this;

	if ( __self.cuboidReference !== undefined ) {
		__self.startTimer();
		__self.el.addEventListener('mouseover', __self.stopTimer);
		__self.cuboidReference.show( __self.cuboidNotificationSide );
	}
};
UI_notification.prototype.hide = function() {
	var __self = this;
	__self.el.removeEventListener("mouseout", __self.startTimer);

	__self.stopTimer();
	__self.cuboidReference.show( __self.cuboidDefaultSide );
};