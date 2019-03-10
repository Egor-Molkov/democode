<?php 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Обработчик post-запросов	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Внешние данные
	$my_POST = pull_test_data( $_POST );

	// Если запросили хлебные крошки дадим и выдем
	if ( $my_POST[ 'title' ] ) {
		
		get_test_breadcrumb( $my_POST[ 'title' ] );
			
		return;
	};
	
	// Шаблон для пагинации
	$str_base = home_url( );
	
	// Распарсим url
	$url_array = parse_url( $my_POST[ 'href' ] );
	
	$path = explode( "/", $url_array[ 'path' ] );

	// Пробежим по масиву возьмем название категории, если пагинация возьмем номер и выйдем
	foreach ( $path as $key => $value ) {
		
		if ( $value ) {
			if ( $value === 'page' ) {
		
				$paged = $path[ $key + 1 ];
			
				break; 
			
			};
		
			// Запршенна категория
			$ask_category = $value;
		
			// Шаблон для пагинации
			$str_base .= '/' . $value;
		};
	};
	
////////////////////////////////////////////////////////////////////////////////////////////////////

	// Шаблон для пагинации
	$str_base .= '/page/%#%';
	
	// Если не каталог, то категория из запроса
	$category = ( $ask_category === 'catalog' ) ? null : $ask_category;

	// Если номера нет страница один
	$paged = ( $paged ) ? $paged : 1 ;

////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Загаловок страницы запишем в печенки
	$title = ( $category ) ? 
		get_category_by_slug( $category ) -> name : 
		get_page_by_path( 'catalog' ) -> post_title;
		
	$_COOKIE[ 'title_base' ] = $ask_category;
	$_COOKIE[ 'title' ] = $title;
	setcookie( 'title_base', $ask_category, 0, '/' );
	setcookie( 'title', $title, 0, '/' );
	
////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Дадим каталог
	get_test_catalog( $category, $paged );

	// Пагинатор return list <ul><li><a>	
	echo '<div class="pagination">' . paginate_links ( 
		[	'base' => $str_base,
			'format' => '?paged=%#%', 
			'type' => 'list' ] 
	) . '</div>';
		
	//Сброс настроек
	wp_reset_query( );

?>


