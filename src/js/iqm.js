	var file,stats;
	file = {
		PDM_URL_base : undefined,
		user         : undefined, // MBA|DOC|ADMIN
		role         : undefined, // MBA|DOC
		report       : "bio",     // bio|admit *is bio by default on load
		term         : undefined, // S = sping|F = fall
		year         : undefined, // ex: 1999,2000,etc

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



	// used like:
	// element.dispatchEvent(clickEvent);
	var __events = {
		__click : new MouseEvent("click", {
				"view": window,
				"bubbles": true,
				"cancelable": false
		}),
		__change : new Event('change')
	};




	var actionsheets = {
		archiveFiles : {
			el : document.querySelector("[data-js~='actionsheetArchiveFiles']") ,
			UI : undefined,
			init : function() {
				var __self,actionsheet;
				__self = this;
				actionsheet = __self.UI = UI.actionsheet(__self.el);

				document.querySelector("[data-js~='updateFile'][value='archive']").addEventListener( 'click', function(e) {
					actionsheet.open();
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
				var dateValidation,renderControls,calendarStart,calendarEnd,today,dd,mm,yyyy,mobileAdjust;
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

				calendarStart = new Pikaday({ 
					field: document.querySelector("[data-js~='exclusionStartDate__datePicker']"),
					format: 'MM/DD/YYYY',
					onSelect: function() {
					    var formattedDate   = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					},
					onOpen   : renderControls,
					onDraw   : renderControls,
					onSelect : validateDate
				 });
				calendarEnd = new Pikaday({ 
					field: document.querySelector("[data-js~='exclusionEndDate__datePicker']"),
					format: 'MM/DD/YYYY',
					onSelect: function() {
					    var formattedDate   = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					},
					onOpen : renderControls,
					onDraw : renderControls,
					onSelect : validateDate
				 });
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
						document.querySelector("[data-js~='exclusionEndDate__datePicker']").readOnly = "readonly";
					} else {
						document.querySelector("[data-js~='exclusionStartDate__datePicker']").readOnly = false;
						document.querySelector("[data-js~='exclusionEndDate__datePicker']").readOnly = false;
					}
				};
				mobileAdjust();
				if ( !UI.utilities.isMobile ) {
					window.addEventListener( 'resize', mobileAdjust );
				}
			},
			reset : function() {
				var today,dd,mm,yyyy,today;
				today = new Date();
				dd    = today.getDate();
				mm    = today.getMonth()+1;
				yyyy  = today.getFullYear();

				today = mm + '/' + dd + '/' + yyyy + ' ';
				document.querySelector("[data-js~='exclusionStartDate__datePicker']").value = today;
				document.querySelector("[data-js~='exclusionEndDate__datePicker']").value = "";
			}
		}
	};




	// UI module objects
	var cuboids = {
		appSuite : {
			isAppSuiteOpen : false,
			el             : document.querySelector("[data-js~='cuboid__initAppSuite']"),
			settings       : {
				sideToShowOnInit : "bottom"
			},
			UI       : null,
			init : function() {
				var __self,__cuboid,backToApp; 
				__self       = this;
				__self.UI    = __cuboid = UI.cuboid( __self.el,__self.settings );

				document.querySelector("[data-js~='cuboid__showAppSuiteSettings']").addEventListener( 'click', __self.show__appSuiteSettings.bind(this) );
				document.querySelector("[data-js~='cuboid__showAppSuiteApps']").addEventListener( 'click', __self.show__appSuiteApps.bind(this) );
				backToApp = document.querySelectorAll("[data-js~='cuboid__showAppSuiteApp']");
				for ( var backBtn = 0, backBtnsLen = backToApp.length; backBtn < backBtnsLen; backBtn++ ) {
					backToApp[backBtn].addEventListener( 'click', __self.show__appSuiteApp.bind(this) );
				}

				UI.keyboard({
					combination          : ['alt','a'],
					onPress     : function(e) {
						__self.show__appSuiteApps();
					}
				});
				UI.keyboard({
					combination          : ['alt','s'],
					onPress     : function(e) {
						__self.show__appSuiteSettings();
					}
				});
				UI.keyboard({
					combination          : ['escape'],
					onPress     : function(e) {
						__self.show__appSuiteApp();
					},
					exception : function() {
						var exception = false;
						if ( !cuboids.appSuite.isAppSuiteOpen ) {
							exception = true;
						}
						return exception;
					}
				});
			},
			show__appSuiteSettings : function() {
				var __self,apps,app,appsGrid,appsSettings;
				__self       = this;
				apps         = document.querySelector("[data-js~='appSuite__apps']");
				app          = document.querySelector("[data-js~='appSuite__app']");
				appsGrid     = document.querySelector("[data-js~='appsGrid']");
				appsSettings = document.querySelector("[data-js~='appsSettings']");

				UI.DOM.removeDataValue( appsSettings,"data-ui-state","is__hidden" );
				UI.DOM.addDataValue( appsGrid,"data-ui-state","is__hidden" );

				UI.animate([app,apps], { animationName : "swap" });
				this.UI.show("top");
				cuboids.appSuite.isAppSuiteOpen = true;
			},
			show__appSuiteApps : function() {
				var __self,apps,app,appsGrid,appsSettings;
				__self       = this;
				apps         = document.querySelector("[data-js~='appSuite__apps']");
				app          = document.querySelector("[data-js~='appSuite__app']");
				appsGrid     = document.querySelector("[data-js~='appsGrid']");
				appsSettings = document.querySelector("[data-js~='appsSettings']");

				UI.DOM.removeDataValue( appsGrid,"data-ui-state","is__hidden" );
				UI.DOM.addDataValue( appsSettings,"data-ui-state","is__hidden" );

				UI.animate([app,apps], { animationName : "swap" });
				this.UI.show("bottom");
				cuboids.appSuite.isAppSuiteOpen = true;
			},
			show__appSuiteApp : function() {
				var __self,apps,app;
				__self = this;
				apps   = document.querySelector("[data-js~='appSuite__apps']");
				app    = document.querySelector("[data-js~='appSuite__app']");

				UI.animate([apps,app], { animationName : "swap" });

				this.UI.show("front");
				setTimeout(function() {
					cuboids.appSuite.isAppSuiteOpen = false;
				},700);
			}
		},
		app : {
			el       : document.querySelector("[data-js~='cuboid__initApp']"),
			settings : {
				sideToShowOnInit : "bottom"
			},
			UI   : null,
			init : function() {
				var __self,__cuboid;
				__self    = this;
				__self.UI = __cuboid = UI.cuboid( __self.el,__self.settings );
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
					__self.postExclusion("create");
				} else {
					// if there is an exclusion already created then we so a simple update
					__self.postExclusion("update");
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
			// we make sure the values in our 'file' object are up to date before constructing our API url
			App.updateAPI_URLValues();
			__self    = this;
			// the active/open record in the UI
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

			exclusion["prsnId"]    = record.prsnId;
			exclusion["group"]     = file.role;
			exclusion["type"]      = file.report;
			exclusion["firstName"] = record.firstName;
			exclusion["lastName"]  = record.lastName;
			exclusion["startDate"] = moment(startDate,"'MM/DD/YYYY'").format("YYYY-MM-DD");
			exclusion["note"]      = __self.exclusionNote.innerText;

			return exclusion;
		},
		postExclusion : function(createOrupdate) {
			var __self,exclusionData,reqExclusionCreate;
			__self             = this;
			exclusionData      = __self.returnExclusionValues();
			reqExclusionCreate = new XMLHttpRequest();
			reqExclusionCreate.open("POST","/iqService/rest/" + file.role + "/" + file.report + "/excl/" + createOrupdate, true);
			reqExclusionCreate.setRequestHeader('Content-Type', 'application/json');
			reqExclusionCreate.onreadystatechange = function() {
				var errorStatus,errorMessage;
				if( this.readyState == 4) {
					if( this.status == 200) {
						console.log( "Config HTTP error " + this.status + " " + this.statusText );
						file.records[ exclusionData.prsnId ].exclusion = exclusionData;
						UI.DOM.addDataValue( tables.records.el.querySelector("[data-record='" + exclusionData.prsnId + "']"), "data-ui-state", "has__exclusion" );

						errorStatus  = "success";
						errorMessage = exclusionData.firstName + " " + exclusionData.lastName + "'s record has been marked as an exclusion.";
					}
					else {
						errorStatus  = "error";
						errorMessage = "Config HTTP error " + this.status + " " + this.statusText;
					}
					notifications.inApp.updateStatus( errorStatus, errorMessage );
				}
			};
			// we send the request for the config data
			reqExclusionCreate.send( JSON.stringify( exclusionData ) );
			// create a and initalize a loader for our new XMLHttprequest object
			loaders.inApp( reqExclusionCreate );
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
		openExclusion : function(noteCollapsed) {
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
			if ( noteCollapsed ) {
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
 



	var modals = {
		iframe : {
			el       : document.querySelector("[data-js~='modal__iframe']"),
			iFrame   : document.querySelector("[data-js~='iframePDM']"),
			settings : {
				mainCanvasElement          : document.querySelector("[data-js~='app__mainCanvas']"),
				clickOutsideExemptElements : [document.querySelector("[data-js~='appClickException']")]
			},
			UI : undefined,
			init : function() {
				var __self,modal,settings,modal,submitButton;
				__self   = this;
				el       = __self.el;
				settings = __self.settings;

				modal = __self.UI = UI.modal( el,settings );

				submitButton = document.querySelector("[data-js~='reValidateRecordField']");
				submitButton.addEventListener( 'click', App.reValidateRecordField );
			},
			updateModaliFrameSource : function(recordID) {
				var iFrameURL;
				// we update our file object
				App.updateAPI_URLValues();
				iFrameURL = file.PDM_URL_base + file.role + "/btStuDtl/edit?prsnId=" + recordID;

				modals.iframe.iFrame.setAttribute('src', iFrameURL);	
			}
		}
	};




	var offCanvasPanels = {
		fileSummary : {
			el : document.querySelector("[data-js~='offCanvasPanel__fileSettings']"),
			settings : {
				showOnInit                 : false,
				onActiveUnfocusMainCanvas  : true,
				closeOnClickOutside        : true,
				clickOutsideExemptElements : [document.querySelector("[data-js~='appClickException']")],
				closeOnEscape              : true,
				closeOnEscapeExemption     : function() {
					var exception;
					exception = false;

					if ( cuboids.appSuite.isAppSuiteOpen ) {
						exception = true;
					}
					return exception;
				},
				mainCanvasElement          : document.querySelector("[data-js~='app__mainCanvas']"),
				toggleBtnSelector          : "[data-js~='file-options__toggle']",
				side                       : "right",
				onShowPanel                : function() {
					var panelToggleIcon = document.querySelector("[data-js~='fileSummaryToggleIcon']");
					UI.DOM.addDataValue( panelToggleIcon,"data-ui-state","is__open" );
				},
				onHidePanel                : function() {
					var panelToggleIcon = document.querySelector("[data-js~='fileSummaryToggleIcon']");
					UI.DOM.removeDataValue( panelToggleIcon,"data-ui-state","is__open" );
				}
			},
			UI : undefined,
			init : function() {
				var __self, panel,settings,__UI,toggleBtn;
				__self    = this;
				panel     = __self.el;
				settings  = __self.settings;

				__UI = __self.UI = UI.offCanvasPanel(panel,settings);


				UI.keyboard({
					combination          : ['alt','f'],
					onPress     : function(e) {
						__UI.showPanel();
					},
					exception : function() {
						var exception;
						exception = false;

						if ( modals.iframe.UI.isModalShowing() || __UI.isPanelShowing() ) {
							exception = true;
						}
						return exception;
					}
				});


				var appCanvas  = document.querySelector("[data-js~='app__mainCanvas']");
				var hammertime = new Hammer(appCanvas);

				hammertime.on("swipeleft", function() {
					offCanvasPanels.fileSummary.UI.showPanel();
				});
				hammertime.on("swiperight", function() {
					if ( __UI.isPanelShowing() ) {
						offCanvasPanels.fileSummary.UI.hidePanel();
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
				clickOutsideExemption      : function() {
					var dontClose,fileSumaryOffCanvas,fileSumaryOffCanvas__isOpen,resolution__isToHight ;

					dontClose                   = false;
					fileSumaryOffCanvas         = document.querySelector("[data-js~='offCanvasPanel__fileSettings']");

					fileSumaryOffCanvas__isOpen = ( fileSumaryOffCanvas.dataset.uiState.indexOf('is__showing-offCanvasPanel') > -1 ) ? true : false;
					resolution__isToHight       = ( window.innerWidth > 1299 ) ? true : false;

					if ( fileSumaryOffCanvas__isOpen || resolution__isToHight ) {
						dontClose = true;
					}
					return dontClose;
				},
				closeOnEscape   : true,
				closeOnEscapeExemption : function() {
					var dontClose,iframeModal,fileSumaryOffCanvas,iframeModal__isOpen,fileSumaryOffCanvas__isOpen,resolution__isToHight;

					dontClose           = false;
					iframeModal         = document.querySelector("[data-js~='modal__iframe']");
					fileSumaryOffCanvas = document.querySelector("[data-js~='offCanvasPanel__fileSettings']");

					iframeModal__isOpen         = ( iframeModal.dataset.uiState.indexOf('is__showing-modal') > -1 ) ? true : false;
					fileSumaryOffCanvas__isOpen = ( fileSumaryOffCanvas.dataset.uiState.indexOf('is__showing-offCanvasPanel') > -1 ) ? true : false;
					resolution__isToHight       = ( window.innerWidth > 1299 ) ? true : false;

					if ( iframeModal__isOpen || fileSumaryOffCanvas__isOpen || resolution__isToHight || cuboids.appSuite.isAppSuiteOpen ) {
						dontClose = true;
					}
					return dontClose;
				},
				showBtnSelector : "[data-js~='showFileContents']",
				hideBtnSelector : "[data-js~='hideFileContents']",
				side : "left"
			},
			UI       : undefined,
			init     : function() {
				var __self,panel,panelInner,settings,adjustStyles;
				__self       = this;
				panel        = __self.el;
				panelInner   = panel.querySelector("[data-js~='appHuver__recordsInner']");
				settings     = __self.settings; 
				adjustStyles = __self.adjustPanelStyles.bind(__self);

				__UI = __self.UI = UI.offCanvasPanel(panel, settings);

				adjustStyles();
				window.addEventListener('resize', adjustStyles );

				// when the resolution is less than 1300 px
				// pressing alt & the 'r' key at the same time will open the records panel
				var keyboardShortcut = function(e) {
					if ( window.innerWidth < 1300 ) {
						if ( e.altKey && e.keyCode == 82 ) {
							__UI.showPanel();
						}
					}
				};
				document.addEventListener('keydown', keyboardShortcut);
			},
			adjustPanelStyles : function() {
				// when the window is at desktop reslutions we want the record and detail panels to sit next to each other
				// if it's below desktop resolution we want the records panel to be a open and closeable panel
				// when it's closeable we want no padding, when it's a none closeable we want it to have padding
				var __self,panel,innerPanel,addToPanel,removeFromPanel,addToInnerPanel,removeFromInnerPanel;
				__self     = this;
				panel      = __self.el;
				innerPanel = panel.querySelector("[data-js~='appHuver__recordsInner']");

				if ( window.innerWidth < 1300 ) {
					addToPanel           = "mount__none depth__medium";
					removeFromPanel      = "mount__thick depth__none";

					addToInnerPanel      = "material__film depth__none";
					removeFromInnerPanel = "material__paper depth__low";
				} else {
					addToPanel           = "mount__thick depth__none";
					removeFromPanel      = "mount__none depth__medium";

					addToInnerPanel      = "material__paper depth__low";
					removeFromInnerPanel = "material__film depth__none";
					// we make sure the records panel is open automatically when we are over the 1300px width resolution
					__self.UI.showPanel(false);
				}

				UI.DOM.removeDataValue( panel, "data-ui-settings", removeFromPanel );
				UI.DOM.addDataValue( panel, "data-ui-settings", addToPanel );

				UI.DOM.removeDataValue( innerPanel, "data-ui-settings", removeFromInnerPanel );
				UI.DOM.addDataValue( innerPanel, "data-ui-settings", addToInnerPanel );
			}
		}
	};




	var segmentControls = {
		fileSettings : function() {
			var fileSettings;
			fileSettings = ['report','term']; // will eventually include year
			if ( file.role === "ADMIN" ) {
				fileSettings.push('role');
			} 
			for ( var setting = 0, settingsLen = fileSettings.length; setting < settingsLen; setting++ ) {
				var currentSetting,settingControls;
				currentSetting  = fileSettings[setting];
				settingControls = document.querySelectorAll("[name='" + currentSetting + "']");

				for ( var control = 0, controlsLen = settingControls.length; control < controlsLen; control++ ) {
					var currentControl;
					currentControl = settingControls[control];

					currentControl.addEventListener( 'change', function(e) {
						var el,isChecked;
						el        = e.currentTarget;
						isChecked = el.checked;

						if ( isChecked ) {
							// the name is one of the fileSettings, ex. 'report'|'term'
							file[ el.name ] = el.value;
						}
					});
				}
			}
		}
	};




	var sticky = {
		records : {
			el : document.querySelector("[data-js~='records__positionSticky']"),
			settings : {
				scrollingElement   : document.querySelector("[data-js~='appHuver__records']"),
				widthReference     : document.querySelector("[data-js~='appHuver__records']").querySelector("[data-js~='appHuver__recordsInner']"),
				distanceToStick    : 30
			},
			UI : undefined,
			init : function() {
				var __self,__sticky,settings,__UI;

				__self   = this;
				__sticky = __self.el;
				__self.settings.onActivateSticky   = sticky.records.addOffsetScroll;
				__self.settings.onDeactivateSticky = sticky.records.removeOffsetScroll;
				settings = __self.settings;
				__UI     = __self.UI = UI.sticky(__sticky,settings);
			}
		},
		details : {
			el : document.querySelector("[data-js~='details__positionSticky']"),
			settings : {
				scrollingElement   : document.querySelector("[data-js~='appHuver__recDetails']"),
				widthReference     : document.querySelector("[data-js~='appHuver__recDetails']").querySelector("[data-js~='appHuver__details-inner']"),
				distanceToStick    : 30
			},
			UI : undefined,
			init : function() {
				var __self,__sticky,settings,__UI;

				__self   = this;
				__sticky = __self.el;
				settings = __self.settings;
				__UI     = __self.UI = UI.sticky(__sticky,settings);
			}
		}
	}; 




	tables = {
		init : function() {
			var __self,recordsTable,detailsTable; 
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
						var exception,tableIsNotActive,fileSummaryIsOpen,modalIsShowing;
						exception = false;

						 // if the panel is showing, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false;
						// if the modal is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; 

						if ( fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}

						return exception;
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
				scrollingElement 	              : document.querySelector("[data-js~='appHuver__records']"),	

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
				exceptions : {
					allKeys : function() {
						var exception,tableIsNotActive,fileSummaryIsOpen,modalIsShowing;
						exception = false;

						tableIsNotActive  = ( tables.details.UI.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}
						return exception;
					}
				}
			},
			init     : function() {
				var __self,__table,errorsFilter;
				__self       = this;
				__self.UI    = __table = UI.table( __self.el, __self.settings );
				errorsFilter = document.querySelector("[data-js~='recordsTable__filter']");

				// adding the personIds the the table record objects
				var tableRecordObjects = __table.list.items;
				for ( var tableRecord = 0, totalTableRecords = tableRecordObjects.length; tableRecord < totalTableRecords; tableRecord++ ) {
					var currentTableRecordObject = tableRecordObjects[tableRecord];
					var currentTableRecordNumber = currentTableRecordObject.elm.dataset.record;
					currentTableRecordObject._values.personId = currentTableRecordNumber;
				}

				__table.filter("has__error");
				__table.focusTable();

				errorsFilter.addEventListener( 'change', function(e) {
					var filter,toFilter;
					filter   = e.currentTarget;
					toFilter = filter.value;

					if ( filter.checked === true ) {
						__table.filter( toFilter );
					} else {
						__table.unfilter( toFilter );
					}
				});

				UI.keyboard({
					combination : ['alt','e'],
					onPress     : function(e) {
						var toFilter = errorsFilter.value;

						if ( errorsFilter.checked == true ) {
							__table.unfilter( toFilter );
							errorsFilter.checked = false;
						} else {
							__table.filter( toFilter );
							errorsFilter.checked = true;
						}
					},
					exception  : function() {
						var exception;
						exception = false;

						tableIsNotActive  = ( !__table.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}
						return exception;
					}
				});



				UI.keyboard({
					combination          : ['alt','space'],
					preventDefaultAction : true,
					onPress     : function(e) {
						document.querySelector("[data-js~='recordsTable__search']").focus();
					},
					exception : function() {
						var exception;
						exception = false;

						tableIsNotActive  = ( !__table.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}
						return exception;
					}
				});
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
					offCanvasPanels.fileSummary.UI.hidePanel();
					modals.iframe.UI.showModal();
				},
				exceptions : {
					allKeys : function() {
						var exception,tableIsNotActive,fileSummaryIsOpen,modalIsShowing;
						exception = false;

						tableIsNotActive  = ( tables.records.UI.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}

						return exception;
					}
				}
			},
			activeRecord : null,
			init : function() {
				var __self,__table;
				__self       = this;
				__self.UI    = __table = UI.table( __self.el, __self.settings );
				detailsTable = __table; 
				errorsFilter = document.querySelector("[data-js~='detailsTable__filter']");

				errorsFilter.addEventListener( 'change', function(e) {
					var filter,toFilter;
					filter   = e.currentTarget;
					toFilter = filter.value;

					if ( filter.checked == true ) {
						__table.filter( toFilter );
					} else {
						__table.unfilter( toFilter );
					}
				});

				UI.keyboard({
					combination : ['alt','e'],
					onPress     : function(e) {
						var toFilter = errorsFilter.value;

						if ( errorsFilter.checked == true ) {
							__table.unfilter( toFilter );
							errorsFilter.checked = false;
						} else {
							__table.filter( toFilter );
							errorsFilter.checked = true;
						}
					},
					exception  : function() {
						var exception;
						exception = false;

						tableIsNotActive  = ( !__table.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}
						return exception;
					}
				});

				UI.keyboard({
					combination          : ['alt','space'],
					preventDefaultAction : true,
					onPress     : function(e) {
						document.querySelector("[data-js~='detailsTable__search']").focus();
					},
					exception : function() {
						var exception;
						exception = false;

						tableIsNotActive  = ( !__table.isTableFocused() ) ? true : false; // if the active table is not the currentTable, exception is true
						fileSummaryIsOpen = ( offCanvasPanels.fileSummary.UI.isPanelShowing() ) ? true : false; // if the panel is showing, exception is true
						modalIsShowing    = ( modals.iframe.UI.isModalShowing() ) ? true : false; // if the modal is showing, exception is true

						if ( tableIsNotActive || fileSummaryIsOpen || modalIsShowing ) {
							exception = true;
						}
						return exception;
					}
				});
				


				var init = true;
				// the click event listener for the table rows in the records table
				document.querySelector("[data-js~='recordsTable']").addEventListener('click', function(e) {
					var targetEl = e.target.parentElement;
					if ( targetEl.dataset.js === "load__record" ) {
						tables.details.openRecord( targetEl );
					}
				});

				__self.el.addEventListener("click", function(e) {
					if ( e.target.parentElement.dataset.js === "show__iframe" ) {
						offCanvasPanels.fileSummary.UI.hidePanel();
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
				
				// unfilter the details table so we can have access to all the fields temporarily
				detailsTableFilterEl         = document.querySelector("[data-js~='detailsTable__filter']");
				detailsTableFilterEl.checked = false;
				detailsTableFilterEl.dispatchEvent(__events.__change);

				// adds our new table rows via the 'toAdd' array we've just finished creating
				__self.UI.add(toAdd);
				__self.UI.remove("hbsId", file.records.active);
				__self.UI.remove("hbsId", "");
				file.records.active = recordID;


				// reapply the details table filter
				deatilsTableFilterEl         = document.querySelector("[data-js~='detailsTable__filter']");
				detailsTableFilterEl.checked = true;
				detailsTableFilterEl.dispatchEvent(__events.__change);

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

				// recordsData.active  = recordID;
				// file.records.active = recordID;
				init = false;
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




	var App = {
		recordsTable : [],
		setupUser : function( configRequest ) {  // CONFIG SETUP STEP 1
			var __self,config,user,roles,role,config; 
			__self = this;
			config = JSON.parse( configRequest.response );
			user   = config.userInfo;
			roles  = user.roles;
			role   = undefined;
			// adds the base URL for PDM lookups in the iframe
			file.PDM_URL_base = config.config.PDM_URL;

			// determine's the logged in user's role
			if ( roles.indexOf("IQ_ADMIN") > -1 ) {
				role = file.role = "MBA";
				file.user = "ADMIN";
			} else if ( roles.indexOf("IQ_MBA") > -1 ) {
				role = file.user = file.role = "MBA";
			} else if ( roles.indexOf("IQ_DOC") > -1 ) {
				role = file.user = file.role = "DOC";
			}

			// sets user's name in the global navigation
			document.querySelector("[data-js~='userName']").innerHTML = user.firstName;
			// if the user isn't an admin we remove the segment control that allows the user to switch between MBA/DOCTORAL files
			if ( file.user !== "ADMIN" ) {
				document.querySelector("[data-js~='adminFileOption']").remove();
			}

			// creates in the 'file' variable, under fieldNames a reference of human readable field names for our HTML
			App.setupFields( config.metadata );

			// we initialize the records and exclusions XMLHTTPRequests
			var requestRecords    = UI.request({ method: "GET", URL: App.getAPI_URL() });
			var requestExclusions = UI.request({ method: "GET", URL: "/iqService/rest/" + file.role + "/" + file.report + "/excl.json" });

			// we initialize the records and exclusions loader loader
			loaders.initializeApp([requestRecords,requestExclusions],document.querySelector("[data-js~='appLoader__records']"),App.buildRecords);
			document.querySelector("[data-js~='appLoader__description']").innerHTML = "processing records";
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

			buildFields( "bio",bioFields,bioFieldNames );
			buildFields( "admit",admitFields,admitFieldNames );
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
			tableRow     = 1;
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
					if ( currentExclusion.hbsId == currentRecord.huId ) {
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

			segmentControls.fileSettings();

			tables.records.init();
			tables.details.init();
			tables.init();

			sticky.records.init();
			sticky.details.init();

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
			var splash,removeSplash;
			splash = document.querySelector("[data-js~='splash__finishedLoad']");

			removeSplash = function(e) {
				if ( e.target == splash ) {
					splash.removeEventListener("webkitTransitionEnd", removeSplash);
					// fastdom.write(function() {
						splash.style.display = "none";
						//splash.remove();

						offCanvasPanels.fileSummary.UI.showPanel();
					// });
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
				}
			};

			splash.addEventListener("webkitTransitionEnd", removeSplash);
			fastdom.write(function() {
				// we do this so the main canvas can animate in on load
				// the file summary off canvas panel changes the state of the main canvas depending on whether it's open or close
				// so we simply want to give a unique state of pushed way back, and to have an opacity of zero
				// so that when we show the panel and it would normally animate the canvas back in space, this animates it forward
				var mainCanvas = document.querySelector("[data-js~='app__mainCanvas']");
				UI.DOM.addDataValue( mainCanvas,"data-ui-state","animate__off scale__down-lg fade__out" );
				document.querySelector("[data-js~='app__mainCanvas']").offsetHeight;

				// this moves the splash element up and fades it out
				splash.style.transform = "translateY(-100px)";
				splash.style.opacity   = 0;
			});
		},
		updateAPI_URLValues : function() {
			var report,term,year,role,personId,API_URL;
			// report is either 'Bio' or 'Admit'
			file.report = document.querySelector("[data-js~='updateFile'][name='report']:checked").value;
			// term is either 'S' for spring or 'F' for fall
			file.term   = document.querySelector("[data-js~='updateFile'][name='term']:checked").value;
			file.year   = document.querySelector("[data-js~='updateFile'][name='year']:checked").value;
			if ( year === "archive" ) {
				// if the selected 'year' segment control is the archive, we need to look to our action sheet to find the value
				file.year = actionsheets.archiveFiles.UI.getSelectedValue();
			}

			if ( file.user === "ADMIN" ) {
				file.role = document.querySelector("[data-js~='updateFile'][name='role']:checked").value;
			}
		},
		getAPI_URL : function(lookupActiveRecord) {
			var API_URL,activeRecord;
			App.updateAPI_URLValues();
			activeRecord = ( lookupActiveRecord !== undefined ) ? "&personId=" + file.records.active : "";
			//var __file = ( file.report === "bio" ) ? "bio" : file.report;
			API_URL      = "/iqService/rest/" + file.role + "/" + file.report + ".json?term=" + file.term + "&year=" + file.year + activeRecord;

			return API_URL;
		},
		reValidateRecordField : function(e) {
			var selectedField,fieldDisplayName,fieldName,reqRecords,API_URL,appLogo,fileLoader;
			selectedField    = tables.details.UI.currentHighlightedRow();
			fieldDisplayName = selectedField.querySelector("[data-table-title~='Field']").innerHTML;
			fieldObject      = tables.details.UI.list.get("is__field",fieldDisplayName)[0].values();
			fieldName        = fieldObject.fieldName;

			// generate the URL for our API call
			API_URL          = App.getAPI_URL(true);
			// setup the XMLHttpRequest
			reqRecords = new XMLHttpRequest();
			reqRecords.open("GET",API_URL,true);
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
							notifications.inApp.updateStatus( errorStatus, errorMessage );
						}
					}
					else {
						errorMessage = "Records HTTP error " + this.status + " " + this.statusText;
						notifications.inApp.updateStatus( "error", errorMessage );
						//console.log("Records HTTP error "+this.status+" "+this.statusText);
					}
				}
			};
			reqRecords.send();

			// create a and initalize a loader for our new XMLHttprequest object
			loaders.inApp( reqRecords );
		}
	}







	var notifications = {
		inApp : {
			el         : document.querySelector( "[data-js~='inAppNotification']" ),
			backing    : document.querySelector( "[data-js~='inAppNotificationBacking']" ),
			message    : document.querySelector( "[data-js~='inAppNotificationMessage']" ),
			close      : document.querySelector( "[data-js~='inAppNotificationClose']" ),
			icon       : document.querySelector( "[data-js~='inAppNotificationIcon']" ),
			status     : "error",
			timer      : undefined,
			init : function() {
				notifications.inApp.close.addEventListener( 'click', function(e) {
					notifications.inApp.hideNotification();
					e.stopPropagation();
				});

				notifications.inApp.el.addEventListener( 'mouseover', function() {
					clearTimeout( notifications.inApp.timer );
				});

				notifications.inApp.el.addEventListener( 'mouseout', function() {
					notifications.inApp.timer = setTimeout(function() {
													notifications.inApp.hideNotification();
												}, 5000);
				});
			},
			showNotification : function() {
				var backing;
				backing = notifications.inApp.backing;

				cuboids.app.UI.show("bottom");
				UI.DOM.addDataValue( backing,"data-ui-state","is__animating" );
				UI.DOM.removeDataValue( backing,"data-ui-state","fade__out" );

				notifications.inApp.timer = setTimeout(function() {
												notifications.inApp.hideNotification();
											}, 5000);
			},
			hideNotification : function() {
				var backing;
				backing = notifications.inApp.backing;

				cuboids.app.UI.show("front");
				setTimeout(function() {
					UI.DOM.removeDataValue( backing,"data-ui-state","is__animating" );
					UI.DOM.addDataValue( backing,"data-ui-state","fade__out" );
				},700);
			},
			// status can be 'warning','error' or sucess
			updateStatus : function( status,message ) {
				var icon,backingStatus;

				backingStatus = "is__" + status;

				notifications.inApp.message.innerHTML = message;
				UI.DOM.removeDataValue( notifications.inApp.backing,"data-ui-state", "is__" + notifications.inApp.status );
				UI.DOM.addDataValue( notifications.inApp.backing,"data-ui-state", backingStatus );
				if ( status === "error" || status === "warning" ) {
					icon = "attention";
				} else if ( status === "success" ) {
					icon = "ok";
				}
				notifications.inApp.icon.setAttribute( "data-ui-icon", "place__before " + icon );
				notifications.inApp.status = status;
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
					notifications.inApp.showNotification();

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

	// we initialize the config XMLHTTPRequest
	var requestConfig = UI.request({ method: "GET", URL: "/iqService/rest/config.json?meta=true", success: App.setupUser });
	// we initialize the config loader
	loaders.initializeApp( requestConfig,document.querySelector("[data-js~='appLoader__config']") );
	// we update the splash page loading message
	document.querySelector("[data-js~='appLoader__description']").innerHTML = "creating user profile";



