// UI TABLE PLUGIN
// DEPENDANCIES
	// list.js        - for the sorting/searching/filtering
	// UI keyboard.js - for enabling the keyboard navigation options
	// UI DOM.js      - for updating classes and data attributes
function UI_table(DOMelement, settings) {
	var __self = this;

	__self.el    = DOMelement;
	__self.tbody = __self.el.querySelector("tbody");
	__self.core  = {
		size : "large"
	};
	__self.list       = null;
	__self.valueNames = settings.valueNames;
	__self.searchEl   = settings.searchElements; 
	__self.sortEl     = settings.sortElements;
	__self.filterEl   = settings.filterElements;


	__self.arrowKeysHighlightRows = ( settings.arrowKeysHighlightRows !== undefined ) ? settings.arrowKeysHighlightRows : true;
	__self.hoverHighlightsRows    = ( settings.hoverHighlightsRows !== undefined )    ? settings.hoverHighlightsRows    : true;
	__self.hoverFocusesTable      = ( settings.hoverFocusesTable !== undefined )      ? settings.hoverFocusesTable      : true;
	__self.returnKeySelectsRow    = ( settings.returnKeySelectsRow !== undefined )    ? settings.returnKeySelectsRow    : true;
	__self.clickSelectsRow        = ( settings.clickSelectsRow !== undefined )        ? settings.clickSelectsRow        : true;
	__self.onRowSelection         = ( settings.onRowSelection !== undefined )         ? settings.onRowSelection         : undefined;
	__self.addStateToRowOnSelect  = ( settings.addStateToRowOnSelect !== undefined )  ? settings.addStateToRowOnSelect  : true;
	__self.selectFirstRowOnInit   = ( settings.selectFirstRowOnInit !== undefined )   ? settings.selectFirstRowOnInit   : false;
	if ( settings.exceptions == undefined || settings.exceptions == null ) { 
		settings.exceptions = {};
	}
	// if a exception function returns true then the key combination won't fire
	__self.upArrowException       = settings.exceptions.upArrow   || function() { return false; };
	__self.downArrowException     = settings.exceptions.downArrow || function() { return false; };
	__self.returnKeyException     = settings.exceptions.returnKey || function() { return false; };
	__self.allKeysException       = settings.exceptions.allKeys   || function() { return false; };


	__self.sorted     = {
		active    : null,
		direction : null
	};
	__self.focused         = false;
	__self.highlightedRow  = undefined;
	__self.selectedRow     = undefined;
	__self.activeFilters   = [];


	if ( __self.arrowKeysHighlightRows ) {
		__self.__upArrow = new UI_keyboard({
									combination : ["up arrow"],
									onPress     : function(e) {
										var previousRow;

										if ( __self.highlightedRow !== undefined && __self.highlightedRow.previousElementSibling !== null && __self.highlightedRow.previousElementSibling !== undefined && __self.highlightedRow.previousElementSibling !== __self.selectedRow ) {
											// if there is a highlighted row already, and it has a previous sibling that's not the currently selected row, then we use the highlight as our starting point
											previousRow = __self.__getPreviousRow( __self.highlightedRow );
											__self.highlightRow( previousRow );
										} else if ( __self.selectedRow !== undefined && __self.selectedRow.previousElementSibling !== null && __self.selectedRow.previousElementSibling !== undefined ) {
											// if there isn't currently a highlighted row, but there is selected row that has a previous sibling, that will be our starting point
											previousRow = __self.__getPreviousRow( __self.selectedRow );
											__self.highlightRow( previousRow );
										} else {
											// if there isn't a highlighted or selected row, we highlight the first row of the table
											previousRow = __self.el.querySelector("tbody tr");
											__self.highlightRow( previousRow );
										}

										// adjusts top
										var header     = document.querySelector("[data-js='details__positionSticky']");
										headerTop      = header.getBoundingClientRect().top + header.getBoundingClientRect().height;
										highlightedTop = previousRow.getBoundingClientRect().top;

										if ( headerTop > highlightedTop && previousRow !== null && previousRow !== undefined ) {
											highlightedTop = Math.abs( highlightedTop );
											var calcDiff   = Math.abs( headerTop - highlightedTop )
											var newTop     = document.querySelector("[data-js='appHuver__recDetails']").scrollTop - calcDiff;

											document.querySelector("[data-js='appHuver__recDetails']").scrollTop = newTop;
										}
									},
									exception : function() {
										var exception = false;
										if ( __self.upArrowException() || __self.allKeysException() ) {
											exception = true;
										}
										return exception;
									}
								});	
		__self.__downArrow = new UI_keyboard({
									combination : ["down arrow"],
									onPress     : function(e) {
										var nextRow;

										if ( __self.highlightedRow !== undefined && __self.highlightedRow.nextElementSibling !== null && __self.highlightedRow.nextElementSibling !== undefined && __self.highlightedRow.nextElementSibling !== __self.selectedRow ) {
											// if there is a highlighted row already, and it has a next sibling that's not the currently selected row, then we use the highlight as our starting point
											nextRow = __self.__getNextRow( __self.highlightedRow );
											__self.highlightRow( nextRow );
										} else if ( __self.selectedRow !== undefined && __self.selectedRow.nextElementSibling !== null && __self.selectedRow.nextElementSibling !== undefined ) {
											// if there isn't currently a highlighted row, but there is selected row that has a next sibling, that will be our starting point
											nextRow = __self.__getNextRow( __self.selectedRow );
											__self.highlightRow( nextRow );
										} else {
											// if there isn't a highlighted or selected row, we highlight the first row of the table
											nextRow = __self.el.querySelector("tbody tr");
											__self.highlightRow( nextRow );
										}


										var windowHeight      = window.innerHeight;
										var highlightedBottom = nextRow.getBoundingClientRect().bottom;

										if ( highlightedBottom > windowHeight && nextRow !== null && nextRow !== undefined ) {
											var calcDiff   = highlightedBottom - windowHeight;
											var newBottom  = document.querySelector("[data-js='appHuver__recDetails']").scrollTop + calcDiff;
											
											document.querySelector("[data-js='appHuver__recDetails']").scrollTop = newBottom;
										}

									},
									exception : function() {
										var exception = false;
										if ( __self.downArrowException() || __self.allKeysException() ) {
											exception = true;
										}
										return exception;
									}
								});	
	}

	if ( __self.returnKeySelectsRow ) {
		__self.__returnKey = new UI_keyboard({
									combination : ["enter"],
									onPress     : function( e ) {
										if ( __self.highlightedRow !== undefined ) {
											if ( __self.onRowSelection !== undefined ) {
												__self.selectRow( __self.highlightedRow );
											}
											e.stopPropagation();
										}
									},
									exception : function() {
										var exception = false;
										if ( __self.returnKeyException() || __self.allKeysException() ) {
											exception = true;
										}
										return exception;
									}
								});	
	}

	__self.initialize_module();
};


UI_table.prototype.__getNextRow = function( currentRow ) {
	var __self,nextRow;
	__self  = this;
	nextRow = currentRow.nextElementSibling;

	return nextRow;
};
UI_table.prototype.__getPreviousRow = function( currentRow ) {
	var __self,previousRow;
	__self      = this;
	previousRow = currentRow.previousElementSibling;

	return previousRow;
};
UI_table.prototype.focusTable = function() {
	var __self;
	__self = this;

	UI_DOM.addDataValue( __self.tbody,"data-ui-state","is__focused" );
	__self.focused = true;
};
UI_table.prototype.unfocusTable = function() {
	var __self;
	__self = this;

	UI_DOM.removeDataValue( __self.tbody,"data-ui-state","is__focused" );
	__self.focused = false;
};
UI_table.prototype.isTableFocused = function() {
	var __self;
	__self = this;

	return __self.focused;
};
UI_table.prototype.highlightRow = function( highlightRow ) {
	var __self,oldHighlightedRowPrevious,oldHightlightRowNext,newHighlightRowPrevious,newHighlightRowNext;
	__self                    = this;
	newHighlightRowPrevious   = highlightRow.previousElementSibling;
	newHighlightRowNext       = highlightRow.nextElementSibling;

	if ( __self.highlightedRow !== undefined ) {
		oldHighlightedRowPrevious = __self.highlightedRow.previousElementSibling;
		oldHightlightRowNext      = __self.highlightedRow.nextElementSibling;
		// there is currently a highlighted row, we neeed to unhighlight it
		if ( oldHighlightedRowPrevious !== null && oldHighlightedRowPrevious !== undefined ) {
			UI_DOM.removeDataValue( __self.highlightedRow.previousElementSibling,"data-ui-state","is__highlighted-step" );
		}
		UI_DOM.removeDataValue( __self.highlightedRow,"data-ui-state","is__highlighted" );
		if ( oldHightlightRowNext !== null && oldHightlightRowNext !== undefined ) {
			UI_DOM.removeDataValue( __self.highlightedRow.nextElementSibling,"data-ui-state","is__highlighted-step" );
		}
	}
	if ( newHighlightRowPrevious !== null && newHighlightRowPrevious !== undefined ) {
		UI_DOM.addDataValue( highlightRow.previousElementSibling,"data-ui-state","is__highlighted-step");
	}
	UI_DOM.addDataValue( highlightRow,"data-ui-state","is__highlighted" );
	if ( newHighlightRowNext !== null && newHighlightRowNext !== undefined ) {
		UI_DOM.addDataValue( highlightRow.nextElementSibling,"data-ui-state","is__highlighted-step");
	}
	__self.highlightedRow = highlightRow;
};
UI_table.prototype.unhighlightRow = function() {
	var __self;
	__self = this;

	if ( __self.highlightedRow !== undefined ) {
		// there is currently a highlighted row, we neeed to unhighlight it
		UI_DOM.removeDataValue( __self.highlightedRow,"data-ui-state","is__highlighted" );
	}
	__self.highlightedRow = undefined;
};
UI_table.prototype.currentHighlightedRow = function() {
	var __self;
	__self = this;

	return __self.highlightedRow;

};
UI_table.prototype.selectRow = function( selectRow ) {
	var __self;
	__self = this;
	if ( __self.addStateToRowOnSelect ) {
		if ( __self.selectedRow !== undefined ) {
			// there is currently a selected row that needs to be unselected
			UI_DOM.removeDataValue( __self.selectedRow,"data-ui-state","is__selected" );
		}
		UI_DOM.addDataValue( selectRow,"data-ui-state","is__selected" );
	}
	__self.selectedRow = selectRow;
	if ( __self.onRowSelection !== undefined ) {
		__self.onRowSelection( selectRow );
	}
};


UI_table.prototype.__filter = function() {
	var __self,activeFilters,totalActiveFilters;
	__self             = this;
	activeFilters      = __self.activeFilters;
	totalActiveFilters = activeFilters.length;

	if ( totalActiveFilters == 0 ) {
		__self.list.filter();
	} else {
		__self.list.filter(function(item) {
			var numberOfAppliedFilters = 0;
			for (var i = 0;i < totalActiveFilters; i++) {
				var currentFilter = activeFilters[i];
				if ( item.values()[currentFilter] !== "" ) {
					numberOfAppliedFilters ++;
				}
			}
			if ( numberOfAppliedFilters == totalActiveFilters ) {
				return true;
			}
		});
	}
	return;
};
UI_table.prototype.filter = function(toFilter) {
	var __self = this;

	__self.activeFilters.push( toFilter );
	__self.__filter();
};
UI_table.prototype.unfilter = function(toUnFilter) {
	var __self = this;
	if ( __self.activeFilters.indexOf( toUnFilter ) > -1 ) {
		var index = __self.activeFilters.indexOf( toUnFilter );

		__self.activeFilters.splice(index,1);
		__self.__filter();
	}
};
UI_table.prototype.sort = function(toSort,sortDirection) {
	var __self,old__activeSort,new__activeSort;
	__self = this;

	if ( __self.sorted.active == null) { 
		__self.sorted.active = toSort;
		if ( sortDirection == undefined ) {
			__self.sorted.direction = "asc";
		} else {
			__self.sorted.direction = sortDirection;
		}
		__self.el.querySelector("[data-sort='" + __self.sorted.active + "']").setAttribute("data-ui-state", "is__sortable-" + __self.sorted.direction);
		//this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + _self.sorted.active +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	} else if ( __self.sorted.active === toSort ) {
		if ( sortDirection == undefined ) {
			if ( __self.sorted.direction === "asc" ) {
				__self.sorted.direction = "desc";
			} else {
				__self.sorted.direction = "asc";
			}
		} else {
			__self.sorted.direction = sortDirection;
		}	
		__self.el.querySelector("[data-sort='" + __self.sorted.active +"']").setAttribute("data-ui-state", "is__sortable-" + __self.sorted.direction);
		//this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + _self.sorted.active +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	} else {
		old__activeSort      = __self.sorted.active;
		new__activeSort      = toSort;
		__self.sorted.active = toSort;

		if ( sortDirection == undefined ) {
			__self.sorted.direction = "asc";
		} else {
			__self.sorted.direction = sortDirection;
		}
		__self.el.querySelector("[data-sort='" + old__activeSort + "']").setAttribute("data-ui-state", "is__sortable" );
		__self.el.querySelector("[data-sort='" + new__activeSort +"']").setAttribute("data-ui-state", "is__sortable-" + __self.sorted.direction);
		// this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + old__activeSort +"']").attr("data-ui-state", "is__sortable");
		// this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + new__activeSort +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	}

	__self.list.sort(toSort,{order: __self.sorted.direction});
};
UI_table.prototype.search = function(toSearch) {
	var __self = this;
	__self.list.search(toSearch);
};
UI_table.prototype.clear = function() {
	var __self;
	__self = this;

	__self.list.search();
	__self.list.filter();
	__self.activeFilters = [];
};


UI_table.prototype.add = function(toAdd) {
	var __self = this;
	__self.list.add(toAdd);	
};
UI_table.prototype.remove = function(valueName,valueToRemove) {
	var __self = this;
	__self.list.remove(valueName, valueToRemove);	

};
UI_table.prototype.addRow = function(rowColumnArray,rowIndex) {

};
UI_table.prototype.removeRow = function(rowIndex) {

};






UI_table.prototype.initialize_module = function() {
	var __self,tableBody;
	__self = this;
	tableBody = __self.el.querySelector("tbody");

	UI_DOM.addClass( tableBody, "list" );

	__self.list = new List( __self.el , { valueNames : __self.valueNames });

	for ( var sort = 0, len = __self.sortEl.length; sort < len; sort++ ) {
		var currentSortEl = __self.sortEl[sort];
		UI_DOM.addDataValue( currentSortEl, "data-ui-state", "is__sortable");

		currentSortEl.addEventListener( 'click', function(e) {
			var sortEl,toSort;
			sortEl = e.currentTarget;
			toSort = sortEl.dataset.sort;

			__self.sort( toSort );
		});
	}
	for ( var search = 0, len = __self.searchEl.length; search < len; search++ ) {
		var currentSearchEl = __self.searchEl[search];

		currentSearchEl.addEventListener( 'keyup', function(e) {
			var searchEl,toSearch;
			searchEl = e.currentTarget;
			toSearch = searchEl.value;

			__self.search( toSearch );
		});
	}

	// adds event listenters for click/hover events if the settings ask for them
	if ( __self.clickSelectsRow ) {
		// select table row on click
		tableBody.addEventListener( 'click', function(e) {
			var clicked = e.target.parentElement;
			if ( clicked.tagName == "TR" ) {
				if ( __self.highlightedRow !== undefined ) {
					if ( __self.onRowSelection !== undefined ) {
						__self.selectRow( __self.highlightedRow );
					}
					e.stopPropagation();
				}
			}
		});
	}

	if ( __self.hoverHighlightsRows ) {
		// highlights table rows on mouseover
		tableBody.addEventListener( "mouseover", function(e) {
			var hovered = e.target.parentElement;

			if ( hovered.tagName == "TR" && hovered !== __self.highlightedRow ) {
				__self.highlightRow( hovered );
			}
		});
	}
};