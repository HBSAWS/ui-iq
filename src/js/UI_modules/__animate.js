// can either animate a host of CSS properties, OR a prebuilt animation from the library
// some prebuilt animations need two elements, simply submit them as an array
// we initialize the anima library
var world      = anima.world();
var UI_animate = {
	el         : undefined,
	toAnimate  : undefined,
	animation  : undefined,
	onComplete : undefined,
	animate : function(settings) {
		var __self;
		__self = UI_animate;
		if ( settings.animation === "collapse" || settings.animation === "expand" ) {
			__self.toAnimate  = world.add( settings.el );
			//__self.__onComplete = settings.onComplete || undefined;
		}
		__self.el = settings.el;

		if ( settings.animation !== undefined ) {
			var animation = settings.animation;
			__self[animation]();
		}
	},
	collapse : function() {
		var __self,newHeight;
		__self = this;

		__self.toAnimate.animate({ 
			height   : "0px",
			duration : 120,
			ease     : 'cubic-bezier(.43,0,0,1)',
			delay    : 140
		});
	},
	expand : function() {
		var __self,newHeight;
		__self    = this;
		newHeight = __self.el.scrollHeight;

		__self.toAnimate.animate({ 
			height   : newHeight + "px",
			duration : 130,
			ease     : "cubic-bezier(.43,0,0,1)"
		})
		.on('end', function() {
			__self.el.style.height = "auto";
		});
	},
	swap : function() {
		var __self,oldItem,newItem,oldItemInner,newItemInner,oldItem__outerAnimation,oldItem__innerAnimation,newItem__outerPreAnimation,newItem__innerPreAnimation,newItem__outerAnimation,newItem__innerAnimation;
		__self = this;
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


		oldItem.setAttribute("data-ui-state", oldItem__outerAnimation);
		oldItemInner.setAttribute("data-ui-state", oldItem__innerAnimation);

		newItem.setAttribute("data-ui-state", newItem__outerPreAnimation);
		newItem.offsetTop;

		newItemInner.setAttribute("data-ui-state", newItem__innerPreAnimation);
		newItemInner.offsetTop;

		newItem.setAttribute("data-ui-state", newItem__outerAnimation);
		newItemInner.setAttribute("data-ui-state", newItem__innerAnimation);
	},
	downAndOut : undefined
};










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


	