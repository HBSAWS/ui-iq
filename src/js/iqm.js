$(document).ready(function() {
	var App;
	var selector = "[data-js-target~='";
    var $recordsTable = $("[data-js-target~='recordsTable']");
    var $detailsTable = $("[data-js-target~='detailsTable']");
	var recordsTable = '';
	var detailsTable = '';
	var stats = {
		records : 0,
		EC      : 0,
		RC      : 0
	};

	var __templates = {
		UI : {
			toggler : function(mode,size,width,jsHook,type,name,value,state,content) {
				var HTML = '' +
					'<div id="file_options" data-ui-core="mode__' + mode + ' size__' + size + '" data-ui-grid="mobile__' + width + '" class="toggler_bold">' +
						'<input data-js-target="' + jsHook + '" data-ui-core="mode__' + mode + ' size__' + size + '" type="' + type + '" name="' + name + '" value="' + value + '" class="toggler-input_bold" ' + state + '>' +
						'<div data-ui-core="mode__' + mode + ' size__' + size + '" class="toggler-toggle_bold">' +
							'<div data-ui-core="mode__' + mode + ' size__' + size + '" class="toggler-toggle-indicator_bold">' + content + '</div>' +
						'</div>' +
					'</div>';

				return HTML;
			}
		},
		app : {
			fileSummary : {
				title    : function () {
					var togglerTemplate,segmentcontrol__settings,segmentcontrol__stats,HTML;

					togglerTemplate = __templates.UI.toggler;

					segmentcontrol__settings = togglerTemplate("segmentcontrol","small","6","show__fileSummary-settings-panel","radio","file-summary__settings-toggle","settings","checked","Settings");
					segmentcontrol__stats    = togglerTemplate("segmentcontrol","small","6","show__fileSummary-stats-panel","radio","file-summary__settings-toggle","stats","","Stats");

					HTML = '' +
					'File Summary' +
					'<div class="popover-title-nav">' +
						segmentcontrol__settings +
						segmentcontrol__stats +
					'</div>';

					return HTML;
				},
				bodyHTML : function () {
					var togglerTemplate,segmentcontrol__doctoral,segmentcontrol__MBA,segmentcontrol__admit,segmentcontrol__bio,segmentcontrol__fall,segmentcontrol__spring,segmentcontrol__prev,segmentcontrol__2015,segmentcontrol__2016,segmentcontrol__2017,segmentcontrol__2018,segmentcontrol__2019,HTML;

					togglerTemplate = __templates.UI.toggler;

					segmentcontrol__doctoral = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__programs-toggle","doctoral","checked","Doctoral");
					segmentcontrol__MBA      = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__programs-toggle","MBA","","MBA");

					segmentcontrol__admit    = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__department-toggle","admit","","Admit");
					segmentcontrol__bio      = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__department-toggle","bio","checked","Bio");

					segmentcontrol__fall     = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__semester-toggle","fall","","Fall");
					segmentcontrol__spring   = togglerTemplate("segmentcontrol","large","6","file-summary__segmentcontrol","radio","file-summary__semester-toggle","spring","checked","Spring");

					segmentcontrol__prev     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","fall","","prev");
					segmentcontrol__2015     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","2015","checked","'15");
					segmentcontrol__2016     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","2016","","'16");
					segmentcontrol__2017     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","2017","","'17");
					segmentcontrol__2018     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","2018","","'18");
					segmentcontrol__2019     = togglerTemplate("segmentcontrol","large","2","file-summary__segmentcontrol","radio","file-summary__year-toggle","2019","","'19");


					HTML = '' +
					'<div class="panels_" data-js-target="panels__fileSummary">' +
						'<div id="panel__fileSummary-settings" class="panels-panel_">' +
							'<div class="panels-panel-content__default">' +
								'<div class="panels-panel-content-fader"></div>' +
								'<div data-ui-core="padding__mobile-horizontal-sm padding__mobile-top-sm" class="layout">' +
									segmentcontrol__doctoral +
									segmentcontrol__MBA +
								'</div>' +
								'<div data-ui-core="padding__mobile-horizontal-sm padding__mobile-top-sm" class="layout">' +
									segmentcontrol__admit +
									segmentcontrol__bio +
								'</div>' +
								'<div data-ui-core="padding__mobile-horizontal-sm padding__mobile-top-sm" class="layout">' +
									segmentcontrol__fall +
									segmentcontrol__spring +
								'</div>' +
								'<div data-ui-core="padding__mobile-horizontal-sm padding__mobile-top-sm" class="layout">' +
									segmentcontrol__prev +
									segmentcontrol__2015 +
									segmentcontrol__2016 +
									segmentcontrol__2017 +
									segmentcontrol__2018 +
									segmentcontrol__2019 +
								'</div>' +
								'<div data-ui-core="padding__mobile-left-sm padding__mobile-right-xs padding__mobile-top-xl padding__mobile-bottom-md" data-ui-grid="mobile__6" class="layout">' +
									'<button class="button__default" data-ui-core="size__small" data-ui-grid="mobile__12">' +
										'<div class="button-content_" data-ui-core="size__small">download CSV</div>' +
									'</button>' +
								'</div>' +
								'<div data-ui-core="padding__mobile-left-xs padding__mobile-right-sm padding__mobile-top-xl padding__mobile-bottom-md" data-ui-grid="mobile__6" class="layout">' +
									'<button class="button__default" data-ui-core="size__small" data-ui-grid="mobile__12">' +
										'<div class="button-content_" data-ui-core="size__small">send file</div>' +
									'</button>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div id="panel__fileSummary-stats" class="panels-panel_">' +
							'<div class="panels-panel-content__default">' +
								'<div class="panels-panel-content-fader"></div>' +
								'<div class="layout">' +
									'<table class="table_" data-ui-core="size__small">' +
										'<thead class="table-head_" data-ui-core="size__small">' +
											'<tr class="table-head-row_" data-ui-core="size__small">' +
												'<th class="table-head-row-header_" data-ui-core="size__small"></th>' +
												'<th class="table-head-row-header_" data-ui-core="size__small">Last</th>' +
												'<th class="table-head-row-header_" data-ui-core="size__small">Current</th>' +
											'</tr>' +
										'</thead>' +
										'<tbody class="table-body_" data-ui-core="size__small">' +
											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small">Records</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">500</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">600</td>' +
											'</tr>' +
											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small">Exclusions</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">5</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">7</td>' +
											'</tr>' +

											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small"></td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small"></td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small"></td>' +
											'</tr>' +

											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small">Stat</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">200</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">300</td>' +
											'</tr>' +
											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small">EC</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">200</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">300</td>' +
											'</tr>' +
											'<tr class="table-body-row_" data-ui-core="size__small">' +
												'<td class="table-body-row-header_" data-ui-core="size__small">RC</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">200</td>' +
												'<td class="table-body-row-cell_" data-ui-core="size__small">300</td>' +
											'</tr>' +
										'</tbody>' +
									'</table>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';

					return HTML;
				},
				$body : null
			}
		}
	};



	// UI module objects
	var cuboids = {
		appSuite : {
			UI       : null,
			$el      : $("[data-js-target~='init__appSuite-cuboid']"),
			settings : [

			],
			init     : function() {
				UI.cuboid( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-handler~='show__appSuite-apps-cuboid']").click(this.show__appsCuboid.bind(this));
				$("[data-js-handler~='show__appSuite-app-cuboid']").click(this.show__appCuboid.bind(this));
			},
			show__appsCuboid : function() {
				this.UI.show("top");
			},
			show__appCuboid : function() {
				this.UI.show("front");
			}
		}
	};




	var panels = {
		fileSummary : {
			UI : null,
			$el : $("[data-js-target~='panels__fileSummary']"),
			settings : [
				{
					id       : "panel__fileSummary-settings",
					mode     : "flush",
					size     : 12,
					position : 0,
					active   : true
				},
				{
					id       : "panel__fileSummary-stats",
					mode     : "flush",
					size     : 12,
					position : 0,
					active   : false
				}
			],
			init     : function() {
				this.$el = $("[data-js-target~='panels__fileSummary']");
				UI.panels( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-target~='show__fileSummary-settings-panel']").click(this.show__settingsPanel.bind(this));
				$("[data-js-target~='show__fileSummary-stats-panel']").click(this.show__statsPanel.bind(this));
			},
			show__settingsPanel : function () {
				var settingsSettings,statsSettings;
				settingsSettings = this.settings[0];
				statsSettings    = this.settings[1];

				settingsSettings.active = true;
				statsSettings.active    = false;

				this.UI.panel("panel__fileSummary-settings", settingsSettings);
				this.UI.panel("panel__fileSummary-stats", statsSettings);
			},
			show__statsPanel : function () {
				var settingsSettings,statsSettings;
				settingsSettings = this.settings[0];
				statsSettings    = this.settings[1];

				settingsSettings.active = false;
				statsSettings.active    = true;

				this.UI.panel("panel__fileSummary-settings", settingsSettings);
				this.UI.panel("panel__fileSummary-stats", statsSettings);
			}

		},
		appSuite : {
			UI 		 : null,
			$el      : $("[data-js-target~='panels__appSuite']"),
			settings : [
				{
					id       : "panel__appSuite-apps",
					mode     : "flush",
					size     : 12,
					position : 0,
					active   : false
				},
				{
					id       : "panel__appSuite-app",
					mode     : "flush",
					size     : 12,
					position : 0,
					active   : true
				}
			],
			init     : function() {
				UI.panels( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-handler~='show__appSuite-apps-panel']").click(this.show__appsPanel.bind(this));
				$("[data-js-handler~='show__appSuite-app-panel']").click(this.show__appPanel.bind(this));
			},
			show__appsPanel : function() {
				this.UI.swap("panel__appSuite-app","panel__appSuite-apps",true,"top");
			},
			show__appPanel : function() {
				this.UI.swap("panel__appSuite-apps","panel__appSuite-app",true,"top");
			}
		},
		appIQM : {
			UI 		 : null,
			$el      : $("[data-js-target~='panels__appIQM']"),
			settings : [
				{
					id       : "panel__appIQM-iframe",
					mode     : "modal",
					size     : 8,
					position : 0,
					active   : false
				},
				{
					id       : "panel__appIQM-stage",
					mode     : "flush",
					size     : 12,
					position : 0,
					active   : true
				}
			],
			init    : function() {
				UI.panels( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-handler~='show__iframe-panel']").click(this.show__iframe.bind(this));
				$("[data-js-handler~='hide__iframe-panel']").click(this.hide__iframe.bind(this));
			},
			show__iframe : function() {
				this.UI.showModal("panel__appIQM-iframe","top");
			},
			hide__iframe : function() {
				this.UI.hideModal("panel__appIQM-iframe","top");
			}
		},
		fileRecords : {
			UI 		 : null,
			$el      : $("[data-js-target~='panels__fileRecords']"),
			settings : [
				{
					id       : "panel__fileRecords-records",
					mode     : "card",
					size     : 4,
					position : 0,
					active   : true
				},
				{
					id       : "panel__fileRecords-record",
					mode     : "card",
					size     : 8,
					position : 4,
					active   : true
				}
			],
			init      : function() {
				UI.panels( this.$el, this.settings );
				this.UI = this.$el.data("UI");
				panels.fileRecords.responsive($(window).width());

				$("[data-js-handler~='swap-panels__records&record']").click(this.swap__RecordsRecord.bind(this));
				$("[data-js-handler~='swap-panels__record&records']").click(this.swap__RecordRecords.bind(this));
			},
			swap__RecordsRecord : function() {
				if ( $(window).width() <= 950 ) {
					this.UI.swap("panel__fileRecords-records","panel__fileRecords-record",true,"right");
				}
			},
			swap__RecordRecords : function() {
				if ( $(window).width() <= 950 ) {
					this.UI.swap("panel__fileRecords-record","panel__fileRecords-records",true,"right");
				}
			},
			responsive : function(windowWidth) {
				var panels, panelRecords__id, panelRecord__id;
				panels           = this.UI;
				panelRecords__id = "panel__fileRecords-records";
				panelRecord__id  = "panel__fileRecords-record";


				if (windowWidth <= 950) {
					panels.panel(panelRecords__id,{
						id       : panelRecords__id,
						mode     : "card",
						size     : 12,
						position : 0,
						active   : true
					});
					panels.panel(panelRecord__id ,{
						id       : panelRecord__id ,
						mode     : "card",
						size     : 12,
						position : 0,
						active   : false
					});
				} else if ( windowWidth > 950 && windowWidth <= 1200 ) {
					panels.panel(panelRecords__id,{
						id       : panelRecords__id,
						mode     : "card",
						size     : 5,
						position : 0,
						active   : true
					});
					panels.panel(panelRecord__id ,{
						id       : panelRecord__id ,
						mode     : "card",
						size     : 7,
						position : 5,
						active   : true
					});
				} else if ( windowWidth > 1200 ) {
					panels.panel(panelRecords__id,{
						id       : panelRecords__id,
						mode     : "card",
						size     : 4,
						position : 0,
						active   : true
					});
					panels.panel(panelRecord__id ,{
						id       : panelRecord__id ,
						mode     : "card",
						size     : 8,
						position : 4,
						active   : true
					});
				}
			}
		}
	};




	var popovers = {
		fileSummary : {
			$el      : $('[data-js-target~="file-options__toggle"]'),
			settings : {
				title   : __templates.app.fileSummary.title(),
				content : __templates.app.fileSummary.$body,
				width   : 380,
				height  : 265				
			},
			init     : function() {
				var fileSummary,$fileSummary,settings;
				this.settings.content = __templates.app.fileSummary.$body;
				settings              = this.settings;

				this.$el.webuiPopover(settings);
				this.$el.webuiPopover('show');
				$(".webui-popover").css({ opacity : 0 });

				panels.fileSummary.init();

				this.$el.webuiPopover('hide');
				$(".webui-popover").css({ opacity : 1 });
			}
		}
	};




	App = {
		init : function() {
			cuboids.appSuite.init();
			__templates.app.fileSummary.$body = $( __templates.app.fileSummary.bodyHTML() );

			popovers.fileSummary.init();

			panels.appSuite.init();
			panels.appIQM.init();
			panels.fileRecords.init();
			$(window).on("resize", function() {
				var windowWidth = $(this).width();
				panels.fileRecords.responsive(windowWidth);
			});
		}
	}





	// call to the api
	<%= get %>
		 var records, numberOfRecords, listOptions,EC,RC;
		var records     = data.records;
		stats.records   = records.length;
		var listOptions = {
			valueNames: [ 'field', 'error', 'content' ]
		};


		var compiledRecords = Handlebars.templates.recordsTemplate;
		var compiledDetails = Handlebars.templates.detailsTemplate;

		for(var i=0;i < stats.records;i++) {
			var record,firstName,lastName,templates;
			record    = records[i].record;
			firstName = record.name.firstName;
			lastName  = record.name.lastName;
			templates = __templates.app.file;
			if (record.career.yearInProgram === "EC") {
				stats.EC ++;
			} else if (record.career.yearInProgram === "EC") {
				stats.RC ++;
			}


			listOptions.valueNames.push("forRecord__" + firstName + '-' + lastName);



			recordsTable += compiledRecords(record);
			detailsTable += compiledDetails(record);

			//detailsTable += templates.recordDetails(firstName,lastName,record);
		}

		// adds the table HTML to the record and details tabale
        $records = $(recordsTable);
        $details = $(detailsTable);

        $recordsTable.append($records);
		$detailsTable.append($details);

		// initializes the responsiveness aspect of the tables






		// sets up table filtering and sorting
        var detailsList = new List('panel__fileRecords-record', listOptions);
        $("#panel__fileRecords-record").data("list",detailsList);

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

        $detailsTable.find("[name='mobile__sort-details']").on("change", function() {
        	var toSort = $("[name='mobile__sort-details']:checked").val();

        	sortDetailsTable(toSort);
		});

        $recordsTable.find('[data-js-handler~="filter__details-table"]').on("click", function() {
        	var $this = $(this);

        	var toFilter = "forRecord__" + $this.attr("data-recordid");
        	filterDetailsTable(toFilter);
        });





		$detailsTable.basictable({
			breakpoint : 480
		});

        // initializes the popover, panel and cuboid modules
        App.init();
	});
	
});
