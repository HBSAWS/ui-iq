function UI_loader( DOMelement,settings ) {
	var __self;
	__self                         = this;
	// the loader wrapper/background DOM element
	__self.loader                  = DOMelement;
	// the loader progress bar DOM element
	__self.loaderProgressbar 	   = __self.loader.querySelector("[class^='loader-progress_']");
	// the XMLHttpRequest objects.  Either singular or array
	__self.requests                = settings.requests;
	// whether the loader should be destroyed when finished
	__self.destroyOnComplete       = ( settings.destroyOnComplete !== undefined )       ? settings.destroyOnComplete : false;
	// if this loader will be running over and over again, it needs to be reset after completeing
	__self.resetLoaderOnComplete   = ( settings.resetLoaderOnComplete !== undefined )   ? settings.resetLoaderOnComplete : false;
	// the loader has several premade animate out functions
	// dev doesn't have to use, by default it's off
	// animation names/attribute accepted values : 'fade out'|'out top'|'out bottom'
	__self.loaderCompleteAnimation = ( settings.loaderCompleteAnimation !== undefined ) ? settings.loaderCompleteAnimation : undefined;
	// this function will fire after the loader animation completes
		// dev has access to the loader DOM object via the 'loader' parameter
		// dev has access to an array of the request objects via the 'requests' parameter
	__self.onComplete              = ( settings.onComplete !== undefined ) ? settings.onComplete : undefined;

	// this is the total percent loaded of all the requests
	__self.percentageLoaded  = 0;
	// array of all the requests progress event listeners
	__self.progressListeners = [];
	__self.__finishedLoading = __self.finishedLoading.bind( __self );

	__self.initialize();
};

UI_loader.prototype.initialize = function() {
	var __self,requests;
	__self   = this;
	requests = __self.requests;

	// a new instance of a class that contains an event listener for each request, is created and added to an array
		// the event listener in the class instance is returning the value of the progress to the instance's 'progress' attribute
		// so the progress can be checked via instance.progress
	if ( requests instanceof Array ) {
		for ( var request = 0,len = requests.length; request < len; request++ ) {
			var currentRequest = requests[request];

			__self.progressListeners.push( new __self.RequestTracker(currentRequest) );
		}
	} else {
		__self.progressListeners.push( new __self.RequestTracker(requests) );
	}

	// we set an event listener on the transition end for the progress bar
	__self.loaderProgressbar.addEventListener( 'webkitTransitionEnd',__self.__finishedLoading);
	// loops through our array of progress event listeners and updates the progressBar and __self.percentageLoaded variable
	__self.updateProgressBar();
};


UI_loader.prototype.RequestTracker = (function() {
	function XHRRequestTracker(request) {
		var event, size, _j, _len1, _onreadystatechange, _ref2,_this;
		_this = this;
		this.progress = 0;
		if (window.ProgressEvent != null) {
			request.addEventListener('progress', function(evt) {
				if (evt.lengthComputable) {
					//console.log("inside event: " + 100 * evt.loaded / evt.total);
					return _this.progress = 100 * evt.loaded / evt.total;
				}
			}, false);
			_ref2 = ['load', 'abort', 'timeout', 'error'];
			for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
				event = _ref2[_j];
				request.addEventListener(event, function() {
					//console.log( "catch event" );
					return _this.progress = 100;
				}, false);
			}
		}
	}

	return XHRRequestTracker;
})();


UI_loader.prototype.updateProgressBar = function() {
	var __self,totalRequests,checkProgress,currentProgress;
	__self          = this;
	totalRequests = __self.progressListeners.length;
	
	var checkProgress = function() {
		setTimeout(function() {
			currentProgress = 0;
			for ( var listener = 0; listener < totalRequests; listener++ ) {
				currentProgress += __self.progressListeners[listener].progress;
				//console.log( "listener #" + listener + " progress: " + __self.progressListeners[listener].progress );
			}
			currentProgress = __self.percentageLoaded = currentProgress / totalRequests;

			//console.log( "total progress: " + currentProgress);
			__self.loaderProgressbar.style.transform = "translateX(" + currentProgress + "%)";
			if ( currentProgress < 100 ) {
				checkProgress();
			}
		},0);
	};
	checkProgress();
};

UI_loader.prototype.resetLoader = function() {
	var __self;
	__self = this;

	__self.loader.offsetHeight;
	__self.loader.style.transition = "opacity 0s,transform 0s";
	__self.loader.style.transform  = "translateY( 0 )";
	__self.loader.style.opacity    = 1;

	__self.loaderProgressbar.style.transition = "opacity 0s,transform 0s";
	__self.loaderProgressbar.style.transform  = "translateX( 0 )";
	__self.loaderProgressbar.offsetHeight;
	__self.loaderProgressbar.style.transition = "transform 1.5s cubic-bezier(0.39, 0.575, 0.565, 1)";
};

UI_loader.prototype.finishedLoading = function() {
	var __self,loader,requests,transitionTiming,transitionAnimation,transitionProperty,onComplete,resetLoader;
	__self = this;
	console.log("finished");
	if ( __self.percentageLoaded == 100 ) {
		loader            = __self.loader;
		requests          = __self.requests;
		onComplete        = __self.onComplete;

		// remove the event listener for the progress bar transitions
		__self.loaderProgressbar.removeEventListener( 'webkitTransitionEnd',__self.__finishedLoading);		

		if ( __self.loaderCompleteAnimation !== undefined ) {
			var completeAnimation = function(e) {
				if ( e.target === e.currentTarget ) { 
					__self.loader.removeEventListener( 'webkitTransitionEnd', completeAnimation );

					if ( __self.resetLoaderOnComplete ) {
						__self.resetLoader();
					}
				}
			};
			__self.loader.addEventListener( 'webkitTransitionEnd', completeAnimation );

			if ( __self.loaderCompleteAnimation === "out top" ) {
				transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1)";
				transitionAnimation = "translateY( -100% )";
				transitionProperty  = "transform";
			} else if ( __self.loaderCompleteAnimation === "out bottom" ) {
				transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1)";
				transitionAnimation = "translateY( 100% )";
				transitionProperty  = "transform";
			} else if ( __self.loaderCompleteAnimation == "fade out" ) {
				transitionTiming    = "opacity .45s cubic-bezier(.43,0,0,1)";
				transitionAnimation = "0";
				transitionProperty  = "opacity";
			}
			__self.loader.style.transition           = transitionTiming;
			__self.loader.style[transitionProperty]  = transitionAnimation;
		} else if ( __self.loaderCompleteAnimation == undefined && __self.resetLoaderOnComplete ) {
			__self.resetLoader();
		}

		if ( onComplete !== undefined ) {
			// if there is a onComplete function, it fires here
			// loader is the actual loader DOM element
			// requests are the original request objects submitted
			__self.onComplete({ loader : loader, requests : requests });
		}



		if ( __self.destroyOnComplete ) {
			// removes the DOM loader and progress bar elements
			loader.remove();
		}
	}
}