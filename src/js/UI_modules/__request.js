function UI_request(settings) {
	var __self;
	__self = this;

	__self.method   = settings.method;
	__self.URL      = settings.URL;
	__self.success  = settings.success;
	__self.error    = settings.error;
	__self.headers  = settings.headers;
	__self.postData = settings.postData;

	__self.XHR      = new XMLHttpRequest(); 

	__self.initialize();

	return __self.XHR;
};

UI_request.prototype.initialize = function() {
	var __self;
	__self = this;

	__self.XHR.open( __self.method , __self.URL ,true);
	if ( __self.headers !== undefined ) {
		__self.XHR.setRequestHeader('Content-Type', __self.headers );
	}
	__self.XHR.onreadystatechange = function() {
		if( this.readyState == 4) {
			if( this.status == 200) {
				if ( __self.success !== undefined ) {
					__self.success(this);
				}
			}
			else {
				if ( __self.error !== undefined ) {
					__self.error(this);
				}
			}
		}
	};
	if ( __self.postData !== undefined ) {
		__self.XHR.send( __self.postData );
	} else {
		__self.XHR.send();
	}
};

UI_request.prototype.returnObject = function() {
	var __self;
	__self = this;

	return __self.XHR;
};