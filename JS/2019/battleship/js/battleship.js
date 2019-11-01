function gameStart () {// 3 + 3 + 4 + 5 + 6 + 5 + 4 + 4 + 4 + 3 + 6 + 5 ( 52 )
	// Сетка
	const GRID = { WIDTH : 14, HEIGHT : 12 };

	// Переменные для create.js
	let stage, stage2, wc, wc2, hc, hc2, sh;

	// Оси, курсор
	let abc = ['А','Б','В','Г','Д','Е','Ж','З','И','К'];
	let cba = ['1','2','3','4','5','6','7','8','9','10'];
	let cursor = ['text','vertical-text','crosshair','pointer'];

	// Карабли
	let allShips = [ 4, 3, 3, 2, 2, 2, 1, 1, 1, 1 ];
	let myShipsInt;
	
	// Объект со всеми точками кораблей (прокси для определения ранил/убил/победа/поражение)
	let newShips = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };
	let compShips = deepCopy ( newShips );
	let myShips;

	// Разное
	let myName;
	let score = 8200;
	let step = 1;
	let shipID = 0;

	// Флажки
	let badGamer = false;
	let sound = false;
	let setShips = false;
	let horizont = false;
	let firstFire = false;
	let isMyFire = false;

	// Объект предведущего выстрела
	let newFire = { lock:false, fire: [] };
	let beforeFire = deepCopy( newFire );

	// Чистая сетка
	let myBox = getBox( GRID, false );
	let compBox = getBox( GRID, true );

	// Чистое игровое поле
	let newFild = getBox( { WIDTH : 9, HEIGHT : 9 }, false );

	// Чистое поле для выстрелов
	let fildMyFire = deepCopy( newFild );
	let fildCompFire = deepCopy( newFild );

	// Поле для кораблей
	let fildMyShips;
	let fildCompShips;

//////////////////////////////////////////////////////////////////////////////////

	// Стратегии расстановки кораблей
	let strategyOne = 
		[[1,2,1,2,0,0,0,0,0,0],
		 [1,2,1,2,0,0,0,0,0,0],
		 [1,2,1,2,0,0,0,0,0,0],
		 [1,2,2,2,0,0,0,0,0,0],
		 [2,2,1,2,0,0,0,0,0,0],
		 [1,2,1,2,0,0,0,0,0,0],
		 [1,2,2,2,0,0,0,0,0,0],
		 [2,2,1,2,0,0,0,0,0,0],
		 [1,2,1,2,0,0,0,0,0,0],
		 [1,2,1,2,0,0,0,0,0,0]];
	let strategyTwo = 
		[[1,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,2],
		 [2,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,2],
		 [2,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,1],
		 [1,2,0,0,0,0,0,0,2,1]];
	let strategyThree = 
		[[1,2,1,1,1,2,1,1,2,1],
		 [1,2,2,2,2,2,2,2,2,1],
		 [1,2,0,0,0,0,0,0,2,2],
		 [1,2,0,0,0,0,0,0,0,0],
		 [2,2,0,0,0,0,0,0,0,0],
		 [1,2,0,0,0,0,0,0,0,0],
		 [1,2,0,0,0,0,0,0,0,0],
		 [1,2,0,0,0,0,0,0,0,0],
		 [2,2,2,0,0,0,0,0,0,0],
		 [1,1,2,0,0,0,0,0,0,0]];

	let randStrategy = getRandomInt( 100 );
	// В 67 % применим стандартную расстоновку кораблей, 
	// от рандомного угла + рандомно-зеркально
	if ( randStrategy < 67 ) {
		let shema = randStrategy % 3;
		let corner = getRandomInt( 4 );
		let invert = getRandomInt( 2 );
		fildCompShips = setStandartShipsInFild( shema, corner, invert );
	// В других случаях просто рандом
	} else {
		fildCompShips = setRandomShipsInFild( compShips );
	};

	// Стандартно
	function setStandartShipsInFild( shema, corner, invert ) {
		let arr, obj;
		switch ( shema ) {
			case 0 : arr = deepCopy( strategyOne ); break
			case 1 : arr = deepCopy( strategyTwo ); break
			case 2 : arr = deepCopy( strategyThree ) };
		arr = rotateMatrix( arr, corner );
		invert ? arr = rotateMatrix( arr, -1 ) : arr;
		compShips = addCompShipsFormObjs( arr, compShips );
		arr = setOneShip ( arr, 4, compShips );
		//console.log( compShips );
		return arr;
	};

	// Рандомно
	function setRandomShipsInFild( obj ) {
		let arr;
		arr = deepCopy( newFild );
		arr = setFourShip ( arr, 1, obj );
		arr = setThreeShip ( arr, 2, obj );
		arr = setTwoShip ( arr, 3, obj );
		arr = setOneShip ( arr, 4, obj );
		//console.log( obj );
		return arr;		
	};
	
///////////////////////////////////////////////////////////////////////////////////

	// Стратегии выстрелов
	let strategyFireOne = 
		[[1,0,0,0,1,0,0,0,1,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,0,1,0,0,0,1,0,0,0],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,0,1,0,0,0,1,0,0,0],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,1,0,0,0,1,0,0,0,1]];
	let strategyFireTwo = 
		[[1,0,0,0,1,0,0,0,1,0],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,0,1,0,0,0,1,0,0,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,0,1,0,0,0,1,0,0,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,0,0,1,0,0,0,1,0,0]];
	let strategyFireThree = 
		[[0,0,0,1,0,0,0,1,0,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [0,0,1,0,0,0,1,0,0,0],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,1,0,0,0,1,0,0,0,1],
		 [0,0,1,0,0,0,1,0,0,0],
		 [1,0,0,0,1,0,0,0,1,0],
		 [0,0,0,1,0,0,0,1,0,0],
		 [0,1,0,0,0,1,0,0,0,1]];

	let fildStrategyFire;
	let randStrategyFire = getRandomInt( 3 );

	// Cлучайная стратегия поска четырех палубника
	switch ( randStrategyFire ) {
		case 0 : fildStrategyFire = deepCopy( strategyFireOne ); break
		case 1 : fildStrategyFire = deepCopy( strategyFireTwo ); break
		case 2 : fildStrategyFire = deepCopy( strategyFireThree ) };

//////////////////////////////////////////////////////////////////////////////

	// Вставит канвас и хранилище, просчитает ширину и высоту клетки
	function getMyContext () { 
		$('#canvasArea').html(`
			<canvas id="outputMy" class="col-lg-6 col-12 my-3"></canvas>
			<canvas id="outputComp" class="col-lg-6 col-12 my-3"></canvas>
		`);
		let myHeight = $('#outputMy').height();
		let myWidth = $('#outputMy').width();
		let compHeight = $('#outputComp').height();
		let compWidth = $('#outputComp').width();
		let canvas = document.getElementById( 'outputMy' );
		canvas.height = myHeight;
		canvas.width = myWidth;
		let canvas2 = document.getElementById( 'outputComp' );
		canvas2.height = compHeight;
		canvas2.width = compWidth;
		stage = new createjs.Stage( canvas );
		wc = ( myWidth - 2 ) / GRID.WIDTH;
		hc = ( myHeight - 2 ) / GRID.HEIGHT;
		stage2 = new createjs.Stage( canvas2 );
		wc2 = ( compWidth - 2 ) / GRID.WIDTH;
		hc2 = ( compHeight - 2 ) / GRID.HEIGHT;
		// Нам нужны квадратные
		wc > hc ? wc = hc : hc = wc;
		wc2 > hc2 ? wc2 = hc2 : hc2 = wc2;
	};

	// Вспомним Имя
	localforage.removeItem( 'badGamer' );
    localforage.getItem( 'name' ).then( function ( name ) {
		myName = name;
		$( '#outputInfo' ).find( '#infoName' ).html(`
			<p class="font-weight-bold">Здравствуйте, ${ myName }!</p> 
			<p>Уже не терпится начать с вами сражение, 
			мой флот уже на поле боя и теперь я ожидаю, 
			когда вы расставите свои карабли,
			для этого нажмите "Расставить".</p>
		`);
	});

	// Добавим полезные кнопки.
	$('#infoAddon').html(`
		<button class="btn btn-light ml-3" id="showFildComp">Режим читера</button>
		<button class="btn btn-light ml-3" id="setSound">Озвучка</button>
	`);

	// Нарисуем сетку с осями
	function renderBox( stage, wc, hc, boxes ) {
		this.stage = stage;
		this.wc = wc;
		this.hc = hc;
		this.boxes = boxes;
		stage.removeAllChildren();
		sh = new createjs.Shape ( );
		let gr = sh.graphics;
		let a = 0, b = 0;
		while ( a < GRID.HEIGHT + 1 ) {
			while ( b < GRID.WIDTH + 1 ) {
				gr.x = -wc/2 + ( wc  ) * b;
				gr.y = -hc/2 + ( hc  ) * a;
				gr.beginStroke("Lightslategray");
				if ( boxes[ a ][ b ] == 0 ) { gr.beginFill("rgba(0,0,0,0.01)"); }
				// Скрытые
				if ( boxes[ a ][ b ] == 2 ) { 
					let color = [ "#ddd","#fff","#fff","#ddd","#ddd","#fff","#fff" ];
					let dist = [ 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1 ];
					gr.beginLinearGradientFill( color, dist, gr.x, gr.y, gr.x + wc, gr.y + hc )
				}
				gr.drawRect( gr.x , gr.y, wc, hc );
				b++;
			};
			b = 0;
			a++;
		};
		// Поля тетрадки
		gr.beginStroke("red");
		gr.beginFill("red");
		gr.moveTo( -wc/2 + ( wc  ) * 3, 0 );
		gr.lineTo( -wc/2 + ( wc  ) * 3, -hc/2 + ( hc  ) * 13 );
		// Рамка рабочей части
		gr.setStrokeStyle(3).beginStroke("#333");
		gr.beginFill("rgba(0,0,0,0)");
		gr.drawRect( -wc/2 + ( wc  ) * 4, -hc/2 + ( hc  ) * 2,  ( wc  ) * 10, ( hc  ) * 10 );
		stage.addChild ( sh );
		// Оси
		abc.forEach(function(item, i, array) {
			let text = new createjs.Text(item, `${ wc / 1.2 }px cursive`, "#333");
			text.x = ( wc * 4 ) + ( i * wc ) -  wc / 2.4;
			text.y = hc - wc / 2.4;
			stage.addChild(text);
		});
		cba.forEach(function(item, i, array) {
			let text = new createjs.Text(item, `${ wc / 1.2 }px cursive`, "#333");
			text.y = ( wc * 2 ) + ( i * wc ) -  wc / 2.4;
			text.x = hc * 3 - wc / 2.4;
			stage.addChild(text);
		});
		stage.update ( );
	};

	// Свеху нарисуем обстановку на поле
	function renderFild( stage, wc, hc, arr ) {
		sh = new createjs.Shape ( );
		let gr = sh.graphics;
		let a = 0, b = 0;
		while ( a < arr.length ) {
			while ( b < arr[0].length ) {
				gr.x = -wc/2 + wc * ( b + 4 );
				gr.y = -hc/2 + hc * ( a + 2 );
				gr.setStrokeStyle(0);
				// Не подбитый корабль
				if ( arr[ b ][ a ] == 1 ) { 
					gr.setStrokeStyle(3).beginStroke("#333");
					gr.beginFill("white");
					gr.drawRect( gr.x, gr.y, wc, hc );
				}
				// Мимо и рядом
				if ( arr[ b ][ a ] == 10 || arr[ b ][ a ] == 12 ) { 
					let color = [ "white", "blue" ];
					let dist = [ 0.9, 1 ];
					//gr.setStrokeStyle(0);
					gr.setStrokeStyle(1).beginStroke("rgba(0,0,0,0)");
					gr.beginRadialGradientFill( color, dist, gr.x, gr.y, wc, gr.x + wc / 2, gr.y + hc / 2, 0 );
					gr.drawRect( gr.x+2, gr.y+2, wc-4, hc-4 );
				}
				// Подбил
				if ( arr[ b ][ a ] == 11 ) {
					gr.setStrokeStyle(3).beginStroke("#333");
					gr.beginFill("white")
					gr.drawRect( gr.x, gr.y, wc, hc );
					let dc = wc - wc / 1.3;
					gr.setStrokeStyle(3).beginStroke("red");
					gr.beginFill("red");
					gr.moveTo( gr.x + dc, gr.y +  dc );
					gr.lineTo( gr.x + wc / 1.3, gr.y + wc / 1.3 );
					gr.moveTo( gr.x + wc / 1.3, gr.y + dc );
					gr.lineTo( gr.x + dc, gr.y + wc / 1.3 );
				}
				b++;
			};
			b = 0;
			a++;
		};
		stage.addChild ( sh );
		stage.update ( );
	}

	// Обновление всего
	function renderAll() {
		$('#infoScore').html(`<p class="mb-0">Ваш результат: ${ score }</p>`)
		getMyContext ();
		renderBox( stage, wc, hc, myBox );
		sh.addEventListener("click", fildClick );
		renderBox( stage2, wc2, hc2, compBox );
		sh.addEventListener("click", fildClick );
		renderFild( stage, wc, hc, fildCompFire );
		renderFild( stage2, wc2, hc2, fildMyFire );
		if ( fildMyShips ) {
			renderFild( stage, wc, hc, fildMyShips );
		}
		if ( badGamer ) {
			renderFild( stage2, wc2, hc2, fildCompShips );
		}
	}

	// При изминении размеров окна
	$( window ).resize( function() {
		renderAll ();
	});
	
////////////////////////////////////////////////////////////////////////////////	

	// А не читер ли ты?
	$( '#infoAddon' ).delegate("#showFildComp", "click", function (){
		badGamer = true;
		renderAll ();
	});

	// А не читер ли ты?
	$( '#infoAddon' ).delegate("#setSound", "click", function (){
		sound ? sound = false : sound = true;
	});

	// Установка моих кораблей вручую
	$( '#infoControl' ).delegate("#setShipsInFild", "click", function (){
		setShips = true;
		myShips = deepCopy ( newShips );
		myShipsInt = deepCopy( allShips );
		fildMyShips = deepCopy( newFild );
		getControlButton ();
		renderAll ();
	});

	// Простор для творчества
	function getControlButton() {
		$( '#outputInfo' ).find( '#infoName' ).html(`
			<p class="font-weight-bold">Замечательно, ${ myName }, 
			у вас ещё ${ myShipsInt.length } кораблей в резерве.</p>
			<p>Выберите корабль, курс задаем стрелками (курсор укажет текущее)
			и устанавливаем корабль кликом мышки.</p>
		`);
		let buttons = ``, ship;
		myShipsInt.forEach( function( item, i, array ) {
			if ( item == 4 ) { ship = '▧▧▧▧' }
			if ( item == 3 ) { ship = '▧▧▧' }
			if ( item == 2 ) { ship = '▧▧' }
			if ( item == 1 ) { ship = '▧' }
			buttons += `
				<button class="btn btn-light mb-3 ship" data-id="${ i }">
				${ ship }</button>`;
		});
		$( '#infoControl' ).html( buttons );
		$( '#infoControl' ).append( `
			<button class="btn btn-dark btn-block mb-3" id="setShipsInFild">
				Очистить поле</button>
			<button class="btn btn-dark btn-block" id="setShipsInFildRand">
				Расставить cлучайно</button>
		` );
		$( '.ship' ).click( function (){
			setShips = true;
			horizont = false;
			$( 'body' ).off( "keyup" );
			let id = $( this ).attr( 'data-id' );
			let curs;
			shipID = id;
			if ( myShipsInt[ id ] > 1 ) { curs = cursor[ 0 ] }
			if ( myShipsInt[ id ] == 1 ) { curs = cursor[ 2 ] }
			$( '#outputMy' ).css( "cursor", curs );
			$( 'body' ).on( "keyup", setCursor );
			function setCursor( e ){
				if ( e.which > 36 && e.which < 41 ) {
					horizont ? horizont = false : horizont = true;
				}
				if ( myShipsInt[ id ] > 1 && horizont ) { curs = cursor[ 1 ] }
				if ( myShipsInt[ id ] > 1 && !horizont ) { curs = cursor[ 0 ] }
				$( '#outputMy' ).css( "cursor", curs );
			};
		});
	}

	// Установка моих кораблей рандомно
	$( '#infoControl' ).delegate("#setShipsInFildRand", "click", function (){
		myShips = deepCopy ( newShips );
		fildMyShips = setRandomShipsInFild( myShips );
		readyFildMyShips ();
		renderAll ();
	});

	// Всё ли?
	function readyFildMyShips (){
		$( '#outputInfo' ).find( '#infoName' ).html(`
			<p class="font-weight-bold">Отлично, ${ myName }!</p>
			<p>Корабли расставленны, теперь мы можем 
			начать сражение, нажмите "Продолжить" или если остались сомнения
			можно заново установить флот.</p>
		`);
		$( '#infoControl' ).html(`
			<button class="btn btn-light btn-block mb-3" id="setShipsInFild">Расставить вручную</button>
			<button class="btn btn-light btn-block mb-3" id="setShipsInFildRand">Расставить cлучайно</button>
			<button class="btn btn-dark btn-block" id="beforeBattle">
			Продолжить</button>
		`);
	}

	// Перед сражением, право первого хода
	$( '#infoControl' ).delegate("#beforeBattle", "click", function (){
		$( '#outputInfo' ).find( '#infoName' ).html(`
			<p class="font-weight-bold">${ myName }, разыграем право
			первого выстрела?</p>
			<p>Можете начать первым или кинем кубики,
			 у кого выпадет больше за тем и выстрел.</p>
		`);
		$( '#infoControl' ).html(`
			<button class="btn btn-dark btn-block mb-3" id="startBattle">Я начну</button>
			<button class="btn btn-dark btn-block" id="setFireRand">Кинем кубики</button>
		`);
	});
	
	// Кинем кубики
	$( '#infoControl' ).delegate("#setFireRand", "click", function (){
		let arr = ['⚀','⚁','⚂','⚃','⚄','⚅'];
		$( '#outputInfo' ).find( '#infoName' ).empty();
		setTimeout(function (){
			let rand1 = getRandomInt(6);
			let rand2 = getRandomInt(6);
			let rand3 = getRandomInt(6);
			let rand4 = getRandomInt(6);
			let str1 = arr[ rand1 ] + arr[ rand2 ];
			let str2 = arr[ rand3 ] + arr[ rand4 ];
			let str3;
			if ( rand1 + rand2 > rand3 + rand4 ) {
				str3 = 'Ход ваш';
			} else {
				str3 = 'Ход за мной';
				firstFire = true;
			}
			$( '#outputInfo' ).find( '#infoName' ).append(`
				<p class="h4">У вас выпали - <span class="h2">${ str1 }</span></p>
			`);
			setTimeout(function (){
				$( '#outputInfo' ).find( '#infoName' ).append(`
					<p class="h4">У меня выпали - <span class="h2">${ str2 }</span></p>
					<p class="h4 mt-4">${ str3 }</p>
				`);
				$( '#infoControl' ).html(`
					<button class="btn btn-dark btn-block" id="startBattle">Продолжить</button>
				`);
			}, 300);
		}, 300)
	});

	// В бой
	$( '#infoControl' ).delegate("#startBattle", "click", function (){
		isMyFire = true;

		if ( !firstFire ) {
			$( '#outputInfo' ).find( '#infoName' ).html(`<p>Ваш ход.</p>`);	
		} else {
			$( '#outputInfo' ).find( '#infoName' ).empty();
			isMyFire = false;
			stepComp ();
		}
		$( '#infoControl' ).empty();
	});

//////////////////////////////////////////////////////////////////////////////////

	// Вымтрел компа
	function stepComp() {
		let summ = 0;
		let int = 0;
		let strategy = false;

		// Стратегические выстрелы есть?
        fildStrategyFire.forEach( function( item, i, array ) {
            item.forEach( function( item, i, array ) {
                if ( item == 1 ) { summ++ }
            });
		});
		if ( summ == 0 ) { strategy = true }

		// Запросить точку
		let fire = getCompRandFire ( fildStrategyFire, beforeFire, fildCompFire, strategy );
		let x = fire[ 1 ], y = fire[ 0 ];

		$( '#outputInfo' ).find( '#infoName' ).prepend(`
			<p class="text-danger">${ step }. Компьютер: 
			<span class="font-weight-bold"> ${ abc[ y ] } - ${ cba[ x ] }</span></p>
		`);

		// Куда-то в корабль попали
		if ( fildMyShips[ y ][ x ] == 1 ) {
			for ( key in myShips ) {
				myShips[ key ].forEach( function( item, i, array ) {
					if ( item[ 0 ] == [ y ] && item[ 1 ] == [ x ] ) {
						// Прокси говорит убили
						if ( array.length == 1 ) {
							//console.log('убил!');
							$( '#outputInfo' ).find( '#infoName' ).prepend(`
								<p class="text-danger font-weight-bold">Уничтожен!</p>
							`);
							beforeFire.fire.push( y,x );
							// Зона вокруг убитого корабля, туда больше не палим
							for (let i = 0; i < beforeFire.fire.length / 2; i++){
								fildCompFire = getNewFildFire( fildCompFire, beforeFire.fire[i*2], beforeFire.fire[i*2+1] );
							}
							array.splice( i, 1 );
							delete myShips[ key ];
							beforeFire = deepCopy( newFire );
						// Прокси говорит ранили
						} else {
							//console.log('попал!');
							$( '#outputInfo' ).find( '#infoName' ).prepend(`
								<p class="text-danger">Корабль, горит!</p>
							`);
							beforeFire.lock = true;
							beforeFire.fire.push( y,x )
							array.splice( i, 1 )
						}
					}
					int++;
				});
			}
			// Длинные рекурсии, сбросим стратегию, четырех палубник скорее всего нашли!
			if ( int < 10 ) {
				console.log("Alert, fire < 10!");
				fildStrategyFire = deepCopy( newFild ); 
				strategy = true;
			}			
		}

		fildCompFire[ y ][ x ] = fildMyShips[ y ][ x ] + 10;
		fildMyShips[ y ][ x ] += 10;
		fildStrategyFire[ y ][ x ] = 0;

		if ( sound ) {
			sayThis( abc[ y ], 0.4 );
			sayThis( cba[ x ], 0.8, begin );
		} else {
			begin ();
		}

		function begin() {
			if ( fildMyShips[ y ][ x ] == 11 ) {
				renderAll ();
				// Конец Игры
				if ( JSON.stringify( myShips ) == "{}" ) {
					score = 0;
					renderAll ();
					$( '#outputInfo' ).find( '#infoName' ).prepend(`
						<p class="text-danger font-weight-bold">
						Финита ля комедия! Вы продули!</p>
						<p class="text-danger font-weight-bold">
						На ${ step } ходу, вы пали на поле боя.</p>
					`);
					console.log('Всё конец');
					return;
				}
				// Сходим опять, попали же.
				step++;
				setTimeout(stepComp, 500);
			}
			if ( fildMyShips[ y ][ x] == 12 || fildMyShips[ y ][ x ] == 10 ) {
				$( '#outputInfo' ).find( '#infoName' ).prepend(`
					<hr>
				`);
				renderAll ();
				// Ваш ход
				step++;
				isMyFire = true;
			}
		};
	};

	// Ваш ход
	function stepMy( x, y ) {
		$( '#outputInfo' ).find( '#infoName' ).prepend(`
			<p class="text-primary">${ step }. Мой выстрел: 
			<span class="font-weight-bold"> ${ abc[ y ] } - ${ cba[ x ] }</span></p>
		`);
		isMyFire = false;

		// Куда-то в корабль попали
		if ( fildCompShips[ y ][ x ] == 1 ) {
			for ( key in compShips ) {
				compShips[ key ].forEach( function( item, i, array ) {
					if ( item[ 0 ] == [ y ] && item[ 1 ] == [ x ] ) {
						// Прокси говорит убили
						if ( array.length == 1 ) {
							//console.log('убил!');
							$( '#outputInfo' ).find( '#infoName' ).prepend(`
								<p class="text-primary">Корабль, потоплен!</p>
							`);
							if ( sound ) {
								sayThis( "Убил", 0.6 );
							}
							array.splice( i, 1 );
							delete compShips[ key ];
						// Прокси говорит ранили
						} else {
							//console.log('попал!');
							$( '#outputInfo' ).find( '#infoName' ).prepend(`
								<p class="text-primary">Корабль, горит!</p>
							`);
							if ( sound ) {
								sayThis( "Ранил", 0.6 );
							}
							array.splice( i, 1 );
						}
					}
				});
			}
		}

		fildMyFire[ y ][ x ] = fildCompShips[ y ][ x ] + 10;
		fildCompShips[ y ][ x ] += 10;

		if ( fildCompShips[ y ][ x ] == 11 ) {
			if ( !badGamer ) { score -= 100; } else { score = 0 }
			renderAll ();
			// Конец Игры
			if ( JSON.stringify( compShips ) == "{}" ) {
				$( '#outputInfo' ).find( '#infoName' ).prepend(`
					<p class="text-primary font-weight-bold">
					Ура! Победа! Вы выиграли!</p>
					<p class="text-primary font-weight-bold">
					На ${ step } ходу, ваш счет составил: ${ score } очков.</p>
				`);
				console.log('Всё конец');
				return;
			}
			step++;
			isMyFire = true;
		}
		if ( fildCompShips[ y ][ x] == 12 || fildCompShips[ y ][ x ] == 10 ) {
			if ( !badGamer ) { score -= 100; } else { score = 0 }
			$( '#outputInfo' ).find( '#infoName' ).prepend(`
				<hr>
			`);
			renderAll ();
			step++;
			setTimeout(stepComp, 500);
		}
	};

////////////////////////////////////////////////////////////////////////////

	function sayThis ( text, speed, callback ) {
		this.text = text;
		this.speed = speed;
		let synth = window.speechSynthesis;
		let utterThis = new SpeechSynthesisUtterance( text );
		utterThis.lang = 'ru-RU';
		utterThis.pitch = 1;
		utterThis.rate = speed;
		synth.speak( utterThis );
		utterThis.onend = function(event) {
			if ( callback ) {
				callback ();
			}
		}
	}

//////////////////////////////////////////////////////////////////////////////

	function fildClick ( e ) {
		let id = e.currentTarget.parent.canvas.id;
		let fild = false;

		wc = ( e.currentTarget.parent.canvas.width - 2 ) / GRID.WIDTH;
		hc = ( e.currentTarget.parent.canvas.height - 2 ) / GRID.HEIGHT;
		wc > hc ? wc = hc : hc = wc;

		a = ( e.stageX / wc ) - 3.5;
		b = ( e.stageY / hc ) - 1.5;
		a > 0 ? a = a^0 : a = -1;
		b > 0 ? b = b^0 : b = -1;

		if ( a >= 0 && a <=9 && b >= 0 && b <= 9 ) { fild = true } 

		if ( fild && isMyFire && id == "outputComp" ) {
			
			if ( fildMyFire[ a ][ b ] < 10 ) {
				stepMy( b, a );
			} else {
				$( '#outputInfo' ).find( '#infoName' ).prepend(`
					<p class="text-warning">Вы уже стреляли в это поле!</p>
				`);
			}
		}

		if ( fild && !isMyFire && setShips && id == "outputMy" ) {
			let isLoose = isLooseBoxMy( a, b, fildMyShips, myShipsInt[ shipID ], horizont );
			if ( isLoose ) { 
				fildMyShips = setShipMyBox( a, b, fildMyShips, myShipsInt[ shipID ], horizont, myShips, myShipsInt.length );
				renderAll ();
				myShipsInt.splice( shipID, 1 );
				shipID = 0;
				if ( myShipsInt.length > 0 ) {
					getControlButton ();
				} else {
					readyFildMyShips ();
					setShips = false;
				}
			} 
			if ( !isLoose ) {
				$( '#outputInfo' ).find( '#infoName' ).html(`
					<p class="font-weight-bold">Замечательно, ${ myName }, у вас ещё ${ myShipsInt.length } 
					кораблей в резерве.</p>
					<p class="text-danger">Невозможно установить корабль в данную точку</p>
				`);
			}
		}
	};

	renderAll ();
};