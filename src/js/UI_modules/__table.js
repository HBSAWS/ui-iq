function UI_table(DOMelement, settings) {
	this.core = {
		size : "large"
	};
	this.tableID         = settings.tableID;
	this.listObject      = null;
	this.valueNames      = settings.valueNames;
	this.searchHandlerID = settings.searchHandlerID; 
	this.sortHandlerID   = settings.sortHandlerID;
	this.filterHandlerID = settings.filterHandlerID;
	this.sorted = {
		active    : null,
		direction : null
	};
	this.activeFilters   = [];

	_UI.call(this,DOMelement,settings);
};

UI_table.prototype = Object.create(_UI.prototype);

UI_table.prototype.initialize_module = function(settings) {
	var _self      = this;
	var tableID    = this.tableID;
	var valueNames = this.valueNames;
	this.$el.find("tbody").addClass(tableID);

	this.list = new List(tableID,{
		valueNames : valueNames,
		listClass  : tableID
	});

	
	$("[data-js-handler~='" + this.sortHandlerID + "']")
		.attr("data-ui-state", "is__sortable")
		.on("click", function() {
			var $this = $(this);
			var toSort = $this.attr("data-sort");
			_self.sort(toSort);
		});
	$("[data-js-handler~='" + this.searchHandlerID + "']").on("keyup", function() {
		var toSearch = $(this).val();
		_self.search(toSearch);
	});
};
UI_table.prototype.__filter = function() {
	var activeFilters,totalActiveFilters;
	activeFilters      = this.activeFilters;
	totalActiveFilters = activeFilters.length;

	if ( totalActiveFilters == 0 ) {
		this.list.filter();
	} else {
		this.list.filter(function(item) {
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
	this.activeFilters.push(toFilter);

	this.__filter();
};
UI_table.prototype.unfilter = function(toUnFilter) {
	if ( this.activeFilters.indexOf(toUnFilter) > -1 ) {
		var index = this.activeFilters.indexOf(toUnFilter);
		this.activeFilters.splice(index,1);

		this.__filter();
	}
};
UI_table.prototype.sort = function(toSort,sortDirection) {
	var _self,old__activeSort,new__activeSort;
	_self = this;

	if ( this.sorted.active == null) { 
		this.sorted.active = toSort;
		if ( sortDirection == undefined ) {
			this.sorted.direction = "asc";
		} else {
			this.sorted.direction = sortDirection;
		}
		this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + _self.sorted.active +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	} else if ( this.sorted.active === toSort ) {
		if ( sortDirection == undefined ) {
			if ( this.sorted.direction === "asc" ) {
				this.sorted.direction = "desc";
			} else {
				this.sorted.direction = "asc";
			}
		} else {
			this.sorted.direction = sortDirection;
		}	
		this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + _self.sorted.active +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	} else {
		old__activeSort  = this.sorted.active;
		new__activeSort  = toSort;
		this.sorted.active = toSort;

		if ( sortDirection == undefined ) {
			this.sorted.direction = "asc";
		} else {
			this.sorted.direction = sortDirection;
		}
		this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + old__activeSort +"']").attr("data-ui-state", "is__sortable");
		this.$el.find("[data-js-handler~='" + this.sortHandlerID + "'][data-sort='" + new__activeSort +"']").attr("data-ui-state", "is__sortable-" + _self.sorted.direction);
	}


	this.list.sort(toSort,{order: _self.sorted.direction});
};
UI_table.prototype.search = function(toSearch) {
	this.list.search(toSearch);
};
UI_table.prototype.clear = function() {
	this.list.search();
	this.list.filter();
	this.activeFilters = [];
};


UI_table.prototype.add = function(toAdd) {
	this.list.add(toAdd);	
};
UI_table.prototype.remove = function(valueName,valueToRemove) {
	this.list.remove(valueName, valueToRemove);	

};
UI_table.prototype.addRow = function(rowColumnArray,rowIndex) {

};
UI_table.prototype.removeRow = function(rowIndex) {

};