<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Конструктор ссылок.
//
// build_test_link( $_args ) - возвращает ссылку ( string )
// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Примеры:
//
// 1. Минимально:			echo build_test_link( [ "href" => "http://default.ru" ] )
//
// 2. С текстом:			echo build_test_link( [ "href" => "http://default.ru", "body" => "default" ] )
//
// 3. С ид:				echo build_test_link( [ "href" => "http://default.ru", "classID" => "#def" ] )
//
// 4. Или классом:			echo build_test_link( [ "href" => "http://default.ru", "classID" => "def" ] )
//
// 5. С титлом:			echo build_test_link( [ "href" => "http://default.ru", "title" => "default" ] )
//
// 6. С svg иконкой и тестом:	echo build_test_link( [ "href" => "http://default.ru", "body" => "default", "icon_name" => "spiner-icon" ] )
//
// 7. Или даже просто с svg:	echo build_test_link( [ "href" => "http://default.ru", "body" => "", "icon_name" => "cart-icon", "icon_classID" => "#cart" ] )
//
// 8. Обернутая в <p>		echo build_test_link( [ "before" => "<p>", "href" => "http://default.ru", "after" => "</p>"] )
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function build_test_link( $args = null ) {
	$defaults = [
		"before"		=>	null,			// "<p>"
		"href"		=>	null,			// "http://default.ru"
		"classID"		=>	null,			// "class" или "#id"
		"title"		=>	null,			// "перейти на дефолтный сайт"
		"body"		=>	null,			// "" --> пусто || null --> "href" || '<img scr="opka.jpg"/>' --> обернуть рисунок
		"icon_name"	=>	null,			// opka-icon
		"icon_classID"	=>	null,			// "opa_class" или "#id_opka"
		"after"		=>	null,			// "</p>"
	];

	// Распарсим аргументы
	$key = wp_parse_args( $args, $defaults );
	
	$link = '';
	$a = '';
	$svg = '';
	
	// Нет адреса, расходимся
	if ( ! $key[ "href" ] ) { return; };
	
	// Предведущий контент, если есть
	if ( $key[ "before" ] && is_string( $key[ "before" ] ) ) {
		
		$link .= $key[ "before" ];
			
	};
		
	// Собственно ссылка
	$a .= '<a href="' . $key[ "href" ] . '" ';
		
	// Класс или ид если есть
	if ( $key[ "classID" ] && is_string( $key[ "classID" ] ) ) {
		
		// Если есть # это ид иначе класс 
		if ( $key[ "classID" ][ 0 ] === "#" ) { 
			
			$a .= 'id="' . substr( $key[ "classID" ], 1 ) . '" ';
				
		} else {
			
			$a .= 'class="' . $key[ "classID" ] . '" ';
				
		};
	};
		
	// Заголовок всплывающий если есть
	if ( $key[ "title" ] && is_string( $key[ "title" ] ) ) {
		
		$a .= 'title="' . $key[ "title" ] . '" ';
			
	};
		
	// Закроем начало ссылки
	$a .= '>';
		
	// Тело в ссылке если нету, то href, если надо пустое ""
	if ( ! is_null( $key[ "body" ] ) && is_string( $key[ "body" ] ) ) {
		
		$a .= $key[ "body" ];
			
	} else {
		
		$a .= $key[ "href" ];
			
	};
		
	// SVG иконка если есть
	if ( $key[ "icon_name" ] && is_string( $key[ "icon_name" ] ) ) {
		
		$svg .= '<svg ';

		// Класс или ид иконки если есть
		if ( $key[ "icon_classID" ] && is_string( $key[ "icon_classID" ] ) ) {
			
			// Если есть # это ид иначе класс 
			if ( $key[ "icon_classID" ][ 0 ] == "#" ) {
				
				$svg .= 'id="' . substr( $key[ "icon_classID" ], 1 ) . '" ';
					
			} else {
				
				$svg .= 'class="' . $key[ "icon_classID" ] . '" ';
					
			};
		};
			
		// Собственно SVG
		$svg .= '><use xlink:href="#' . $key[ "icon_name" ] . '" href="#' .$key[ "icon_name" ] . '"/></svg>';
	};
	
	// Добавим иконку
	$a .= $svg;
	
	// Закроем ссылку
	$a .= '</a>';
	
	// Добавим ссылку с иконкой
	$link .= $a;
	
	// Следующий контент, если есть
	if ( $key[ "after" ] && is_string( $key[ "after" ] ) ) {
		
		$link .= $key[ "after" ];
			
	};
		
	return $link;
	
};

?>



