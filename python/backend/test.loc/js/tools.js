
// Запрос к серверу
async function getDataAsync( _options, callback ) {
    let data;
    try {
        // Опции по умолчанию
        let options = {
                method: _options.metod || 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' },
                body: _options.obj ? JSON.stringify( _options.obj ) : _options.param
            };
        // Получем токен, если требуеться авторизация
        if ( _options.auth ) {
            const token = await localforage.getItem( 'access_token' );
            if ( token == null ) {
                alert("Авторизация не действительна")
                app.auth();
                return
            } else {
                options.headers["Authorization"] = "Bearer " + token;
            }
        }
        // Запросим
        const response = await fetch( app.api + _options.url, options );
        const stat = response.status
        // Ок, create, accepted
        if ( stat == 200 || stat == 201 || stat == 202 ) {
            data = await response.json();
            data = { data: data, status: stat };
        // Bad, auth, nofound
        } else if ( stat == 400 || stat == 403 || stat == 404 ) {
            data = await response.json();
            data = { data: data.error, status: stat };
        // Обновим токен и запросим заново
        } else if ( stat == 401 ) {
            let action = "/auth/refresh";
            const response_ref = await getDataAsync({ url:action, metod:"GET", auth:true })
            if ( response_ref.status == 200 || response_ref.status == 201 ) {
                await localforage.setItem( 'access_token', response_ref.data.data );
                data = await getDataAsync( _options, callback )
            } else {
                alert("Авторизация не действительна")
                app.auth();
                return
            }
        }

    // Ошибки сети, все плохо
    } catch ( e ) {
        let error = "Ошибка сети, нет связи с сервером..."
        data = { data: error, status: 500 };
    }
    if ( callback ) {
        //console.log( _options.url + ' - ' + JSON.stringify( data ) );
        callback( data )
    // Иначе вернем данные
    } else {
        //console.log( _options.url + ' - ' + JSON.stringify( data ) );
        return data
    }
};
