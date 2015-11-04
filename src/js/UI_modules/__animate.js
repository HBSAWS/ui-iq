UI_animate = function(DOMelement, settings) {
	var __self;
	__self = this;

	__self.el             = DOMelement;
	// the anima init and object instantiation
	__self.animaObj       = anima.world()
	__self.anima          = undefined;
	// the predefined animation functions are : collapse, expand and swap
	// these are the only animationNames currently allowed
	__self.animationName  = settings.animationName;
	__self.properties     = settings.properties;
	__self.speed          = settings.speed;
	__self.onComplete     = settings.onComplete;
	__self.onStart        = settings.onStart;
	__self.delay          = settings.delay;

	// we only define this if a premade animation function isn't being called
	__self.customAnimation = undefined;

	__self.initialize(__self);
};

UI_animate.prototype.initialize = function(__self) {
	if ( __self.speed === "fast" ) {
		__self.speed = 120;
	} else if ( __self.speed === "medium" ) {
		__self.speed = 200;
	} else if ( __self.speed === "slow" ) {
		__self.speed = 300;
	} else if ( __self.speed === "instant" ) {
		__self.speed = 0;
	}

	if ( __self.animationName !== undefined ) {
		if ( __self.animationName !== "swap" ) {
			__self.anima = __self.animaObj.add( __self.el );
		}
		__self[ __self.animationName ]();
	}

	// if there isn't a animation name defined by the user we assume it's a custom function
	if ( __self.animationName == undefined && __self.properties !== undefined ) {
		for ( var property in __self.properties ) {
			__self.customAnimation[ property ] = __self.properties[property];
		}
		__self.customAnimation.duration = ( __self.duration == undefined ) ? 400                       : __self.delay;
		__self.customAnimation.ease     = ( __self.ease == undefined )     ? "cubic-bezier(.43,0,0,1)" : __self.ease;
		__self.delay                    = ( __self.delay == undefined )    ? 0                         : __self.delay;

		__self.anima.animate( __self.customAnimation )
			.on('start', function() {
				if ( __self.onStart !== undefined ) {
					__self.onStart(this);
				}
			})
			.on('end', function() {
				if ( __self.onComplete !== undefined ) {
					__self.onComplete(this);
				}
			});
	}

};

UI_animate.prototype.collapse = function() {
	var __self,duration,delay;
	__self = this;

	if ( __self.speed == undefined ) {
		duration = 120;
	} else {
		duration = __self.speed;
	}

	if ( __self.delay == undefined ) {
		delay = 140;
	} else {
		delay = __self.delay;
	}

	__self.anima.animate({ 
		height   : "0px",
		duration : duration,
		ease     : 'cubic-bezier(.43,0,0,1)',
		delay    : 140
	})
	.on('start', function() {
		if ( __self.onStart !== undefined ) {
			__self.onStart(this);
		}
	})
	.on('end', function() {
		if ( __self.onComplete !== undefined ) {
			__self.onComplete(this);
		}
	});
};
UI_animate.prototype.expand = function() {
	var __self,duration,delay,newHeight;
	__self    = this;

	if ( __self.speed == undefined ) {
		duration = 130;
	} else {
		duration = __self.speed;
	}

	if ( __self.delay == undefined ) {
		delay = 0;
	} else {
		delay = __self.delay;
	}

	newHeight = __self.el.scrollHeight;
	__self.anima.animate({ 
		height   : newHeight + "px",
		duration : duration,
		ease     : "cubic-bezier(.43,0,0,1)",
		delay    : delay
	})
	.on('start', function() {
		if ( __self.onStart !== undefined ) {
			__self.onStart(this);
		}
	})
	.on('end', function() {
		__self.el.style.height = "auto";
		if ( __self.onComplete !== undefined ) {
			__self.onComplete(this);
		}
	});
};
UI_animate.prototype.swap = function() {
	var __self,oldItem,newItem,oldItemInner,newItemInner,oldItem__outerAnimation,oldItem__innerAnimation,newItem__outerPreAnimation,newItem__innerPreAnimation,newItem__outerAnimation,newItem__innerAnimation;
	__self       = this;
	oldItem      = __self.el[0];
	newItem 	 = __self.el[1];
	oldItemInner = oldItem.querySelector("[data-js~='animateInner']");
	newItemInner = newItem.querySelector("[data-js~='animateInner']");

	// these items immediately animate
	oldItem__outerAnimation = "animate__out-delay move__top";
	oldItem__innerAnimation = "animate__out scale__down rotate__top";

	// we need to make sure these items are in the right position before animating them
	// so we need to preanimate them (or setup)
	newItem__outerPreAnimation = "animate__off move__top";
	newItem__innerPreAnimation = "animate__off scale__down rotate__top";
	// once we've preanimated or setup our elements we can animate them in
	newItem__outerAnimation = "animate__in-delay-sm";
	newItem__innerAnimation = "animate__in-delay-lg";

	newItem.addEventListener( "webkittransitionend", function(e) {
		if ( e.target == e.currentTarget ) {
			__self.onComplete(__self);
		}
	}, false);


	oldItem.setAttribute("data-ui-state", oldItem__outerAnimation);
	oldItemInner.setAttribute("data-ui-state", oldItem__innerAnimation);

	newItem.setAttribute("data-ui-state", newItem__outerPreAnimation);
	newItem.offsetTop;

	newItemInner.setAttribute("data-ui-state", newItem__innerPreAnimation);
	newItemInner.offsetTop;

	newItem.setAttribute("data-ui-state", newItem__outerAnimation);
	newItemInner.setAttribute("data-ui-state", newItem__innerAnimation);
};


	// toAnimate  : undefined,
	// animation  : undefined,
	// speed      : undefined,
	// onComplete : undefined,
	// speeds allowed :
		// fast
		// medium
		// slow
		// instant
		// undefined default value will be used
		// number - will be animated in miliseconds
	// animation names allowed : 
		// collapse
		// expand
		// swap
	// settings = {
		// el         : the DOM element to be animated
		// animation  : the name of the animation (list written above ^^),
		// speed      : the desired animation speed - if left blank a default speed will be used,
		// onComplete : the function to be called after the animation is finished, access to the animated element is given 
	// }
// 	animate : function(settings) {
// 		var __self;
// 		__self = UI_animate;
// 		if ( settings.onComplete !== undefined ) {
// 			__self.onComplete = settings.onComplete;
// 		}
// 		if ( settings.speed !== undefined ) {
// 			__self.speed = settings.speed;
// 		} else if ( settings.speed === "fast" ) {
// 			__self.speed = 120;
// 		} else if ( settings.speed === "medium" ) {
// 			__self.speed = 200;
// 		} else if ( settings.speed === "slow" ) {
// 			__self.speed = 300;
// 		} else if ( settings.speed === "instant" ) {
// 			__self.speed = 0;
// 		}

// 		if ( settings.animation === "collapse" || settings.animation === "expand" ) {
// 			__self.toAnimate  = world.add( settings.el );
// 			//__self.__onComplete = settings.onComplete || undefined;
// 		}
// 		__self.el = settings.el;

// 		if ( settings.animation !== undefined ) {
// 			var animation = settings.animation;
// 			__self[animation]();
// 		}
// 	},
// 	collapse : function() {
// 		var __self,newHeight, duration;
// 		__self = this;

// 		if ( __self.speed == undefined ) {
// 			duration = 120;
// 		} else {
// 			duration = __self.speed;
// 		}

// 		__self.toAnimate.animate({ 
// 			height   : "0px",
// 			duration : duration,
// 			ease     : 'cubic-bezier(.43,0,0,1)',
// 			delay    : 140
// 		})
// 		.on ('end', function() {
// 			if ( __self.onComplete !== undefined ) {
// 				__self.onComplete(this);
// 				__self.onComplete = undefined;
// 			}
// 		});
// 	},
// 	expand : function() {
// 		var __self,newHeight,duration;
// 		__self    = this;
// 		newHeight = __self.el.scrollHeight;

// 		if ( __self.speed == undefined ) {
// 			duration = 130;
// 		} else {
// 			duration = __self.speed;
// 		}

// 		__self.toAnimate.animate({ 
// 			height   : newHeight + "px",
// 			duration : duration,
// 			ease     : "cubic-bezier(.43,0,0,1)"
// 		})
// 		.on('end', function() {
// 			__self.el.style.height = "auto";
// 			if ( __self.onComplete !== undefined ) {
// 				__self.onComplete(this);
// 			}
// 		});
// 	},
// 	swap : function() {
// 		var __self,oldItem,newItem,oldItemInner,newItemInner,oldItem__outerAnimation,oldItem__innerAnimation,newItem__outerPreAnimation,newItem__innerPreAnimation,newItem__outerAnimation,newItem__innerAnimation;
// 		__self = this;
// 		oldItem      = __self.el[0];
// 		newItem 	 = __self.el[1];
// 		oldItemInner = oldItem.querySelector("[data-js~='animateInner']");
// 		newItemInner = newItem.querySelector("[data-js~='animateInner']");

// 		// these items immediately animate
// 		oldItem__outerAnimation = "animate__out-delay move__top";
// 		oldItem__innerAnimation = "animate__out scale__down rotate__top";

// 		// we need to make sure these items are in the right position before animating them
// 		// so we need to preanimate them (or setup)
// 		newItem__outerPreAnimation = "animate__off move__top";
// 		newItem__innerPreAnimation = "animate__off scale__down rotate__top";
// 		// once we've preanimated or setup our elements we can animate them in
// 		newItem__outerAnimation = "animate__in-delay-sm";
// 		newItem__innerAnimation = "animate__in-delay-lg";


// 		oldItem.setAttribute("data-ui-state", oldItem__outerAnimation);
// 		oldItemInner.setAttribute("data-ui-state", oldItem__innerAnimation);

// 		newItem.setAttribute("data-ui-state", newItem__outerPreAnimation);
// 		newItem.offsetTop;

// 		newItemInner.setAttribute("data-ui-state", newItem__innerPreAnimation);
// 		newItemInner.offsetTop;

// 		newItem.setAttribute("data-ui-state", newItem__outerAnimation);
// 		newItemInner.setAttribute("data-ui-state", newItem__innerAnimation);
// 	},
// 	downAndOut : undefined
// };










	/**
	    Smoothly scroll element to the given target (element.scrollTop)
	    for the given duration

	    Returns a promise that's fulfilled when done, or rejected if
	    interrupted
	 */
	// smooth_scroll_to = function(element, target, duration) {
	//     target = Math.round(target);
	//     duration = Math.round(duration);
	//     if (duration < 0) {
	//         return Promise.reject("bad duration");
	//     }
	//     if (duration === 0) {
	//         element.scrollTop = target;
	//         return Promise.resolve();
	//     }

	//     var start_time = Date.now();
	//     var end_time = start_time + duration;

	//     var start_top = element.scrollTop;
	//     var distance = target - start_top;

	//     // based on http://en.wikipedia.org/wiki/Smoothstep
	//     var smooth_step = function(start, end, point) {
	//         if(point <= start) { return 0; }
	//         if(point >= end) { return 1; }
	//         var x = (point - start) / (end - start); // interpolation
	//         return x*x*(3 - 2*x);
	//     }

	//     return new Promise(function(resolve, reject) {
	//         // This is to keep track of where the element's scrollTop is
	//         // supposed to be, based on what we're doing
	//         var previous_top = element.scrollTop;

	//         // This is like a think function from a game loop
	//         var scroll_frame = function() {
	//             if(element.scrollTop != previous_top) {
	//                 reject("interrupted");
	//                 return;
	//             }

	//             // set the scrollTop for this frame
	//             var now = Date.now();
	//             var point = smooth_step(start_time, end_time, now);
	//             var frameTop = Math.round(start_top + (distance * point));
	//             element.scrollTop = frameTop;

	//             // check if we're done!
	//             if(now >= end_time) {
	//                 resolve();
	//                 return;
	//             }

	//             // If we were supposed to scroll but didn't, then we
	//             // probably hit the limit, so consider it done; not
	//             // interrupted.
	//             if(element.scrollTop === previous_top
	//                 && element.scrollTop !== frameTop) {
	//                 resolve();
	//                 return;
	//             }
	//             previous_top = element.scrollTop;

	//             // schedule next frame for execution
	//             setTimeout(scroll_frame, 0);
	//         }

	//         // boostrap the animation process
	//         setTimeout(scroll_frame, 0);
	//     });
	// }


	