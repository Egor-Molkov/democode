// Объект для передачи
var obj_form = { param1: "", param2: "" };

// Получим имя, запишем в печенки, уберем авторизацию, покажем ввод
$( '[name = login_ok]' ).click( function ( ) {

	var this_name = "guest";

	if ($( '[name = login]' ).val( ) != "" ) { this_name = encodeURIComponent( $( '[name = login]' ).val( ) ) }
	setCookie( "names", this_name );
	
	$( '[name = login]' ).val("");
	
	$("._text").slideToggle("slow");
	$("._login").delay(400).slideToggle("slow");
});

// Передадим параметры в объект, отправим на сервер POST запросом, 
// при получении результата каллбак, очистим поле, передадим фокус
$( '[name = text_ok]' ).click( function ( ) {
	
	obj_form.param1 = decodeURIComponent( getCookie( "names" ) );
	if ( $( '[name = text]' ).val( ) != "" ) { obj_form.param2 =  $( '[name = text]' ).val( ) } 
	else { obj_form.param2 = "Сказал что-то невнятное.." };
	
	$.post(
		"/server.php",
		obj_form,
		onAjaxSuccess
	);
 	
	function onAjaxSuccess( data ) {
		$( "._bottom" ).empty( );
		$( "._bottom" ).append( data );
	}
	
	$( '[name = text]' ).val("");
	obj_form.param2 = "";
	
	setTimeout("$( '[name = text]').focus()", 200);
});


// По таймеру отправим пустой запрос, получим все текущие сообщения
var timing = setInterval( function ( ) {
	
	obj_form.param1 = decodeURIComponent( getCookie( "names" ) );
	
	$.post(
		"/server.php",
		obj_form,
		onAjaxSuccess
	);
 	
	function onAjaxSuccess( data ) {
		$( "._bottom" ).empty( );
		$( "._bottom" ).append( data );
	}

	
}, 2000 );