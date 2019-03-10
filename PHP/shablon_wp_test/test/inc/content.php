<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Модули	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require get_template_directory( ) . '/inc/page/post.php';		// Для товара
require get_template_directory( ) . '/inc/page/catalog.php';	// Для каталога
require get_template_directory( ) . '/inc/page/page.php';		// Для страниц
require get_template_directory( ) . '/inc/page/feedback.php';	// Для обратной связи
require get_template_directory( ) . '/inc/page/basket.php';		// Для корзины
require get_template_directory( ) . '/inc/page/price.php';		// Для прайса

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Вывод содержимого	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_content( ) {

	// Извлечь категория есть?
	$category = pull_test_data(  get_query_var( 'category_name' ), true );
	
	// Это каталог или категория?
	if ( is_page( 'catalog' )  || $category ) {
	
		get_test_catalog( );
		
	// Это форма обратной связи?
	} elseif ( is_page( 'feedback' ) ) {
	
		get_test_page_feedback( );
		
	// Это корзина?
	} elseif ( is_page( 'basket' ) ) {
	
		get_test_page_basket( );

	// Это корзина?
	} elseif ( is_page( 'price' ) ) {
	
		get_test_page_price( );
		
	// Это товар?
	} elseif ( is_single( ) ) {
	
		get_test_post( );
	
	// Это страница!	
	} else {
	
		get_test_page( );
	};
	
	//Сброс настроек
	wp_reset_query( );

};

?>


