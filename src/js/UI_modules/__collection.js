var UI_collection = function(items,activeItem) {
	var __self;
	__self = this;

	// key   = the item ID
	// value = the cached DOM element
	__self.items   = {};
	__self.active  = activeItem;
};

UI_collection.prototype = Object.create(__Animation.prototype);

UI_collection.prototype.initialize_module = function(settings) {
	var __self,items; 
	__self = this;
	items  = settings.items;

	for ( var item = 0, len = items.length; item < len; setting++) {
		var currentItem = items[item];
		// creating object of cached DOM objects
		// key   = the item ID
		// value = the cached DOM element
		__self.items[currentItem] = document.getElementById(currentItem);
	}
};

UI_collection.prototype.isActive = function( itemToCheckId ) {
	var __self,state;
	__self = this;
	state  = false;

	if ( itemToCheckId === __self.active ) {
		state = true;
	}
	return state;
};



UI_collection.prototype.showItem = function(itemToShowId) {
	var __self,oldItem,newItem;
	__self = this;

	// check to make sure item isn't already active
	if ( __self.isActive(itemToShowId) ) {
		return;
	}

	// retrieve cached DOM elements
	oldItem = __self.item[__self.active];
	newItem = __self.items[itemToShowId];

	oldItem.setAttribute("data-ui-state", "is__hidden");
	newItem.setAttribute("data-ui-state", "");
	__self.active = itemToShowId;
};

UI_collection.prototype.activeItem = function() {
	return this.active;
};

UI_collection.prototype.swapItems = function(itemToSwapInId) {
	var __self,oldItem,newItem;
	__self = this;

	// check to make sure item isn't already active
	if ( __self.isActive(itemToShowId) ) {
		return;
	}

	// retrieve cached DOM elements
	oldItem      = __self.item[__self.active];
	newItem 	 = __self.items[itemToSwapInId];
	fastdom.read(function() {
		oldItemInner = oldItem.querySelector("[data-js-target~='animateInner']");
		newItemInner = newItem.querySelector("[data-js-target~='animateInner']");
	});

	// these items immediately animate
	oldItem__outerAnimation = __self.animationLibrary("shrink-move-up").animate.outer;
	oldItem__innerAnimation = __self.animationLibrary("shrink-move-up").animate.inner;

	// we need to make sure these items are in the right position before animating them
	// so we need to preanimate them (or setup)
	newItem__outerPreAnimation = __self.animationLibrary("shrink-move-up").setup.outer;
	newItem__innerPreAnimation = __self.animationLibrary("shrink-move-up").setup.inner;
	// once we've preanimated or setup our elements we can animate them in
	newItem__outerAnimation = __self.animationLibrary("move-down-grow").animate.outer;
	newItem__innerAnimation = __self.animationLibrary("move-down-grow").animate.inner;

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
};

