
// Запрос к серверу
async function getDataAsync( _options, callback ) {

	let data;
	
	try {
		// По умолчанию
		let options = {
				method: _options.metod || 'POST',
				headers: {
					'Content-Type': 'application/json', 
					'Accept': 'application/json' },
				body: _options.obj ? JSON.stringify( _options.obj ) : _options.param
			};
		// Токен
		_options.auth ? options.headers["Authorization"] = "Bearer " + _options.auth : null;
		
		// отправляет запрос и получаем ответ
		const response = await fetch( app.api + _options.url, options );
		
		// если запрос прошел не нормально
		if ( response.status !== 200 ) {
		
			data = await response.json();
			
			data = { error:data.errorText, status: response.status };
			
		} else {

			data = await response.json();
			
			data = { data: data, status: 200 };
			
		}
	// Ошибки сети
	} catch ( e ) {

		data = { error: "Ошибка сети, нет связи с сервером...", status: 500 };
		
	}
	// Каллбек
	if ( callback ) { callback( data ) };
	
	console.log( _options.url + ' - ' + JSON.stringify( data ) );
};
