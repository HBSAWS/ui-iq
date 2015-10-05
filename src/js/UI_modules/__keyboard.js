var UI_keyboard = function( settings ) {
	var __self = this;

	__self.library = {
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
		add	             : 107,
		alt              : 18,
		b	             : 66,
		back_slash	     : 220,
		backspace        : 8,
		c	             : 67,
		close_braket     : 221,
		comma	         : 188,
		caps_lock        : 20,
		ctrl             : 17,
		d	             : 68,	 
		dash	         : 189,
		decimal_point    : 110,
		delete	         : 46,
		divide           : 111,
		down_arrow       : 40,
		e	             : 69,
		enter            : 13,
		equal_sign	     : 187,
		escape           : 27,
		end	             : 35,
		f	             : 70,
		forward_slash    : 191,
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
		g	             : 71,
		grave_accent     : 192,
		h	             : 72,
		home	         : 36,
		i	             : 73,
		insert	         : 45,	
		j	             : 74,
		k	             : 75,
		l	             : 76,
		left_arrow       : 37,
		left_window_key  : 91,
		m	             : 77,
		multiply	     : 106,
		n	             : 78,
		num_lock	     : 144,
		number_pad_0	 : 96,
		number_pad_1	 : 97,
		number_pad_2	 : 98,
		number_pad_3	 : 99,
		number_pad_4	 : 100,
		number_pad_5	 : 101,
		number_pad_6	 : 102,
		number_pad_7	 : 103,
		number_pad_8	 : 104,
		number_pad_9	 : 105,
		o	             : 79,
		open_bracket     : 219,
		p	             : 80,
		page_down        : 34,
		page_up          : 33,
		period	         : 190,
		q	             : 81,
		r	             : 82,
		right_arrow      : 39,
		right_window_key : 92,
		s	             : 83,
		scroll_lock      : 145,
		select_key	     : 93,
		semi_colon       : 186,
		shift            : 16,
		single_quote     : 222,
		space            : 32,
		subtract	     : 109,
		t	             : 84,
		tab              : 9,
		u	             : 85,
		up_arrow         : 38,
		v	             : 86,
		w	             : 87,
		x	             : 88,
		y	             : 89,
		z	             : 90
	};

	// SETTINGS
	// combination can either be a space separated string or array
	__self.encryptedCombination    = ( settings.combination.indexOf(',') > -1 ) ? settings.combination.join(',') : settings.combination;
	__self.onPress 	               = settings.onPress;
	__self.exception               = settings.exception || function() { return false };
	__self.numbersIncludeNumberPad = settings.numbersIncludeNumberPad || true;
	__self.returnKeyIncludesEnter  = settings.returnKeyIncludesEnter || true;


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
	e.stopPropagation();
};

UI_keyboard.prototype.keyUp = function(e) {
	var __self,e,key,index;
	__self = this; 
	e      = e || event; // to deal with IE
	key    = window.event ? e.keyCode : e.which;
	index  = __self.keysDown.indexOf( key );
	__self.keysDown.splice(index, 1);
	e.stopPropagation();
};



UI_keyboard.prototype.initialize = function() {
	var __self = this;

	__self.__decryptKeycodes();
	__self.bind();
};
