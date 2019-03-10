<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Шапка сайта		топ, меню, слайдер, хлебные крошки	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

set_test_cookie( ); // inc/cookie.php

?>

<!DOCTYPE html>
<html  class="no-js" lang="ru-RU">

<head>

	<meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
	
	<meta name="viewport" content="width=device-width">
	
	<title><?php get_test_title( ); // Заголовок inc/in-header.php ?></title>
	
	<meta name="description" content="<?php bloginfo( 'description' ); // Описание ?>">
	
	<?php wp_head( ); // скрипты ?>
	
</head>

<!--******************************************************************-->
	
<body <?php body_class( ); //Для вп ?>>

<header>
	<section class="header-top">
		<div class="header-left">
			<div class="header-logo">
				<?php get_test_site_logo( ); //Лого inc/in-header.php ?>
			</div>

			<div class="header-site-title">
				<?php get_test_site_info( ); //Инфо inc/in-header.php ?>
			</div>			
		</div>
		
		<div class="header-right">
			<?php get_test_social( ); //Другое инфо inc/sub-menu.php ?>
		</div>
	</section>
	
	<section class="header-menu">
			<?php get_test_menu( ); //Основное меню inc/main-menu.php ?>
	</section>			

	<section class="header-menu-bottom">
	</section>

	<section class="header-slider">
		<div style="background-image: url(/img/slider1.png);"></div>
		<div style="background-image: url(/img/slider2.jpg);"></div>
		<div style="background-image: url(/img/slider3.png);"></div>
		<noscript>
			<section></section>
		</noscript> 
	</section>
	
	
	<section class="header-breadcrumb">
		<div></div>
		<?php get_test_breadcrumb( ); // Хлебные крошки inc/sub-menu.php ?>
	</section>

</header>
