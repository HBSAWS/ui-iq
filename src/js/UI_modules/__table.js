function UI_table(DOMelement, settings) {
	var __self = this;

	__self.el   = DOMelement;
	__self.core = {
		size : "large"
	};
	__self.list       = null;
	__self.valueNames = settings.valueNames;
	__self.searchEl   = settings.searchElements; 
	__self.sortEl     = settings.sortElements;
	__self.filterEl   = settings.filterElements;
	__self.sorted     = {
		active    : null,
		direction : null
	};
	__self.activeFilters = [];

	__self.initialize_module();
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
		__self.el.querySelector("[data-sort='" + __self.sorted.active +"']").setAttribute("data-ui-state", "is__sortable-" + __self.sorted.direction);
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
	//this.$el.find("tbody").addClass(tableID);

	__self.list = new List( __self.el , {
		valueNames : __self.valueNames
		//listClass  : __self.tableID
	});

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
	// $("[data-js~='" + this.sortHandlerID + "']")
	// 	.attr("data-ui-state", "is__sortable")
	// 	.on("click", function() {
	// 		var $this = $(this);
	// 		var toSort = $this.attr("data-sort");
	// 		_self.sort(toSort);
	// 	});
	for ( var search = 0, len = __self.searchEl.length; search < len; search++ ) {
		var currentSearchEl = __self.searchEl[search];

		currentSearchEl.addEventListener( 'keyup', function(e) {
			var searchEl,toSearch;
			searchEl = e.currentTarget;
			toSearch = searchEl.value;

			__self.search( toSearch );
		});
	}

	// $("[data-js-handler~='" + this.searchHandlerID + "']").on("keyup", function() {
	// 	var toSearch = $(this).val();
	// 	_self.search(toSearch);
	// });
};