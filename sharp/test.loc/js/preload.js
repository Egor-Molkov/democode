// Preload support !TODO
var DOMTokenListSupports = function( tokenList, token ) {
	if ( !tokenList || !tokenList.supports ) { return } else { return tokenList.supports(token) }};
var linkSupportsPreload = DOMTokenListSupports( document.createElement( "link" ).relList, "preload" );

// Добавить css
function addLink( source, callback ) {
	if ( source ) {
		var	link = document.createElement( "link" );
		if ( linkSupportsPreload ) {
			link.rel = "preload";
			link.href = source;
			link.as = "style";
			link.crossorigin = "anonymous";
			link.onload = function() {
				this.rel='stylesheet';
				if ( callback ) { calback() }
			};
		} else {
			link.rel = "stylesheet";
			link.href = source;
		}
		console.log("Загружаю - " + source );
		document.head.appendChild( link );
	}
};

// Добавить js
function addScript( source, metod, callback ) {
	if ( source ) {
		var	link = document.createElement( "script" );
			link.src = source;
			if ( metod ) {
				switch ( metod ) {
					case "async" : link.async = true; break
					case "defer" : link.defer = true; };			
			}
			if ( callback ) { link.onload = callback }
			console.log("Загружаю - " + source );
		document.body.appendChild( link );
	}
};