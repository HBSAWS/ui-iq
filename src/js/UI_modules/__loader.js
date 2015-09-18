function UI_loader( DOMelement,settings ) {
	var __self;
	__self                   = this;
	__self.loader            = DOMelement;
	__self.loaderProgress 	 = __self.loader.querySelector("[class^='loader-progress_']");

	// options: fadeOut|outTop|outBottom
	__self.loaderOnComplete  = settings.loaderOnComplete || undefined;
	__self.onComplete        = settings.onComplete || undefined; 
	__self.destroyOnComplete = settings.destroyOnComplete || false;

	__self.__finish          = __self.finish.bind(this);
};

UI_loader.prototype.progress = function( percentage ) {
	var __self,progressBar;
	__self      = this;
	progressBar = __self.loaderProgress;

	if ( percentage == 100 ) {
		progressBar.addEventListener( 'webkitTransitionEnd', __self.__finish);
	}
	progressBar.style.transform = "translateX(" + percentage + "%)";
};

UI_loader.prototype.finish = function( sucess, failure, warning ) {
	var __self,loaderOnComplete,transitionTiming,transitionAnimation,transitionProperty;
	__self           = this;
	loaderOnComplete = __self.loaderOnComplete;

	if ( __self.loaderOnComplete !== undefined ) {
		if ( loaderOnComplete === "outTop" ) {
			transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1) .3s";
			transitionAnimation = "translateY( -100% ) translateX( 100% )";
			transitionProperty  = "transform";
		} else if ( loaderOnComplete === "outBottom" ) {
			transitionTiming    = "transform .45s cubic-bezier(.43,0,0,1) .3s";
			transitionAnimation = "translateY( 100% ) translateX( 100% )";
			transitionProperty  = "transform";
		} else if ( loaderOnComplete == "fadeOut" ) {
			transitionTiming    = "opacity .45s cubic-bezier(.43,0,0,1) .1s";
			transitionAnimation = "0";
			transitionProperty  = "opacity";
		}

		fastdom.write(function() {
			__self.loader.style.transition = transitionTiming;
			__self.loader.style[transitionProperty]  = transitionAnimation;
		});
	}

	if ( __self.onComplete !== undefined ) {
		__self.onComplete();
	}

	__self.loaderProgress.removeEventListener( 'webkitTransitionEnd', __self.__finish);

}