////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Функции активные сразу после подгрузки заголовка	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener( "DOMContentLoaded", function( ) {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Функции активные после подгрузки контента, но до загрузки рисунков	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener( "load", ready_AJAX( ) );

function ready_AJAX ( ) {

	var breadcrumbViewPort = document.querySelector( '.header-breadcrumb' );
	var contentViewPort = document.querySelector( '.content' );
	var tovar	= document.getElementsByClassName( 'tovar' );	

	//////////////////////////////////////////////////////////////////////

	var elementsA = document.getElementsByTagName( 'a' );	
	var i = 0;

	// Пометим все ссылки
	while ( i < elementsA.length ) { elementsA[ i ].addEventListener( "click", clicks ); i++; };

	//////////////////////////////////////////////////////////////////////

	console.log( "AJAX ready.." );

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Обработка ссылок	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function clicks( event ) {
	
		var page = /page/, category = /category/;	// Паттерны

		// Если категория или пагинация
		if ( category.test( this.pathname ) || page.test( this.pathname ) ) { 
		
			//////////////////////////////////////////////////////////////////////
		
			// Прервать всплытие! 
			if ( event.stopPropagation ) {
				event.stopPropagation( ); // Стандартная модель
			} else {
				event.cancelBubble = true; // IE
			};
		
			// Отменить действия по умолчанию ( стандартный GET запрос )
			if ( event.preventDefault ) {
				event.preventDefault( ); // Стандартная модель
			} else {
				event.returnValue = false; // IE
			};
		
			//////////////////////////////////////////////////////////////////////
			
			var param = 'href=' + this.href;
			
			// Запросить по окончании get_content передать в нее response
			xhr( param, get_content );
		
			//////////////////////////////////////////////////////////////////////

			// Значек загрузки..
			var div = document.createElement( 'div' );
			div.className	= 'spiner';
			div.innerHTML	= '<svg id="spiner"><use xlink:href="#spiner-icon" href="#spiner-icon"/></svg>';
			
			//Добавим к контенту впоследствии очистим полностью
			contentViewPort.appendChild( div );

			//////////////////////////////////////////////////////////////////////
			
			// Анимация спрятать
			var i = 0;

			// Поменяем класс
			while ( i < tovar.length ) { 
			
				function func( i ) { tovar[ i ].classList.add( 'in' ); };

				setTimeout( func, 150*i, i );
				
				i++; 
			};
		
		};
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Ответ получили, выведем контент	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function get_content( response ) {

		// По окончании анимации вывода
		tovar[ tovar.length-1 ].addEventListener('transitionend', function( ) {

			// Заменим HTML на ответ сервера
			contentViewPort.innerHTML = response;

			//////////////////////////////////////////////////////////////////////
			
			// Анимация показать
			tovar = document.getElementsByClassName( 'tovar' );	
		
			var i = 0;

			// Поменяем класс
			while ( i < tovar.length ) {
			
				function func( i ) { tovar[ i ].classList.remove( 'in' ); };

				setTimeout( func, 150*i, i );
				
				i++; 
			};

			//////////////////////////////////////////////////////////////////////
		
			// Поменяем заголовок страницы
			document.title = getCookie( 'title' );
		
			//////////////////////////////////////////////////////////////////////
			
			// Вернуть крошки для категории
			var param = 'title=' + getCookie( 'title_base' );
		
			// Запросить по окончании get_breadcrumb передать в нее response
			xhr( param, get_breadcrumb );
		
			//////////////////////////////////////////////////////////////////////
		
		}, response );
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Дать крошки	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function get_breadcrumb( response ) {

		// Показать крошки
		breadcrumbViewPort.innerHTML = '<div></div>' + response;
			
		//////////////////////////////////////////////////////////////////////
	
		// обновим ссылки в пагинации и крошках
		elementsA = document.querySelectorAll( '.pagination a' );
		elementsB = document.querySelectorAll( '.header-breadcrumb a' );

		// При клике
		i = 0; while ( i < elementsA.length ) { elementsA[ i ].addEventListener( "click", clicks );	i++;	};
		i = 0; while ( i < elementsB.length ) { elementsB[ i ].addEventListener( "click", clicks );	i++;	};

	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Цепочка: Ajax запрос ( параметры ) -> функция( ответ ) по окончании	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function xhr( param, func ) {

		var xhr = new XMLHttpRequest( );

		//////////////////////////////////////////////////////////////////////
	
		// Открыть POST соединение с обработчиком асинхронное
		xhr.open( 'POST', '/handler/', true );
	
		// Установить заголовок - параметры передаем как при GET
		xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

		// Отправить
		xhr.send( param );
	
		//////////////////////////////////////////////////////////////////////
		
		xhr.onerror = function( ) {
	
			return func( 'Ошибка: Отсутствует соединение с сервером...'  );
		};
	
		//////////////////////////////////////////////////////////////////////
	
		// При смене статуса	
		xhr.onreadystatechange = function( ) {
	
			// Ждем статуса полученн ответ
			if ( this.readyState != 4 ) return;
		
			// Проблеммы на сервере
			if ( this.status != 200 ) {
		
				return func( 'Ошибка: Сервер возвращает - ' + this.status + ' -> ' + this.statusText );
			};
		
			// Все ок вызывем функцию передадим ей ответ
			if ( this.status == 200 ) {
		
					return func( this.responseText );
			};
		};
	};



};
} );

