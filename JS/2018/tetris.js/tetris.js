//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Конструктор тетрис					///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Tetris ( ) {

	// статус игры NONACTIVE, ACTIVE, PAUSED
	stat = "NONACTIVE";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// старт игры
	this.start = function ( ) { if ( stat == "NONACTIVE" ) { startTetris ( ) }; }
	// установить паузу
	this.setPaused = function ( ) { return paused ? paused = false : paused = true };
	// вернуть результат
	this.getScore = function ( ) { return score };
	// вернуть скорость
	this.getSpeed = function ( ) { return scr };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// приращение очков
	var DELTASCORE = 10;
	// сетка: ширина и высота
	var GRID = {	WIDTH : 10,
				HEIGHT : 20 };
	// время: в начале игры, приращение, шаг основного цикла
	var TIME = {	BEGINSPEED : 700,
				DELTASPEED : 5,
				PACESPEED : 60 };
	// массив фигур: нижняя строка, верхняя строка
	var FIGURES = [	[ "11", "11" ],
					[ "1111" ],
					[ "111", "100" ],
					[ "111", "001" ],
					[ "011", "110" ],
					[ "110", "011" ],
					[ "010", "111" ] ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// текущий результат
	var score = 0;
	// скорость сейчас
	var speedNow = TIME.BEGINSPEED;
	// скорость в результат
	var scr="Черепаха";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// пауза
	var paused = false;
	// конец игры
	var gameOver = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Запуск игры					////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function startTetris ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		// Текущая фигура contents: [ [ 0,1,0 ], [ 1,1,1 ] ], перевернутая на 90 гр., ширина и высота, x,y фигуры			
		var figureNow = {	contents : [],
						contents_90 : [],
						w : 0,
						h : 0,
						x : 0,
						y : 0 };
		// игровой стакан [ [ ],[ ],[ ],..[ ] ]
		var glassNow = [];
		
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// определим канвас
		var canvas = document.getElementById( 'game_output' );
		// определим хранилище
		var stage = new createjs.Stage( canvas );
		// рассчитаем ширину и высоту пикселя
		var wc = canvas.width / GRID.WIDTH - 4;
		var hc = canvas.height / GRID.HEIGHT - 4;
		// добавим слой
		var sh = new createjs.Shape ( );


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// флаги клавиш
		var	flagKeyLeft = false;
		var	flagKeyRight = false;
		var	flagKeyUp = false;
		var	flagKeyDown = false;
		var	flagDubleDown = false;
		// флаги: стенка, влево вправо, снизу, поворот, авто ход
		var	chekedWall = true;
		var	cheked = true;
		var	chekedDown = true;
		var	chekedRotate = true;
		var	flagAuto = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		// события клавиатуры нажали отпустили 
		$( "body" ).keydown(function (eventObject) {
			switch (eventObject.which) {
				case 37 : flagKeyLeft = true; break
				case 39 : flagKeyRight = true; break
				case 38 : flagKeyUp = true; break
				case 40 : flagKeyDown = true; break
				case 32 : flagDubleDown = true}
		});
		$( "body" ).keyup(function (eventObject) {
			switch (eventObject.which) {
				case 37 : flagKeyLeft = false; break
				case 39 : flagKeyRight = false; break
				case 38 : flagKeyUp = false; break
				case 40 : flagKeyDown = false; break
				case 32 : flagDubleDown = false;}
		});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа с фигурой					///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Figure ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// создать новую: новый контент из рандомной фигуры, h;w;x;y;, контент 90 гр.
			this.makeRandome = function ( ) {
				var a = 0, b = 0, c = 0, ran = ( Math.random( )*FIGURES.length ) ^ 0, i = 0;
				// заполним контент
				figureNow.contents = [ ];
				while ( a < FIGURES [ ran ].length ) {
					figureNow.contents.push ( [ ] );
					while ( b < FIGURES [ ran ] [ a ].length )	{
						figureNow.contents [ a ].push( + ( FIGURES [ ran ] [ a ].charAt( b ) ) );
						b++;
					};
					b = 0;
					a++;
				};
				a = 0;
				// заполним h,w,x,y
				figureNow.h = figureNow.contents.length;
				figureNow.w = figureNow.contents [ 0 ].length;
				figureNow.x = ( ( GRID.WIDTH / 2 ) ^ 0 ) - ( ( figureNow.w / 2 ) ^ 0 );
				figureNow.y = figureNow.h - 1;
				// заполним контент 90 гр.
				c = figureNow.w - 1;
				figureNow.contents_90 = [ ];
				while ( a < figureNow.w ) {
					figureNow.contents_90.push ( [ ] );
					while ( b < figureNow.h )	{
						figureNow.contents_90 [ a ].push( figureNow.contents [ b ][ c ] );
						b++;
					};
					c--;
					b = 0;
					a++;
				};
				a = 0;
				// если ставить некуда, то мы влипли
				while ( a < figureNow.h ) { 
					while ( b < figureNow.w ) {
						i = figureNow.contents [ a ] [ b ];
						i += glassNow [ figureNow.y - a + 1 ] [ figureNow.x + b ];
						if ( i > 1 ) { gameOver = true };
						i = 0;
						b++;
					};
					b = 0;
					a++;
				};
				a = 0;
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// проверка вхождений фигуры в стакан
			this.check = function ( ) {
				var a = 0 , b = 0, i = 0;
				// Если стенки	или дно			
				if ( flagKeyLeft && ( figureNow.x - 1 ) < 0 ) // для влево-вправо
					{ chekedWall = false }
				else if ( flagKeyRight && ( figureNow.x + figureNow.w + 1 ) > GRID.WIDTH ) 
					{ chekedWall = false } else  { chekedWall = true };
				if ( ( ( figureNow.y + 1 ) == GRID.HEIGHT ) ) // для вниз
					{ chekedDown = false } else  { chekedDown = true };
				// если не пусто слева и справа
				if ( flagKeyLeft ) {
					while ( a < figureNow.h ) { 
						while ( b < figureNow.w ) {
							i = figureNow.contents [ a ] [ b ];
							i += glassNow [ figureNow.y - a ] [ figureNow.x + b - 1 ];
							if ( i > 1 ) { cheked = false };
							i = 0;
							b++;
						};
						b = 0;
						a++;
					};
					a = 0;}
				else if ( flagKeyRight ) {
					while ( a < figureNow.h ) { 
						while ( b < figureNow.w ) {
							i = figureNow.contents [ a ] [ b ];
							i += glassNow [ figureNow.y - a ] [ figureNow.x + b + 1 ];
							if ( i > 1 ) { cheked = false };
							i = 0;
							b++;
						};
						b = 0;
						a++;
					};
					a = 0;}
				else { cheked = true };
				// если не пусто снизу
				if ( chekedDown ) {
					if ( flagKeyDown || flagDubleDown || !flagAuto ) {
						while ( a < figureNow.h ) { 
							while ( b < figureNow.w ) {
								i = figureNow.contents [ a ] [ b ];
								i += glassNow [ figureNow.y - a + 1 ] [ figureNow.x + b ];
								if ( i > 1 ) { chekedDown = false };
								i = 0;
								b++;
							};
							b = 0;
							a++;
						};
						a = 0;} 
					else { chekedDown = true }
				};
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// вращение
			this.rotate = function ( ) {
				var a = 0, b = 0, c = 0, i = 0;
				// если справа стенка сдвинем влево
				if ( ( ( figureNow.x + figureNow.h ) > GRID.WIDTH ) ) { 
					figureNow.x = GRID.WIDTH - figureNow.h ; 
				};
				// если упремся в потолок ждем
				if ( ( figureNow.y - figureNow.w + 1 ) < 0 ) { chekedRotate = false; } 
				else {
				// если нет спросим, а нет ли наложений при перевороте
					while ( a < figureNow.h ) {  
						while ( b < figureNow.w ) {
							i = figureNow.contents_90 [ b ] [ a ];
							i += glassNow [ figureNow.y - b ] [ figureNow.x + a ]; 
							if ( i > 1 ) { chekedRotate = false; };
							i = 0;
							b++;
						};
						b = 0;
						a++;
					};
					a = 0;
				};
				// если все нормально перекинем контент_90 в контент
				if ( chekedRotate ) {
					figureNow.contents = [ ];
					while ( b < figureNow.w ) {
						figureNow.contents.push ( [ ] );
						while ( a < figureNow.h )	{
							figureNow.contents [ b ].push( figureNow.contents_90 [ b ][ a ] );
							a++;
						};
						a = 0;
						b++;
					};
					b = 0;
					// пересчитаем h,w
					figureNow.h = figureNow.contents.length;
					figureNow.w = figureNow.contents [ 0 ].length;
					// закинем следующий контент_90
					c = figureNow.w - 1;
					figureNow.contents_90 = [ ];
					while ( a < figureNow.w ) {
						figureNow.contents_90.push ( [ ] );
						while ( b < figureNow.h )	{
							figureNow.contents_90 [ a ].push( figureNow.contents [ b ][ c ] );
							b++;
						};
						c--;
						b = 0;
						a++;
					};
					a = 0;			
				};
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// движение
			this.move = function ( ) {
				// если ходу нет закрепим фигуру, проверим заполненные ряды, вызовем новую фигуру
				if ( !chekedDown ) {
					media.addFigureInGlass ( );
					glass.checkGoodLine ( );
					figure.makeRandome ( );
					flagDubleDown = false;
				};
				// если снизу ок сходим или прокинем фигуру вниз
				if ( chekedDown ) {
					if ( flagKeyDown || flagAuto ) { figureNow.y++; };
					if ( flagDubleDown ) { figureNow.y++; figure.check ( ); figure.move ( ); };
				};
				// крутанем если нужно
				if ( flagKeyUp ) { figure.rotate ( ); flagKeyUp = false; chekedRotate = true; };
				// или сместим в сторону
				if ( chekedWall && cheked ) {
					if ( flagKeyLeft ) { figureNow.x--; flagKeyLeft = false };
					if ( flagKeyRight ) { figureNow.x++; flagKeyRight = false };
				};
				// поместим фигуру в стакан и от рисуем, уберем фигуру из стакана
//				media.clearText ( );		// вывод через текст
				media.addFigureInGlass ( );
				media.showCanvas ( );		// вывод через канвас
//				media.showText ( );			// вывод через текст
				media.removeFigureInGlass ( );
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// автоход
			this.autoMove = function ( ) {
				flagAuto = true;
				figure.check ( );
				figure.move ( );
				flagAuto = false;
			};
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа со стаканом					///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Glass ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// создать новый
			this.createNew = function ( ) {
				var a = 0, b = 0
				glassNow = [ ];
				while ( a < GRID.HEIGHT ) {
					glassNow.push ( [ ] );
					while ( b < GRID.WIDTH ) {
						glassNow [ a ].push( 0 );
						b++;
					};
					b = 0;
					a++;
				};
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// проверяем стакан: вернем очки, скорость
			this.checkGoodLine = function ( ) {
				var a = GRID.HEIGHT - 1 , b = GRID.WIDTH - 1, i = 1;
					// добавим в i пиксели из ряда
					while ( i != 0 ) {
						i = 0;
						while ( b > -1 ) {
							i += glassNow [ a ] [ b ];
							b--;
							
						};
						// если все на месте добавим очков, изменим скорость изимим ряд и добавим сверху
						if ( i == GRID.WIDTH ) { 
							score += DELTASCORE; 
							speedNow -= TIME.DELTASPEED;
							glassNow.splice( a, 1 );
							glassNow.unshift ( [ ] );
							b = i;
							a++;
							while ( b > 0 )	{
								glassNow[ 0 ].push( 0 );
								b--;
							};
						};
						b = GRID.WIDTH - 1;
						a--;
					};
					// скорость в результат от текущей скорости
					speedNow < 100 ? scr = "I\'m robot" :
					speedNow < 200 ? scr = "Очень быстро" :
					speedNow < 300 ? scr = "Шустренько" :
					speedNow < 400 ? scr = "Неплохо продолжай" :
					speedNow < 500 ? scr = "Уже лучше" :
					speedNow < 600 ? scr = "Все еще медленно" : scr = "Черепаха";
			};
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа с от рисовкой					//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Media ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// показать в текстовом виде как вариант в виде ▢ ▣
			this.showText = function ( ) {
				var a = 0, b = 0;
				$( ".game_output_text" ).append( "<br>" );
				while ( a < GRID.HEIGHT ) {
					while ( b < GRID.WIDTH ) {
						if ( glassNow [ a ] [ b ] == 1 ) { $( ".game_output_text" ).append( "▣" ) } 
						else { $( ".game_output_text" ).append( "▢" ) };
						b++;
					};
					$( ".game_output_text" ).append( "<br>" );
					b = 0;
					a++;
				};
				$( ".game_output_text" ).append( "<br>" );
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// очистить в текстовом виде
			this.clearText = function ( ) {
				$( ".game_output_text" ).empty ( );
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// добавить фигуру в стакан
			this.addFigureInGlass = function ( ) {
				var a = 0, b = 0;
				while ( a < figureNow.h ) {
					while ( b < figureNow.w ) {
						glassNow [ figureNow.y - a ] [ figureNow.x + b ] += figureNow.contents [ a ] [ b ];
						b++;
					};
					b = 0;
					a++;
				};
				a = 0;
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// убрать фигуру из стакана
			this.removeFigureInGlass = function ( ) {
				var a = 0, b = 0;
				while ( a < figureNow.h ) {
					while ( b < figureNow.w ) {
						glassNow [ figureNow.y - a ] [ figureNow.x + b ] -= figureNow.contents [ a ] [ b ];
						b++;
					};
					b = 0;
					a++;
				};
				a = 0;
			};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// показать в графическом виде канвас
			this.showCanvas = function ( ) {
				var a = 0, b = 0;
				delete sh;
				sh = new createjs.Shape ( );
				var gr = sh.graphics;
				gr.setStrokeStyle( 1 );
				// от рисуем весь стакан вроде шустро 10-20 мс
				while ( a < GRID.HEIGHT ) {
					while ( b < GRID.WIDTH ) {
						gr.x = 2 + ( wc + 4 ) * b;
						gr.y = 2 + ( hc + 4 ) * a;
						if ( glassNow [ a ] [ b ] == 1 ) { 
							gr.beginRadialGradientFill(
								["Steelblue","white"], [0, 1], gr.x+wc/2, gr.y+hc/2, hc/2, gr.x+wc/2, gr.y+hc/2, 0)
							gr.drawRect( gr.x , gr.y, wc, hc );}
						else {
							gr.beginStroke("Lightslategray");
							gr.beginFill("Blanchedalmond");							
							gr.drawRect( gr.x , gr.y, wc, hc );}
						b++;
					};
					b = 0;
					a++;
				};
				a = 0
				stage.addChild(sh);
				stage.update( );
				stage.removeChild(sh);
			};
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Основной игровой цикл					//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var figure = new Figure;
		var glass = new Glass;
		var media = new Media;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		// подготовка: создать стакан, взять фигуру, засечь время
		glass.createNew ( );
		figure.makeRandome ( );
		var date = new Date;
		var date_now = new Date;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// по шагу: проверим вхождения и сходим, если пора авто ход, если пауза, если конец каллбак
		var timer = setInterval (function ( ) {
			date_now = new Date;
			if ( !paused && !gameOver ) {
				figure.check ( ); 
				figure.move ( );
				if ( date_now - date > speedNow ) {
					date = new Date;
					figure.autoMove ( );
				};
			};
			paused ? stat = "PAUSED" : stat = "ACTIVE";
			if ( gameOver ) { CB_gameOver ( ); }
		}, TIME.PACESPEED );

	}; 
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////	ТАБ 5 СИМВОЛОВ	///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

