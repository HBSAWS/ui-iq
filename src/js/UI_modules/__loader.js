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
	__self.destroyOnComplete       = settings.destroyOnComplete || false;
	// the loader has several premade animate out functions
	// dev doesn't have to use, by default it's off
	// animation names/attribute accepted values : 'fade out'|'out top'|'out bottom'
	__self.loaderCompleteAnimation = settings.loaderCompleteAnimation || "none";
	// this function will fire after the loader animation completes
		// dev has access to the loader DOM object via the 'loader' parameter
		// dev has access to an array of the request objects via the 'requests' parameter
	__self.onComplete              = settings.onComplete || undefined;

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
			size = null;
			request.addEventListener('progress', function(evt) {
				if (evt.lengthComputable) {
					return _this.progress = 100 * evt.loaded / evt.total;
				}
			}, false);
		}
	}

	return XHRRequestTracker;
})();


UI_loader.prototype.updateProgressBar = function() {
	var __self,totalRequests,currentProgress;
	__self          = this;
	totalRequests = __self.requests.length;
	
	var checkProgress = function() {
		setTimeout(function() {
			currentProgress = 0;
			for ( var listener = 0; listener < totalRequests; listener++ ) {
				currentProgress += __self.progressListeners[listener].progress;
				console.log( "listener #" + listener + " progress: " + __self.progressListeners[listener].progress );
			}
			currentProgress = __self.percentageLoaded = currentProgress / totalRequests;

			console.log( "total progress: " + currentProgress);
			__self.loaderProgressbar.style.transform = "translateX(" + currentProgress + "%)";
			if ( currentProgress < 100 ) {
				checkProgress();
			}
		},0);
	};
	checkProgress();
};

UI_loader.prototype.finishedLoading = function() {
	var __self,totalPercentage,loader,requests,completeAnimation,onComplete,transitionTiming,transitionAnimation,transitionProperty;
	__self = this;
	console.log(totalPercentage);
	if ( __self.percentageLoaded == 100 ) {
		loader            = __self.loader;
		requests          = __self.requests;
		completeAnimation = __self.loaderCompleteAnimation;
		onComplete        = __self.onComplete;

		if ( completeAnimation !== "none" ) {
			if ( completeAnimation === "out top" ) {
				transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1) .3s";
				transitionAnimation = "translateY( -100% ) translateX( 100% )";
				transitionProperty  = "transform";
			} else if ( completeAnimation === "out bottom" ) {
				transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1) .3s";
				transitionAnimation = "translateY( 100% ) translateX( 100% )";
				transitionProperty  = "transform";
			} else if ( completeAnimation == "fade out" ) {
				transitionTiming    = "opacity .45s cubic-bezier(.43,0,0,1) .1s";
				transitionAnimation = "0";
				transitionProperty  = "opacity";
			}

			fastdom.write(function() {
				__self.loader.style.transition           = transitionTiming;
				__self.loader.style[transitionProperty]  = transitionAnimation;
			});
		}

		if ( onComplete !== undefined ) {
			__self.onComplete( loader,requests );
		}

		__self.loaderProgressbar.removeEventListener( 'webkitTransitionEnd',__self.__finishedLoading);

		if ( __self.destroyOnComplete ) {
			loader.remove();
		}
	}
}