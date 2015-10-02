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
		__self            = UI_animate;
		__self.el         = settings.el;
		__self.toAnimate  = world.add( settings.el );
		//__self.__onComplete = settings.onComplete || undefined;

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
		oldItem      = __self.__el[0];
		newItem 	 = __self.__el[1];
		fastdom.read(function() {
			oldItemInner = oldItem.querySelector("[data-js~='animateInner']");
			newItemInner = newItem.querySelector("[data-js~='animateInner']");
		});

		// these items immediately animate
		oldItem__outerAnimation = "animate__out-delay move__top";
		oldItem__innerAnimation = "animate__out scale__down rotate__top";

		// we need to make sure these items are in the right position before animating them
		// so we need to preanimate them (or setup)
		newItem__outerPreAnimation = "animate__off move__top";
		newItem__innerPreAnimation = "animate__off scale__down rotate__top";
		// once we've preanimated or setup our elements we can animate them in
		newItem__outerAnimation = "animate__in-delay";
		newItem__innerAnimation = "animate__in";

		fastdom.write(function() {
			oldItem.setAttribute("data-ui-state", oldItem__outerAnimation);
			oldItemInner.setAttribute("data-ui-state", oldItem__innerAnimation);

			newItem.setAttribute("data-ui-state", newItem__outerPreAnimation);
			newItem.offsetTop;

			newItemInner.setAttribute("data-ui-state", newItem__innerPreAnimation);
			newItemInner.offsetTop;

			newItem.setAttribute("data-ui-state", newItem__outerAnimation);
			newItemInner.setAttribute("data-ui-state", newItem__innerAnimation);
		});
	},
	downAndOut : undefined
};