// var appSuite : {
// 	App         : document.querySelector("[data-js~='appSuiteApp']"),
// 	Apps        : document.querySelector("[data-js~='appSuiteApps']"),
// 	Settings    : document.querySelector("[data-js~='appSuiteSettings']"),
// 	Preferences : document.querySelector("[data-js~='appSuitePreferences']"),
// 	active      : "App",
// 	init        : function() {
// 		var __self = this,showApp;
// 		document.querySelector("[data-js~='cuboid__showAppSuiteSettings']").addEventListener( 'click', function() { __self.show("Settings"); });
// 		document.querySelector("[data-js~='cuboid__showAppSuiteApps']").addEventListener( 'click', function() { __self.show("Apps"); });
// 		showAppBtns = document.querySelectorAll("[data-js~='cuboid__showAppSuiteApp']");
// 		for ( var btn = 0, totalBtns = showAppBtns.length; btn < totalBtns; btn++ ) {
// 			showAppBtns[btn].addEventListener( 'click', function() { __self.show("App"); });
// 		}

// 		UI.keyboard({
// 			combination : ['alt','a'],
// 			onPress     : function(e) {
// 				__self.show("Apps");
// 			}
// 		});
// 		UI.keyboard({
// 			combination : ['alt','s'],
// 			onPress     : function(e) {
// 				__self.show("Settings");
// 			}
// 		});
// 		UI.keyboard({
// 			combination : ['escape'],
// 			onPress     : function(e) {
// 				__self.show("App");
// 			},
// 			exception : function() {
// 				return App.UIState({ appSuiteApp : true });
// 			}
// 		});
// 	},
// 	show : function(toShow) {
// 		var active,swapOut,swapIn,settings,side;
// 		active = App.appSuite.active;

// 		if ( toShow !== active ) {
// 			if ( toShow === "App" ) {
// 				swapOut  = App.appSuite.Preferences;
// 				swapIn   = App.appSuite.App;
// 				settings = { 
// 					animationName : "swap", 
// 					onComplete    : function() { UI.DOM.addDataValue( App.appSuite[active], "data-ui-state", "is__hidden" ); } 
// 				};
// 				side     = "front";
// 			} else {
// 				swapOut  = App.appSuite.App;
// 				swapIn   = App.appSuite.Preferences;
// 				settings = { animationName : "swap" };
// 				side     = ( toShow === "Apps" ) ? "bottom" : "top";
// 				UI.DOM.removeDataValue( App.appSuite[toShow], "data-ui-state", "is__hidden" );
// 			}
// 			App.appSuite.active = toShow;
// 			UI.animate( [swapOut,swapIn], settings );
// 			cuboids.appSuite.UI.show( side );
// 		}
// 	}
// 		