<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Шаблон страниц, каталога ( постов )	//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

get_header( ); // header 
?>

<article>
	<section class="article-left <?php if ( is_page( 'basket' ) ) { echo 'baskets'; } ?>">
		<div class="article-menu">
			<?php get_test_menu_article( ); //Список для каталога, категории или поста inc/sub-menu.php ?>
		</div>
	</section>
		
	<section class="article-right <?php if ( is_page( 'basket' ) ) { echo 'baskets'; } ?>">
		<div class="content">
			<?php get_test_content( ); // Вывод содержимого inc/content.php ?>
		</div>
	</section>
</article>

<?php get_footer( ); // footer ?>
