<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	page	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Вывод содержимого
function get_test_page( ) {

		// Дать пост
		$post = get_post( );
		
		// Карточка страницы
		echo '
			<div id="page">
				' . $post -> post_content . '
			</div>
		';
		
};

?>


