<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//			page	basket		//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_page_basket( ) {
	
	// Массив из номеров товаров
	$product_array = explode( "+", pull_test_data( $_COOKIE[ 'basket' ][ 'string' ] ) );

	// Отсортировать по порядку 1 2 2 3 4 4 4 5
	asort($product_array);

	$i = 0;
	
	$info = 'Ваш выбор:';
	
	// Обойти
	foreach ( $product_array as $key => $value ) {
	
		// Если не пустая строка
		if ( $value ) {
		
			$i++;
			
			$post = get_post( $value );
			
			//Цена есть?
			$price = ( 	get_post_meta( $post -> ID, 'price', true ) ) ? 
						get_post_meta( $post -> ID, 'price', true ) . ' ₽' : 
						'Не указанна..';
			
			// Инфо по заказу	
			$info .= '<br>' . $i . '. ' . $post -> post_title . ' ' . $price . ' ✔ ';
		
			// если номер такой же как у прошлого
			if ( $value == $before_value ) {
		
				// Добавим количество шт.
				$product[ $value ]++;
			
			} else {
			
				// Изначально 1 шт.
				$product[ $value ] = 1;
			};
			
			// Прошлое значение
			$before_value = $value;
		};
	};
	
	// Форма с тремя полями
	$form = 	[	
				'before'	=> '<div class="contener-form">',
				'after'	=> '</div>',
				'classID'	=> '#feedback',
				'title'	=> 'С кем связаться..', 
				'name'	=> '', 
				'phone'	=> '', 
				'email'	=> '', 
				'info'	=> $info,
			];
			
	// Флаги
	$bay = false;
	$sort = false;
	$param = false;
	
	// Обработаем параметры
	$my_GET = pull_test_data( $_GET, true );

	// Форма что-то вернула
	if ( $my_GET[ "f_name" ] || $my_GET[ "f_phone" ] || $my_GET[ "f_email" ] ) { 
		
		$param = true;
	
		// Попробуем обработать форму
		$result = pull_test_form( $form );
	
		// Бракованные данные		
		if ( ! is_null ( $result[ "warning" ] ) ) {
		
			// Покажем что не так
			echo get_test_form( $result );
			
		// все ок	
		} else {
		
			// Сбросим куки
			$_COOKIE[ 'basket' ][ 'length' ] = '';
			$_COOKIE[ 'basket' ][ 'string' ] = '';

			$text =	'т. ' . 
						$result[ "phone" ] . 
					' | @. ' . 
						$result[ "email" ] . 
					' | <br/><br/>' . 
						$result[ "info" ];
		
			$commentdata = [
				'comment_author'       => $result[ "name" ],
				'comment_author_email' => $result[ "email" ],
				'comment_content'      => $text,
			];
		
			wp_new_comment( $commentdata );

		};
	};
	
	// Нажали заказать
	if ( $my_GET[ "bay" ] ) { 
		
		$bay = true;
		
		// дадим форму		
		echo get_test_form( $form );
		
	};

	// Нажали сортировать
	if ( $my_GET[ "sort" ] ) { 
	
		// Обработаем параметры
		$my_sort = pull_test_data( $_GET['sort'], ['tcp'] );
	
		$sort = true;
		
		if ( $my_sort === 't' ) {
		
			foreach ( $product as $key => $value ) {
			
				//Дать пост
				$post = get_post( $key ); 
			
				$sortarray[ $key . ';' . $value ] = $post -> post_title;
				
			};

			asort( $sortarray, SORT_STRING ); //arsort

			$product = [];
			
			foreach ( $sortarray as $keys => $value ) {
			
				$key = explode( ";", $keys );

				$product[ $key[ 0 ] ] = $key[ 1 ];
			};
			
		} elseif ( $my_sort === 'c' ) {
		
			arsort( $product, SORT_NUMERIC ); //ksort
			
		} elseif ( $my_sort === 'p' ) {
		
			foreach ( $product as $key => $value ) {
			
				//Дать пост
				$post = get_post( $key ); 
			
				//Цена есть?
				$price = ( 	get_post_meta( $post -> ID, 'price', true ) ) ? 
							get_post_meta( $post -> ID, 'price', true ) : 
							0;
							
				$sortarray[ $key . ';' . $value ] = $price;
				
			};

			arsort( $sortarray, SORT_NUMERIC );
			
			$product = [];
			
			foreach ( $sortarray as $keys => $value ) {
			
				$key = explode( ";", $keys );

				$product[ $key[ 0 ] ] = $key[ 1 ];
			};

		};
		
	};
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Если не заказ, нет данных и продукты есть отрисуем табличку
	if (	!$bay && !$param && isset( $product ) ) {
	
		$tovar = '';
		
		$i = 0;
		
		foreach ( $product as $key => $value ) { 
		
			$i++;

			//Дать пост
			$post = get_post( $key ); 

			//Фото есть?
			if ( has_post_thumbnail( $post -> ID ) ) {
				
				$img = get_the_post_thumbnail( $post -> ID, [ 200,  ], [ 'class' => 'foto_product', 'alt' => 'foto' ] );
			
			//Без фото
			} else {
						
				$img = '<img src="/img/foto.png" class="foto_product" alt="foto" width="200" height="200"/>';
					
			};
			
			//Ссылка на продукт
			$a_img = build_test_link( [	
									"href"		=>	get_permalink( $post -> ID ),
									"title"		=>	$post -> post_title,
									"body"		=>	$img,
								] );
			
			// Ссылка на добавление
			$plus = build_test_link( [	
									"href"		=>	home_url( ) . '/basket/?uid=' . $post -> ID,
									"classID"		=>	'#control-icon',
									"title"		=>	"Добавить",
									"body"		=>	'',
									"icon_name"	=>	'plus-icon',
									"icon_classID"	=>	'#plus',
						] );
				
			//Цена есть?
			$price = ( 	get_post_meta( $post -> ID, 'price', true ) ) ? 
						get_post_meta( $post -> ID, 'price', true ) . ' ₽' : 
						'Не указанна..';
						
			// Ссылка на уменьшение
			$minus = build_test_link( [	
									"href"		=>	home_url( ) . '/basket/?uid=-' . $post -> ID,
									"classID"		=>	'#control-icon',
									"title"		=>	"Убрать",
									"body"		=>	'',
									"icon_name"	=>	'minus-icon',
									"icon_classID"	=>	'#minus',
								] );
								
			// Товарная линия
			$tovar[ $i - 1 ] = [ 
							'basket-number'		=> $i,
							'basket-img'			=> $a_img,
							'basket-title'			=> $post -> post_title,
							'basket-control left'	=> $minus,
							'basket-count'			=> $value,
							'basket-control right'	=> $plus,
							'basket-price'			=> $price,
							];	
		};
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// Ссылка заголовок
		$title = build_test_link( [	"href"		=>	home_url( ) . '/basket/?sort=t',
								"title"		=>	'Сортировать по названию.',
								"body"		=>	'Наименование',
							] );
							
		// Ссылка количество
		$counter = build_test_link( [	"href"		=>	home_url( ) . '/basket/?sort=c',
								"title"		=>	'Сортировать по количеству.',
								"body"		=>	'Количество',
							] );
							
		// Ссылка цена
		$prices = build_test_link( [	"href"		=>	home_url( ) . '/basket/?sort=p',
								"title"		=>	'Сортировать по цене.',
								"body"		=>	'Цена',
							] );
		
		$head = [
				'titles' => $title, null, null, 
				'counters' => $counter, null, null, 
				'prices' => $prices 
				];
		
		echo get_test_table(	[ 
							"classID"	=>	"#basket",
							"head"	=>	$head,
							"body"	=>	$tovar,
							] );
	
		echo '
		<script>
			if ( !navigator.cookieEnabled ) { 
				var div = document.querySelector( ".content" ); 
				div.innerHTML = "Включите cookie!";
				div.style.padding="64px";
				div.style.fontSize="1.5rem";
			};
		</script>
		';

	};
};

?>


