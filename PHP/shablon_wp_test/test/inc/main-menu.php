<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Ссылка на корзину или назад в каталог если есть return <li><a>	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_basket_link( ) {

	$basket = get_page_by_path( 'basket' );
	$catalog = get_page_by_path( 'catalog' );
	
	// Если страница есть
	if ( $basket ) {
	
		// Если это каталог и есть товар в корзине
		if ( ( pull_test_data( $_COOKIE[ 'basket' ][ 'length' ], 123 ) > 0 ) && ! is_page( 'basket' ) ) {
		
			// Ссылка
			echo build_test_link( [	"before"		=>	'<li id="button" class="menu">',
								"href"		=>	get_permalink( $basket ),
								"classID"		=>	null,
								"title"		=>	"В корзину",
								"body"		=>	$basket -> post_title,
								"icon_name"	=>	"cart-icon",
								"icon_classID"	=>	"#cart",
								"after"		=>	'</li>',
							] );
		
		// Если это корзина
		} elseif ( is_page( 'basket' ) ) {
			
			// Если заказ
			if ( pull_test_data( get_query_var( 'bay' ), true ) || pull_test_data( get_query_var( 'f_name' ), true ) ) {
		
				// Ссылка
				echo build_test_link( [	"before"		=>	'<li id="button" class="menu">',
									"href"		=>	get_permalink( $basket ),
									"classID"		=>	null,
									"title"		=>	"В корзину",
									"body"		=>	"Назад",
									"icon_name"	=>	"cart-icon",
									"icon_classID"	=>	"#cart",
									"after"		=>	'</li>',
								] );
			
  			// Если категория
			} elseif ( preg_match( '/category/', pull_test_data( $_SERVER[ 'HTTP_REFERER' ], 'url' ) ) ) {
		
				// Ссылка
				echo build_test_link( [	"before"		=>	'<li id="button" class="menu">',
									"href"		=>	strval( pull_test_data( $_SERVER[ 'HTTP_REFERER' ] ) ),
									"classID"		=>	null,
									"title"		=>	"В категорию",
									"body"		=>	$catalog -> post_title,
									"icon_name"	=>	"folder-open-icon",
									"icon_classID"	=>	"#folder",
									"after"		=>	'</li>',
								] );

 			// Каталог!
			} else {
		
				// Ссылка
				echo build_test_link( [	"before"		=>	'<li id="button" class="menu">',
									"href"		=>	get_permalink( $catalog ),
									"classID"		=>	null,
									"title"		=>	"В каталог",
									"body"		=>	$catalog -> post_title,
									"icon_name"	=>	"folder-open-icon",
									"icon_classID"	=>	"#folder",
									"after"		=>	'</li>',
								] );

			};

		};
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Основное меню и basket_link, return: <ul>nav-primary, <li><a>basket_link	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_menu( ) {

	// Меню основной навигации
	wp_nav_menu( [	'menu_class' => 'gl_menu',
				'menu_id' => 'gl_menu',
				'container' => '',
				'theme_location' => 'primary',
	] );
	
	// basket_link
	get_test_basket_link( );
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Основное локальное меню return: <ul>nav-primary-loc	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_menu_local( ) {	

	// Меню основной навигации 	
	wp_nav_menu ( [	'menu_class' => 'loc_menu',
					'menu_id' => 'loc_menu',
					'container' => '',
					'theme_location' => 'primary',
	] ); 
};

?>


