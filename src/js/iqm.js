(function($) {
	var App;
	var userData    = {
		role : undefined, // either MBA,DOCTORAL or ADMIN
		PDM  : undefined
	};
	var recordsData = {
		active : undefined
	};
	var stats = {
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
				sideToShowOnInit : "back"
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
				sideToShowOnInit : "back"
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




	var panelSelection = {
		activePanel    : "recordsPanel",
		activeRow      : "unselected",
		recordsPanel   : document.querySelector("[data-js~='appHuver__recordsInner']"),
		detailsPanel   : document.querySelector("[data-js~='appHuver__details-inner']"),
		setScrollPosition : function() {
			var __self,elementToScroll,panelHeaderHeight,tableHeaderHeight,tableRowHeight;
			__self            = this;
			elementToScroll   = __self[__self.activePanel].parentElement;
			panelHeaderHeight = __self[__self.activePanel].querySelector("[data-js*='_positionSticky']").getBoundingClientRect().height;
			tableHeaderHeight = __self[__self.activePanel].querySelector("thead").getBoundingClientRect().height;
			tableRowHeight    = __self.activeRow.getBoundingClientRect().height * __self.activeRow.rowIndex;

			elementToScroll.scrollTop = tableHeaderHeight + tableRowHeight - 10;
		},
		panelSelection : function() {
			var __self,active,recordsPanel,detailsPanel,recordsTableRow,detailsTableRow,activeRecordsTableRow,activeDetailsTableRow;
			__self            = this;
			active            = __self.activePanel;
			recordsPanel      = __self.recordsPanel;
			detailsPanel      = __self.detailsPanel;

			
			recordsTableRow   = recordsPanel.querySelector("[data-js~='recordsTable'] tbody tr:not([data-ui-state~='is__selected'])");
			detailsTableRow   = detailsPanel.querySelector("[data-js~='detailsTable'] tbody tr:not([data-ui-state~='is__selected'])");

			activeRecordsTableRow = recordsPanel.querySelector("[data-js~='recordsTable'] tbody tr[data-ui-state~='is__highlighted']");
			activeDetailsTableRow = detailsPanel.querySelector("[data-js~='detailsTable'] tbody tr[data-ui-state~='is__highlighted']");

			if ( active === "unselected" || active === "detailsPanel" ) {
				__self.activePanel = "recordsPanel";
				if ( window.innerWidth < 1300 ) {
					// records is in offcanvas mode
					// so we highlight it by simply activating it
					offCanvasPanels.records.UI.showPanel();
				}
				if ( activeDetailsTableRow !== null ) {
					activeDetailsTableRow.removeAttribute("data-ui-state");
				}
				recordsTableRow.setAttribute("data-ui-state", "is__highlighted");
				__self.activeRow = recordsTableRow;
			} else if ( active === "recordsPanel" ) {
				__self.activePanel = "detailsPanel";
				if ( window.innerWidth < 1300 ) {
					// records is in offcanvas mode
					// so we highlight it by simply activating it
					offCanvasPanels.records.UI.hidePanel();
				}
				if ( activeRecordsTableRow !== null ) {
					activeRecordsTableRow.removeAttribute("data-ui-state");
				}
				detailsTableRow.setAttribute("data-ui-state", "is__highlighted");
				__self.activeRow = detailsTableRow;
			} 
			__self.setScrollPosition();
		},
		rowSelection : function(direction) {
			var __self,activeRow;
			__self    = this;
			activeRow = __self.activeRow;

			if ( activeRow === "unselected" ) {
				return;
			} else if ( direction === "next" ) {
				// making sure there is a next sibling to go to
				if ( activeRow.nextElementSibling !== null ) {
					// checking to see if the next sibling is selected, if it is AND there is a next next sibling then we skip it, 
						// otherwise we do nothing
					if ( activeRow.nextElementSibling.dataset.uiState !== undefined && activeRow.nextElementSibling.dataset.uiState === "is__selected" && activeRow.nextElementSibling.nextElementSibling !== null ) {
						activeRow.removeAttribute("data-ui-state");
						__self.activeRow = activeRow = activeRow.nextElementSibling.nextElementSibling;
						activeRow.setAttribute("data-ui-state", "is__highlighted");	
					} else {
						activeRow.removeAttribute("data-ui-state");
						__self.activeRow = activeRow = activeRow.nextElementSibling;
						activeRow.setAttribute("data-ui-state", "is__highlighted");	
					}

					__self.setScrollPosition();

				}
			} else if ( direction === "previous" ) {
				// making sure there is a previous sibling to go to
				if ( activeRow.previousElementSibling !== null ) {
					// checking to see if the previous sibling is selected, if it is AND there is a previous previous sibling then we skip it, 
						// otherwise we do nothing
					if ( activeRow.previousElementSibling.dataset.uiState !== undefined && activeRow.previousElementSibling.dataset.uiState === "is__selected" && activeRow.previousElementSibling.previousElementSibling !== null ) {
						activeRow.removeAttribute("data-ui-state");
						__self.activeRow = activeRow = activeRow.previousElementSibling.previousElementSibling;
						activeRow.setAttribute("data-ui-state", "is__highlighted");
					} else {
						activeRow.removeAttribute("data-ui-state");
						__self.activeRow = activeRow = activeRow.previousElementSibling;
						activeRow.setAttribute("data-ui-state", "is__highlighted");
					}

					__self.setScrollPosition();
				}
			}
		}
	}; 




	var keyboardShortcuts = function(e) {
		// if the panel is not opened already, pressing alt + s will open the file summary panel
		if ( !offCanvasPanels.fileSummary.UI.isPanelShowing() ) {
			if ( e.altKey && e.keyCode == 70 ) {
				offCanvasPanels.fileSummary.UI.showPanel();
			}

			if ( !modals.iframe.UI.isModalShowing() ) {
				if ( e.keyCode == 9 ) {
					e.preventDefault();
					panelSelection.panelSelection();
				} else if ( e.keyCode == 40 ) { 
					// down arrow
					e.preventDefault();
					panelSelection.rowSelection("next");
				} else if ( e.keyCode == 38 ) { 
					// down arrow
					e.preventDefault();
					panelSelection.rowSelection("previous");
				} else if ( e.keyCode == 13 && panelSelection.activeRow !== "unselected" ) {
					e.preventDefault();
					if ( panelSelection.activePanel === "recordsPanel" ) {
						var record = panelSelection.activeRow;
						tables.details.openRecord(record);
						panelSelection.panelSelection();
					} else {
						modals.iframe.UI.showModal();
					}
				}
			}
		}
	};



	/**
	    Smoothly scroll element to the given target (element.scrollTop)
	    for the given duration

	    Returns a promise that's fulfilled when done, or rejected if
	    interrupted
	 */
	smooth_scroll_to = function(element, target, duration) {
	    target = Math.round(target);
	    duration = Math.round(duration);
	    if (duration < 0) {
	        return Promise.reject("bad duration");
	    }
	    if (duration === 0) {
	        element.scrollTop = target;
	        return Promise.resolve();
	    }

	    var start_time = Date.now();
	    var end_time = start_time + duration;

	    var start_top = element.scrollTop;
	    var distance = target - start_top;

	    // based on http://en.wikipedia.org/wiki/Smoothstep
	    var smooth_step = function(start, end, point) {
	        if(point <= start) { return 0; }
	        if(point >= end) { return 1; }
	        var x = (point - start) / (end - start); // interpolation
	        return x*x*(3 - 2*x);
	    }

	    return new Promise(function(resolve, reject) {
	        // This is to keep track of where the element's scrollTop is
	        // supposed to be, based on what we're doing
	        var previous_top = element.scrollTop;

	        // This is like a think function from a game loop
	        var scroll_frame = function() {
	            if(element.scrollTop != previous_top) {
	                reject("interrupted");
	                return;
	            }

	            // set the scrollTop for this frame
	            var now = Date.now();
	            var point = smooth_step(start_time, end_time, now);
	            var frameTop = Math.round(start_top + (distance * point));
	            element.scrollTop = frameTop;

	            // check if we're done!
	            if(now >= end_time) {
	                resolve();
	                return;
	            }

	            // If we were supposed to scroll but didn't, then we
	            // probably hit the limit, so consider it done; not
	            // interrupted.
	            if(element.scrollTop === previous_top
	                && element.scrollTop !== frameTop) {
	                resolve();
	                return;
	            }
	            previous_top = element.scrollTop;

	            // schedule next frame for execution
	            setTimeout(scroll_frame, 0);
	        }

	        // boostrap the animation process
	        setTimeout(scroll_frame, 0);
	    });
	}






	var loaders = {
		app : {
			configProgress     : 0,
			exclusionsProgress : 0,
			recordsProgress    : 0,
			el : document.querySelector("[data-js~='appLoader']"),
			settings : {
				loaderOnComplete : "fadeOut",
				onComplete       : function() {
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
							},100);
							setTimeout(function(){
								cuboids.app.UI.show("front");
							},300);
						}
					};

					splash.addEventListener("webkitTransitionEnd", removeSplash);
					fastdom.write(function() {
						// we do this so the main canvas can animate in on load
						// the file summary off canvas panel changes the state of the main canvas depending on whether it's open or close
						// so we simply want to give a unique state of pushed way back, and to have an opacity of zero
						// so that when we show the panel and it would normally animate the canvas back in space, this animates it forward
						document.querySelector("[data-js~='app__mainCanvas']").setAttribute("data-ui-state", "animate__off scale__down-lg fade__out");
						document.querySelector("[data-js~='app__mainCanvas']").offsetHeight;

						// this moves the splash element up and fades it out
						splash.style.transform = "translateY(-100px)";
						splash.style.opacity   = 0;
					});
				}
			},
			__UI : undefined,
			init : function() {
				var __self,loader, settings, __UI;
				__self   = this;
				loader   = __self.el;
				settings = __self.settings;

				__UI = __self.UI = UI.loader(loader,settings);
			},
			updateProgress : function() {
				var __self, appLoader, appProgress;
				__self      = this;
				appLoader   = __self.__UI;
				appProgress = ( __self.configProgress + __self.exclusionsProgress + __self.recordsProgress ) * 0.03;

				appLoader.progress( appProgress );
			}
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
				var __self,modal,settings,__UI;
				__self   = this;
				modal    = __self.el;
				settings = __self.settings;

				__UI = __self.UI = UI.modal(modal,settings);

				document.getElementById("detailsTable").addEventListener("click", function(e) {
					if ( e.target.parentElement.dataset.jsHandler === "show__iframe" ) {
						offCanvasPanels.fileSummary.UI.hidePanel();
						__UI.showModal();
					}
					e.stopPropagation();
				});
			},
			updateModaliFrameSource : function(recordID) {
				var pdmId,pdmIframe,dept,newURL;

				fastdom.read(function() {
					pdmIframe = document.querySelector("[data-js~='iframePDM']");
				});

				if ( userData.role === "MBA") {
					dept = 'mba';
				} else if ( userData.role === "DOCTORAL" ) {
					dept = 'doctoral';
				} else if ( userData.role === "ADMIN" ) {
					dept = document.querySelector("[name='file-summary__programs-toggle']:checked").value;
				}

				newURL = userData.PDM + "mba/btStuDtl/edit?prsnId=" + recordID;

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
				toOffset    = document.querySelector("[data-js~='records__offsetSticky']");

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
				toOffset    = document.querySelector("[data-js~='details__offsetSticky']");

				toOffset.style.paddingTop = "0px";
			}
		}
	}; 



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
			},
			openRecord : function(recordEl) {
				if ( recordEl.dataset.jsHandler === "load__record" ) {
					var pdmId,pdmIframe,newURL;

					fastdom.read(function() {
						pdmIframe = document.querySelector("[data-js~='iframePDM']");
					});

					pdmId     = recordsData.active;
					newURL    = userData.PDM + "mba/btStuDtl/edit?prsnId=" + pdmId;

					fastdom.write(function() {
						pdmIframe.setAttribute('src', newURL);
					});
				}
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
				var __self = this;
				UI.table( this.$el, this.settings );
				this.UI = this.$el.data("UI");

				$("[data-js-handler~='detailsTable__filter']").on("change", function() {
					var $this = $(this);
					var toFilter = $this.val();

					if ($this.is(":checked")) {
						__self.UI.filter(toFilter);
					} else {
						__self.UI.unfilter(toFilter);
					}
				});


				var init = true;
				// the click event listener for the table rows in the records table
				document.querySelector("[data-js~='recordsTable']").addEventListener('click', function(e) {
					var targetEl = e.target.parentElement;
					if ( targetEl.dataset.jsHandler === "load__record" ) {
						tables.details.openRecord( targetEl );
					}
				});
			},
			openRecord : function(recordsTableRowEl) {
				var __self,recordID,record,toAdd,detailsTableFilterEl,detailsTableTitle;
				__self   = this;
				recordID = recordsTableRowEl.dataset.record;
				record   = recordsData[recordID];
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
				detailsTableFilterEl         = document.querySelector("[data-js-handler~='detailsTable__filter']");
				detailsTableFilterEl.checked = false;
				detailsTableFilterEl.dispatchEvent(__events.__change);

				__self.UI.add(toAdd);
				__self.UI.remove("hbsId", recordsData.active);
				__self.UI.remove("hbsId", "");
				recordsData.active = recordID;

				// reapply the details table filter
				deatilsTableFilterEl         = document.querySelector("[data-js-handler~='detailsTable__filter']");
				detailsTableFilterEl.checked = true;
				detailsTableFilterEl.dispatchEvent(__events.__change);

				tables.records.$el.find("[data-ui-state~='is__selected']").removeAttr("data-ui-state");
				recordsTableRowEl.setAttribute("data-ui-state","is__selected");
				detailsTableTitle           = document.querySelector("[data-js~='recordName']");
				detailsTableTitle.innerHTML = record.firstName + " " + record.lastName;
				//$("[data-js~='recordName']").html(record.firstName + " " + record.lastName);

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




	App = {
		init : function() {
			UI.keyboard({
				combination : ["alt","p"],
				onPress     : function(e) {
					console.log("pressed");
				}
			});
			var is__mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			if( !is__mobile ) {
				var hoverTables;

				hoverTables = [document.querySelector("[data-js~='recordsTable']"),document.querySelector("[data-js~='detailsTable']")];
				for ( var table = 0, len = hoverTables.length; table < len; table++ ) {
					var currentTable = hoverTables[table];
					currentTable.addEventListener('mouseover', function(e) {
						var hoverTarget; 
						panelSelection.activeRow = hoverTarget = e.target.parentElement;
						if ( hoverTarget.tagName === "TR" && hoverTarget.dataset.uiState !== "is__selected" ) {
							if ( this.querySelector("[data-js~='appHuver__recordsInner']") !== undefined ) {
								// records panel is being hovered
								panelSelection.activePanel = "recordsPanel";
							} else {
								// details panel is being hovered
								panelSelection.activePanel = "detailsPanel";
							}
							panelSelection.activeRow = hoverTarget;
							if ( document.querySelector("tbody tr[data-ui-state~='is__highlighted']") !== null ) {
								document.querySelector("tbody tr[data-ui-state~='is__highlighted']").removeAttribute("data-ui-state");
							}
							hoverTarget.setAttribute("data-ui-state", "is__highlighted");
						}
					});
					currentTable.addEventListener('mouseout', function(e) {
						var hoverTarget; 
						panelSelection.activeRow = "unselected";
						hoverTarget              = e.target.parentElement;
						if ( hoverTarget.tagName === "TR" && hoverTarget.dataset.uiState !== "is__selected" ) {
							hoverTarget.removeAttribute("data-ui-state");
						}
					});
				}
			}

			UI.tabs();
			calendar.exclusions.init();

			cuboids.appSuite.init();
			cuboids.app.init();

			exclusions.init();

			modals.iframe.init();

			//panels.fileSummary.init();

			offCanvasPanels.fileSummary.init();
			offCanvasPanels.records.init();

			tables.records.init();
			tables.details.init();

			tooltips.errors.init();
			tooltips.fileSummary.init();
			
			document.addEventListener('keydown', keyboardShortcuts);
			document.getElementById("recordsTable").querySelector("tbody").addEventListener('click', function(e) {
				var recordEl = e.target.parentElement;
				tables.records.openRecord(recordEl);
			});

			sticky.records.init();
			sticky.details.init();

			if( is__mobile ) {
				FastClick.attach(document.body);
			}
		}
	}




	// initialize our app loader
	loaders.app.init();
	// var xhrConfig = new XMLHttpRequest();
	// xhrConfig.onprogress = function(e){
	//     if (e.lengthComputable)
	//         var percent = (e.loaded / e.total) * 100;
	//     	console.log("test XHR percentage: " + percent);
	// };
	// xhrConfig.open('GET', encodeURI('https://secure-stage.hbs.edu/iqService/rest/config.json'));
	// xhrConfig.onload = function() {
	//     if (xhr.status === 200) {
	//         console.log("test XHR complete");
	//     }
	//     else {
	//         alert('Request failed.  Returned status of ' + xhr.status);
	//     }
	// };


	$.when(
		// the config
		// $.ajax({
		// 	dataType : "json",
		// 	url      : " https://secure-stage.hbsstg.org/iqService/rest/config.json"
		// }),	
		// // // the exclusions
		// $.ajax({
		// 	dataType : "json",
		// 	url      : "//rana1-stage.hbs.edu:8136/iqService/rest/mba/bio/excl.json"
		// }),
		// the records
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				//Download progress
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
				    	var percentComplete;

				    	percentComplete = ( evt.loaded / evt.total ) * 100;
				    	loaders.app.init();
				    	loaders.app.UI.progress(percentComplete);
					}
				}, false);
				return xhr;
			},
			dataType : "json",
			url      : "js/bio.json"
		})
	//).done(function ( dataUser,datadataRecords ) {
		).done(function ( dataRecords ) {

		// console.log("done");
		// var records, numberOfRecords, listOptions,EC,RC;
		// var user        = dataUser[0].userInfo;
		// var records     = dataRecords[0].records;
		// userData["PDM"] = dataUser[0].config.PDM_URL;
		
		// for ( var __role = 0, len = user["roles"].length; __role < len; __role++ ) {
		// 	var currentRole,userRole;
		// 	currentRole = user["roles"][__role];
		// 	if ( currentRole === "IQ__ADMIN" ) {
		// 		userRole = "ADMIN";
		// 	} else if ( currentRole === "MBA" ) {
		// 		userRole = "MBA";
		// 	} else if ( currentRole === "DOCTORAL" ) {
		// 		userRole = "DOCTORAL";
		// 	}
		// }
		// userData["role"] = userRole;


		// var totalRecords = records.length;
		// stats.records    = totalRecords;
		// var firstVisibleRecord;



		//offsite  -- START
		console.log("done");
		var records, numberOfRecords, listOptions,EC,RC;
		//var user        = dataConfig[0].userInfo;
		var records     = dataRecords.records;
		//userData["PDM"] = dataConfig[0].config.PDM_URL;


		var totalRecords = records.length;
		stats.records    = totalRecords;
		var firstVisibleRecord;
		//OFFSITE  -- END



		var recRow = 1;
		var recordTableBodyHTML = [];
		recordTableBodyHTML[0] = '<tbody data-ui-settings="size__large" class="table-body_">';

		var detRow = 1;
		var detailTableBodyHTML = [];
		detailTableBodyHTML[0] = '<tbody data-ui-settings="size__large" class="table-body_">';


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

			recordTableBodyHTML[recRow++] = '<tr class="table-body-row_" data-record="' + hbsId + '" data-ui-settings="size__large" data-js-handler="load__record">';
			recordTableBodyHTML[recRow++] = '<td class="table-body-row-cell_ is__firstName' + has__error + '" data-ui-settings="size__large">' + firstName + '</td>';
			recordTableBodyHTML[recRow++] = '<td class="table-body-row-cell_ is__lastName' + has__error + '" data-ui-settings="size__large">' + lastName + '</td>';
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
		
		document.querySelector("[data-js~='recordsTable']").insertAdjacentHTML( "beforeend", recordTableBodyHTML.join('') );



        // initializes the popover, panel and cuboid modules
        App.init();



		var firstRecord = document.getElementById("recordsTable").querySelector("[data-js-handler~='load__record']");
		tables.details.openRecord(firstRecord);
		//$("#recordsTable tbody tr:first").trigger("click");
	});
	
}(jQuery));
