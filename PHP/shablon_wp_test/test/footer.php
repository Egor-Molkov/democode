<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Подвал сайта	//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
?>

<footer>	
	<section class="footer-left">
		<div>
			<?php get_test_copyright( ); // копирайт инфо inc/in-footer.php ?>
		</div>
	</section>
		
	<section class="footer-menu">
		<?php get_test_menu_local( ); //Основное локальное меню inc/main-menu.php ?>
	</section>

	<section class="footer-right">
		<?php get_test_proginfo( ); // programming инфо inc/in-footer.php ?>
	</section>
</footer>

<?php wp_footer( ); ?>

</body>
</html>
