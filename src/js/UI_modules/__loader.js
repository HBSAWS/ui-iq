function UI_loader( target ) {
	this.el = target;
};

UI_loader.prototype.progress = function( percentage ) {
	this.el.style.transform = "translateY(" + percentage + "deg)";
};

UI_loader.prototype.finish = function( sucess, failure, warning ) {

}