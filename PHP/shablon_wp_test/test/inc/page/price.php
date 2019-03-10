<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	page price	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_page_price( ) {

	// Настройка параметров выдачи постов				
	$args = [	
			'posts_per_page'	=>	999,
			'order'			=>	'ASC',
			'orderby'			=>	'ID',
			//'meta_key'		=>	'price', // раскометить если указанны все цены на товары ( выдача товаров по цене )
			'type'			=> 	'list'
	];
		
	// Применить настройки
	$full_product = query_posts( $args );
	
	// Обработаем параметры
	$my_GET = pull_test_data( $_GET, true );

	$product = [];

	foreach ( $full_product as $key => $value ) { 
	
		//Цена есть?
		$price = ( 	get_post_meta( $full_product[ $key ] -> ID, 'price', true ) ) ? 
					get_post_meta( $full_product[ $key ] -> ID, 'price', true ): 
					0;
		
		$product[ $full_product[ $key ] -> post_title . ';;' . $full_product[ $key ] -> ID ] = $price;
	};
	
	// Нажали сортировать
	if ( $my_GET[ "sort" ] ) { 
	
		// Обработаем параметры
		$my_sort = pull_test_data( $_GET['sort'], ['itp'] );
	
		if ( $my_sort === 'i' ) {
			

		} elseif ( $my_sort === 't' ) {
			
			ksort( $product, SORT_STRING ); //arsort

		} elseif ( $my_sort === 'p' ) {
		
			arsort( $product, SORT_NUMERIC );
			
		};
	};
	
	$i = 0;
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	foreach ( $product as $key => $value ) { 
		
		$i++;
		
		$id = explode( ";;", $key );
		
		//Дать пост
		$post = get_post( $id[ 1 ] ); 

		//Фото есть?
		if ( has_post_thumbnail( $post -> ID ) ) {
				
			$img = get_the_post_thumbnail( $post -> ID, [ 200,  ], [ 'class' => 'foto_product', 'alt' => 'foto' ] );
			
		//Без фото
		} else {
						
			$img = '<img src="/img/foto.png" class="foto_product" alt="foto" width="200" height="200"/>';
					
		};
		
		//Цена есть?
		$price = ( 	get_post_meta( $post -> ID, 'price', true ) ) ? 
					get_post_meta( $post -> ID, 'price', true ) . ' ₽' : 
					'Не указанна..';
			
		//Ссылка на продукт
		$a_img = build_test_link( [	
								"href"	=>	get_permalink( $post -> ID ),
								"title"	=>	$post -> post_title,
								"body"	=>	$img,
							] );
			
		// Товарная линия
		$tovar[ $i - 1 ] = [ 
						'price-id'	=> $id[ 1 ],
						'price-img'	=> $a_img,
						'price-title'	=> $post -> post_title,
						'price-price'	=> $price,
						];	
	};
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Ссылка заголовок
	$id = build_test_link( [	
						"href"	=>	home_url( ) . '/price/?sort=i',
						"title"	=>	'Сортировать по ид.',
						"body"	=>	'id',
						] );

	// Ссылка заголовок
	$title = build_test_link( [	
							"href"	=>	home_url( ) . '/price/?sort=t',
							"title"	=>	'Сортировать по названию.',
							"body"	=>	'Наименование',
						] );
							
	// Ссылка цена
	$prices = build_test_link( [	
							"href"	=>	home_url( ) . '/price/?sort=p',
							"title"	=>	'Сортировать по цене.',
							"body"	=>	'Цена',
						] );
		
	$head = [ 
			'ids' => $id, 
			'titles' => $title, null, 
			'prices' => $prices  
			];
		
	echo get_test_table(	[ 
							"classID"	=>	"#price",
							"head"	=>	$head,
							"body"	=>	$tovar,
						] );
	

};

?>


