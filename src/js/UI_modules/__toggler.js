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