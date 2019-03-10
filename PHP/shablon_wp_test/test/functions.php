<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Настройки темы		//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Количество товаров на странице 
//	[ 	1. для каталога, 
//		2. для категории, 
//		3. порядок сортировки прямой обратный (ASC, DESC),
//		4. сортировать по: 'ID' 'title' 'rand' 'menu_order' 'meta_value_num'
//		( ид названию случайно категориям ( по цене если все цены указанны ) ) ]
		
$settings_view	=	[
					'catalog'			=>	6, 
					'category'		=>	6, 
					'order'			=>	'ASC', 
					'orderby'			=>	'title',
					'excerpt_length'	=>	5,
					'excerpt_more'		=>	'...'
				] ;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Общие настройки темы	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ( ! function_exists( 'test_setup' ) ) {

	function test_setup( ) {

		// Превьюшки товаров
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 200, 200 );

		// Кастомное лого
		add_theme_support( 'custom-logo' );

		// Менюшка
		register_nav_menus( [
			'primary' => 'Primary Menu',
			'social'  => 'Social Links Menu' 
		] );
	};
};
add_action( 'after_setup_theme', 'test_setup' );

// Арены виджетов
function test_widgets_init( ) {
	register_sidebar( [
		'name'          => __( 'Header right', 'test' ),
		'id'            => 'header_right',
		'description'   => __( 'Виджеты в шапке справа', 'test' ),
		'before_widget' => '',
		'after_widget'  => '',
		'before_title'  => '',
		'after_title'   => '',
		] );
};
add_action( 'widgets_init', 'test_widgets_init' );

// Количество слов из описания в карточке
function test_custom_excerpt_length( ) {

	global $settings_view;
	
	return $settings_view[ 'excerpt_length' ];
};
add_filter( 'excerpt_length', 'test_custom_excerpt_length', 999 );

// Символ сокращения 
function test_excerpt_more( ) { 

	global $settings_view;
	
	return $settings_view[ 'excerpt_more' ];
};
add_filter( 'excerpt_more', 'test_excerpt_more' );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Скрипты
function test_scripts( ) {
	// Сброс стиля
	wp_enqueue_style( 'test-reset-style', get_template_directory_uri( ) . '/css/reset.css' );
	// Стиль сайта
	wp_enqueue_style( 'test-style', get_template_directory_uri( ) . '/style.css' );
	
	// Функции дополняющие функционал стандартного сайта
	wp_enqueue_script( 'test-function-js', get_template_directory_uri( ) . '/js/test-function.js' );
	// Функции ajax сайта
	wp_enqueue_script( 'test-ajax-js', get_template_directory_uri( ) . '/js/test-ajax.js' );
	// Функции печенек
	wp_enqueue_script( 'test-cookie-js', get_template_directory_uri( ) . '/js/test-cookie.js' );
	// 	
	wp_deregister_script( 'wp-embed' );
};
add_action( 'wp_enqueue_scripts', 'test_scripts' );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Удаляем лишнее с head части сайта
remove_action( 'wp_head', '_wp_render_title_tag', 1 ); //Заголовок
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 ); 
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 ); // Убираем связанные ссылки
remove_action( 'wp_head', 'locale_stylesheet' );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );
remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); 
remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 ); // Ссылки на соседние статьи
add_filter( 'the_generator', '__return_empty_string' ); // Убираем версию WordPress

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Правила перезаписи	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Рулес принимаемых параметров
function custom_rewrite( ) {
	add_rewrite_tag( '%uid%', '([^&]+)' );
	add_rewrite_tag( '%bay%', '([^&]+)' );
	add_rewrite_tag( '%sort%', '([^&]+)' );
	add_rewrite_tag( '%f_name%', '([^&]+)' );
	add_rewrite_tag( '%f_phone%', '([^&]+)' );
	add_rewrite_tag( '%f_email%', '([^&]+)' );
	add_rewrite_tag( '%f_text%', '([^&]+)' );
};
add_action( 'init', 'custom_rewrite', 10, 0 );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Иконки	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function load_test_svg_icons( ) {
	
	$svg_lib = get_parent_theme_file_path( '/img/icon.svg' );

	if ( file_exists( $svg_lib ) ) { require_once( $svg_lib ); };
};
add_action( 'wp_footer', 'load_test_svg_icons', 9999 );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Универсальные функции	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require get_template_directory( ) . '/inc/data.php';			// Обработка данных		| pull_test_data( $_data, $_return_type )
require get_template_directory( ) . '/inc/link.php';			// Конструктор ссылок	| build_test_link( $args[] )
require get_template_directory( ) . '/inc/form.php';			// Конструктор форм		| get_test_form( $args[] ) | pull_test_form( $args[] )
require get_template_directory( ) . '/inc/table.php';			// Конструктор таблиц	| get_test_table( $args[] )


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Уникальные функции	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require get_template_directory( ) . '/inc/cookie.php';			// Работа с печенками
require get_template_directory( ) . '/inc/in-header.php';		// Для заголовка
require get_template_directory( ) . '/inc/in-footer.php';		// Для подвала
require get_template_directory( ) . '/inc/main-menu.php';		// Для главного меню
require get_template_directory( ) . '/inc/sub-menu.php';		// Для вспомогательных меню
require get_template_directory( ) . '/inc/content.php';		// Вывод контента -->

?>


