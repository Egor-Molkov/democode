
action = "/auth/login";

// Загрузим вид
( async () => {
	
	let response = await fetch("page/view/auth.html");
	
	if ( response.ok ) {
	
  		app.view.auth = await response.text();
  		// Вставим вид
  		$("#login").html( `${ app.view.auth }` );
  		
  		let form = $( '#loginUser' );

		form.on( 'submit', function ( e ) {
		
			let _email = form.find( '[name=email]' ).val();
			let _password = form.find( '[name=password]' ).val();	
				
			if ( e.stopPropagation ) { e.stopPropagation( ); } else { e.cancelBubble = false };
			if ( e.preventDefault ) { e.preventDefault( ); } else { e.returnValue = false };
			
			// Параметры запроса
			let param = { login:_email, password:_password }
			// Запросим токен
			getDataAsync( { url:action, obj:param }, extractAuth );
				
		});
		
	} else {
	
		$( "body" ).html( `
			<div class="text-danger m-auto">
				<span class="fa fa-exclamation-triangle mr-2"></span>
				Ошибка 404, страница не найдена...
			</div>` );
			
  		console.log("Error: page not found");
  		
  	}
  	
})();


function extractAuth( response ) {

	if  ( response.status === 200 ) {

		localforage.setItem( 'access_token', response.data.access_token ).then( () => { AppStart() });
		localforage.setItem( 'role', response.data.role );	
		
		$("#login").addClass("d-none");
		$("#app").addClass("d-flex");
		
	} else {
	
		$( "#loginUser #error" ).html( response.error );
		console.log(response.error);
	}

};
