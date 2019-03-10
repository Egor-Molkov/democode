<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Конструктор форм.
//
// get_test_form( $_args ) - возвращает форму ( string )
// 
// Проверка данных формы.
//
// pull_test_form( $args ) - возвращает валидные данные или [ 'warning' ]
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Примеры:
//
// 1. с полем имя и кнопкой отправить: get_test_form( [ "name" => "" ] )
//
// 2. с заполненным полем имя, заполненным полем телефон и кнопкой отправить: get_test_form( [ "name" => "Иван", "phone" => "55 55 55"] )
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_test_form( $args = null ) {
	$defaults = [
		'before'	=>	null,	// <div>
		'after'	=>	null,	// </div>
		'classID'	=>	null,	// '#feedback'
		'title'	=> 	null,	// 'Заполни что-бы оставить сообщение..'
		'name' 	=> 	null,	// '' || 'Вася'
		'phone' 	=> 	null,	// '' || '77 77 77'
		'email' 	=> 	null,	// '' || 'vasja@da.da'
		'text' 	=> 	null,	// '' || 'Здесь был Вася'
		'warning'	=>	null,	// null || 'Не правильно набран номер..'
		'info'	=>	null,	// null || 'Васям конфеты не даем!'
	];

	// Распарсим аргументы
	$key = wp_parse_args( $args, $defaults );
 
	// Нет содержимого.. строить не чего выходим
	if ( !(	!is_null( $key[ 'name' ] )	||
			!is_null( $key[ 'phone' ] )	||
			!is_null( $key[ 'email' ] )	||
			!is_null( $key[ 'text' ] ) )	) { return; };

	$form = '';
	$classID = '';
	
	// Если передали before, например 'before' => '<div>'
	if ( $key[ 'before' ] && is_string( $key[ 'before' ] ) ) { 
		
		$form .= $key[ 'before' ];
				
	};
	
	// Класс или ид если есть
	if ( $key[ 'classID' ] && is_string( $key[ 'classID' ] ) ) {
	
		// Если есть # это ид иначе класс 
		if ( $key[ 'classID' ][ 0 ] === '#' ) { 
		
			$classID .= 'id="' . substr( $key[ 'classID' ], 1 ) . '" ';
			
		} else {
		
			$classID .= 'class="' . $key[ 'classID' ] . '" ';
			
		};
	};
	
	// Если передали title, например 'title' => 'Форма'
	if ( $key[ 'title' ] && is_string( $key[ 'title' ] ) ) { 
		
		$title = '<h3>' . $key[ 'title' ] . '</h3>';
				
	};
	
	// Если передали name, например 'name' => '' ( Просто показать поле ) | 'name' => 'Ivan' ( Заполнить name )
	if ( ! is_null( $key[ 'name' ] ) && is_string( $key[ 'name' ] ) ) { 
		
		$name = '
			<p>
				<label>Ваше имя</label>
				<input style="outline:none;" name="f_name" value="' . $key[ 'name' ] . '" maxlength="30" type="text"  placeholder="Иван" required autofocus="true">
			</p> 
		';
	};
	
	// Если передали phone, например 'phone' => '' ( Просто показать поле ) | 'phone' => '55-45-65' | '+7 800 700 56 56' ( Заполнить номер )
	if ( ! is_null( $key[ 'phone' ] ) && ( is_string( $key[ 'phone' ] ) || is_int( $key[ 'phone' ] ) ) ) { 
		
		$phone = '
			<p>
				<label>Телефон</label>
				<input style="outline:none;" name="f_phone" value="' . $key[ 'phone' ] . '" maxlength="22" type="tel" pattern="^[0-9 +-]+$" required placeholder="8-900-888-77-66" >
			</p> 
		';
	};
	
	// Если передали email, например 'email' => '' ( Просто показать поле ) | 'email' => 'name@info.ru' ( Заполнить email )
	if ( ! is_null( $key[ 'email' ] ) && is_string( $key[ 'email' ] ) ) { 
		
		$email = '
				<p>
					<label>Email</label>
					<input style="outline:none;" name="f_email" value="' . $key[ 'email' ] . '" maxlength="30" type="email" placeholder="name@info.ru" required>
				</p> 
		';
	};
	
	// Если передали text, например 'text' => '' ( Просто показать поле ) | 'text' => 'bla bla' ( Заполнить text )
	// * только при поддержке JS иначе значение выводиться пустым
	if ( ! is_null( $key[ 'text' ] ) && is_string( $key[ 'text' ] ) ) { 
		
		$text = '
				<p>
					<label>Сообщение</label>
					<textarea style="outline:none;" cols="10" name="f_text" placeholder="Ваш текст" rows="4" required></textarea>
				</p>
				<script>
					var textarea = document.getElementsByTagName( "textarea" )[0]; 
					textarea.value="' . $key[ 'text' ] . '"
				</script>
		';
	};
	
	// Если передали warning, например 'warning' => 'Не дам конфетку!' ( "Внимание! Не дам конфетку!" )
	if ( $key[ 'warning' ] ) { 
		
		$warning = '
				<p id="warning">
					<label>Внимание!</label>
					' . $key[ 'warning' ] . '
				</p>
				
		';
	};
	
	// Если передали info, например 'info' => 'Конфетки не даем!' ( "Справка. Конфетки не даем!" )
	if ( $key[ 'info' ] ) { 
		
		$info = '
				<p id="info">
					<label>Справка.</label>
					' . $key[ 'info' ] . '
				</p>
				
		';
	};
	
	// Форма
	$form .= '
		<form ' . $classID . '>' .
		 	$title .
		 	$name .
		 	$phone .
		 	$email .
		 	$text . 
		 	$info .
		 	$warning .
		 	'
			<p style="justify-content:center;">
				<button formmethod="get">Отправить</button>
			</p> 
		</form> 
	';
	
	// Если передали after, например 'after' => '</div>'
	if ( ! is_null( $key[ 'after' ] ) && is_string( $key[ 'after' ] ) ) { 
		
		$form .= $key[ 'after' ];
				
	};
	
	return $form;
	
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Проверка данных формы
//
// например:	1. из поля имя: pull_test_form( [ "name" => "" ] )	вернет массив, если ок	[ "name" => "безопасное значение" ] 
// 														или массив, если не ок	[ "name" => "", "warning" => "Заполните, Ваше имя.<br>"]
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pull_test_form( $args = null ) {
	$defaults = [
		'before'	=>	null,
		'after'	=>	null,
		'classID'	=>	null,
		'title'	=> 	null,
		'name' 	=> 	null,
		'phone' 	=> 	null,
		'email' 	=> 	null,
		'text' 	=> 	null,
		'warning'	=>	null,
		'info'	=>	null,
	];
	
	$warning = null;

	// Распарсим аргументы
	$key = wp_parse_args( $args, $defaults );

	// Проверим имя если после подрезки пусто, ошибка
	if ( ! is_null( $key[ 'name' ] ) && is_string( $key[ 'name' ] ) ) {
	
		$name = pull_test_data( get_query_var( 'f_name' ) );
			
		if ( $name === '' ) {
 
    			$warning .= 'Заполните, Ваше имя.<br>';
    			
		};
		
	};
		
	// Проверим телефон если после подрезки номер меньше 4-значного или вообще не заполнен, ошибка
	if ( ! is_null( $key[ 'phone' ] ) && ( is_string( $key[ 'phone' ] ) || is_int( $key[ 'phone' ] ) ) ) {
	
		$phone = pull_test_data( get_query_var( 'f_phone' ), ['0-9 +-'] );
		
		if ( $phone === '' ) {
			
			$warning .= 'Укажите, номер телефона.<br>';
		
		} elseif ( pull_test_data( $phone, ['0-9'] ) < 10000 ) {
 
			$warning .= 'Не верный номер телефона.<br>';
			
		};
	};
			
	// Проверим email если после подрезки email не валидный или вообще не заполнен, ошибка
	if ( ! is_null( $key[ 'email' ] ) && is_string( $key[ 'email' ] ) ) {

		$email = pull_test_data( get_query_var( 'f_email' ), 'email' );

		if ( $email === '' ) {
			
			$warning .= 'Заполните, email.<br>';
					
		} elseif ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
 
    			$warning .= 'Не верный email.<br>';
    			
		};
	};
	
	// Проверим текст если после подрезки пусто, ошибка
	if ( ! is_null( $key[ 'text' ] ) && is_string( $key[ 'text' ] ) ) {
		
		$text = pull_test_data( get_query_var( 'f_text' ) );
				
		if ( $text === '' ) {
 
    			$warning .= 'Заполните, сообщение!<br>';
    			
		};
		
	};
	
	$result = [	
		'before'	=>	$key[ 'before' ],
		'after'	=>	$key[ 'after' ],
		'classID'	=>	$key[ 'classID' ],
		'title'	=> 	$key[ 'title' ],
		'name' 	=> 	$name,
		'phone' 	=> 	$phone,
		'email' 	=> 	$email,
		'text' 	=> 	$text,
		'warning'	=>	$warning,
		'info'	=>	$key[ 'info' ],
	];
			 
	return $result;
};

?>


