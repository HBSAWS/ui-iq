var UI_keyboard = function( settings ) {
	var __self = this;

	__self.library = {
		backspace        : 8,
		tab              : 9,
		enter            : 13,
		shift            : 16,
		ctrl             : 17,
		alt              : 18,
		caps_lock        : 20,
		escape           : 27,
		space            : 32,
		page_up          : 33,
		page_down        : 34,
		end	             : 35,
		home	         : 36,
		left_arrow       : 37,
		up_arrow         : 38,
		right_arrow      : 39,
		down_arrow       : 40,
		insert	         : 45,
		delete	         : 46,
		0	             : 48,
		1	             : 49,
		2	             : 50,
		3	             : 51,
		4	             : 52,
		5	             : 53,
		6	             : 54,
		7	             : 55,
		8	             : 56,
		9	             : 57,
		a	             : 65,
		b	             : 66,
		c	             : 67,
		d	             : 68,	 	
		e	             : 69,
		f	             : 70,
		g	             : 71,
		h	             : 72,
		i	             : 73,
		j	             : 74,
		k	             : 75,
		l	             : 76,
		m	             : 77,
		n	             : 78,
		o	             : 79,
		p	             : 80,
		q	             : 81,
		r	             : 82,
		s	             : 83,
		t	             : 84,
		u	             : 85,
		v	             : 86,
		w	             : 87,
		x	             : 88,
		y	             : 89,
		z	             : 90,
		left_window_key  : 91,
		right_window_key : 92,
		select_key	     : 93,
		numpad_0	     : 96,
		numpad_1	     : 97,
		numpad_2	     : 98,
		numpad_3	     : 99,
		numpad_4	     : 100,
		numpad_5	     : 101,
		numpad_6	     : 102,
		numpad_7	     : 103,
		numpad_8	     : 104,
		numpad_9	     : 105,
		multiply	     : 106,
		add	             : 107,
		subtract	     : 109,
		decimal_point    : 110,
		divide           : 111,
		f1	             : 112,
		f2	             : 113,
		f3	             : 114,
		f4	             : 115,
		f5	             : 116,
		f6	             : 117,
		f7	             : 118,
		f8	             : 119,
		f9	             : 120,
		f10	             : 121,
		f11	             : 122,
		f12	             : 123,
		num_lock	     : 144,
		scroll_lock      : 145,
		semi_colon       : 186,
		equal_sign	     : 187,
		comma	         : 188,
		dash	         : 189,
		period	         : 190,
		forward_slash    : 191,
		grave_accent     : 192,
		open_bracket     : 219,
		back_slash	     : 220,
		close_braket     : 221,
		single_quote     : 222
	};

	// SETTINGS
	// combination can either be a space separated string or array
	__self.encryptedCombination    = ( settings.combination.indexOf(',') > -1 ) ? settings.combination.join(',') : settings.combination;
	__self.onPress 	               = settings.onPress;
	__self.exception               = settings.exception || function() { return false };
	__self.numbersIncludeNumberPad = settings.numbersIncludeNumberPad || true;


	__self.keysDown             = [];
	__self.decryptedCombination = [];
	__self.__keyDown            = __self.keyDown.bind( __self );
	__self.__keyUp 				= __self.keyUp.bind( __self );


	__self.initialize();
};

UI_keyboard.prototype.unBind = function() {
	var __self = this;
	document.removeEventListener( 'keydown', __self.__keyDown);
	document.removeEventListener( 'keyup', __self.__keyUp);
};
UI_keyboard.prototype.bind = function() {
	var __self = this;
	document.addEventListener( 'keydown', __self.__keyDown);
	document.addEventListener( 'keyup', __self.__keyUp);
};

UI_keyboard.prototype.__decryptKeycodes = function() {
	var __self;
	__self = this;
	//the user provided keycodes have at this point been converted to an array
	// we need to convert those array values from the plugin's library vocabulary to computer friendly keycodes
	for ( var code = 0, len = __self.encryptedCombination.length; code < len; code++ ) {
		var encyptedCode,decryptedCode;
		encyptedCode  = ( __self.encryptedCombination[code].indexOf(' ') > -1 ) ?  __self.encryptedCombination[code].replace(' ', '_') : __self.encryptedCombination[code];
		decryptedCode = __self.library[encyptedCode];

		__self.decryptedCombination.push( decryptedCode );
	}	
};

UI_keyboard.prototype.keyDown = function(e) {
	var __self,e,key;
	__self = this; 
	e      = e || event; // to deal with IE
	key    = window.event ? e.keyCode : e.which;
    __self.keysDown.push( key );


	if ( !__self.exception() ) {
		// if the exception isn't true, then we can fire our function 
		var unlocked,pins;
		unlocked  = __self.decryptedCombination.length;
		pins      = 0;
		for ( var pin = 0,len = __self.keysDown.length; pin < len; pin++ ) {
			var currentKey = __self.keysDown[pin];
			if ( __self.decryptedCombination.indexOf( currentKey ) > -1 ) {
				pins++;
			}
		}

		if ( pins == unlocked ) {
			__self.onPress();
		}
	}
};

UI_keyboard.prototype.keyUp = function(e) {
	var __self,e,key,index;
	__self = this; 
	e      = e || event; // to deal with IE
	key    = window.event ? e.keyCode : e.which;
	index  = __self.keysDown.indexOf( key );
	__self.keysDown.splice(index, 1);
};



UI_keyboard.prototype.initialize = function() {
	var __self = this;

	__self.__decryptKeycodes();
	__self.bind();
};
