var app = {
		version: "v.1.0 01.2020",
		api: "https://test.loc:5000/api/v1.0",
		token: null,
		pill: null,
		view: {},
		vars: {},
		auth: () => { addScript( "page/controller/auth.js", "async" ) },
		company: () => { addScript( "page/controller/company.js", "async" ) },
		product: () => { addScript( "page/controller/product.js", "async" ) }
	};
var action;
	
document.addEventListener("DOMContentLoaded", () => {
    addLink( "css/bootstrap.min.css" );
    addLink( "css/font-awesome.min.css" );
    addLink( "css/style.css" );
    addScript( "js/tools.js", "async" );
    addScript( "vendors/localforage.min.js", "async" );
    addScript( "vendors/jquery-3.1.1.min.js", "defer", () => {
    		addScript( "js/event.js", "async" );
    		addScript( "vendors/jquery.dataTables.min.js", "async" );
    		addLink( "css/tables.css" );
    		addScript( "vendors/bootstrap.min.js", "defer", () => { AppStart() } );
    });
});


function AppStart() {

	$("#preload").addClass("d-none");
	//localforage.clear();
	
	// Проверим токен
	localforage.getItem( 'access_token' ).then( ( value ) => {
	
  		if ( value ) {
  			// Актуален?
  			let action = "/auth/test";
  			getDataAsync( { url:action, metod:"GET", auth:value } , ( response ) => {
				
				if ( response.status !== 200 ) { 
  						
  					$( "body" ).append( `
  						<div class="text-danger m-auto">
  							<span class="fa fa-exclamation-triangle mr-2"></span>
  							${ response.status } - ${ response.error }
  						</div>` );
  							
				} else {
				
					app.token = value;
					
					pillStart();
					
				};
  			});
  		// Нет токена, загрузим контроллер авторизации
  		} else {
  			
  			$("#login").removeClass( "d-none" );
  				
  			app.auth();
  				
  		}
  	});
	
};




function pillStart() {

	$("#app").removeClass( "d-none" );
	
	localforage.getItem( 'pill' ).then( ( value ) => {
	
		if ( value ) {
			
			app.pill = value;
			
			//app[value]();
			
		} else {
		
			app.pill = "company";
			
			localforage.setItem( 'pill', app.pill );
			
			//app.company();
			
		}
		
		$('#' + app.pill + '-tab').tab('show');
	});
	
};

