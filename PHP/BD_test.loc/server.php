<?php
	// откроем соединение с базой
	$mysqli = new mysqli( "127.0.0.1", "egor", "123", "egor" );
	if ( $mysqli->connect_errno ) { echo "Не удалось подключиться к MySQL: ".$mysqli->connect_error; }
	
	// если запрос не пуст
	if ( $_POST['param2'] != "" ) {
		$date_in = new DateTime();
		
		$d = $date_in->format('Y-m-d H:i:s');
		$l = $_POST['param1'];
		$t = $_POST['param2'];

		// запишем сообщение в БД
		$mysqli->query( "INSERT INTO `msg` (`date`, `login`, `text`) VALUES ('$d', '$l', '$t')" );

		// если БД много сообщений, удалим самое старое
		$res = $mysqli->query( "SELECT * FROM msg" );
		if ( $res->num_rows > 20) { $mysqli->query( "DELETE FROM `msg` WHERE 1 ORDER BY 'date' LIMIT 1" ); };
	}

	// запросим у БД весь список сообщений
	$res = $mysqli->query( "SELECT * FROM msg" );
	$txt = "";
	
	// по количеству строк добавим к txt в обратном порядке (из даты, только время), каждое сообщение обернем в див
	for ($i = 1; $i <= $res->num_rows; $i++) {
		$row = $res->fetch_assoc( );
		$txt = "<div>".explode(" ", $row['date'])[1]." ".htmlentities($row['login']).": ".htmlentities($row['text'])."</div>".$txt;
		$row = $res->fetch_field( );
	}
	
	// закроем БД, отправим текст на клиент
	mysqli_close($mysqli);
	echo $txt;
?>