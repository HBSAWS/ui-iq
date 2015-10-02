// DIRECTIONS

// MAKING THE TABS
// For tabs we always use the togglers module, in the segment control mode, as segment controls are always radio button inputs
	// 1. Make sure your segment control toggler input element is the type 'radio'
	// 2. To create a tab group give each segment control toggler a name that starts with 'tabs__'.  
		// Anything can come after the 'tabs__ prefix', just make sure all segment control togglers in a tab group have the exact same name
	// 3. Next give each of the segment control toggler elements a unique value that is prefixed with 'tab__'
	// 4. To make a tab start off as selected simply make sure the specific segment control toggler a attribute of 'checked', like in the example below
	// EXAMPLE SEGMENT CONTROL TOGGLER:
		// <div class="toggler__inverted" data-ui-settings="mode__segmentcontrol size__small" data-ui-grid="mobile__4">
		//     <input class="toggler-input__inverted" data-ui-settings="mode__segmentcontrol size__small" type="radio" name="tabs__fileSummary" value="tab__fileRecords" checked="">
		//     <div class="toggler-toggle__inverted" data-ui-settings="mode__segmentcontrol size__small">
		//         <div class="toggler-toggle-indicator__inverted" data-ui-settings="mode__segmentcontrol size__small">
		//             File Records
		//         </div>
		//     </div>
		// </div>

// MAKING THE TAB CONTENT
	// The tabs plugin doesn't care about what elements or CSS you use for the tab content.  It's simply keeping track of your tabs and toggling thtem on and off when users click them
	// So for the content part of your HTML feel free to use what ever elements you'd like
	// 1. take the value you gave to your segment control toggler's 'value' attribute and make it the value of a data attribute 'data-ui-tab' 
		// on the element you want to use as your specific tab's content.  Here's an example matching a div we want to use as our tab's contents to the
		// example segment control toggler given above: 
	// EXAMPLE ACTIVE TAB CONTENT TAG:
		// <div class="layout" data-ui-tab="tab__fileRecords"></div>
		// if your specific tab's content isn't active on load, your app will be less likely to flash the inactive
			// tab's content if you give it a state of 'data-ui-state="is__hidden"', like so:
	// EXAMPLE INACTIVE TAB CONTENT TAG:
		// <div class="layout" data-ui-state="is__hidden" data-ui-tab="tab__fileRecords"></div>
		// if you forget, or decide not to give your inactive tab content's a hidden state, don't worry,
			// the plugin will do it for you

// INITIALIZING
	// you can set up as many different tab groups as you'd like this way
	// to initialize them simple include the following anywhere in your javascript file
	// UI.tabs();
// That's it!
// note : make sure you've included the UI.js file, and that it comes before your javascript code/file

UI_tabs = {
	tabGroups : {},
	init : function() {
		var __self,tabs,tabsList;
		__self = UI_tabs;
		tabs   = document.querySelectorAll("[name^='tabs_']");

		if ( tabs !== undefined && tabs !== null ) {
			for ( var tab = 0,len = tabs.length; tab < len; tab++ ) {
				var currentTab,currentTabContent;
				currentTab         = tabs[tab];
				currentTabContent  = document.querySelector("[data-ui-tab~='" + currentTab.value + "']");

				if ( currentTab.checked ) {
					// we store the current contents (not tab) DOM object in the tabGroups object
					// under the attribute of the tab group name so that we can have a reference to it
					// and turn it off when we need to show a new tab
					__self.tabGroups[ currentTab.name ] = currentTabContent;
					__self.showTab( currentTab );
				} else if ( currentTabContent !== null && currentTabContent !== undefined && !UI_DOM.hasDataValue( currentTabContent,"data-ui-state","is__hidden") ) {
					UI_DOM.addDataValue( currentTabContent,"data-ui-state","is__hidden" );
				}
				currentTab.addEventListener( 'change', __self.checkTab.bind(__self) );
			}
		}
	},
	checkTab : function(e) {
		var __self,el,isChecked;
		__self    = this;
		el        = e.currentTarget;
		isChecked = el.checked;

		if ( isChecked ) {
			__self.showTab( el );
		}
	},
	showTab : function( tab ) {
		var __self,tabOldContent,tabNewContent;
		__self        = this;
		tabNewContent = document.querySelector("[data-ui-tab~='" + tab.value + "']");
		if ( tabNewContent !== undefined && tabNewContent !== null ) {
			tabOldContent = __self.tabGroups[ tab.name ];
			tabOldContent.style.display = "none";
			tabNewContent.style.display = "initial";

			__self.tabGroups[ tab.name ] = tabNewContent;
		}
	}
};