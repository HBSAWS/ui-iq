$(document).ready(function() {
    var $recordsTable = $("[data-js-target~='recordsTable']");
    var $detailsTable = $("[data-js-target~='detailsTable']");
	var recordsTable = '';
	var detailsTable = '';

	$.get( "/api", function( data ) {
		var recordsLength = data.length;
		var listOptions;

		var listOptions = {
			valueNames: [ 'field', 'error', 'content' ]
		};

		for(var i=0;i < recordsLength;i++) {
			var record    = data[i].record;
			var firstName = record.name.firstName;
			var lastName  = record.name.lastName;

			
			listOptions.valueNames.push("forRecord__" + firstName + '-' + lastName);

			var recordRow = '<tr class="table-body-row" data-recordID="' + firstName + '-' + lastName + '" data-js-handler="filter__details-table">' +
				'<td class="table-body-row-cell">' + firstName + '</td>' +
				'<td class="table-body-row-cell">' + lastName + '</td>' +
			'</tr>';
			recordsTable += recordRow;

			var detailRow = '' +
			'<tr class="table-body-row field__usaCitizen">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">usaCitizen</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell ontent forRecord__' + firstName + '-' + lastName + '">' + record.citizenship.usaCitizen + '</td>' +
			'</tr>' +
			'<tr class="table-body-row field__citizenshipStatus forRecord__' + firstName + '-' + lastName + '">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">citizenshipStatus</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell content forRecord__' + firstName + '-' + lastName + '">' + record.citizenship.citizenshipStatus + '</td>' +
			'</tr>' +
			'<tr class="table-body-row field__address forRecord__' + firstName + '-' + lastName + '">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">address</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell content forRecord__' + firstName + '-' + lastName + '">' + record.mailAddress.address + '</td>' +
			'</tr>' +
			'<tr class="table-body-row field__city forRecord__' + firstName + '-' + lastName + '">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">city</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell content forRecord__' + firstName + '-' + lastName + '">' + record.mailAddress.city + '</td>' +
			'</tr>' +
			'<tr class="table-body-row field__state forRecord__' + firstName + '-' + lastName + '">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">state</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell content forRecord__' + firstName + '-' + lastName + '">' + record.mailAddress.state + '</td>' +
			'</tr>' +
			'<tr class="table-body-row field__postal forRecord__' + firstName + '-' + lastName + '">' +
				'<td class="table-body-row-cell field forRecord__' + firstName + '-' + lastName + '">postal</td>' +
				'<td class="table-body-row-cell error forRecord__' + firstName + '-' + lastName + '">' + 'no error' + '</td>' +
				'<td class="table-body-row-cell content forRecord__' + firstName + '-' + lastName + '">' + record.mailAddress.postal + '</td>' +
			'</tr>';			
			detailsTable += detailRow;
		}

		$recordsTable.append(recordsTable);
		$detailsTable.append(detailsTable);

		$("#detailsTable").basictable({
			breakpoint : 480
		});









        var detailsList = new List('users', listOptions);

        var sortDetailsTable = function(toSort) {
			detailsList.sort(toSort, { order: "asc" });
		};

        var filterDetailsTable = function(filter) {
        	var toFilter = filter;
        	detailsList.filter(function(item) {
				return item.values()[toFilter] !== "";
        	});
			return false;
        };

        $("[name='mobile__sort-details']").on("change", function() {
        	var toSort = $("[name='mobile__sort-details']:checked").val();

        	sortDetailsTable(toSort);
		});








        $('[data-js-handler~="filter__details-table"]').on("click", function() {
        	var $this = $(this);

        	var toFilter = "forRecord__" + $this.attr("data-recordid");
        	filterDetailsTable(toFilter);
        });




        $('[data-js-target~="init_toggler"]').each(function() {
			UI.toggler($(this));
        });

        var $panelsFiles = $('[data-js-target~="file_panels"]');
        UI.panels($panelsFiles, {
        	core : {
        		mode : "split"
        	},
        	panels : {
        		panels : ["zero","one","two","three","four"],
        		first  : ["zero","secondary"],
        		second : ["one","primary"]
        	}
        });
        
        var $panelsApp = $('[data-js-target~="app_panels"]');
        UI.panels($panelsApp, {
        	core : {
        		mode : "full"
        	},
        	panels : {
        		panels : ["appModal","appStage"],
        		first  : ["appStage","primary"]
        	}
        });

		$("[data-js-handler~='filter__details-table']").on("click", function() {
			if ($(window).width() < 1200) {
				var panelsFiles = $panelsFiles.data("UI");
				panelsFiles.switchPanels("one","swap","right");
			}
		});
		$("[data-js-target~='back_toRecords']").on("click", function() {
			if ($(window).width() < 1200) {
				var panelsFiles = $panelsFiles.data("UI");
				panelsFiles.switchPanels("zero","swap","right");
			}
		});
	});



























	$('.front a').on('click', function(){
	    $('#nav-box').removeShowClasses().addClass('show-bottom').children('div').addClass('done');
	});
	$('.bottom a').on('click', function(){
	    $('#nav-box').removeShowClasses().addClass('show-back').children('div').addClass('done');
	});
	$('.back a').on('click', function(){
	    $('#nav-box').removeShowClasses().addClass('show-top').children('div').addClass('done');
	});
	$('.top a').on('click', function(){
	    $('#nav-box').removeShowClasses().addClass('show-back rewind');
	    setTimeout(function(){
	        $('#nav-box').removeShowClasses().addClass('show-bottom');
	    }, 500);
	    setTimeout(function(){
	        $('#nav-box').removeShowClasses().addClass('show-front').removeClass('rewind');
	    }, 1000);
	});
	    
	jQuery.fn.removeShowClasses = function() {
	    $(this).removeClass('show-front show-back show-top show-bottom done');
	    return $(this);
	};
});