$(document).ready(function() {
    var $recordsTable = $("[data-js-target~='recordsTable']");
    var $detailsTable = $("[data-js-target~='detailsTable']");
	var recordsTable = '';
	var detailsTable = '';


	var fileOptionsPopover = '' +
		'<div data-ui-core="padding__mobile-horizontal-sm padding__mobile-top-xs" class="layout">' +
		    '<div id="file_options" data-ui-core="mode__segmentcontrol size__small" data-ui-grid="mobile__6" data-js-target="init_toggler" class="toggler_bold" data-ui-state="is__checked">' +
		        '<input data-ui-core="mode__segmentcontrol size__small" type="radio" name="file-options__nav" value="settings" class="toggler-input_bold" data-ui-state="is__checked" checked>' +
		        '<div data-ui-core="mode__segmentcontrol size__small" class="toggler-toggle_bold" data-ui-state="is__checked">' +
		            '<div data-ui-core="mode__segmentcontrol size__small" class="toggler-toggle-indicator_bold" data-ui-state="is__checked">Settings</div>' +
		        '</div>' +
		    '</div>' +
		    '<div id="file_stats" data-ui-core="mode__segmentcontrol size__small" data-ui-grid="mobile__6" data-js-target="init_toggler" class="toggler_bold" data-ui-state="">' +
		        '<input data-ui-core="mode__segmentcontrol size__small" type="radio" name="file-options__nav" value="stats" class="toggler-input_bold" data-ui-state="">' +
		        '<div data-ui-core="mode__segmentcontrol size__small" class="toggler-toggle_bold" data-ui-state="">' +
		            '<div data-ui-core="mode__segmentcontrol size__small" class="toggler-toggle-indicator_bold" data-ui-state="">Stats</div>' +
		        '</div>' +
		    '</div>' +
		'</div>';
	var $fileOptionsPopover = $(fileOptionsPopover);
	UI.toggler($fileOptionsPopover.find("#file_settings"));
	UI.toggler($fileOptionsPopover.find("#file_stats"));
	$('[data-js-target~="file-options__toggle"]').webuiPopover({title:'File Summary',content:$fileOptionsPopover});








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



	








        var $filePanels = $('#users');
        UI.panels($filePanels, [
    		{
    			id       : "zero",
    			mode     : "card",
    			size     : 4,
    			position : 0,
    			active   : true
    		},
    		{
    			id       : "one",
    			mode     : "card",
    			size     : 8,
    			position : 4,
    			active   : true
    		},
    		{
    			id       : "two",
    			mode     : "card",
    			size     : "medium",
    			position : -1,
    			active   : false
    		},
    		{
    			id       : "three",
    			mode     : "card",
    			size     : 8,
    			position : -1,
    			active   : false
    		},
    		{
    			id       : "four",
    			mode     : "modal",
    			size     : 8,
    			position : -1,
    			active   : false
    		}
    	]);
		var responsiveFilePanels = function() {
			var switchedToMobile = false;
			var windowWidth      = $(window).width();
			var filePanels = $('#users').data("UI");

			if (windowWidth <= 950) {
				switchedToMobile = true;

				filePanels.panel("zero",{
					id       : "zero",
					mode     : "card",
					size     : 12,
					position : 0,
					active   : true
				});
				filePanels.panel("one",{
					id       : "one",
					mode     : "card",
					size     : 12,
					position : -1,
					active   : false
				});
			} else if ( windowWidth > 950 && windowWidth <= 1200 ) {
				switchedToMobile = false;

				filePanels.panel("zero",{
					id       : "zero",
					mode     : "card",
					size     : 5,
					position : 0,
					active   : true
				});
				filePanels.panel("one",{
					id       : "one",
					mode     : "card",
					size     : 7,
					position : 5,
					active   : true
				});
			} else if ( windowWidth > 1200 ) {
				switchedToMobile = false;

				filePanels.panel("zero",{
					id       : "zero",
					mode     : "card",
					size     : 4,
					position : 0,
					active   : true
				});
				filePanels.panel("one",{
					id       : "one",
					mode     : "card",
					size     : 8,
					position : 4,
					active   : true
				});
			}
		};
		responsiveFilePanels();
		$(window).on("resize", function() {
			responsiveFilePanels();
		});

		var $panelsApp = $("[data-js-target~='app_panels']");
		UI.panels($panelsApp, [
        		{
        			id       : "appModal",
        			mode     : "modal",
        			size     : 8,
        			position : 2,
        			active   : false
        		},
        		{
        			id       : "appStage",
        			mode     : "flush",
        			size     : 12,
        			position : 0,
        			active   : true
        		}
		]);

		var $panelsSkeleton = $("[data-js-target~='global_panels']");
		UI.panels($panelsSkeleton, [
        		{
        			id       : "appsGrid",
        			mode     : "flush",
        			size     : 12,
        			position : -1,
        			active   : false
        		},
        		{
        			id       : "skeletonStage",
        			mode     : "flush",
        			size     : 12,
        			position : 0,
        			active   : true
        		}
		]);

		$("[data-js-handler~='filter__details-table']").on("click", function() {
			if ($(window).width() < 950) {
				var panelsFiles = $('[data-js-target~="file_panels"]').data("UI");
				panelsFiles.swap("zero","one",true,"right");
			}
		});
		$("[data-js-target~='back_toRecords']").on("click", function() {
			if ($(window).width() < 950) {
				var panelsFiles = $('[data-js-target~="file_panels"]').data("UI");
				panelsFiles.swap("one","zero",true,"right");
			}
		});
	});
	






    $('[data-js-target~="init_toggler"]').each(function() {
		UI.toggler($(this));
    });

    var nav = UI.cuboid($("[data-js-target~='init__cuboid']"));


















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