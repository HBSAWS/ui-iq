var glyphs = function() {
	var isMobile,glyphs;
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	if ( !isMobile ) {
		glyphs = document.querySelectorAll("[class^='glyph_']");
		if ( glyphs !== null && glyphs !== undefined ) {
			for ( var glyph = 0, totalGlyphs = glyphs.length; glyph < totalGlyphs; glyph++ ) {
				var currentGlyph = glyphs[glyph];

				currentGlyph.addEventListener( 'mouseover', function(e) {
					UI_DOM.addDataValue( e.currentTarget, "data-ui-state","is__hovered" );
				});
				currentGlyph.addEventListener( 'mouseout', function(e) {
					UI_DOM.removeDataValue( e.currentTarget, "data-ui-state","is__hovered" );
				});
			}
		}
	}
};