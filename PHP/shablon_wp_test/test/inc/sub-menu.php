<?php	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Социальные ссылки, return: <ul>nav-social, <div>sidebar, <p><a>feedback, <p><a>loginout	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_social( ) {

	// Меню дополнительной навигации
	wp_nav_menu( [	'theme_location' => 'social', 'menu_class' => 'social-menu' ] ); 
	
	//Виджеты в шапке если есть
	if ( is_active_sidebar( 'header_right' ) ) dynamic_sidebar( 'header_right' );
	
	//Ссылка на фидбек если есть
	$feedback = get_page_by_path( 'feedback' );
	
	if ( $feedback ) {
		
		// Ссылка
		echo build_test_link ( [	"before"		=>	'<p>',
							"href"		=>	get_permalink( $feedback ),
							"classID"		=>	null,
							"title"		=>	null,
							"body"		=>	$feedback -> post_title,
							"icon_name"	=>	null,
							"icon_classID"	=>	null,
							"after"		=>	'</p>',
						] );
	};
	
	//Вход в админку
	echo '<p>';
	wp_loginout( );
	echo '</p>';
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Хлебные крошки return list <ul><li><a>	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_breadcrumb( $ask_category = null ) {

	$catalog = get_page_by_path( 'catalog' );
	
	// Если внешний запрос уставить категорию иначе взять из GET 
	$category =	$ask_category ? 
				$ask_category : 
				pull_test_data( get_query_var ( 'category_name' ) );
				
	echo '<ul>';
	
	// Ссылка Домашний url // 1
	echo build_test_link( [	"before"		=>	'<li>',
						"href"		=>	get_bloginfo ( 'wpurl' ),
						"classID"		=>	null,
						"title"		=>	null,
						"body"		=>	get_bloginfo ( 'name' ),
						"icon_name"	=>	null,
						"icon_classID"	=>	null,
						"after"		=>	'</li>',
					] );
	
	// Это ошибка?
	if ( is_404( ) ) { 
	
		echo '</ul>'; 
		
		return; 
		
	};
	
	if ( $ask_category === 'catalog' ) { 
		echo '<li class="current">' . $catalog -> post_title . '</li>'; 
		echo '</ul>';
		return;
	};
	
	// Это категория?
	if ( $category ) {
		
		// Ссылка на каталог // 2
		echo build_test_link( [	"before"		=>	'<li>',
							"href"		=>	get_permalink( $catalog ),
							"classID"		=>	null,
							"title"		=>	null,
							"body"		=>	$catalog -> post_title,
							"icon_name"	=>	null,
							"icon_classID"	=>	null,
							"after"		=>	'</li>',
						] );

		// Категория
		$category =	$category ? 
					get_category_by_slug( $category ) : 
					get_category( pull_test_data( get_query_var ( 'cat' ) ) );
		
		// Получить массив предков категорий
		$categories = get_ancestors( $category -> term_id, 'category' );
		
		// Есть предки?
		if ( count( $categories ) > 0 ) {
		
			$categories = array_reverse( $categories );
			
			// Пробежать вверх, добавить ссылки спереди
			foreach ( $categories as $value ) {
			
				$category_list .= build_test_link( [	"before"		=>	'<li>',
												"href"		=>	get_category_link ( $value ),
												"classID"		=>	null,
												"title"		=>	null,
												"body"		=>	get_the_category_by_ID ( $value ),
												"icon_name"	=>	null,
												"icon_classID"	=>	null,
												"after"		=>	'</li>',
											] );
			};
			
			// Показать предков категории
			echo $category_list; // 3, .., n-1
		};
		
		// Текущая категория
		echo '<li class="current">' . $category -> name . '</li>'; // n+1
		
	// Это пост?	
	} elseif ( is_single( ) ) {

		// Ссылка на каталог // 2
		echo build_test_link( [	"before"		=>	'<li>',
							"href"		=>	get_permalink( $catalog ),
							"classID"		=>	null,
							"title"		=>	null,
							"body"		=>	$catalog -> post_title,
							"icon_name"	=>	null,
							"icon_classID"	=>	null,
							"after"		=>	'</li>',
						] );
		
		// Текущий пост
		$post = get_post( );

		// Категория поста
		$arr_term = get_the_category( );
		$category = get_category( $arr_term[ 0 ] -> term_id );		

		// Получить массив предков категорий
		$categories = get_ancestors( $category -> term_id, 'category' );
		
		// Есть предки?
		if ( count( $categories ) > 0 ) {
		
			$categories = array_reverse( $categories );
			
			// Пробежать вверх, добавить ссылки спереди
			foreach ( $categories as $value ) {
			
				$category_list .= build_test_link( [	"before"		=>	'<li>',
												"href"		=>	get_category_link ( $value ),
												"classID"		=>	null,
												"title"		=>	null,
												"body"		=>	get_the_category_by_ID ( $value ),
												"icon_name"	=>	null,
												"icon_classID"	=>	null,
												"after"		=>	'</li>',
											] );
			};
			
			// Показать предков категории
			echo $category_list; // 3, .., n-2
		};
		
		// Категория поста // n-1
		echo build_test_link( [	"before"		=>	'<li>',
							"href"		=>	get_category_link( $category ),
							"classID"		=>	null,
							"title"		=>	null,
							"body"		=>	$category -> name,
							"icon_name"	=>	null,
							"icon_classID"	=>	null,
							"after"		=>	'</li>',
						] );
		// и сам пост
		echo '<li class="current">' . $post -> post_title . '</li>'; // n
		
	// Это страница!
	} else {
	
		// Открытая страница
		the_title ( '<li class="current">','</li>', true );
	};
	
	echo '</ul>';
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Дополнительне элементы управления корзиной return <li><a>	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_basket_control_link( ) {

	$basket = get_page_by_path( 'basket' );
	
	if ( $basket ) {

		// Если есть товары и не заказ и не после заказа
		if ( pull_test_data( $_COOKIE[ 'basket' ][ 'length' ], 123 ) > 0 && ! ( pull_test_data( get_query_var( 'f_name' ), true ) ) && pull_test_data( get_query_var( 'bay' ), ['*'] ) !== '*' ) {
		
			echo build_test_link( [	"before"		=>	'<li id="button">',
								"href"		=>	'?uid=*',
								"classID"		=>	null,
								"title"		=>	'Очистить',
								"body"		=>	'Очистить',
								"icon_name"	=>	'cart-icon',
								"icon_classID"	=>	'#remove',
								"after"		=>	'</li>',
							] );
			
			echo build_test_link( [	"before"		=>	'<li id="button">',
								"href"		=>	home_url( ) . '/basket/?bay=*',
								"classID"		=>	null,
								"title"		=>	"Заказать",
								"body"		=>	"Заказать",
								"icon_name"	=>	'check-icon',
								"icon_classID"	=>	'#check',
								"after"		=>	'</li>',
							] );
		};
		
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Меню каталога return list <ul><li><a> + количество постов ()	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_menu_article( ) {

	// Для каталога, категории или поста
	if ( is_page( 'catalog' ) || pull_test_data( get_query_var( 'category_name' ), true ) || is_single( ) ) {
	
		echo '<ul>';
		
		// Категории каталога
		wp_list_categories( [	'title_li'  => '', 
							'show_count' => 1,
							'taxonomy'=>'category' ] );
		echo '</ul>';
		
	// Для корзины
	} elseif ( is_page( 'basket' ) ) {
		echo '<ul id="button-area">';
	
			get_test_basket_link( );		
			get_test_basket_control_link ( );
			
		echo '</ul>';
	};
};

?>


