<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	page feedback	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_page_feedback( ) {

	// Форма с четырьмя полями
	$form = [	'title'	=> 'Оставить сообщение..', 
			'name'	=> '', 
			'phone'	=> '', 
			'email'	=> '', 
			'text'	=> '', 
			"before"	=> '<div class="contener-form">',
			"after"	=> '</div>',
			"classID"	=> '#feedback',
			];

	// Обработаем параметры
	$my_GET = pull_test_data( $_GET, true );
	
	if ( $my_GET[ "f_name" ] || $my_GET[ "f_phone" ] || $my_GET[ "f_email" ] || $my_GET[ "f_text" ] ) { 
		$retrieved_event_data = true;
	} else {
		$retrieved_event_data = false;
	};
			
	// Данных еще нет
	if ( ! $retrieved_event_data ) {

		// Дадим форму	
		echo get_test_form( $form );
	
	// Событие: пришли данные
	} else {
	
		// Попробуем обработать форму
		$result = pull_test_form( $form );
	
		// Бракованные данные		
		if ( ! is_null ( $result[ "warning" ] ) ) {
		
			// Покажем что не так
			echo get_test_form( $result );
			
		// Если прошла проверку отправим сообщение
		} else {
			
			echo '
			<div class="feedback">
				<h2>Спасибо!</h2>
				<h3>Мы обязательно примем меры.. Невиновные понесут суровое наказание..</h3>
				
				<div class="form" style="width:100%;min-height:250px;align-items: self-start;">
					<p>name: ' . $result[ "name" ] . '</p>
					<p>phone: ' . $result[ "phone" ] . '</p>
					<p>email: ' . $result[ "email" ] . '</p>
					<p>text: ' . $result[ "text" ] . '</p>
				</div>
			</div>
			';
		
			$full_text = 	'Челобитная | ' . 
							$result[ "name" ] .
						' | т. ' . 
							$result[ "phone" ] . 
						' | @. ' . 
							$result[ "email" ] . 
						' | <br/><br/>' . 
							$result[ "text" ];
		
			$commentdata = [
				'comment_author'       => $result[ "name" ],		
				'comment_author_email' => $result[ "email" ],		
				'comment_content'      => $full_text,	
			];
		
			wp_new_comment( $commentdata );
	
		};
	};
};

?>


