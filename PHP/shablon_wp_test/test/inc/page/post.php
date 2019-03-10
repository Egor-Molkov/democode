<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	post	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_post( $ask_post = null ) {

		// Дать пост
		$post = $ask_post ? get_post( $ask_post ) : get_post( );
					
		//Фото есть?
		if ( has_post_thumbnail( ) ) {
					
			$foto = get_the_post_thumbnail( $post -> ID, 'full', [ 'class' => 'foto_product', 'alt' => 'foto' ] );
					
		//Без фото
		} else {
					
			$foto = '<img src="/img/foto.png" class="foto_product" alt="foto"/>';
						
		};
					
		//Цена есть?
		$price = ( 	get_post_meta( $post -> ID, 'price', true ) ) ? 
					get_post_meta( $post -> ID, 'price', true ) . ' ₽' : 
					'Не указанна..';
		
		// Ссылка на корзину
		$basket = build_test_link( [	
								"href"		=>	home_url( ) . '/basket/?uid=' . $post -> ID,
								"title"		=>	'В корзину',
								"body"		=>	'',
								"icon_name"	=>	'cart-icon',
								"icon_classID"	=>	'#basket-icon',
							] );

// Карточка товара
echo '

<div id="post">

	<div class="tovar ">
	
		<div class="tovar-header">
			' . $foto . '
		</div>
		
		<div class="tovar-info">
			<h3>' . $post -> post_title . '</h3>
			<p>' . $post -> post_content . '</p>
			
			<div class="tovar-footer">
				<strong>' . $price . '</strong>
				' . $basket . '
			</div>
		</div>
		
	</div>
	
</div>
	
';

};

?>



