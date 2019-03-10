<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	catalog	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_catalog ( $ask_category = null, $ask_page = null ) {

	//Имя категории если запросили иначе из GET
	$category =	$ask_category ? 
				$ask_category : 
				pull_test_data( get_query_var( 'category_name' ) );
	
	// Номер страницы пагинатора или первая если запросили иначе из GET
	if ( $ask_page ) {
	
		$page = $ask_page;
		
	} else {
	
		$page =	pull_test_data( get_query_var( 'paged' ), true ) ? 
				pull_test_data( get_query_var( 'paged' ), 123 ) :
				1;
	};
	
	global $settings_view;
	
	// Показывать колличество товаров из глобальной если каталог или категория
	$view_post =	$category ? 
				$settings_view[ 'category' ] : 
				$settings_view[ 'catalog' ];

	// Посчитаем посты
	$count_post = count( query_posts( [ 'category_name' => $category ] ) );

	// Настройка параметров выдачи постов				
	$args = [		'posts_per_page'	=>	$view_post, 
				'category_name'	=>	$category,
				'paged'			=>	$page,
				'order'			=>	$settings_view[ 'order' ],
				'orderby'			=>	$settings_view[ 'orderby' ],
				//'meta_key'		=>	'price', // раскометить если указанны все цены на товары ( выдача товаров по цене )
				'type'			=> 	'list'
	];
		
	// Применить настройки
	query_posts( $args );
	
	// Нет постов! Идти нафиг.
	if ( ! query_posts( $args ) ) {
	
		echo '<script>location.replace("404.php");</script>';
		
	};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	if ( $ask_category || $ask_page ) { $class_in = 'in'; } else { $class_in = ''; };

	$tovar = '';
			
	// Добавим товары в цикле !
	if ( have_posts( ) ) {
		
		while ( have_posts( ) ) {
	
			the_post( );
			
			//Дать пост
			$post = get_post( ); 
				
			//Фото есть?
			if ( has_post_thumbnail( ) ) {
				
				$img = get_the_post_thumbnail( $post -> ID, [ 200,  ], [ 'class' => 'foto_product', 'alt' => 'foto' ] );
			
			//Без фото
			} else {
						
				$img = '<img src="/img/foto.png" class="foto_product" alt="foto" width="200" height="200"/>';
					
			};
			
			//Ссылка на продукт
			$foto = build_test_link( [	"before"		=>	null,
									"href"		=>	get_permalink( $post -> ID ),
									"classID"		=>	null,
									"title"		=>	$post -> post_title,
									"body"		=>	$img,
									"icon_name"	=>	null,
									"icon_classID"	=>	null,
									"after"		=>	null,
							] );
					
			//Цена есть?
			$price =  	get_post_meta( $post -> ID, 'price', true ) ? 
						get_post_meta( $post -> ID, 'price', true ) . ' ₽' : 
						'Не указанна..';
						
			
			// Ссылка на корзину
			$basket = build_test_link( [	"before"		=>	null,
									"href"		=>	home_url( ) . '/basket/?uid=' . $post -> ID,
									"classID"		=>	null,
									"title"		=>	'В корзину',
									"body"		=>	'',
									"icon_name"	=>	'cart-icon',
									"icon_classID"	=>	'#basket-icon',
									"after"		=>	null,
								] );
								
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
			
			// Карточка товара		
			$tovar .= '

			<div class="tovar ' . $class_in . '">

				<div class="tovar-header">
					' . $foto . '
				</div>
	
				<div class="tovar-info">
					<h3>' . $post -> post_title . '</h3>
					<p>' . get_the_excerpt( $post -> ID ) . '</p>
				</div>
	
				<div class="tovar-footer">
					<strong>' . $price . '</strong>
					' . $basket . '
				</div>
	
			</div>

			';
			// Следующий товар ^
		};
	};
	// вышли из цикла
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	// Дадим каталог с товаром
	echo '

		<div class="catalog">
			' . $tovar .'
		</div>

	';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
		
	// Если количесво постов больше разрешенного и не запрос
	if ( ( $count_post > $count_view ) && ! $ask_category && ! $ask_page ) {

		// Пагинатор return list <ul><li><a>	
		echo '
			<div class="pagination">
				' . paginate_links ( [ 'type' => 'list' ] ) . '
			</div>
		';
	};
};

?>


