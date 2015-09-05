var __Animation = function(DOMelement,settings) {
	this.$el        = $(DOMelement);
	this.animations = [];

	_UI.call(this,DOMelement,settings);
};

__Animation.prototype = Object.create(_UI.prototype);

// USAGE

// an animation must have animation name and direction
// available animations

// [
// 	{
// 		name      : <rotate><move>,
// 		direction : <out><in>,
// 		side 	  : <top><right><bottom><left>,
//		animate   : <true><false>
// 	},
// 	{
// 		name      : <scale>,
// 		direction : <out><in>,
//		animate   : <true><false>
// 	}
// ]
__Animation.prototype.__compileAnimation = function(settings) {
	var animations, compiledAnimationState;
	animations 			   = settings.length;
	compiledAnimationState = '';

	for ( var currentAnimation = 0; currentAnimation < animations; currentAnimation++ ) {
		var animation,animationName,animationDirection,animationSide,animate;

		animation          = currentAnimation[i];
		animationName      = animation["name"] + '__';
		animationDirection = animation["direction"];
		animationSide      = animation["side"] == undefined ? ' ' : '-' + animation.side + ' ';
		animate 	  	   = animation["animate"] == true ? 'animate__' + animationDirection + ' ' : "animate__off ";

		compiledAnimationState += animate + animationName + animationDirection + animationSide;
	}
	return compiledAnimationState;
};
__Animation.prototype.animate = function(settings) {
	var compiledAnimationState = this.__compile(settings);
	this.$el.attr("data-ui-state", compiledAnimationState);
};