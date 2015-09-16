(function($) {
	var App;
	var userData    = {};
	var recordsData = {
		active : undefined
	};
	var stats = {
		records : 0,
		errors  : 0,
		EC      : 0,
		RC      : 0
	};



	var calendar = {
		exclusions : {
			init : function() {
				var today = new Date();
				var dd    = today.getDate();
				var mm    = today.getMonth()+1;
				var yyyy  = today.getFullYear();

				if(dd<10){
				    dd='0'+dd
				} 
				if(mm<10){
				    mm='0'+mm
				} 

				var today = mm + '/' + dd + '/' + yyyy + ' ';
				document.querySelector("[data-js-target~='activeExclusion__startDate']").innerHTML = today;

				var calendar = new Pikaday({ 
					field: document.querySelector("[data-js-handler~='exclusionEnd__datePicker']"),
					format: 'D MMM YYYY',
					onSelect: function() {
					    var formattedDate = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					}
				 });
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




	var modals = {
		iframe : {
			el       : document.querySelector("[data-js-target~='modal__iframe']"),
			settings : {
				mainCanvasElement : document.querySelector("[data-js-target~='app__mainCanvas']")
			},
			UI : undefined,
			init : function() {
				var _self,modal,settings,__UI;
				_self    = this;
				modal    = _self.el;
				settings = _self.settings;

				__UI = _self.UI = UI.modal(modal,settings);

				document.getElementById("detailsTable").addEventListener("click", function(e) {
					if ( e.target.parentElement.dataset.jsHandler === "show__iframe" ) {
						offCanvasPanels.fileSummary.UI.hidePanel();
						__UI.showModal();
					}
					e.stopPropagation();
				});
			}
		}
	};




	var offCanvasPanels = {
		fileSummary : {
			el : document.querySelector("[data-js-target~='offCanvasPanel__fileSettings']"),
			settings : {
				showOnInit        : true,
				unfocusMainCanvas : true,
				mainCanvasElement : document.querySelector("[data-js-target~='app__mainCanvas']")
			},
			UI : undefined,
			init : function() {
				var __self, panel,settings,__UI,toggleBtn;
				__self   = this;
				panel    = __self.el;
				settings = __self.settings;
				toggleBtn = document.querySelector("[data-js-target~='file-options__toggle']");

				__UI = __self.UI = UI.offCanvasPanel(panel,settings);

				toggleBtn.addEventListener('click', function() {
					var panel__isOpen;
					panel__isOpen = __UI.isPanelShowing();

					if ( panel__isOpen ) {
						__UI.hidePanel();
					} else {
						__UI.showPanel();
					}
				});
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
				var _self = this;
				UI.panels( this.$el, this.settings );
				_self.UI = this.$el.data("UI");
				panels.fileRecords.responsive($(window).width());
				_self.UI.hideNotification("panel__fileRecords-record",false);

				$("[data-js-handler~='load__record']").click(this.swap__RecordsRecord.bind(this));
				$("[data-js-handler~='swap-panels__record&records']").click(this.swap__RecordRecords.bind(this));

				$("[data-js-handler~='toggle__panelNotification']").on("change", function() {
					var $this = $(this);
					if ( $this.is(":checked") ) {
						//calendar.exclusions.init();
						_self.UI.showNotification("panel__fileRecords-record",true);
					} else {
						_self.UI.hideNotification("panel__fileRecords-record",true);
					}
				});
				$("[data-js-handler~='toggle__exclusion']").on("click", function() {
					$("[data-js-handler~='toggle__panelNotification']").prop("checked", false).change();
				});
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
				var panels, panelRecords__id, panelRecord__id,recordsSettings,recordSettings;
				panels              = this.UI;
				panelRecords__id    = "panel__fileRecords-records";
				recordsSettings     = this.settings[0];

				panelDetails__id    = "panel__fileRecords-record";
				detailsSettings     = this.settings[1];


				if (windowWidth <= 950) {

					recordsSettings.active   = true;
					recordsSettings.size     = 12;
					recordsSettings.porition = 0;
					
					detailsSettings.active   = false;
					detailsSettings.size     = 12;
					detailsSettings.position = 0;

					panels.panel(panelRecords__id, recordsSettings);
					panels.panel(panelDetails__id, detailsSettings);
				} else if ( windowWidth > 950 && windowWidth <= 1200 ) {
					recordsSettings.active   = true;
					recordsSettings.size     = 5;
					recordsSettings.porition = 0;
					
					detailsSettings.active   = true;
					detailsSettings.size     = 7;
					detailsSettings.position = 5;

					panels.panel(panelRecords__id, recordsSettings);
					panels.panel(panelDetails__id, detailsSettings);
				} else if ( windowWidth > 1200 ) {
					recordsSettings.active   = true;
					recordsSettings.size     = 4;
					recordsSettings.porition = 0;
					
					detailsSettings.active   = true;
					detailsSettings.size     = 8;
					detailsSettings.position = 4;

					panels.panel(panelRecords__id, recordsSettings);
					panels.panel(panelDetails__id, detailsSettings);
				}
			}
		}
	};




	// var popovers = {
	// 	fileSummary : {
	// 		$el      : $('[data-js-target~="file-options__toggle"]'),
	// 		settings : {
	// 			title   : __templates.app.fileSummary.title(),
	// 			content : null,
	// 			width   : 380,
	// 			height  : 290				
	// 		},
	// 		init     : function() {
	// 			var settings;
	// 			this.settings.content = __templates.app.fileSummary.$body[0];
	// 			settings              = this.settings;

	// 			this.$el.webuiPopover(settings);
	// 			this.$el.webuiPopover('show');
	// 			$(".webui-popover").css({ opacity : 0 });

	// 			panels.fileSummary.init();

	// 			this.$el.webuiPopover('hide');
	// 			$(".webui-popover").css({ opacity : 1 });
	// 		}
	// 	}
	// };



	var tables = {
		records : {
			$el      : $("#recordsTable"),
			UI       : null,
			settings : {
				tableID         : "recordsTable",
				valueNames      : ['is__firstName','is__lastName','has__error','is__exclusion','is__pending'], 
				searchHandlerID : "recordsTable__search",
				sortHandlerID   : "recordsTable__sort", 
				filterHandlerID : "recordsTable__filter"
			},
			init     : function() {
				var _self = this;
				UI.table( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				this.UI.filter("has__error");

				$("[data-js-handler~='recordsTable__filter']").on("change", function() {
					var $this = $(this);
					var toFilter = $this.val();

					if ($this.is(":checked")) {
						_self.UI.filter(toFilter);
					} else {
						_self.UI.unfilter(toFilter);
					}
				});

				this.$el.find("[data-js-handler~='detailsTable__filter-record']").on("click", function() {
					_self.$el.find("[data-js-handler~='detailsTable__filter-record']").attr("data-ui-state","");
					$(this).attr("data-ui-state","is__selected");
				});
				_self.$el.find("tbody tr").first().trigger("click");
			}
		},
		details : {
			$el      : $("#detailsTable"),
			UI       : null,
			settings : {
				tableID         : "detailsTable",
				valueNames      : ['is__field','is__error','has__error','is__exclusion','is__pending', 'content', "hbsId"], 
				searchHandlerID : "detailsTable__search",
				sortHandlerID   : "detailsTable__sort", 
				filterHandlerID : "detailsTable__filter"
			},
			activeRecord : null,
			init     : function() {
				var _self = this;
				UI.table( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-handler~='detailsTable__filter']").on("change", function() {
					var $this = $(this);
					var toFilter = $this.val();

					if ($this.is(":checked")) {
						_self.UI.filter(toFilter);
					} else {
						_self.UI.unfilter(toFilter);
					}
				});


				var init = true;
				$("[data-js-handler~='load__record']").on("click", function() {
					var $this,recordID,record,toAdd;
					$this      = $(this); 
					recordID   = $this.attr("data-record");
					record     = recordsData[recordID];
					toAdd      = [];

					for ( var field in record ) {
						var errorMessage = "no error";
						var has__error   = "";
						if ( record.errors != undefined && field !== "errors" ) {
							if ( record["errors"].hasOwnProperty(field) == true ) {
								errorMessage = record["errors"][field]["message"];
								has__error   = errorMessage;
							}
						}
						var row = {
							'is__field'     : field,
							'is__error'     : errorMessage,
							'has__error'    : has__error,
							'is__exclusion' : "",
							'is__pending'   : "", 
							'content'       : record[field],
							'hbsId'         : recordID
						};
						if ( field !== "errors" ) {
							toAdd.push(row);
						}
					};
					$("[data-js-handler~='detailsTable__filter']").prop("checked", false).change();

					_self.UI.add(toAdd);
					_self.UI.remove("hbsId", recordsData.active);
					_self.UI.remove("hbsId", "");
					recordsData.active = recordID;

					$("[data-js-handler~='detailsTable__filter']").prop("checked", true).change();

					tables.records.$el.find("[data-ui-state~='is__selected']").removeAttr("data-ui-state");
					$this.attr("data-ui-state","is__selected");
					$("[data-js-target~='recordName']").html(record.firstName + " " + record.lastName);

					init = false;
				});
			}

		}
	};




	var tooltips = {
		errors : {
			settings : {
				target   : undefined,
				position : 'bottom center',
				content  : "filter errors",
				classes  : 'tooltip-theme-arrows'
			},
			init : function() {
				var _self,errorFilters__checkbox; 
				_self = this;
				errorFilters__checkbox = document.querySelectorAll("[data-js-target~='tooltip__error']");

				for (var currentFilter = 0, len = errorFilters__checkbox.length; currentFilter < len; currentFilter++) {
					_self.settings.target = errorFilters__checkbox[currentFilter];
					new Tooltip(_self.settings);
				}
			}
		}
	};




	App = {
		init : function() {
			var is__mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			if( !is__mobile ) {
				tooltips.errors.init();
			}
			calendar.exclusions.init();
			cuboids.appSuite.init();

			modals.iframe.init();

			panels.appSuite.init();
			panels.fileRecords.init();
			panels.fileSummary.init();

			offCanvasPanels.fileSummary.init();

			tables.records.init();
			tables.details.init();
			
			document.getElementById("recordsTable").querySelector("tbody").addEventListener('click', function(e) {
				if ( e.target.parentElement.dataset.jsHandler === "load__record" ) {
					var pdmId,pdmIframe,newURL;

					fastdom.read(function() {
						pdmIframe = document.querySelector("[data-js-target~='iframePDM']");
					});

					pdmId     = recordsData.active;
					newURL    = userData.PDM + "mba/btStuDtl/edit?prsnId=" + pdmId;

					fastdom.write(function() {
						pdmIframe.setAttribute('src', newURL);
					});
				}
			});
			$(window).on("resize", function() {
				var windowWidth = $(this).width();
				panels.fileRecords.responsive(windowWidth);
			});

			FastClick.attach(document.body);
		}
	}


	var nanoOptions = {
		bg: 'rgba(0,0,0,0.2)',

		// leave target blank for global nanobar
		target: document.getElementById('globalLoader'),

		// id for new nanobar
		id: 'mynano'
	};

	var nanobar = new Nanobar( nanoOptions );


	$.when(
		// the config
		$.ajax({
			dataType : "json",
			url      : "http://rhdevapp1.hbs.edu:9080/iqService-dev/rest/config.json"
		}),	
		// the records
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				//Download progress
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
				    	var percentComplete = evt.loaded / evt.total;
				    	//Do something with download progress
				    	console.log(percentComplete * 100);
				    	nanobar.go( percentComplete * 100 );
					}
				}, false);
				return xhr;
			},
			dataType : "json",
			url      : "js/bio.json"
		})
	).done(function ( dataConfig,dataRecords ) {

		console.log("done");
		var records, numberOfRecords, listOptions,EC,RC;
		var user    = dataConfig[0].userInfo;
		var records = dataRecords[0].records;
		userData["PDM"] = dataConfig[0].config.PDM_URL;


		var totalRecords = records.length;
		stats.records    = totalRecords;
		var firstVisibleRecord;


		var recRow = 1;
		var recordTableBodyHTML = [];
		recordTableBodyHTML[0] = '<tbody data-ui-core="size__large" class="table-body_">';

		var detRow = 1;
		var detailTableBodyHTML = [];
		detailTableBodyHTML[0] = '<tbody data-ui-core="size__large" class="table-body_">';


		for(var __record=0;__record < totalRecords;__record++) {
			var currentRecord,details,errors,hbsId,firstName,lastName,templates, recordsRow;
			currentRecord = records[__record];
			details       = currentRecord.record;
			errors        = currentRecord.errors;
			if ( currentRecord["hbsId"] !== undefined ) {
				hbsId = currentRecord["hbsId"].toString();
			} else {
				hbsId = details.huid;
			}
			firstName     = details.name.firstName;
			lastName      = details.name.lastName;

			totalErrors   = errors.length;
			stats.errors  += totalErrors;
			if (details.career.yearInProgram === "EC") {
				stats.EC ++;
			} else if (details.career.yearInProgram === "RC") {
				stats.RC ++;
			}
			tables.details.settings.valueNames.push("detailOf__" + hbsId);

			recordsData[hbsId] = {};
			if ( currentRecord.errors !== undefined ) {
				recordsData[hbsId]["errors"] = {};

				for ( var error = 0; error < totalErrors; error++ ) {
					var currentError      = errors[error];
					var currentErrorField = currentError.field.split(".").pop();

					recordsData[hbsId]["errors"][currentErrorField] = {
						type    : currentError["type"],
						message : currentError["message"],
						field   : currentErrorField
					};
				}
			}



			var has__error = errors.length > 0 ? " has__error" : "";

			recordTableBodyHTML[recRow++] = '<tr class="table-body-row_" data-record="' + hbsId + '" data-ui-core="size__large" data-js-handler="load__record">';
			recordTableBodyHTML[recRow++] = '<td class="table-body-row-cell_ is__firstName' + has__error + '" data-ui-core="size__large">' + firstName + '</td>';
			recordTableBodyHTML[recRow++] = '<td class="table-body-row-cell_ is__lastName' + has__error + '" data-ui-core="size__large">' + lastName + '</td>';
			recordTableBodyHTML[recRow++] = '</tr>';

			for (var fieldGroups in details) {
				if (fieldGroups !== "updateDate" && fieldGroups !== "hbsId") {
					var fieldGroup = details[fieldGroups];
					for ( var field in fieldGroup) {
						recordsData[hbsId][field] = fieldGroup[field];
					}
				}
			}
		}
		recordTableBodyHTML[recRow++] = '</tbody>';
		//detailTableBodyHTML[detRow++] = '</tbody>';
		
		$("[data-js-target~='recordsTable']").append( recordTableBodyHTML.join('') );
    	//$("[data-js-target~='detailsTable']").append( detailTableBodyHTML.join('') );

		// initializes the responsiveness aspect of the tables
		$("[data-js-target~='detailsTable']").basictable({
			breakpoint : 480
		});



        // initializes the popover, panel and cuboid modules
        App.init();



		document.getElementById("recordsTable").querySelector("[data-js-handler~='load__record']").click();
		//$("#recordsTable tbody tr:first").trigger("click");
	});
	
}(jQuery));
