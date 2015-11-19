	var file,stats,updateAPIURLs;
	file = {
		API          : undefined,
		PDM_URL_base : undefined,
		user         : undefined, // MBA|DOC|ADMIN
		role         : undefined, // MBA|DOC
		report       : "bio",     // bio|admit *is bio by default on load
		term         : "S", // S = sping|F = fall
		year         : new Date().getFullYear(), // ex: 1999,2000,etc.  Defaults to current year

		fieldNames   : {
			bio   : {},
			admit : {}
		},
		records      : {
			active        : undefined,
			isFieldActive : false,
			activeField   : undefined
		}
	};
	stats = {
		records : 0,
		errors  : 0,
		EC      : 0,
		RC      : 0
	};
	updateAPIURLs = function() {
		file.API = {
			records : {
				get  : {
					active : "/iqService/rest/" + file.role + "/" + file.report + "/records.json?term=" + file.term + "&year=" + file.year + "&personId=" + file.records.active,
					all    : "/iqService/rest/" + file.role + "/" + file.report + "/records.json?term=" + file.term + "&year=" + file.year
				}
			},
			exclusions : {
				get    : "/iqService/rest/" + file.role + "/" + file.report + "/exclusions.json",
				create : "/iqService/rest/" + file.role + "/" + file.report + "/exclusions/create",
				update : "/iqService/rest/" + file.role + "/" + file.report + "/exclusions/update"
			}
		};
	};




	var actionsheets = {
		archiveFiles : {
			el : document.querySelector("[data-js~='actionsheetArchiveFiles']") ,
			UI : undefined,
			init : function() {
				var __self = this;
				__self.UI = UI.actionsheet(__self.el);

				document.querySelector("[data-js~='updateFile'][value='archive']").addEventListener( 'click', function() { 
					__self.UI.open(); 
				});
			}
		}
	};

	// code snippet to convert the date format Igor is using to the UI format
	// moment("2015-10-29T19:01:54.749+0000", "YYYY-MM-DDTHH:mm:ss.SSSSZ").format('MM/DD/YYYY');

	// code snippet to convert UI dates to format Igor is using:
	// moment("10/29/2015","'MM/DD/YYYY'").format("YYYY-MM-DD");
	var calendar = {
		exclusions : {
			init : function() {
				var dateValidation,renderControls,calendarSettings,calendarStart,calendarEnd,today,dd,mm,yyyy,mobileAdjust;
				renderControls = function() {
					if ( window.innerWidth < 767 || UI.utilities.isMobile ) {
						var renderedCalendarControls = this.el.querySelector(".pika-mobile-controls");
						if ( renderedCalendarControls == null ) {
							var __self, calendarControls;
							calendarControls = '<div class="pika-mobile-controls"><button class="pika-mobile-controls-button" data-js="closeCalendar">Close</button><button class="pika-mobile-controls-button" data-js="clearCalendarInput">Clear</button></div>';
							__self           = this;

							__self.el.insertAdjacentHTML( "beforeend", calendarControls );
							__self.el.querySelector("[data-js='closeCalendar']").addEventListener( "click", function() {
								__self.hide();
							});
							__self.el.querySelector("[data-js='clearCalendarInput']").addEventListener( "click", function() {
								__self._o.field.value = "";
							});
						}
					}
				};
				validateDate = function() {
					var __self, inputMessage;
					__self       = this;
					inputMessage = document.querySelector("[data-js~='exlusionDatesMessage']");

					if ( calendarStart._o.field.value >= calendarEnd._o.field.value ) {
						inputMessage.innerHTML = "The end date must come after the start date.";

						UI.DOM.removeDataValue ( inputMessage,"data-ui-state","is__hidden" );
						UI.DOM.addDataValue( __self._o.field, "data-ui-state", "is__error animation__shake");
					} else {
						UI.DOM.addDataValue ( inputMessage,"data-ui-state","is__hidden" );
						UI.DOM.removeDataValue( calendarStart._o.field, "data-ui-state", "is__error animation__shake");	
						UI.DOM.removeDataValue( calendarEnd._o.field, "data-ui-state", "is__error animation__shake");							
					}
				};
				calendarSettings = {
					field    : undefined,
					format   : 'MM/DD/YYYY',
					onSelect : function() {
					    var formattedDate   = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					},
					onOpen   : renderControls,
					onDraw   : renderControls,
					onSelect : validateDate
				};
				calendarSettings.field = document.querySelector("[data-js~='exclusionStartDate__datePicker']");
				calendarStart          = new Pikaday( calendarSettings );

				calendarSettings.field = document.querySelector("[data-js~='exclusionEndDate__datePicker']");
				calendarEnd            = new Pikaday( calendarSettings );

				// IMPORTANT!! IN THE PIKADAY.JS FILE COMMENT OUT LINE 512
				// the script has some mobile bugs - this fixes the one where the pikaday closes the calendar when you click the next button
				// in mobile when the input field gets a blur event it closes the calendar

				// by making the inputs readOnly we prevent the soft keyboard from opening when the input is focused
				// this is important because in mobile view our date picker sits on the bottom of the screen and is full width
				// so when the soft keyboard slides in, it covers our date picker
				mobileAdjust = function(e) {
					var isReadOnly;
					if ( window.innerWidth < 768 || UI.utilities.isMobile ) {
						document.querySelector("[data-js~='exclusionStartDate__datePicker']").readOnly = "readonly";
						document.querySelector("[data-js~='exclusionEndDate__datePicker']").readOnly   = "readonly";
					} else {
						document.querySelector("[data-js~='exclusionStartDate__datePicker']").readOnly = false;
						document.querySelector("[data-js~='exclusionEndDate__datePicker']").readOnly   = false;
					}
				};
				mobileAdjust();
				if ( !UI.utilities.isMobile ) {
					window.addEventListener( 'resize', mobileAdjust );
				}
			},
			reset : function() {
				var today;
				today = new Date();
				today = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ';
				document.querySelector("[data-js~='exclusionStartDate__datePicker']").value = today;
				document.querySelector("[data-js~='exclusionEndDate__datePicker']").value = "";
			}
		}
	};




	// UI module objects
	var cuboids = {
		appSuite : {
			el   : document.querySelector("[data-js~='cuboid__initAppSuite']"),
			UI   : null,
			init : function() {
				var __self = this;
				__self.UI  = UI.cuboid( __self.el, { sideToShowOnInit : "bottom" } );
			},
		},
		app : {
			el   : document.querySelector("[data-js~='cuboid__initApp']"),
			UI   : null,
			init : function() {
				var __self = this;
				__self.UI  = UI.cuboid( __self.el, {sideToShowOnInit : "bottom"} );
			}
		}
	};



	// code snippet to convert the date format Igor is using to the UI format
	// moment("2015-10-29T19:01:54.749+0000", "YYYY-MM-DDTHH:mm:ss.SSSSZ").format('MM/DD/YYYY');

	// code snippet to convert UI dates to format Igor is using:
	// moment("10/29/2015","'MM/DD/YYYY'").format("YYYY-MM-DD");
	var exclusions = {
		exclusion            : document.querySelector("[data-js~='exclusion']"),
		exclusionNoteWrapper : document.querySelector("[data-js~='exclusionNoteWrapper']"),
		exclusionNote        : document.querySelector("[data-js~='exclusionNote']"),
		exclusionTogglers    : document.querySelectorAll("[data-js~='exclusionToggler']"),
		exclusionNoteToggler : document.querySelector("[data-js~='exclusionNoteToggler']"),
		exclusionSubmitBtn   : document.querySelector("[data-js~='submitExclusion']"),
		init : function() {
			var __self,excludeToggle;
			__self = this;

			for ( var toggler = 0, totalTogglers = __self.exclusionTogglers.length; toggler < totalTogglers; toggler++ ) {
				var currentToggler = __self.exclusionTogglers[toggler];
				currentToggler.addEventListener('change', function() {
					if ( currentToggler.checked == true ) {
						__self.openExclusion();
					} else {
						__self.closeExclusion();
					}
				});			
			}

			__self.exclusionSubmitBtn.addEventListener( 'click', function() {
				if ( file.records[ file.records.active ].exclusion == undefined ) {
					// if the active record doesn't have an exclusion we need to create a entry
					__self.updateExclusion("create");
				} else {
					// if there is an exclusion already created then we so a simple update
					__self.updateExclusion("update");
				}
			});
			// the event listener for the btn that toggles the exclusion open and close
			__self.exclusionNoteToggler.addEventListener('click', function(e) {	
				var __el,exclusionNotes; 
				__el = e.currentTarget;

				if ( __self.exclusionNoteWrapper.offsetHeight > 0 ) {
					// if the current rendered height of the exclusion note is greater than 0
					// then we'll collapse the note because it's open
					__self.closeExclusionNote();
				} else {
					// if the current rendered height of the exclusion note is not greater than 0
					// then we know it's collapsed and we should be expanding it
					__self.openExclusionNote();
				}
			});

		},
		populateExclusion : function(recordId) {
			var __self,exclusion,startDate,endDate;
			__self    = this;
			exclusion = file.records[recordId].exclusion;
			startDate = moment( exclusion.startDate, "YYYY-MM-DDTHH:mm:ss.SSSSZ").format('MM/DD/YYYY');
			if ( exclusion.endDate !== undefined ) {
				endDate = moment( exclusion.endDate, "YYYY-MM-DDTHH:mm:ss.SSSSZ").format('MM/DD/YYYY');
				// set UI end date
				document.querySelector("[data-js~='exclusionEndDate__datePicker']").value = endDate;
			}

			// set UI start date
			document.querySelector("[data-js~='exclusionStartDate__datePicker']").value = startDate;
			// populates the exclusion note
			__self.exclusionNote.innerHTML = exclusion.note;
		},
		unPopulateExclusion : function() {
			var __self;
			__self = this;

			calendar.exclusions.reset();
			__self.exclusionNote.innerHTML = "";	
		},
		returnExclusionValues : function() {
			var __self,record,exclusion,startDate,endDate;
			__self    = this;
			record    = file.records[ file.records.active ];
			// initialize exclusion object
			exclusion = {};
			startDate = document.querySelector("[data-js~='exclusionStartDate__datePicker']").value;
			endDate   = document.querySelector("[data-js~='exclusionEndDate__datePicker']");
			// do some light validation on the end date to make sure there is one, and if there is to include it in our exclusion object
			if ( endDate !== null && endDate !== undefined ) {
				endDate = endDate.value.replace(/\s/g, '');
				if ( endDate.length > 0 ) {
					exclusion["endDate"]   = moment(endDate,"'MM/DD/YYYY'").format("YYYY-MM-DD");
				}
			}

			if ( record.exclusion !== undefined ) {
				exclusion["id"] = record.exclusion["id"]
			}
			exclusion["prsnId"]    = record.prsnId;
			exclusion["group"]     = file.role;
			exclusion["type"]      = file.report;
			exclusion["firstName"] = record.firstName;
			exclusion["lastName"]  = record.lastName;
			exclusion["startDate"] = moment(startDate,"'MM/DD/YYYY'").format("YYYY-MM-DD");
			exclusion["note"]      = __self.exclusionNote.innerText;

			return exclusion;
		},
		updateExclusion : function(method) {
			var __self,exclusionData,exclusionRequest;
			__self             = this;
			exclusionData      = __self.returnExclusionValues();

			updateAPIURLs();
			exclusionRequest = UI.request({ 
				method   : ( method === "create" ) ? "POST" : "PUT", 
				URL      : file.API.exclusions[method] + (( method === "update" ) ? "/" + file.records[exclusionData.prsnId].exclusion.id : ""),
				headers  : 'application/json',
				postData : JSON.stringify( exclusionData ),
				success  : function(data) {
					if ( method === "create" ) {
						var newExclusion = UI.request({
							method  : "GET",
							URL     : file.API.exclusions.get + "?prsnId=" + exclusionData.prsnId,
							success : function(data) {
								file.records[ exclusionData.prsnId ].exclusion = JSON.parse( data.response ).exclusions[0];
								UI.DOM.addDataValue( tables.records.el.querySelector("[data-record='" + exclusionData.prsnId + "']"), "data-ui-state", "has__exclusion" );

								notifications.inApp.UI.update( "success", exclusionData.firstName + " " + exclusionData.lastName + "'s record has been marked as an exclusion." );
							} 
						}) ;
					} else {
						file.records[ exclusionData.prsnId ].exclusion = exclusionData;
						UI.DOM.addDataValue( tables.records.el.querySelector("[data-record='" + exclusionData.prsnId + "']"), "data-ui-state", "has__exclusion" );

						notifications.inApp.UI.update( "success", "The exclusion in " + exclusionData.firstName + " " + exclusionData.lastName + "'s record has been updated." );
					}
				},
				error    : function(response) {
					notifications.inApp.UI.update( "error", "Config HTTP error " + response.status + " " + response.statusText );
				}
			});
			loaders.inApp( exclusionRequest );
		},
		closeExclusionNote : function() {
			var __self;
			__self = this;

			UI.DOM.addDataValue( __self.exclusionNoteToggler, "data-ui-state", "animate__out rotate__90-neg" );
			UI.animate( __self.exclusionNoteWrapper, { animationName : "collapse" });
		},
		openExclusionNote : function() {
			var __self;
			__self = this;

			UI.animate( __self.exclusionNoteWrapper, { animationName : "expand" });
			UI.DOM.removeDataValue( __self.exclusionNoteToggler, "data-ui-state", "rotate__90-neg" );
		},
		openExclusion : function(collapseNote) {
			var __self,exclusionNoteToggler,exclusionNote,openExclusionUI;
			__self = this;

			openExclusionUI = function() {
				var exclusionChecks;

				UI.animate( document.querySelector(".exclude"), { animationName : "expand"});
				document.querySelector(".exclude-content").setAttribute("data-ui-state", "animate__out");

				for ( var exclusionToggler = 0, totalExclusionTogglers = __self.exclusionTogglers.length; exclusionToggler < totalExclusionTogglers; exclusionToggler++ ) {
					var currentExclusionCheck = __self.exclusionTogglers[exclusionToggler];
					if ( currentExclusionCheck.checked !== true ) {
						currentExclusionCheck.checked = true;
					}
				}
			};
			if ( collapseNote ) {
				UI.DOM.addDataValue( __self.exclusionNoteToggler, "data-ui-state", "rotate__90-neg" );
				UI.animate( __self.exclusionNoteWrapper, { 
					animationName : "collapse",
					speed         : 0,
					onComplete    : openExclusionUI
				});
			} else {
				__self.openExclusionNote();
				openExclusionUI();				
			}
		},
		closeExclusion : function() {
			var __self;
			__self = this;

			UI.animate( __self.exclusion, { animationName : "collapse"} );
			__self.closeExclusionNote();
			UI.DOM.addDataValue( document.querySelector(".exclude-content"), "data-ui-state", "animate__out scale__down fade__out" );
			//document.querySelector(".exclude-content").setAttribute("data-ui-state", "animate__out scale__down fade__out");

			for ( var exclusionToggler = 0, totalExclusionTogglers = __self.exclusionTogglers.length; exclusionToggler < totalExclusionTogglers; exclusionToggler++ ) {
				var currentExclusionCheck = __self.exclusionTogglers[exclusionToggler];
				if ( currentExclusionCheck.checked == true ) {
					currentExclusionCheck.checked = false;
				}
			}
		}
	};




	var loaders = {
		inApp : function(XMLHttpRequestObject) {
			var appLogo,loader;
			// App logo in the App Navbar that will rotate on loading
			appLogo    = document.querySelector("[data-js~='appLogo']");
			// the in app loader
			loader = document.querySelector("[data-js~='inApp__loader']");
			UI.loader( loader, {
				requests                : XMLHttpRequestObject,
				loaderCompleteAnimation : "fade out",
				resetLoaderOnComplete   : true,
				onComplete              : function() {
					var stopRotating; 
					notifications.inApp.UI.show();

					stopRotating = function(e) {
						UI.DOM.removeDataValue( e.currentTarget,"data-ui-state","is__rotating");
						appLogo.removeEventListener("webkitAnimationIteration", stopRotating);
						e.stopPropagation();
					};
					appLogo.addEventListener("webkitAnimationIteration", stopRotating);
				}
			});
			UI.DOM.addDataValue( appLogo,"data-ui-state","is__rotating");
		},
		initializeApp : function(XMLHttpRequestObject,loader,onComplete) {
			UI.loader( loader, {
				requests                : XMLHttpRequestObject,
				onComplete              : onComplete
			});
		}
	};	
 



	modals = {
		login : {
			el       : document.querySelector("[data-js~='modalLoginiFrame']"),
			iFrame   : document.querySelector("[data-js~='iframeLogin']"),
			UI       : undefined,
			init : function() {
				var __self = this,submitButton;
				__self.UI = UI.modal( __self.el, { mainCanvasElement : document.querySelector("[data-js~='splash']") });

				document.querySelector("[data-js~='splashLogin']").addEventListener( 'click', function() {
					__self.UI.showModal();
				});
				document.querySelector("[data-js~='splashReload']").addEventListener( 'click', function() {
					splash.removeError( App.getUser() );
				});
			}
		},
		iframe : {
			el       : document.querySelector("[data-js~='modal__iframe']"),
			iFrame   : document.querySelector("[data-js~='iframePDM']"),
			UI       : undefined,
			init : function() {
				var __self = this,submitButton;
				__self.UI = UI.modal( __self.el, {
					mainCanvasElement          : document.querySelector("[data-js~='app__mainCanvas']"),
					clickOutsideExemptElements : [document.querySelector("[data-js~='appClickException']")]
				});

				submitButton = document.querySelector("[data-js~='reValidateRecordField']");
				submitButton.addEventListener( 'click', App.reValidateRecordField );
			},
			updateModaliFrameSource : function(recordID) {
				modals.iframe.iFrame.setAttribute('src', file.PDM_URL_base + file.role + "/btStuDtl/edit?prsnId=" + file.records.active );	
			}
		}
	};




	notifications = {
		inApp : {
			el   : document.querySelector("[data-js~='inAppNotification']"),
			UI   : undefined,
			init : function() {
				var __self;
				__self = this;

				__self.UI = UI.notification( __self.el, {
					closeIcon              : document.querySelector("[data-js~='inAppNotificationClose']"),
					statusIcon             : document.querySelector("[data-js~='inAppNotificationIcon']"),
					statusMessage          : document.querySelector("[data-js~='inAppNotificationMessage']"),
					backing                : document.querySelector("[data-js~='inAppNotificationBacking']"),
					cuboidReference        : cuboids.app.UI,
					cuboidDefaultSide      : "front",
					cuboidNotificationSide : "bottom"
				});
			}
		}
	};




	offCanvasPanels = {
		fileSummary : {
			el : document.querySelector("[data-js~='offCanvasPanel__fileSettings']"),
			settings : {
				showOnInit                 : false,
				onActiveUnfocusMainCanvas  : true,
				closeOnClickOutside        : true,
				clickOutsideExemptElements : [document.querySelector("[data-js~='appClickException']")],
				closeOnEscape              : true,
				closeOnEscapeException     : function() {
					return App.UIState({ appSuiteApps : true, appSuiteSettings : true });
				},
				mainCanvasElement          : document.querySelector("[data-js~='app__mainCanvas']"),
				toggleBtnSelector          : "[data-js~='fileSummaryToggleIcon']",
				side                       : "right"
			},
			UI : undefined,
			init : function() {
				var __self = this;
				__self.UI  = UI.offCanvasPanel( __self.el, __self.settings );

				UI.keyboard({
					combination : ['alt','f'],
					onPress     : function(e) {
						__self.UI.showPanel();
					},
					exception   : function() {
						return App.UIState({
							iframeModal          : true,
							fileSummaryOffCanvas : true
						});
					}
				});

				var appCanvas  = document.querySelector("[data-js~='app__mainCanvas']");
				var hammertime = new Hammer(appCanvas);

				hammertime.on("swipeleft", function() {
					__self.UI.showPanel();
				});
				hammertime.on("swiperight", function() {
					if ( __self.UI.isPanelShowing() ) {
						__self.UI.hidePanel();
					}
				});
			}
		},
		records : {
			el       : document.querySelector("[data-js~='appHuver__records']"),
			settings : {
				showOnInit                 : true, 
				closeOnClickOutside        : true,
				clickOutsideExemptElements : [document.querySelector("[data-js~='file-options__toggle']"),document.querySelector("[data-js~='appClickException']")],
				closeOnEscape              : true,
				showBtnSelector            : "[data-js~='showFileContents']",
				hideBtnSelector            : "[data-js~='hideFileContents']",
				side                       : "left"
			},
			UI       : undefined,
			init     : function() {
				var __self,exception,adjustStyles;
				__self       = this;
				exception    = function() {
					return App.UIState({
						iframeModal          : true,
						fileSummaryOffCanvas : true,
						resolutionDesktop    : true
					});
				};
				__self.settings.clickOutsideException  = exception;
				__self.settings.closeOnEscapeException = exception;
				__self.UI = UI.offCanvasPanel( __self.el, __self.settings);
				
				UI.keyboard({
					combination : ['alt','r'],
					onPress     : function(e) {
						__self.UI.showPanel();
					},
					exception   : exception
				});
			}
		}
	};




	var segmentControls = {
		fileRecords : function() {
			// making sure our file values are up to date so that API urls are accurate
			var fileSourceControls;
			fileSourceControls = document.querySelectorAll("[data-js~='updateFile']");

			for ( var control = 0, totalControls = fileSourceControls.length; control < totalControls; control++ ) {
				var currentControl = fileSourceControls[control];
				currentControl.addEventListener( 'change', function(e) {
					var toUpdate,updateValue;
					toUpdate 	= e.currentTarget.name; // this will be 'role','term',etc
					updateValue = e.currentTarget.value; 

					file[toUpdate] = updateValue;
				});
				updateAPIURLs();
			}
		}
	};




	splash = UI.splash( document.querySelector("[data-js~='splash']") );




	var sticky = {
		records : {
			el : document.querySelector("[data-js~='records__positionSticky']"),
			UI : undefined,
			init : function() {
				var __self = this;
				__self.UI  = UI.sticky( __self.el, {
					scrollingElement : document.querySelector("[data-js~='appHuver__records']"),
					widthReference   : document.querySelector("[data-js~='appHuver__records']").querySelector("[data-js~='appHuver__recordsInner']"),
					distanceToStick  : 30
				});
			}
		},
		details : {
			el : document.querySelector("[data-js~='details__positionSticky']"),
			UI : undefined,
			init : function() {
				var __self = this;
				__self.UI  = UI.sticky( __self.el, {
					scrollingElement : document.querySelector("[data-js~='appHuver__recDetails']"),
					widthReference   : document.querySelector("[data-js~='appHuver__recDetails']").querySelector("[data-js~='appHuver__details-inner']"),
					distanceToStick  : 30
				});
			}
		}
	}; 




	tables = {
		init : function() {
			var __self,recordsTable,detailsTable,errorFilters,filterErrors; 
			__self       = this;
			recordsTable = __self.records.UI;
			detailsTable = __self.details.UI;

			// when the user hovers the records panel, the records table becomes the active table
			document.querySelector("[data-js~='appHuver__recordsInner']").addEventListener( 'mouseover', function() {
				__self.records.UI.focusTable();
				__self.details.UI.unfocusTable();
				//console.log("records rollover");
			});
			// when the user hovers the details panel, the details table becomes the active table
			document.querySelector("[data-js~='appHuver__details-inner']").addEventListener( 'mouseover', function() {
				__self.records.UI.unfocusTable();
				__self.details.UI.focusTable();
				//console.log("details rollover");
			});
			// when the tab button is pressed, we want to toggle between the active tables
			UI.keyboard({
				preventDefaultAction : true,
				combination : ["tab"],
				onPress     : function(e) {
					if ( __self.records.UI.isTableFocused() ) {
						// if yes then we switch to the details table
						if ( window.innerWidth < 1300 && offCanvasPanels.records.UI.isPanelShowing() ) {
							// if the browser window is less than 1300 pixels, and the records slide is open, then we need to close it so the details panel isn't obstructed
							offCanvasPanels.records.UI.hidePanel();
						}
						__self.records.UI.unfocusTable();
						__self.details.UI.focusTable();
					} else {
						// if records is not focused, then we focus it
						if ( window.innerWidth < 1300 && !offCanvasPanels.records.UI.isPanelShowing() ) {
							// if the browser window is less than 1300 pixels, and the records slide is off canvas we open it
							offCanvasPanels.records.UI.showPanel();
						}
						__self.records.UI.focusTable();
						__self.details.UI.unfocusTable();
					} 
				},
				exceptions : {
					allKeys : function() {
						return App.UIState({
							exclusionFocused     : true,
							iframeModal          : true,
							fileSummaryOffCanvas : true
						});
					}
				}
			});

			errorFilters = document.querySelectorAll("[data-js~='tableFilter'][value='has__error'");
			filterErrors = function(tableName) {
				var table,errorsAreFiltered,filterMethod,checkedStatus;
				table = tables[tableName].UI;
				// if true then errors are currently filtered
				errorsAreFiltered = table.activeFilters.indexOf('has__error') > -1;
				filterMethod      = ( errorsAreFiltered ) ? "unfilter" : "filter";
				checkedStatus     = ( errorsAreFiltered ) ? false      : true;

				tables[tableName].UI[filterMethod]("has__error");
				for ( var filter = 0, totalFilters = errorFilters.length; filter < totalFilters; filter++ ) {
					var currentFilter = errorFilters[filter];
					if ( currentFilter.name === tableName ) {
						errorFilters[filter].checked = checkedStatus;
					}
				}
			};
			for ( var filter = 0, totalFilters = errorFilters.length; filter < totalFilters; filter++ ) {
				var currentFilter = errorFilters[filter];
				currentFilter.addEventListener( 'click', function(e) {
					filterErrors( e.currentTarget.name );
				});
			};

			UI.keyboard({
				combination : ['alt','e'],
				onPress     : function(e) {
					if ( tables.records.UI.isTableFocused() ) {
						filterErrors("records");
					} else if ( tables.details.UI.isTableFocused() ) {
						filterErrors("details");
					}
				}
			});

			UI.keyboard({
				combination          : ['alt','space'],
				preventDefaultAction : true,
				onPress     : function(e) {
					if ( tables.records.UI.isTableFocused() ) {
						document.querySelector("[data-js~='recordsTable__search']").focus();
					} else if ( tables.details.UI.isTableFocused() ) {
						document.querySelector("[data-js~='detailsTable__search']").focus();
					}
				}
			});
		},
		records : {
			el       : document.querySelector("[data-js~='recordsTable']"),
			UI       : null,
			settings : {
				tableName      : "recorsTable",
				valueNames     : ['is__firstName','is__lastName','has__error','is__exclusion','is__pending','personId'], 
				searchElements : document.querySelectorAll("[data-js~='recordsTable__search']"),
				sortElements   : document.querySelectorAll("[data-js~='recordsTable__sort']"), 
				filterElements : document.querySelectorAll("[data-js~='recordsTable__filter']"),

				scrollAdjustmentOnArrowNavigation : true,
				scrollAdjustmentOffsetTop         : function() {
					return document.querySelector("[data-js~='records__positionSticky']").getBoundingClientRect().bottom;
				},
				scrollingElement : document.querySelector("[data-js~='appHuver__records']"),	

				onRowSelection : function( selectRow ) {
					tables.details.openRecord( selectRow );

					// set a timeout so that the refocusing doesn't also cause the details table to fire a selection event as well
					setTimeout(function() {
						tables.records.UI.unfocusTable();
						tables.details.UI.focusTable();
					},200);
					if ( window.innerWidth < 1300 ) {
						offCanvasPanels.records.UI.hidePanel();
					}
				},
				exceptions : { allKeys : undefined }
			},
			init     : function() {
				var __self,exception,errorsFilter;
				__self       = this;
				exception    = function() {
					return App.UIState({
						detailsTableFocused  : true,
						exclusionFocused     : true,
						iframeModal          : true,
						fileSummaryOffCanvas : true
					});
				};
				__self.settings.exceptions.allKeys = exception;
				__self.UI = UI.table( __self.el, __self.settings );

				// adding the personIds the the table record objects
				var tableRecordObjects = __self.UI.list.items;
				for ( var tableRecord = 0, totalTableRecords = tableRecordObjects.length; tableRecord < totalTableRecords; tableRecord++ ) {
					var currentTableRecordObject = tableRecordObjects[tableRecord];
					var currentTableRecordNumber = currentTableRecordObject.elm.dataset.record;
					currentTableRecordObject._values.personId = currentTableRecordNumber;
				}

				__self.UI.filter("has__error");
				__self.UI.focusTable();
			}
		},
		details : {
			el       : document.querySelector("[data-js~='detailsTable']"),
			UI       : null,
			settings : {
				tableName             : "detailsTable",
				// fieldName is the none human readable name, we use it for lookups in the code
				// is__field is the human readable version of the field name, we use it for displaying in the table
				valueNames            : ['fieldName','is__field','is__error','has__error','is__exclusion','is__pending', 'content', "hbsId"], 
				searchElements        : document.querySelectorAll("[data-js~='detailsTable__search']"),
				sortElements          : document.querySelectorAll("[data-js~='detailsTable__sort']"), 
				filterElements        : document.querySelectorAll("[data-js~='detailsTable__filter']"),

				scrollAdjustmentOnArrowNavigation : true,
				scrollAdjustmentOffsetTop         : function() {
					return document.querySelector("[data-js~='details__positionSticky']").getBoundingClientRect().bottom;
				},
				scrollingElement 	              : document.querySelector("[data-js~='appHuver__recDetails']"),			
				addStateToRowOnSelect : false,
				onRowSelection        : function() {
					//offCanvasPanels.fileSummary.UI.hidePanel();
					modals.iframe.UI.showModal();
				},
				exceptions : { allKeys : undefined }
			},
			activeRecord : null,
			init : function() {
				var __self,exception,errorsFilter;
				__self       = this;
				exception    = function() {
					return App.UIState({
						recordsTableFocused  : true,
						exclusionFocused     : true,
						fileSummaryOffCanvas : true,
						iframeModal          : true
					});
				};
				__self.settings.exceptions.allKeys = exception;
				__self.UI    = UI.table( __self.el, __self.settings );


				// the click event listener for the table rows in the records table
				document.querySelector("[data-js~='recordsTable']").addEventListener('click', function(e) {
					var targetEl = e.target.parentElement;
					if ( targetEl.dataset.js === "load__record" ) {
						tables.details.openRecord( targetEl );
					}
				});

				__self.el.addEventListener("click", function(e) {
					if ( e.target.parentElement.dataset.js === "show__iframe" ) {
						modals.iframe.UI.showModal();
					}
					e.stopPropagation();
				});

				var firstRecord = tables.records.el.querySelector("[data-js~='load__record']");
				tables.records.UI.selectRow( firstRecord );
			},
			openRecord : function(recordsTableRowEl) {
				var __self,recordID,record,toAdd,detailsTableFilterEl,detailsTableTitle;
				__self   = this;
				recordID = recordsTableRowEl.dataset.record;
				record   = file.records[recordID];
				toAdd    = [];

				// if the record is already active we leave the function
				if ( recordID === file.records.active ) {
					return;
				}
				// update the modal iframesource
				modals.iframe.updateModaliFrameSource(recordID);

				// check if this record has an exclusion
				if ( record.exclusion !== undefined ) {
					exclusions.populateExclusion(recordID);
					exclusions.openExclusion(true);
				} else {
					exclusions.closeExclusion();
					exclusions.unPopulateExclusion();
				}

				for ( var field in record ) {
					var errorMessage,has__error,row;
					errorMessage = "no error";
					has__error   = "";
					if ( record.errors != undefined && field !== "errors" ) {
						if ( record["errors"].hasOwnProperty(field) == true ) {
							errorMessage = record["errors"][field]["message"];
							has__error   = errorMessage;
						}
					}
					row = {
						// this looks up the human readable version of the field name
						'fieldName'     : field,
						'is__field'     : file.fieldNames.bio[field],
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
				
				tables.details.UI.unfilter("has__error");

				// adds our new table rows via the 'toAdd' array we've just finished creating
				__self.UI.add(toAdd);
				__self.UI.remove("hbsId", file.records.active);
				__self.UI.remove("hbsId", "");
				file.records.active = recordID;

				tables.details.UI.filter("has__error");

				var errorItems = tables.details.UI.list.visibleItems;
				for ( var errorItem = 0, totalErrorItems = errorItems.length; errorItem < totalErrorItems; errorItem++ ){
					var currentErrorItem = errorItems[errorItem];
					var currentErrorTR   = currentErrorItem.elm;
					UI.DOM.addDataValue( currentErrorTR,'data-ui-state','has__error' );
				} 


				var recordsTableSelectedRow = tables.records.el.querySelector("[data-ui-state~='is__selected']");
				UI.DOM.addDataValue( recordsTableRowEl, "data-ui-state", "is__selected" );
				detailsTableTitle           = document.querySelector("[data-js~='recordName']");
				detailsTableTitle.innerHTML = record.firstName + " " + record.lastName;


				if ( tables.details.UI.currentHighlightedRow() == undefined ) {
					var firstRow = tables.details.el.querySelector("tbody tr ");
					tables.details.UI.highlightRow( firstRow );
				}
			}
		}
	};




	var tooltips = {
		init   : function() {
			tooltips.errorFilterCheckboxes();
			tooltips.fileSummary();
			tooltips.appGrid();
			tooltips.appSettings();
		},
		errorFilterCheckboxes : function() {
			var errorFilterCheckboxes = document.querySelectorAll("[data-js~='tooltip__error']");

			for (var currentFilter = 0, totalFilters = errorFilterCheckboxes.length; currentFilter < totalFilters; currentFilter++) {
				new Tooltip({
					target   : errorFilterCheckboxes[currentFilter],
					position : 'bottom center',
					content  : "filter errors (alt + e)	",
					classes  : 'tooltip-theme-arrows'
				});
			}
		},
		fileSummary : function() {
			new Tooltip({
				target   : document.querySelector("[data-js~='file-options__toggle']"),
				position : 'bottom right',
				content  : 'File Summary (alt + f)',
				classes  : 'tooltip-theme-arrows'
			});
		},
		appGrid : function() {
			new Tooltip({
				target   : document.querySelector("[data-js~='cuboid__showAppSuiteApps']"),
				position : 'bottom right',
				content  : 'Apps Grid (alt + a)',
				classes  : 'tooltip-theme-arrows'
			});
		},
		appSettings : function() {
			new Tooltip({
				target   : document.querySelector("[data-js~='cuboid__showAppSuiteSettings']"),
				position : 'bottom center',
				content  : 'App Settings (alt + s)',
				classes  : 'tooltip-theme-arrows'
			});
		}
	};




	App = {
		appSuite : {
			App         : document.querySelector("[data-js~='appSuiteApp']"),
			Apps        : document.querySelector("[data-js~='appSuiteApps']"),
			Settings    : document.querySelector("[data-js~='appSuiteSettings']"),
			Preferences : document.querySelector("[data-js~='appSuitePreferences']"),
			active      : "App",
			init        : function() {
				var __self = this,showApp;
				document.querySelector("[data-js~='cuboid__showAppSuiteSettings']").addEventListener( 'click', function() { __self.show("Settings"); });
				document.querySelector("[data-js~='cuboid__showAppSuiteApps']").addEventListener( 'click', function() { __self.show("Apps"); });
				showAppBtns = document.querySelectorAll("[data-js~='cuboid__showAppSuiteApp']");
				for ( var btn = 0, totalBtns = showAppBtns.length; btn < totalBtns; btn++ ) {
					showAppBtns[btn].addEventListener( 'click', function() { __self.show("App"); });
				}

				UI.keyboard({
					combination : ['alt','a'],
					onPress     : function(e) {
						__self.show("Apps");
					}
				});
				UI.keyboard({
					combination : ['alt','s'],
					onPress     : function(e) {
						__self.show("Settings");
					}
				});
				UI.keyboard({
					combination : ['escape'],
					onPress     : function(e) {
						__self.show("App");
					},
					exception : function() {
						return App.UIState({ appSuiteApp : true });
					}
				});
			},
			show : function(toShow) {
				var active,swapOut,swapIn,settings,side;
				active = App.appSuite.active;

				if ( toShow !== active ) {
					if ( toShow === "App" ) {
						swapOut  = App.appSuite.Preferences;
						swapIn   = App.appSuite.App;
						settings = { 
							animationName : "swap", 
							onComplete    : function() { UI.DOM.addDataValue( App.appSuite[active], "data-ui-state", "is__hidden" ); } 
						};
						side     = "front";
					} else {
						swapOut  = App.appSuite.App;
						swapIn   = App.appSuite.Preferences;
						settings = { animationName : "swap" };
						side     = ( toShow === "Apps" ) ? "bottom" : "top";
						UI.DOM.removeDataValue( App.appSuite[toShow], "data-ui-state", "is__hidden" );
					}
					App.appSuite.active = toShow;
					UI.animate( [swapOut,swapIn], settings );
					cuboids.appSuite.UI.show( side );
				}
			}
		},
		UIState : function(check) {
			var appSuiteApps,appSuiteSettings,appSuiteApp,iframeModal,fileSummaryOffCanvas,recordsTableFocused,detailsTableFocused,exclusionFocused,resolutionDesktop,resolutionTablet,resolutionMobile,exception;
			appSuiteApps         = ( check.appSuiteApps         !== undefined ) ? true : false;
			appSuiteSettings     = ( check.appSuiteSettings     !== undefined ) ? true : false;
			appSuiteApp          = ( check.appSuiteApp          !== undefined ) ? true : false;
			iframeModal          = ( check.iframeModal          !== undefined ) ? true : false;
			fileSummaryOffCanvas = ( check.fileSummaryOffCanvas !== undefined ) ? true : false;
			recordsTableFocused  = ( check.recordsTableFocused  !== undefined ) ? true : false;
			detailsTableFocused  = ( check.detailsTableFocused  !== undefined ) ? true : false;
			exclusionFocused     = ( check.exclusionFocused     !== undefined ) ? true : false;
			isMobileDevice       = ( check.isMobileDevice       !== undefined ) ? true : false;
			resolutionDesktop    = ( check.resolutionDesktop    !== undefined ) ? true : false;
			resolutionTablet     = ( check.resolutionTablet     !== undefined ) ? true : false;
			resolutionMobile     = ( check.resolutionMobile     !== undefined ) ? true : false;

			exception = false;

			if ( iframeModal && modals.iframe.UI.isModalShowing() ) {
				exception = true;
			} else if ( fileSummaryOffCanvas && offCanvasPanels.fileSummary.UI.isPanelShowing() ) {
				exception = true;
			} else if ( recordsTableFocused && tables.records.UI.isTableFocused() ) {
				exception = true;
			} else if ( detailsTableFocused && tables.details.UI.isTableFocused() ) {
				exception = true;
			} else if ( exclusionFocused && document.activeElement.dataset.js === "exclusionNote" ) {
				exception = true;
			} else if ( resolutionDesktop && window.innerWidth > 1299 ) {
				exception = true;
			} else if ( resolutionTablet && window.innerWidth > 767 ) {
				exception = true;
			} else if ( resolutionMobile && window.innerWidth > 480 ) {
				exception = true;
			} else if ( isMobileDevice && UI.utilities.isMobile ) {
				exception = true;
			} else if ( appSuiteApps && App.appSuite.active === "Apps" ) {
				exception = true;
			} else if ( appSuiteApp && App.appSuite.active === "App" ) {
				exception = true;
			} else if ( appSuiteSettings && App.appSuite.active === "Settings" ) {
				exception = true;
			}

			return exception;
		},
		getUser : function() {
			// we initialize the config XMLHTTPRequest
			var requestConfig = UI.request({ 
				method  : "GET", 
				URL     : "/iqService/rest/config.json?meta=true", 
				success : function(request) {
					if ( request.response.indexOf("!DOCTYPE") > -1 ) {
						modals.login.iFrame.setAttribute('src', request.responseURL );	
						setTimeout(function() {
							splash.addError( "We weren't able to load your user profile. Try logging in and reloading." );
						}, 600);
					} else {
						setTimeout(function() {
							App.setupUser(request);
						},250);
					}
				},
				error   : function(request) {
					setTimeout(function() {
						splash.addError( "We weren't able to load your user profile. Try logging in and reloading." );
					}, 250);
				} 
			});
			// we initialize the config loader
			loaders.initializeApp( requestConfig,document.querySelector("[data-js~='appLoader__config']") );
			// we update the splash page loading message
			document.querySelector("[data-js~='splashLoaderMessage']").innerHTML = "creating user profile";
		},
		setupUser : function( configRequest ) {  // CONFIG SETUP STEP 1
			var __self,config,user,roles,role,config,requestRecords,requestExclusions; 
			__self = this;
			config = JSON.parse( configRequest.response );
			user   = config.userInfo;
			roles  = user.roles;
			role   = undefined;
			// adds the base URL for PDM lookups in the iframe
			file.PDM_URL_base = config.config.PDM_URL;

			// determine's the logged in user's role
			if ( roles.indexOf("IQ_ADMIN") > -1 ) {
				role      = file.role = "mba";
				file.user = "admin";
			} else if ( roles.indexOf("IQ_MBA") > -1 ) {
				role = file.user = file.role = "mba";
			} else if ( roles.indexOf("IQ_DOC") > -1 ) {
				role = file.user = file.role = "doc";
			}
			updateAPIURLs();

			// sets user's name in the global navigation
			document.querySelector("[data-js~='userName']").innerHTML = user.firstName;
			// if the user isn't an admin we remove the segment control that allows the user to switch between MBA/DOCTORAL files
			if ( file.user !== "admin" ) {
				document.querySelector("[data-js~='adminFileOption']").remove();
			}

			// creates in the 'file' variable, under fieldNames a reference of human readable field names for our HTML
			App.setupFields( config.metadata );

			// we initialize the records and exclusions XMLHTTPRequests
			requestRecords    = UI.request({ method: "GET", URL: file.API.records.get.all });
			requestExclusions = UI.request({ method: "GET", URL: file.API.exclusions.get });

			// we initialize the records and exclusions loader loader
			loaders.initializeApp([requestRecords,requestExclusions],document.querySelector("[data-js~='appLoader__records']"),App.buildRecords);
			document.querySelector("[data-js~='splashLoaderMessage']").innerHTML = "processing records";
		},
		setupFields : function( fieldData ) { // CONFIG SETUP STEP 2
			// fieldData = config.metadata
			var bioFields,bioFieldNames,admitFields,admitFieldNames,buildFields;
			// prsnId,degPrgmNum,etc
			bioFields       = fieldData.bioFields;
			// the name is under the title attribute
			bioFieldNames   = fieldData.bioMeta;
			admitFields     = fieldData.admitFields;
			admitFieldNames = fieldData.admitMeta;
			buildFields     = function(report,fields,fieldNames) {
				for ( var field = 0,len = fields.length; field < len; field++ ) {
					var currentField = fields[field];
					file.fieldNames[report][currentField] = fieldNames[currentField]["title"];
				}
			};

			buildFields( "bio", bioFields,bioFieldNames );
			buildFields( "admit", admitFields,admitFieldNames );
		},
		buildRecords : function( data ) { // RECORDS SETUP STEP 1
			var __self,exclusions,records,recordsTable,totalRecords,fields,tableRow;
			__self       = this;

			records      = JSON.parse( data.requests[0].response ).records;//  data.records.records;JSON.parse( reqConfig.response )
			exclusions   = JSON.parse( data.requests[1].response ).exclusions;//  data.exclusions.exclusions; // array of the exclusions
			recordsTable = [];
			totalRecords = records.length;
			fields       = file.fieldNames[file.report];

			// starts generating the HTML for records table
			tableRow        = 1;
			recordsTable[0] = '<tbody class="table-body_" data-ui-settings="size__large">';

			for ( var record = 0; record < totalRecords; record++ ) {
				var currentRecord,errors,hasErrors,hasExclusion,errorCount,recordId;
				currentRecord = records[record]["record"];
				errors        = records[record]["errors"];
				hasErrors     = ( errors.length > 0 ) ? true : false;
				hasExclusion  = false;
				recordId      = currentRecord["prsnId"];

				// adds an entry into 'file.records' for the current record
				file.records[recordId] = {};

				// check to see if there is an exclusion for this record
				for ( var exclusion = 0, totalExclusions = exclusions.length; exclusion < totalExclusions; exclusion++ ) {
					var currentExclusion = exclusions[exclusion];
					// we'll have to update this later when the two fields are made to match ( hbsId vs huId )  IMPORTANT NOTE!!
					if ( currentExclusion.prsnId == currentRecord.prsnId ) {
						file.records[recordId]["exclusion"] = currentExclusion;
						hasExclusion = true;
					}
				}

				// adds the current record to our recordTable array
				recordsTable[tableRow++] = '<tr class="table-body-row__light" data-record="' + recordId + '" data-ui-settings="size__large material__paper" data-ui-state="' + ( hasExclusion ? "has__exclusion" : "" ) + ( hasErrors ? " has__error" :"" ) + '" data-js="load__record">';
				recordsTable[tableRow++] = '<td class="table-body-row-cell_ is__firstName' + ( hasErrors ? " has__error":"" ) + '" data-ui-settings="size__large">' + currentRecord.firstName + '</td>';
				recordsTable[tableRow++] = '<td class="table-body-row-cell_ is__lastName' + ( hasErrors ? " has__error":"" ) + '" data-ui-settings="size__large">' + currentRecord.lastName + '</td>';
				recordsTable[tableRow++] = '</tr>';
				



				if ( hasErrors ) {
					// records without errors have an empty array - if the errors array length is greater than zero then we know there are errors
					// then we add the errors to the record entry in file.records[recordId]["errors"]
					file.records[recordId]["errors"] = {};
					for ( var error = 0,len = errors.length; error < len; error++ ) {
						var currentError;
						currentError = errors[error];
						file.records[recordId]["errors"][currentError["field"]] = {
							message : currentError["message"],
							type    : currentError["type"],
							ind     : currentError["ind"]
						};
					}
				}

				// add the fields in the record to the file.records[recordId]
				for ( var field in fields ) {
					var currentFieldValue;
					// we use the fields we pull from the user's meta data
					// by looping through the values in this we look up the fields in the current record
					// and then add them to our file.records[recordId] attribute
					currentFieldValue = currentRecord[field];
					file.records[recordId][field] = currentFieldValue;					
				}
			}
			// finishes the recordsTable array
			recordsTable[tableRow++] = '</tbody>';
			// converts the array into a string containing the records table 'tbody'cvvgvv
			recordsTable.join('');
			document.querySelector("[data-js~='recordsTable']").insertAdjacentHTML( "beforeend", recordsTable );

			// all of the HTML has been generated
			// now we need to update it with our plugins and custom javascript
			App.setupUI();
		},
		setupUI : function() {
			// APPLY ALL OF THE UI PLUGINS
			UI.tabs();

			actionsheets.archiveFiles.init();

			calendar.exclusions.init();

			cuboids.appSuite.init();
			cuboids.app.init();

			exclusions.init();
			UI.glyphs();
			modals.iframe.init();
			
			notifications.inApp.init();

			offCanvasPanels.fileSummary.init();
			offCanvasPanels.records.init();

			segmentControls.fileRecords();

			tables.records.init();
			tables.details.init();
			tables.init();

			sticky.records.init();
			sticky.details.init();

			App.appSuite.init();

			// for initializing on none mobile devices only
			if ( !UI.utilities.isMobile ) {
				tooltips.init();
			}
			// for initializing on mobile devices only
			if( UI.utilities.isMobile ) {
				FastClick.attach(document.body);
			}

			this.animateInUI();
		},
		animateInUI : function() {
			var prepUIForAnimateIn = function() {
				console.log("fired");
				offCanvasPanels.fileSummary.UI.showPanel();
				setTimeout(function(){
					cuboids.appSuite.UI.show("front");
					UI.DOM.removeDataValue( cuboids.app.el.querySelector("[data-ui-state~='is__camouflaged']"),"data-ui-state","is__camouflaged" );
				},100);
				setTimeout(function(){
					cuboids.app.UI.show("front");
					UI.DOM.removeDataValue( cuboids.appSuite.el.querySelector("[data-ui-state~='is__camouflaged']"),"data-ui-state","is__camouflaged" );
				},280);
				setTimeout(function() {
					var inAppNotification = document.querySelector("[data-js='inAppNotification']");
					UI.DOM.removeDataValue( inAppNotification,"data-ui-state","is__hidden" );
				},800);
			};

				// we do this so the main canvas can animate in on load
				// the file summary off canvas panel changes the state of the main canvas depending on whether it's open or close
				// so we simply want to give a unique state of pushed way back, and to have an opacity of zero
				// so that when we show the panel and it would normally animate the canvas back in space, this animates it forward
				var mainCanvas = document.querySelector("[data-js~='app__mainCanvas']");
				UI.DOM.addDataValue( mainCanvas,"data-ui-state","animate__off scale__down-lg fade__out" );
				document.querySelector("[data-js~='app__mainCanvas']").offsetHeight;

				// this moves the splash element up and fades it out
				splash.hide( true, prepUIForAnimateIn );

		},
		reValidateRecordField : function(e) {
			var selectedField,fieldDisplayName,fieldName,reqRecords,API_URL,appLogo,fileLoader;
			selectedField    = tables.details.UI.currentHighlightedRow();
			fieldDisplayName = selectedField.querySelector("[data-table-title~='Field']").innerHTML;
			fieldObject      = tables.details.UI.list.get("is__field",fieldDisplayName)[0].values();
			fieldName        = fieldObject.fieldName;

			// setup the XMLHttpRequest
			updateAPIURLs();
			reqRecords = new XMLHttpRequest();
			reqRecords.open("GET", file.API.records.get.active ,true);
			reqRecords.onreadystatechange = function() {
				var errorStatus,errorMessage;
				if( this.readyState == 4) {
					if( this.status == 200) {
						var records = JSON.parse( this.response );
						var errors  = records.records[0].errors;
						if ( errors !== undefined && errors !== null ) {
							// we know there are still errors, so we need to check if the field that was active when the request was sent still has an error
							var errorIsFixed = true;
							for ( var error = 0, totalErrors = errors.length; error < totalErrors; error++ ) {
								var currentError = errors[error];
								if ( currentError.field = fieldName ) {
									// if this conditional passes it means the error still exists
									errorIsFixed = false;
								}
							}
							if ( errorIsFixed ) {
								// the error was sucessfully fixed

								// we update the variables for our notification
								errorStatus  = "success";
								errorMessage = "You're a rockstar, the error has been fixed!";

								modals.iframe.UI.hideModal();
								// we remove the specific error from the record in our file.records variable
								delete file.records[file.records.active].errors[fieldName];
								tables.details.UI.remove( "fieldName", fieldName, true, function() {
									tables.details.UI.list.add({
										'fieldName'     : fieldName,
										'is__field'     : file.fieldNames.bio[fieldName],
										'is__error'     : "no error",
										'has__error'    : "",
										'is__exclusion' : "",
										'is__pending'   : "", 
										'content'       : records.records[0].record[fieldName],
										'hbsId'         : records.records[0].record.prsnId
									});
								});
								if ( errors.length == 0 ) {
									// if this passes it means there are no remaining errors, so we need to update the record in the first record table to not show as having errors
									tables.records.UI.remove("personId", records.records[0].record.prsnId, true, function() {
										tables.records.UI.list.add({
											has__error    : "",
											is__exclusion : "",
											is__firstName : records.records[0].record.firstName,
											is__lastName  : records.records[0].record.lastName,
											is__pending   : "",
											personId      : records.records[0].record.prsnId
										});
									});
								}
							} else {
								// the error is still there
								errorStatus  = "error";
								errorMessage = "Ugh, what a pesky error, it's still there!";
							}
							notifications.inApp.UI.update( errorStatus, errorMessage );
						}
					}
					else {
						errorMessage = "Records HTTP error " + this.status + " " + this.statusText;
						notifications.inApp.UI.update( "error", errorMessage );
						//console.log("Records HTTP error "+this.status+" "+this.statusText);
					}
				}
			};
			reqRecords.send();

			// create a and initalize a loader for our new XMLHttprequest object
			loaders.inApp( reqRecords );
		}
	}










	modals.login.init();
	App.getUser();


