	var recordsData,file,stats;
	recordsData = {
		active : undefined
	};
	file = {
		PDM_URL_base : undefined,
		role         : undefined, // MBA|DOC
		report       : "bio",     // bio|admit *is bio by default on load
		term         : undefined, // S = sping|F = fall
		year         : undefined, // ex: 1999,2000,etc

		fieldNames : {
			bio   : {},
			admit : {}
		},
		records    : {
			active : undefined
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




	var calendar = {
		exclusions : {
			init : function() {
				var calendar = new Pikaday({ 
					field: document.querySelector("[data-js~='exclusionEndDate__datePicker']"),
					format: 'D MMM YYYY',
					onSelect: function() {
					    var formattedDate   = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					}
				 });
				var calendar = new Pikaday({ 
					field: document.querySelector("[data-js~='exclusionStartDate__datePicker']"),
					format: 'D MMM YYYY',
					onSelect: function() {
					    var formattedDate   = this.getMoment().format('MM/DD/YYYY');
					    this._o.field.value = formattedDate;
					}
				 });

				var today = new Date();
				var dd    = today.getDate();
				var mm    = today.getMonth()+1;
				var yyyy  = today.getFullYear();

				var today = mm + '/' + dd + '/' + yyyy + ' ';
				document.querySelector("[data-js~='activeExclusion__startDate']").value = today;
			}
		}
	};




	// UI module objects
	var cuboids = {
		appSuite : {
			el       : document.querySelector("[data-js~='cuboid__initAppSuite']"),
			settings : {
				sideToShowOnInit : "bottom"
			},
			UI       : null,
			init : function() {
				var __self,__cuboid; 
				__self    = this;
				__self.UI = __cuboid = UI.cuboid( __self.el,__self.settings );

				document.querySelector("[data-js~='cuboid__showAppSuiteApps']").addEventListener( 'click', __self.show__appSuiteApps.bind(this) );
				document.querySelector("[data-js~='cuboid__showAppSuiteApp']").addEventListener( 'click', __self.show__appSuiteApp.bind(this) );
			},
			show__appSuiteApps : function() {
				var apps,app;
				apps = document.querySelector("[data-js~='appSuite__apps']");
				app  = document.querySelector("[data-js~='appSuite__app']");

				UI.animate({
					animation : "swap",
					el 		  : [app,apps]
				});
				this.UI.show("top");
			},
			show__appSuiteApp : function() {
				var apps,app;
				apps = document.querySelector("[data-js~='appSuite__apps']");
				app  = document.querySelector("[data-js~='appSuite__app']");

				UI.animate({
					animation : "swap",
					el 		  : [apps,app]
				});

				this.UI.show("front");
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
			},
			show__appsCuboid : function() {
				this.UI.show("top");
			},
			show__appCuboid : function() {
				this.UI.show("front");
			}
		}
	};




	var exclusions = {
		el : document.querySelector("[data-js~='toggleExclusion']"),
		init : function() {
			var __self,excludeToggle;
			__self        = this;
			excludeToggle = document.querySelectorAll("[data-js~='excludeToggle']");

			for ( var toggle = 0, len = excludeToggle.length; toggle < len; toggle++ ) {
				var currentToggle = excludeToggle[toggle];
				currentToggle.addEventListener('change', function() {
					if ( currentToggle.checked == true ) {
						__self.openExclusions();
					} else {
						__self.closeExclusions();
					}
				});			
			}

			document.querySelector("[data-js~='submitExclusion']").addEventListener('click', function() {
				UI.animate({ el : document.querySelector("[data-js~='toggleExclusionNotes']"),animation : "collapse"});
			});

			document.querySelector("[data-js~='toggleExclusionNote']").addEventListener('click', function() {	
				var __el,exclusionNotes; 
				__el           = this;
				exclusionNotes = document.querySelector("[data-js~='toggleExclusionNotes']");

				if ( exclusionNotes.offsetHeight > 0 ) {
					// if the current rendered height is greater than zero we'll collapse it, other wise we'll expand it
					__el.setAttribute("data-ui-state", "animate__out rotate__90-neg");
					UI.animate({ el : exclusionNotes ,animation : "collapse"});
				} else {
					__el.setAttribute("data-ui-state", "animate__out");
					UI.animate({ el : exclusionNotes ,animation : "expand"});
				}
			});

		},
		openExclusions : function() {
			UI.animate({el : document.querySelector(".exclude"),animation : "expand"});
			document.querySelector(".exclude-content").setAttribute("data-ui-state", "animate__out");
		},
		closeExclusions : function() {
			UI.animate({el : document.querySelector(".exclude"),animation : "collapse"});
			document.querySelector(".exclude-content").setAttribute("data-ui-state", "animate__out scale__down fade__out");
		}
	};
 



	var modals = {
		iframe : {
			el       : document.querySelector("[data-js~='modal__iframe']"),
			settings : {
				mainCanvasElement : document.querySelector("[data-js~='app__mainCanvas']")
			},
			UI : undefined,
			init : function() {
				var __self,modal,settings,modal;
				__self   = this;
				el       = __self.el;
				settings = __self.settings;

				modal = __self.UI = UI.modal( el,settings );
			},
			updateModaliFrameSource : function(recordID) {
				var pdmId,pdmIframe,role,newURL;

				fastdom.read(function() {
					pdmIframe = document.querySelector("[data-js~='iframePDM']");
				});

				if ( file.role === "MBA") {
					role = 'mba';
				} else if ( file.role === "DOC" ) {
					role = 'doctoral';
				} else if ( file.role === "ADMIN" ) {
					role = document.querySelector("[data-js~='updateFile'][name='role']:checked").value;
				}

				newURL = file.PDM_URL_base + role + "/btStuDtl/edit?prsnId=" + recordID;

				fastdom.write(function() {
					pdmIframe.setAttribute('src', newURL);
				});		
			}
		}
	};




	var offCanvasPanels = {
		fileSummary : {
			el : document.querySelector("[data-js~='offCanvasPanel__fileSettings']"),
			settings : {
				showOnInit                : false,
				onActiveUnfocusMainCanvas : true,
				closeOnClickOutside       : true,
				mainCanvasElement         : document.querySelector("[data-js~='app__mainCanvas']"),
				toggleBtnSelector         : "[data-js~='file-options__toggle']",
				side                      : "right"
			},
			UI : undefined,
			init : function() {
				var __self, panel,settings,__UI,toggleBtn;
				__self    = this;
				panel     = __self.el;
				settings  = __self.settings;

				__UI = __self.UI = UI.offCanvasPanel(panel,settings);

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
				showOnInit              : true, 
				closeOnClickOutside     : true,
				exemptFromClickOutside  : ["[data-js~='file-options__toggle']"],
				clickOutsideExemption : function() {
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

					if ( iframeModal__isOpen || fileSumaryOffCanvas__isOpen || resolution__isToHight ) {
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
				distanceToStick    : 30,
				onActivateSticky   : undefined,
				onDeactivateSticky : undefined
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
			},
			addOffsetScroll : function() {
				var toOffset,offsetValue; 
				toOffset    = document.querySelector("[data-js~='records__offsetSticky']");
				offsetValue = document.querySelector("[data-js~='records__positionSticky']").getBoundingClientRect().height;

				toOffset.style.paddingTop = offsetValue + "px";
			},
			removeOffsetScroll : function() {
				var toOffset,offsetValue; 
				toOffset = document.querySelector("[data-js~='records__offsetSticky']");

				toOffset.style.paddingTop = "0px";
			}
		},
		details : {
			el : document.querySelector("[data-js~='details__positionSticky']"),
			settings : {
				scrollingElement   : document.querySelector("[data-js~='appHuver__recDetails']"),
				widthReference     : document.querySelector("[data-js~='appHuver__recDetails']").querySelector("[data-js~='appHuver__details-inner']"),
				distanceToStick    : 30,
				onActivateSticky   : undefined,
				onDeactivateSticky : undefined
			},
			UI : undefined,
			init : function() {
				var __self,__sticky,settings,__UI;

				__self   = this;
				__sticky = __self.el;
				__self.settings.onActivateSticky   = sticky.details.addOffsetScroll;
				__self.settings.onDeactivateSticky = sticky.details.removeOffsetScroll;
				settings = __self.settings;
				__UI     = __self.UI = UI.sticky(__sticky,settings);
			},
			addOffsetScroll : function() {
				var toOffset,offsetValue; 
				toOffset    = document.querySelector("[data-js~='details__offsetSticky']");
				offsetValue = document.querySelector("[data-js~='details__positionSticky']").getBoundingClientRect().height;

				toOffset.style.paddingTop = offsetValue + "px";
			},
			removeOffsetScroll : function() {
				var toOffset,offsetValue; 
				toOffset = document.querySelector("[data-js~='details__offsetSticky']");

				toOffset.style.paddingTop = "0px";
			}
		}
	}; 




	var tables = {
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
				valueNames     : ['is__firstName','is__lastName','has__error','is__exclusion','is__pending'], 
				searchElements : document.querySelectorAll("[data-js~='recordsTable__search']"),
				sortElements   : document.querySelectorAll("[data-js~='recordsTable__sort']"), 
				filterElements : document.querySelectorAll("[data-js~='recordsTable__filter']"),
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
				var __self,__table;
				__self    = this;
				__self.UI = __table = UI.table( __self.el, __self.settings );

				__table.filter("has__error");
				__table.focusTable();

				document.querySelector("[data-js~='recordsTable__filter']").addEventListener( 'change', function(e) {
					var filter,toFilter;
					filter   = e.currentTarget;
					toFilter = filter.value;

					if ( filter.checked === true ) {
						__table.filter( toFilter );
					} else {
						__table.unfilter( toFilter );
					}
				});
			}
		},
		details : {
			el       : document.querySelector("[data-js~='detailsTable']"),
			UI       : null,
			settings : {
				valueNames            : ['is__field','is__error','has__error','is__exclusion','is__pending', 'content', "hbsId"], 
				searchElements        : document.querySelectorAll("[data-js~='detailsTable__search']"),
				sortElements          : document.querySelectorAll("[data-js~='detailsTable__sort']"), 
				filterElements        : document.querySelectorAll("[data-js~='detailsTable__filter']"),
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

				document.querySelector("[data-js~='detailsTable__filter']").addEventListener( 'change', function(e) {
					var filter,toFilter;
					filter   = e.currentTarget;
					toFilter = filter.value;

					if ( filter.checked === true ) {
						__table.filter( toFilter );
					} else {
						__table.unfilter( toFilter );
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
				//tables.details.openRecord(firstRecord);
				tables.records.UI.selectRow( firstRecord );
			},
			openRecord : function(recordsTableRowEl) {
				var __self,recordID,record,toAdd,detailsTableFilterEl,detailsTableTitle;
				__self   = this;
				recordID = recordsTableRowEl.dataset.record;
				record   = file.records[recordID];
				toAdd    = [];

				// update the modal iframesource
				modals.iframe.updateModaliFrameSource(recordID);

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
				
				// unfilter the details table so we can have access to all the fields temporarily
				detailsTableFilterEl         = document.querySelector("[data-js~='detailsTable__filter']");
				detailsTableFilterEl.checked = false;
				detailsTableFilterEl.dispatchEvent(__events.__change);

				__self.UI.add(toAdd);
				__self.UI.remove("hbsId", recordsData.active);
				__self.UI.remove("hbsId", "");
				recordsData.active = recordID;

				// reapply the details table filter
				deatilsTableFilterEl         = document.querySelector("[data-js~='detailsTable__filter']");
				detailsTableFilterEl.checked = true;
				detailsTableFilterEl.dispatchEvent(__events.__change);


				var recordsTableSelectedRow = tables.records.el.querySelector("[data-ui-state~='is__selected']");
				UI.DOM.addDataValue( recordsTableRowEl, "data-ui-state", "is__selected" );
				detailsTableTitle           = document.querySelector("[data-js~='recordName']");
				detailsTableTitle.innerHTML = record.firstName + " " + record.lastName;


				if ( tables.details.UI.currentHighlightedRow() == undefined ) {
					var firstRow = tables.details.el.querySelector("tbody tr ");
					tables.details.UI.highlightRow( firstRow );
				}

				recordsData.active = recordID;
				init = false;
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
				errorFilters__checkbox = document.querySelectorAll("[data-js~='tooltip__error']");

				for (var currentFilter = 0, len = errorFilters__checkbox.length; currentFilter < len; currentFilter++) {
					_self.settings.target = errorFilters__checkbox[currentFilter];
					new Tooltip(_self.settings);
				}
			}
		},
		fileSummary : {
			settings : {
				target   : document.querySelector("[data-js~='file-options__toggle']"),
				position : 'bottom right',
				content  : 'File Summary (alt + f)',
				classes  : 'tooltip-theme-arrows'
			},
			init : function() {
				var __self;
				__self = this;

				new Tooltip(__self.settings);
			}
		}
	};




	var App = {
		recordsTable : [],
		setupUser : function( config ) {  // CONFIG SETUP STEP 1
			var __self,user,roles,role,config; 
			__self = this;
			user   = config.userInfo;
			roles  = user.roles;
			role   = undefined;
			// adds the base URL for PDM lookups in the iframe
			file.PDM_URL_base = config.config.PDM_URL;

			// determine's the logged in user's role
			if ( roles.indexOf("IQ_ADMIN") > -1 ) {
				role = file.role = "ADMIN";
			} else if ( roles.indexOf("IQ_MBA") > -1 ) {
				role = file.role = "MBA";
			} else if ( roles.indexOf("IQ_DOC") > -1 ) {
				role = file.role = "DOC";
			}

			// sets user's name in the global navigation
			document.querySelector("[data-js~='userName']").innerHTML = user.firstName;
			// if the user isn't an admin we remove the segment control that allows the user to switch between MBA/DOCTORAL files
			if ( role !== "ADMIN" ) {
				document.querySelector("[data-js~='adminFileOption']").remove();
			}

			// creates in the 'file' variable, under fieldNames a reference of human readable field names for our HTML
			__self.setupFields( config.metadata );

			// everything that's needed for the initial records request is been processed
			// so now we request the initial set of records
			reqRecords.send();
			// we initialize the records loader
			loaders.app.startup.records.init();
		},
		setupFields : function( fieldData ) { // CONFIG SETUP STEP 2
			// fieldData = config.metadata
			var bioFields,bioFieldNames,admitFields,admitFieldNames,buildFields;
			// prsnId,degPrgmNum,etc
			bioFields       = fieldData.bio2Fields;
			// the name is under the title attribute
			bioFieldNames   = fieldData.bio2Meta;
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
		buildRecords : function( recordsData ) { // RECORDS SETUP STEP 1
			var __self,records,totalRecords,fields,tableRow;
			__self       = this;
			records      = recordsData.records;
			totalRecords = records.length;
			fields       = file.fieldNames[file.report];

			// starts generating the HTML for records table
			tableRow     = 1;
			__self.recordsTable[0] = '<tbody class="table-body_" data-ui-settings="size__large">';

			for ( var record = 0; record < totalRecords; record++ ) {
				var currentRecord,errors,errorCount,recordId;
				currentRecord = records[record]["record"];
				errors        = records[record]["errors"];
				hasErrors     = ( errors.length > 0 ) ? true : false;
				recordId      = currentRecord["prsnId"];
				//tables.details.settings.valueNames.push("detailOf__" + recordId);  // pretty sure this doesn't actually need to happen

				// adds the current record to our recordTable array
				__self.recordsTable[tableRow++] = '<tr class="table-body-row__light" data-record="' + recordId + '" data-ui-settings="size__large material__paper" data-js="load__record">';
				__self.recordsTable[tableRow++] = '<td class="table-body-row-cell_ is__firstName' + ( hasErrors ? " has__error":"" ) + '" data-ui-settings="size__large">' + currentRecord.firstName + '</td>';
				__self.recordsTable[tableRow++] = '<td class="table-body-row-cell_ is__lastName' + ( hasErrors ? " has__error":"" ) + '" data-ui-settings="size__large">' + currentRecord.lastName + '</td>';
				__self.recordsTable[tableRow++] = '</tr>';

				// create an entry in file.records for the current record
				file.records[recordId] = {};

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
			__self.recordsTable[tableRow++] = '</tbody>';
			// converts the array into a string containing the records table 'tbody'cvvgvv
			__self.recordsTable.join('');
			document.querySelector("[data-js~='recordsTable']").insertAdjacentHTML( "beforeend", __self.recordsTable );

			// all of the HTML has been generated
			// now we need to update it with our plugins and custom javascript
			__self.setupUI();
		},
		setupUI : function() {
			var is__mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

			// APPLY ALL OF THE UI PLUGINS
			UI.tabs();
			calendar.exclusions.init();

			cuboids.appSuite.init();
			cuboids.app.init();

			exclusions.init();

			modals.iframe.init();

			notifications.inApp.init();

			offCanvasPanels.fileSummary.init();
			offCanvasPanels.records.init();

			segmentControls.fileSettings();

			tables.records.init();
			tables.details.init();
			tables.init();

			tooltips.errors.init();
			tooltips.fileSummary.init();

			sticky.records.init();
			sticky.details.init();

			if( is__mobile ) {
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
						splash.remove();

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
		}
	}






	var requests = {
		records    : true,
		config     : true,
		exclusions : true
	};


	var reqConfig = new XMLHttpRequest();
	//reqConfig.open("GET","/iqService/rest/config.json?meta=true",true);
	reqConfig.open("GET","js/config.json",true);
	reqConfig.onreadystatechange = function() {
		if( this.readyState == 4) {
			if( this.status == 200) {

			}
			else {
				requests.config = false;
				console.log("Config HTTP error "+this.status+" "+this.statusText);
			}
		}
	};

	var reqRecords = new XMLHttpRequest();
	reqRecords.open("GET","js/bio.json",true);
	reqRecords.onreadystatechange = function() {
		if( this.readyState == 4) {
			if( this.status == 200) {

			}
			else {
				requests.records = false;
				console.log("Records HTTP error "+this.status+" "+this.statusText);
			}
		}
	};



	// var reqExclusions = new XMLHttpRequest();
	// reqExclusions.open("GET","/iqService/mba/bio/excl.json",true);
	// reqExclusions.onreadystatechange = function() {
	// 	if( this.readyState == 4) {
	// 		if( this.status == 200) {

	// 		}
	// 		else {
	// 			requests.exclusions = false;
	// 			console.log("Exclusoins HTTP error "+this.status+" "+this.statusText);
	// 		}
	// 	}
	// }
	// reqExclusions.send();

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
				UI.DOM.removeDataValue( notifications.inApp.backing,"data-ui-state",notifications.inApp.status );
				UI.DOM.addDataValue( notifications.inApp.backing,"data-ui-state", backingStatus );
				if ( status === "error" || status === "warning" ) {
					icon = "attention";
				} else if ( status === "success" ) {
					icon = "ok";
				}
				notifications.inApp.icon.setAttribute( "data-ui-icon", icon );
				notifications.inApp.status = status;
			}
		}
	};

	test = function() {
		var reqFile,fileLoader,appLogo,error;

		reqFile = new XMLHttpRequest();
		reqFile.open("GET","js/bio.json",true);
		reqFile.onreadystatechange = function() {
			if( this.readyState == 4) {
				if( this.status == 200) {

				}
				else {
					requests.records = false;
					error = "Records HTTP error " + this.status + " " + this.statusText;
				}
			}
		};
		reqFile.send();

		appLogo    = document.querySelector("[data-js~='appLogo']");
		fileLoader = document.querySelector("[data-js~='inApp__loader']");
		UI.loader( fileLoader, {
			requests                : reqFile,
			loaderCompleteAnimation : "fade out",
			resetLoaderOnComplete   : true,
			onComplete              : function() {
				var stopRotating; 

				notifications.inApp.updateStatus( "success", "These are not the droids you're looking for.... actually I guess they are, sorry about that." );
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
	};


	var loaders = {
		app : {
			startup : {
				config : {
					el : document.querySelector("[data-js~='appLoader__config']"),
					settings : {
						requests   : reqConfig,
						onComplete : function() {
							if ( requests.config ) {
								var configData = JSON.parse( reqConfig.response );
								App.setupUser( configData );
							}
						}
					},
					__UI : undefined,
					init : function() {
						var __self,loader, settings, __UI;
						__self   = this;
						loader   = __self.el;
						settings = __self.settings;

						document.querySelector("[data-js~='appLoader__description']").innerHTML = "creating user profile";
						__UI = __self.UI = UI.loader(loader,settings);
					}
				},
				records : {
					el : document.querySelector("[data-js~='appLoader__records']"),
					settings : {
						requests   : reqRecords,
						onComplete : function() {
							if ( requests.records ) {
								var recordsData = JSON.parse( reqRecords.response );
								App.buildRecords( recordsData );
							}
						}
					},
					__UI : undefined,
					init : function() {
						var __self,loader, settings, __UI;
						__self   = this;
						loader   = __self.el;
						settings = __self.settings;

						document.querySelector("[data-js~='appLoader__description']").innerHTML = "processing records";
						__UI = __self.UI = UI.loader(loader,settings);
					}					
				}
			}
		}
	};
	// we send the request for the config data
	reqConfig.send();
	// we initialize the config loader
	loaders.app.startup.config.init();



