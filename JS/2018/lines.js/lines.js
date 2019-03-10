//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Конструктор линии					///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Lines ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// старт игры если не запущенна
	this.start = function ( ) { if ( !stat ) { startLines ( ) } };
	// вернуть результат
	this.getScore = function ( ) { return score };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// приращение очков по очку за убранный шар
	var DELTASCORE = 1;
	// минимальное число шаров в линии
	var MINBALL = 5;
	// поле: ширина и высота
	var GRID = {	WIDTH : 9,
				HEIGHT : 9 };
	// массив цветов кожзгсф без нулевого
	var COLORS = [ "", "red", "Darkorange", "Gold", "Limegreen", "Lightblue", "Dodgerblue", "Darkviolet" ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// текущий результат
	var score = 0;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// играем или еще нет
	var stat = false;
	// конец игры
	var gameOver = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Запуск игры					////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function startLines ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		// выбранный шар: цвет, x, y, dx, dy
		var ballNow = {	color : 0,
						x : 0,
						y : 0,
						dx : 0,
						dy : 0 };
		// игровое поле [ [ ],[ ],[ ],..[ ] ]
		var boxNow = [ ];
		// поле превью [ 1, 2, 3 ]
		var boxPre = [ ];
		// подсказка
		var info = [	"Выберите шар.",
					"Куда ставим?",
					"Нет пути...еще варианты?" ];
		// индекс текущей подсказки
		var t = 0;
		
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// определим канвас игрового поля
		var canvas = document.getElementById( 'game_output' );
		// определим хранилище игрового поля
		var stage = new createjs.Stage( canvas );
		// рассчитаем ширину и высоту пикселя игрового поля
		var wc = canvas.width / GRID.WIDTH - 4;
		var hc = canvas.height / GRID.HEIGHT - 4;
		// добавим слой игрового поля
		var sh = new createjs.Shape ( );
		
		// определим канвас превью
		var canvas2 = document.getElementById( 'game_output_pre' );
		// определим хранилище превью
		var stage2 = new createjs.Stage( canvas2 );
		// рассчитаем ширину и высоту пикселя превью
		var wc2 = canvas2.width / 3 - 4;
		var hc2 = canvas2.height - 4;
		// добавим слой превью
		var sh2 = new createjs.Shape ( );


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// флаги:
		var checked = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа с шаром					////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Ball ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// добавить три случайных шара в превью
			this.addTreePre = function ( ) {
				var c1 = ( Math.random( ) * COLORS.length )^0;
				var c2 = ( Math.random( ) * COLORS.length )^0;
				var c3 = ( Math.random( ) * COLORS.length )^0;

				if (	c1 == 0 || c2 == 0 || c3 == 0 ) { ball.addTreePre ( ); } 
				else { 
					boxPre = [ ];
					boxPre.push( c1 );
					boxPre.push( c2 );
					boxPre.push( c3 );}
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// добавить случайные шары из превью в игровое поле
			this.addTree = function ( ) {
				var a = ( Math.random( ) * GRID.WIDTH )^0;
				var b = ( Math.random( ) * GRID.HEIGHT )^0;
				if ( boxPre.length != 0 ) {
					if ( boxNow [ a ] [ b ] != 0 ) { ball.addTree ( ); }
					else { boxNow [ a ] [ b ] = boxPre[ 0 ]; boxPre.shift( ); ball.addTree ( ); };
				};
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// проверить путь
			this.checkWay = function ( ) {
			};
			
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа со боксом					///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Box ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// создать новый
			this.createNew = function ( ) {
				var a = 0, b = 0
				boxNow = [ ];
				while ( a < GRID.HEIGHT ) {
					boxNow.push ( [ ] );
					while ( b < GRID.WIDTH ) {
						boxNow [ a ].push( 0 );
						b++;
					};
					b = 0;
					a++;
				};
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// посчитаем свободные клетки
			this.countEmpty = function ( ) {
				var c = 0, d = 0, i = 0;
				while ( c < boxNow.length ) {
					while ( d < boxNow[ 0 ].length ) {
						if ( boxNow[ c ][ d ] == 0 ) { i++ };
						d++;
					}
					c++;
					d = 0;
				};
				c = 0;
				if ( i < 3 ) { gameOver =  true }
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// проверим хорошие линии
			this.checkGoodLine = function ( ) {
				var a = 0, b = 0, i = 1, c = 0;
				// по горизонтали
				while ( a < GRID.HEIGHT ) {
					while ( b < GRID.WIDTH - 1 ) {
						if ( boxNow[ a ][ b ] !=0 && boxNow[ a ][ b ] == boxNow[ a ][ b + 1 ] ) { 
							i++;
							if ( b == GRID.WIDTH - 2 && i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ a ][ b - i + 2 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ a ][ b - i + 1 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;						 
					}
					i = 1;
					b = 0;
					a++;
				}
				a = 0;			
				i = 1;			
				// по вертикали
				while ( a < GRID.WIDTH ) {
					while ( b < GRID.HEIGHT - 1 ) {
						if ( boxNow[ b ][ a ] !=0 && boxNow[ b ][ a ] == boxNow[ b + 1 ][ a ] ) { 
							i++;
							if ( b == GRID.HEIGHT - 2 && i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 2 ][ a ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 1 ][ a ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;						 
					}
					i = 1;
					b = 0;
					a++;
				}
				a = 0;			
				i = 1;
				// по диагонали х+,y0
				while ( a < GRID.WIDTH - MINBALL + 2 ) {
					while ( b < GRID.HEIGHT - a - 1 ) {
						if ( boxNow[ b ][ a + b ] !=0 && boxNow[ b ][ a + b ] == boxNow[ b + 1 ][ a + b + 1 ] ) { 
							i++;
							if ( ( b == GRID.HEIGHT - a - 2 || a == GRID.WIDTH - MINBALL ) && i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 2 ][ a + b - i + 2 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 1 ][ a + b - i + 1 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;						 
					}
					i = 1;
					b = 0;
					a++;
				}
				a = 0;			
				i = 1;
				// по диагонали х0,y+
				while ( a < GRID.WIDTH - MINBALL + 2 ) {
					while ( b < GRID.HEIGHT - a - 1 ) {
						if ( boxNow[ a + b ][ b ] !=0 && boxNow[ a + b ][ b ] == boxNow[ a + b + 1 ][ b + 1 ] ) { 
							i++;
							if ( ( b == GRID.HEIGHT - a - 2 || a == GRID.WIDTH - MINBALL ) && i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ a + b - i + 2 ][ b - i + 2 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ a + b - i + 1 ][ b - i + 1 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;						 
					}
					i = 1;
					b = 0;
					a++;
				}
				a = GRID.WIDTH - 1;			
				i = 1;			
				// по диагонали х-,y0
				while ( a > MINBALL - 2 ) {
					while ( b < GRID.HEIGHT - ( GRID.WIDTH - a ) ) {
						if ( boxNow[ b ][ a - b ] !=0 && boxNow[ b ][ a - b ] == boxNow[ b + 1 ][ a - b - 1 ] ) { 
							i++;
							if ( ( b == GRID.HEIGHT - ( GRID.WIDTH - a ) - 1 || a == MINBALL - 1 ) && 
								i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 2 ][ a - b + i - 2 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 1 ][ a - b + i - 1 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;						 
					}
					i = 1;
					b = 0;
					a--;
				}
				a = GRID.WIDTH - 1;
				c = GRID.HEIGHT - 1;
				i = 1;			
				// по диагонали х0,y-
				while ( a > MINBALL - 2 ) {
					while ( b < GRID.HEIGHT - 1 ) {
						if ( boxNow[ b ][ c ] !=0 && boxNow[ b ][ c ] == boxNow[ b + 1 ][ c - 1 ] ) { 
							i++;
							if ( ( b == GRID.HEIGHT - 2 || a == MINBALL - 1 ) && i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 2 ][ c + i - 2 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }}
						else if ( i >= MINBALL ) {
							while ( i > 0 ) { 
								boxNow[ b - i + 1 ][ c + i - 1 ] = 0; 
								score += DELTASCORE ;
								i--;
								checked=true; }
								media.showCanvas ( ); 
								i = 1 }
						else { i = 1 }
						b++;
						c--;					 
					}
					c = GRID.HEIGHT - 1;
					i = 1;
					a--;
					b = ( GRID.WIDTH - 1 - a );
					
				}

			};
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Работа с от рисовкой					//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function Media ( ) {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// показать подсказку
			this.showText = function ( ) {
				$( ".game_info_txt" ).empty( );
				$( ".game_info_txt" ).append( "<br>" + info [ t ] )
			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// показать превью
			this.showPre = function ( ) {
				// очистим хранилище и переопределим слой, быстрый доступ к графике
				stage2.removeAllChildren();
				sh2 = new createjs.Shape ( );
				var gr2 = sh2.graphics;
				
				var a = 0;
				// три шара с градиентом добавим к слою
				while ( a < boxPre.length ) {
					gr2.x = 2 + ( wc2 + 4 ) * a;
					gr2.y = 2;
					gr2.beginRadialGradientFill(
		[COLORS[boxPre[a]],"white"], [0, 1], gr2.x+wc2/2, gr2.y+hc2/2, hc2-hc2/3, gr2.x+wc2/2-wc2/5, gr2.y+hc2/2-hc2/5, 0)
					gr2.drawCircle( gr2.x+wc2/2 , gr2.y+hc2/2, hc2/2-hc2/11 );
					a++;
				};
				a = 0;
				// добавим слой покажем
				stage2.addChild ( sh2 );
				stage2.update ( );

			};
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// от рисуем поле
			this.showCanvas = function ( ) {
				// очистим хранилище и переопределим слой, быстрый доступ к графике
				stage.removeAllChildren();
				sh = new createjs.Shape ( );
				var gr = sh.graphics;

				var a = 0, b = 0;
				// 9Х9 обведенный квадрат + шар с градиентом добавим к слою, если 0 без шара
				while ( a < GRID.HEIGHT ) {
					while ( b < GRID.WIDTH ) {
						gr.x = 2 + ( wc + 4 ) * b;
						gr.y = 2 + ( hc + 4 ) * a;
						gr.beginStroke("Lightslategray");
						gr.beginFill("Blanchedalmond");							
						gr.drawRect( gr.x , gr.y, wc, hc );
						if ( boxNow [ a ] [ b ] > 0 ) { 
							gr.beginRadialGradientFill(
			[COLORS[boxNow[a][b]],"white"], [0, 1], gr.x+wc/2, gr.y+hc/2, hc-hc/3, gr.x+wc/2-wc/5, gr.y+hc/2-hc/5, 0)
							gr.drawCircle( gr.x+wc/2 , gr.y+hc/2, hc/2-hc/7 );}
						b++;
					};
					b = 0;
					a++;
				};
				a = 0;
				// добавим слой покажем
				stage.addChild ( sh );
				stage.update ( );
				// добавить событие клик handleEvt ( evt )
				sh.addEventListener( "click", handleEvt );				
			};
		};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////					Основной игровой цикл					//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var ball = new Ball;
		var box = new Box;
		var media = new Media;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		// играем, добавим информацию, уберем запуск
		stat = true;
		$( ".game_info_pre" ).show( 600 );
		$( ".game_info_txt" ).delay( 600 ).show( 600 );
		$( ".game_play" ).delay( 1200 ).hide( 600 );

		// создадим поле
		box.createNew ( );

		// возьмем новые шары
		ball.addTreePre ( );

		// добавим шары в поле
		ball.addTree ( );

		// возьмем новые шары
		ball.addTreePre ( );

		// покажем их в превью
		media.showPre ( );

		// покажем подсказку
		t = 0; media.showText ( );

		// при от рисовке поля добавиться событие клик handleEvt ( evt )
		media.showCanvas ( );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// обработчик событий по клику
		function handleEvt ( evt ) {
			var animBG = new createjs.Shape( );
			var anim = new createjs.Shape( );
			var grBG = animBG.graphics;
			var gr = anim.graphics;
			var a = 0, b = 0, alp = 0;
			var rev = false;
			a = ( evt.stageX / ( canvas.width / GRID.WIDTH ) )^0;
			b = ( evt.stageY / ( canvas.height / GRID.HEIGHT ) )^0;
			animBG.x = canvas.width / GRID.WIDTH * a + 4;
			animBG.y = canvas.height / GRID.HEIGHT * b + 4;
			anim.x = canvas.width / GRID.WIDTH * a + 2;
			anim.y = canvas.height / GRID.HEIGHT * b + 2;

			function ini() {

				grBG.beginFill("Blanchedalmond");							
				grBG.drawRect( 0 , 0, wc-3, hc-3 );
				stage.addChild(animBG);
				stage.update();
				
				gr.beginStroke("Lightslategray");
				gr.beginRadialGradientFill(
					[COLORS[boxNow[b][a]],"white"], [0, 1], wc/2,hc/2, hc-hc/3, wc/2-wc/5, hc/2-hc/5, 0 )
				gr.drawCircle( wc/2 , hc/2, hc/2-hc/7 );
				stage.addChild(anim);
				createjs.Ticker.on("tick", tick);
				createjs.Ticker.setFPS(60);
			}
		
			function tick(event) {
				if ( !rev ) {
					anim.scaleX -= 0.01;
					anim.scaleY -= 0.01;
					anim.x += wc/2*0.01;
					anim.y += hc/2*0.01;
					alp -= 0.01 } 
				else { 
					anim.scaleX += 0.01;
					anim.scaleY += 0.01;
					anim.x -= wc/2*0.01;
					anim.y -= hc/2*0.01;
					alp += 0.01 }
				if ( alp > 0.1 ) { rev = false }
				if ( alp < -0.1 ) { rev = true }
				stage.update(event); // important!!
			}			

					

		// если играем
		if ( !gameOver ) {
			// если цвет не выбран и под указателем ни чего нет
			if ( ballNow.color == 0 && boxNow [ b ] [ a ] == 0 ) { t = 0; media.showText( ); }
			// если цвет не выбран выберем
			else if ( boxNow [ b ] [ a ] != 0 &&  ballNow.color == 0  ) {
				ballNow.color = boxNow [ b ] [ a ];
				ballNow.x = a;
				ballNow.y = b;
				media.showCanvas( );
				createjs.Ticker.reset ( );
				ini();
				t = 1; media.showText( ); }
			// если цвет выбран но под указателем другой, поменяем
			else if ( ballNow.color != 0 && boxNow [ b ] [ a ] != 0 ) {
				ballNow.color = boxNow [ b ] [ a ];
				ballNow.x = a;
				ballNow.y = b;
				media.showCanvas( );
				createjs.Ticker.reset ( );
				ini();
				t = 1; media.showText( ); }
			//  если все ок переставим
			else { 
				boxNow [ ballNow.y ] [ ballNow.x ] = 0;
				boxNow [ b ] [ a ] = ballNow.color;
				ballNow.color = 0;
				t = 0; media.showText( );
				box.checkGoodLine ( );
				if ( !checked ) { 
					ball.addTree ( );
					box.countEmpty ( );
					media.showCanvas ( );
					ball.addTreePre ( );
					media.showPre ( );
					box.checkGoodLine ( );}
				else {
					media.showCanvas ( );
					media.showPre ( );
					checked=false;
				}
			}
		} else { CB_gameOver ( ); }			
		
		};

	}; 
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////	ТАБ 5 СИМВОЛОВ	///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

