<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Извлечение данных.
//
// pull_test_data( $_data, $_return_type ) - извлекает заданные значения из данных
// _arr_pull_data( $_data, $_return_type ) - вспомогательная ( принимает только массив )
// _str_pull_data( $_data, $_return_type ) - вспомогательная ( принимает только скалар )
// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Примеры:
//
// 1. тип стока или null:	pull_test_data( ['abc','-123.3','<script>alert("tt")</script>\''] ) ) -> ['abc','-123.3','<script>alert("tt")</script>'']( не исполняемо )
//
// 2. тип int:				pull_test_data( ['abc','-123.3','<>"'], 123 ) -> [ 0, -123, 0 ]
//
// 3. тип float:			pull_test_data( ['abc','-123.3','<>"'], 123.123 ) -> [ 0, -123.3, 0 ]
//
// 4. тип bool:			pull_test_data( ['abc','123','<>"'], true ) -> [ true, true, true ]
//
// 5. тип белый список:		pull_test_data( ['abc','123','<>"'], ['a1'] ) -> [ 'a', '1', '' ]
//
// 6. тип черный список:		pull_test_data( ['abc','123','<>"'], ['^a1'] ) -> [ 'bc', '23', '<>"' ]
//
// 7. тип 'email':			pull_test_data( '~!@#$%^:">ph@ph.%^&fc', 'email' ) -> "~!@#$%^ph@ph.%^&fc" ( допустимые в email )
//
// 8. тип 'url':			pull_test_data( '~!@#$%^:">ph@ph.%^&fc', 'url' ) ->  "%7E%21%40%23%24%25%5E%3A%22%3Eph%40ph.%25%5E%26fc" ( допустимые в url )
//
// 9. тип 'number':			pull_test_data( '123qwert!@#.456hfhdj-+', 'number' ) ->  "123.456-+" ( допустимые в числах )
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Подробно:
//
//	значение $_data:			запрошен тип $_return_type:			на выходе return:
//
// 	( null )					*								( null )
//
//	^( bool, int, float, str, arr )* 								( null )
//
//															вырезает символы [0..32, 127..] экранирует [<>'"%&] 
// 	( string ) *по умолчанию		( null ), ( string ) 				( string ) ( string -> filter_strip  ) ( аналог htmlspecialchars( ENT_NOQUOTES )+ )
//
// 	( string )				( string ) ( 'email' || '@' )			( string ) ( string -> filter_email )
//
// 	( string )				( string ) ( 'number' || 'num' )		( string ) ( string -> filter_float [0-9+-.] )
//
//	( string )				( string ) ( 'url' )				( string ) ( string -> filter_url )
//
// 	( string )				( bool )							( bool )
//
// 	( string )				( integer	)						( integer ) ( string -> filter_float [0-9+-] )
//
// 	( string )				( float )							( float ) ( string -> filter_float [0-9+-.] )
//
//	( string )				( array ) ['a-z0-9'] || ['^a-z0-9']	( string ) ( string -> допустимые символы или не допустимые символы )
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	( bool, int, float )		*								cм. String
//
// 	( array ) [ scalar, array ]	*								cм. String
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Разбор скалярных значений.	//
// вспомогательная			//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function _str_pull_data( $in_str = null , $type = 'string' ) {

	// Аргумента нет, выходим
	if ( is_null( $in_str ) ) { return null; };
	
	// Не скаляр
	if ( ! is_scalar( $in_str ) ) { return null; }

	// Стандартный фильтр htmlspecialchars( ENT_NOQUOTES ) + char [0..32, 127..255] вырезать
	$filter = FILTER_SANITIZE_FULL_SPECIAL_CHARS;
	$flags = [ 'flags' => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH ];

	//
	// Специальные типы
	//
	
	// Вернуть допустимые символы для E-mail
	if ( $type === 'email' || $type === '@' ) {
		
		return $result = filter_var( $in_str, FILTER_SANITIZE_EMAIL);
		
	// Вернуть допустимые символы для номера [0-9-+.]
	} elseif ( $type === 'number' || $type === 'num' ) { 
			
		return $result = filter_var( $in_str, FILTER_SANITIZE_NUMBER_FLOAT, [ 'flags' => FILTER_FLAG_ALLOW_FRACTION ] );
		
	// Вернуть допустимые символы для url ( не безопасные значения кодировать )
	} elseif ( $type === 'url' ) {
		
		return $result = filter_var( filter_var( $in_str, FILTER_SANITIZE_URL ), FILTER_SANITIZE_ENCODED );
		
	// Вернуть белый список или черный список для класса символов. Тип: array[один элемент ' строка ']
	} elseif ( is_array( $type ) && ( count ( $type[ 0 ] ) === 1 ) && is_string( $type[ 0 ] ) ) {

		return $result = implode( preg_grep ( '/^[' . $type[ 0 ] . ']+$/' , str_split( filter_var( $in_str, $filter, $flags ) ) ) );
	
	//
	// Скалярные значения
	//
	
	// String запрошен тип
	} elseif ( is_string( $type ) ) {
		
		return $result = filter_var( $in_str, $filter, $flags );
			
	// Boolean запрошенный тип
	} elseif ( is_bool( $type ) ) { 
			
		return $result = boolval( $in_str );
			
	// Inreger запрошенный тип
	} elseif ( is_int( $type ) ) { 
			
		return $result = intval( filter_var( $in_str, FILTER_SANITIZE_NUMBER_FLOAT ) );
			
	// Float запрошенный тип
	} elseif ( is_float( $type ) ) { 
			
		return $result = floatval( filter_var( $in_str, FILTER_SANITIZE_NUMBER_FLOAT, [ 'flags' => FILTER_FLAG_ALLOW_FRACTION ] ) );

	// В других случаях	
	} else {
	
		return null;
		
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Разбор массива.	//
// вспомогательная	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function _arr_pull_data( $in_arr = null , $type = 'string'  ) {

	// Аргумента нет, выходим
	if ( is_null( $in_arr ) ) { return null; };
	
	// Не массив
	if (	! is_array( $in_arr ) ) { return null; }
	
	// Пройдем по массиву
	foreach ( $in_arr as $key => $value ) {
				
		// Новый массив? 
		if (	is_array( $value ) ) {
		
			// рекурсивно!!!
			$result[ $key ] = _arr_pull_data( $value, $type );
					
		} else {
				
			$result[ $key ] = _str_pull_data( $value, $type );
					
		};
						
	};
			
	return $result;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Извлечение данных	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pull_test_data( $in = null, $type = 'string' ) {

	// Аргумента нет, выходим
	if ( is_null( $in ) ) { return null; };

	//
	// Массив на входе
	//
	if ( is_array( $in ) ) {
		
		return $result = _arr_pull_data( $in, $type );
		
	};
	
	//	
	// Сколяр на входе bool, int, float или string
	//
	if ( is_scalar ( $in ) ) { 
		
		return $result = _str_pull_data( $in, $type );
		 
	};
	
	//
	// Не понятно что на входе
	//
	if ( ! is_array( $in ) && ! is_scalar ( $in ) ) {
		
		return null;

	};
};

?>



