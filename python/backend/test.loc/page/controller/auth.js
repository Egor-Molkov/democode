
// Котроллер авторизации 
( async () => {
    $("#login").removeClass( "d-none" );
    $("#app").removeClass( "d-flex" );
    $("#app").addClass( "d-none" );
    // Загрузим вид
    let view = await fetch( "page/view/auth.html" );
    if ( view.ok ) {
        // Как, текст, для обработки переменных в шаблоне, если потребуется
        app.view.auth = await view.text();
        // Вставим вид
        $("#login").html( `${ app.view.auth }` );
        let form = $( '#loginUser' );
        // Отправка данных формы
        form.on( 'submit', function ( e ) {
            let _email = form.find( '[name=email]' ).val();
            let _password = form.find( '[name=password]' ).val();	
            if ( e.stopPropagation ) { e.stopPropagation( ); } else { e.cancelBubble = false };
            if ( e.preventDefault ) { e.preventDefault( ); } else { e.returnValue = false };
            let action = "/auth/login";
            let param = { login:_email, password:_password };
            // Запросим токен
            getDataAsync( { url:action, obj:param }, extractAuthToken );
        });
    } else {
        notFound();
    }

})();

// Сохраним токен
async function extractAuthToken( response ) {
    if  ( response.status == 200 || response.status == 201 ) {
        await localforage.setItem( 'access_token', response.data.data )
        AppStart();
        $("#login").addClass("d-none");
        $("#app").addClass("d-flex");
    } else {
        $( "#error" ).html( "" )
        if ( response.data ) {
            $( "#error" ).append( response.data )
        }
        if ( response.data.login ) {
            response.data.login.forEach( function( item ) {
                $( "#error" ).append( "login - " + item )
            })
        }
        if ( response.data.password ) {
            response.data.password.forEach( function( item ) {
                $( "#error" ).append( "password - " + item )
            })
        }
    }
};
