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
	__self.tableName  = settings.tableName;
	__self.valueNames = settings.valueNames;
	__self.searchEl   = settings.searchElements; 
	__self.sortEl     = settings.sortElements;
	__self.filterEl   = settings.filterElements;


	__self.arrowKeysHighlightRows            = ( settings.arrowKeysHighlightRows !== undefined )            ? settings.arrowKeysHighlightRows            : true;
	__self.scrollAdjustmentOnArrowNavigation = ( settings.scrollAdjustmentOnArrowNavigation !== undefined ) ? settings.scrollAdjustmentOnArrowNavigation : true;
	__self.scrollAdjustmentOffsetTop         = ( settings.scrollAdjustmentOffsetTop !== undefined )         ? settings.scrollAdjustmentOffsetTop         : undefined;
	__self.scrollAdjustmentOffsetBottom      = ( settings.scrollAdjustmentOffsetBottom !== undefined )      ? settings.scrollAdjustmentOffsetBottom      : undefined;
	__self.scrollingElement                  = ( settings.scrollingElement !== undefined )                  ? settings.scrollingElement                  : undefined;


	__self.hoverHighlightsRows               = ( settings.hoverHighlightsRows !== undefined )               ? settings.hoverHighlightsRows    : true;
	__self.hoverFocusesTable                 = ( settings.hoverFocusesTable !== undefined )                 ? settings.hoverFocusesTable      : true;
	__self.returnKeySelectsRow               = ( settings.returnKeySelectsRow !== undefined )               ? settings.returnKeySelectsRow    : true;
	__self.clickSelectsRow                   = ( settings.clickSelectsRow !== undefined )                   ? settings.clickSelectsRow        : true;
	__self.onRowSelection                    = ( settings.onRowSelection !== undefined )                    ? settings.onRowSelection         : undefined;
	__self.addStateToRowOnSelect             = ( settings.addStateToRowOnSelect !== undefined )             ? settings.addStateToRowOnSelect  : true;
	__self.selectFirstRowOnInit              = ( settings.selectFirstRowOnInit !== undefined )              ? settings.selectFirstRowOnInit   : false;

	if ( settings.exceptions == undefined || settings.exceptions == null ) { 
		settings.exceptions = {};
	}
	// if a exception function returns true then the key combination won't fire
	__self.upArrowException         = ( settings.exceptions.upArrow !== undefined )   ? settings.exceptions.upArrow   : function() { return false; };
	__self.downArrowException       = ( settings.exceptions.downArrow !== undefined ) ? settings.exceptions.downArrow : function() { return false; };
	__self.returnKeyException       = ( settings.exceptions.returnKey !== undefined ) ? settings.exceptions.returnKey : function() { return false; };
	__self.allKeysException         = ( settings.exceptions.allKeys !== undefined )   ? settings.exceptions.allKeys   : function() { return false; };

	__self.sortingRadioButtons      = document.querySelectorAll("[name='" + __self.tableName + "']");
	__self.foundSortingRadioButtons = ( __self.sortingRadioButtons.length == 0 ) ? false : true;
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

										
										if ( __self.scrollAdjustmentOnArrowNavigation ) {
											var scrollingElement = __self.scrollingElement;
											var offset           = ( __self.scrollAdjustmentOffsetTop !== undefined ) ? __self.scrollAdjustmentOffsetTop() + 0 : 0;
											var highlightedTop   = previousRow.getBoundingClientRect().top;
											// if the top of the highlighted item is less than 0 ( or 0 + the offset ), then we know it's past that point and needs to be adjusted
											if ( offset > highlightedTop ) {
												highlightedTop     = Math.abs ( highlightedTop );
												var calcDifference = Math.abs( offset - highlightedTop );
												var newTop         = scrollingElement.scrollTop - calcDifference;

												scrollingElement.scrollTop = newTop;
											}
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


										if ( __self.scrollAdjustmentOnArrowNavigation ) {
											var scrollingElement  = __self.scrollingElement;
											var offset            = ( __self.scrollAdjustmentOffsetBottom !== undefined ) ? window.innerHeight - __self.scrollAdjustmentOffsetTop() : window.innerHeight;
											var highlightedBottom = nextRow.getBoundingClientRect().bottom;

											if ( highlightedBottom > offset ) {
												var calcDifference = highlightedBottom - offset;
												var newBottom      = scrollingElement.scrollTop + calcDifference;
												
												scrollingElement.scrollTop = newBottom;
											}
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


// THESE ARE SPECIFIC TO THE LIST.JS API  ** START **
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
	var __self,oldSortingRadioButton,oldSortingRadioButtonDisplay,newSortingRadioButton,newSortingRadioButtonDisplay,newSortElement,oldSortElement,oldSortValue,oldSortDirection,newSortValue,newSortDirection;
	__self         = this;
	newSortValue   = toSort;

	if ( __self.sorted.active == null) { // SINGLE DOM ELEMENT TO UPDATE - NO VALUE TO REMOVE - VALUE TO ADD
		// if nothing has been sorted yet, this means:
			// there is no active sort value
			// there is no sort direction yet
			// there is no DOM elmement with a sorted state
		oldSortElement   = "none";
		oldSortValue     = undefined;
		newSortDirection = 'asc';
	} else if ( __self.sorted.active === toSort ) { // SINGLE DOM ELEMENT TO UPDATE - VALUE TO REMOVE - VALUE TO ADD
		// if the current sort value is the same as the new sort value
		oldSortElement = "same";
		if ( sortDirection == undefined ) {
			// if the user gives no direction they want to sort it, we simply go in the opposite direction of the active sort direction
			if ( __self.sorted.direction === "asc" ) {
				oldSortDirection = "asc";
				newSortDirection  = "desc";
			} else {
				oldSortDirection = "desc";
				newSortDirection  = "asc";
			}
		} else {
			oldSortDirection = __self.sorted.direction;
			newSortDirection  = sortDirection;
		}	

		oldSortValue = __self.sorted.active;
	} else { // TWO DOM ELEMENTS TO UPDATE - BOTH WITH VALUE TO REMOVE - BOTH WITH VALUE TO ADD
		oldSortElement    = "different";
		oldSortValue      = __self.sorted.active;
		oldSortDirection = __self.sorted.direction;

		if ( sortDirection == undefined ) {
			newSortDirection = "asc";
		} else {
			newSortDirection = sortDirection;
		}
	}

	// we update the DOM elements
	if ( oldSortElement === "same" ) {
		newSortElement = __self.el.querySelector("[data-sort='" + oldSortValue +"']");
		if ( __self.foundSortingRadioButtons ) {
			newSortingRadioButton        = document.querySelector( "[name='" + __self.tableName + "'][value='" + oldSortValue + "']" );
			newSortingRadioButtonDisplay = newSortingRadioButton.nextElementSibling;

			newSortingRadioButton.checked = true;
			UI_DOM.removeDataValue( newSortingRadioButtonDisplay, "data-ui-state", "is__sorted-" + oldSortDirection );
			UI_DOM.addDataValue( newSortingRadioButtonDisplay, "data-ui-state", "is__sorted-" + newSortDirection );			
		}

		UI_DOM.removeDataValue( newSortElement, "data-ui-state", "is__sorted-" + oldSortDirection );
		UI_DOM.addDataValue( newSortElement, "data-ui-state", "is__sorted-" + newSortDirection );
	} else if ( oldSortElement === "different" ) {
		oldSortElement = __self.el.querySelector("[data-sort='" + oldSortValue +"']");
		newSortElement = __self.el.querySelector("[data-sort='" + newSortValue +"']");
		if ( __self.foundSortingRadioButtons ) {
			oldSortingRadioButton        = document.querySelector( "[name='" + __self.tableName + "'][value='" + oldSortValue + "']" );
			oldSortingRadioButtonDisplay = oldSortingRadioButton.nextElementSibling;

			newSortingRadioButton        = document.querySelector( "[name='" + __self.tableName + "'][value='" + newSortValue + "']" );
			newSortingRadioButtonDisplay = newSortingRadioButton.nextElementSibling;

			oldSortingRadioButton.checked = false;
			UI_DOM.removeDataValue( oldSortingRadioButtonDisplay, "data-ui-state", "is__sorted-" + oldSortDirection );

			newSortingRadioButton.checked = true;
			UI_DOM.addDataValue( newSortingRadioButtonDisplay, "data-ui-state", "is__sorted-" + newSortDirection );			
		}

		UI_DOM.removeDataValue( oldSortElement, "data-ui-state", "is__sorted-" + oldSortDirection );
		UI_DOM.addDataValue( oldSortElement, "data-ui-state", "is__sortable" );

		UI_DOM.removeDataValue( newSortElement, "data-ui-state", "is__sortable" );
		UI_DOM.addDataValue( newSortElement, "data-ui-state", "is__sorted-" + newSortDirection );
	} else {
		newSortElement = __self.el.querySelector("[data-sort='" + newSortValue +"']");
		if ( __self.foundSortingRadioButtons ) {
			newSortingRadioButton        = document.querySelector( "[name='" + __self.tableName + "'][value='" + newSortValue + "']" );
			newSortingRadioButtonDisplay = newSortingRadioButton.nextElementSibling;

			newSortingRadioButton.checked = true;
			UI_DOM.addDataValue( newSortingRadioButtonDisplay, "data-ui-state", "is__sorted-" + newSortDirection );			
		}

		UI_DOM.removeDataValue( newSortElement, "data-ui-state", "is__sortable" );
		UI_DOM.addDataValue( newSortElement, "data-ui-state", "is__sorted-" + newSortDirection );
	}

	// we update the table list object, which will update our table body DOM element's contents for us
	__self.list.sort(toSort,{ order: newSortDirection });


	// we update the table UI object's sort tracking object
	__self.sorted.active    = newSortValue;
	__self.sorted.direction = newSortDirection;
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
UI_table.prototype.remove = function(valueName,valueToRemove,toAnimate,callback) {
	var __self = this;
	
	if ( toAnimate ) {
		var selectedField = __self.list.get(valueName, valueToRemove)[0].elm;

		selectedField.style.transition = "transform 0.6s cubic-bezier(.43,0,0,1), filter 0.6s cubic-bezier(.43,0,0,1) !important";
		var newHeight = selectedField.clientHeight;
		var tds = selectedField.querySelectorAll("td");
		for ( var td = 0, totalTds = tds.length; td < totalTds; td++ ) {
			var currentTd = tds[td];
			var wrapper = document.createElement('div');
			wrapper.style.transition = "max-height 0.46s cubic-bezier(.43,0,0,1), padding 0.46s cubic-bezier(.43,0,0,1)";
			wrapper.style.padding    = "11px 50px";
			wrapper.style.maxHeight  = newHeight + "px";
			wrapper.style.overflow   = "hidden";
			wrapper.offsetWidth;
			currentTd.style.padding  = "0px";

			currentTd.appendChild(wrapper);
			while ( currentTd.firstChild !== wrapper ) {
				wrapper.appendChild( currentTd.firstChild );
			}
		}

		var deleteError = function(e) {
			// check to make sure the event is for the selectedElement, not a child element
			if ( e.target == e.currentTarget ) {
				selectedField.removeEventListener( 'webkitTransitionEnd', deleteError );
				selectedField.style.transition = "transform 0.38s cubic-bezier(.43,0,0,1), filter 0.38s cubic-bezier(.43,0,0,1)";
				__self.list.remove(valueName, valueToRemove);

				e.stopPropagation();
				if ( callback !== undefined ) {
					callback();
				}
			}
		}

		selectedField.addEventListener( 'webkitTransitionEnd', deleteError);

		UI.DOM.addDataValue( selectedField,"data-ui-state","is__deleting" );
	} else {
		__self.list.remove(valueName, valueToRemove);	
	}

};


UI_table.prototype.get = function(valueName, value) {
	var __self;
	__self = this;
	return __self.get(valueName, value);
};
// THESE ARE SPECIFIC TO THE LIST.JS API  ** FINISH **





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

	if ( __self.foundSortingRadioButtons ) {
		for ( var radioButton = 0, totalRadioButtons = __self.sortingRadioButtons.length; radioButton < totalRadioButtons; radioButton++ ) {
			var currentRadioButton = __self.sortingRadioButtons[radioButton];

			currentRadioButton.addEventListener( 'click', function(e) {
				__self.sort( e.currentTarget.value );
			});	
		}
	}
};