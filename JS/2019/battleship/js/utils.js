// Вернет класс объекта
function _getClass( obj ) {
	return {}.toString.call( obj ).slice( 8, -1 );
};

// Глубоко копировать любой объект
function deepCopy( source ) {
	clss = _getClass( source )
	let target;
		
	if ( clss=="Array" ) { target = [] }
	if ( clss=="Object" ) { target = {} }
	if ( clss=="Date" ) { target = new Date }
	if ( clss=="Null" ) { target = null }  

	for ( let prop in source ) {
		if ( typeof source[ prop ] === "object") {
			target[ prop ] = deepCopy( source[ prop ] );
		} else {
			target[ prop ] = source[ prop ];
		}
	}
	return target;
};

// Развернет равнобедренную матрицу на 90 (1 int), 180(2 int), 270(3 int) 
// градусов или отобразит зеркально "invert"(-1 int)
function rotateMatrix( source, corner ) {
    let w, h, target;

    if ( corner == - 1 || corner == "invert" ) {
        target = deepCopy( source );
        target.reverse();
        return target;
    }
    if ( corner == 1 || corner == 90 ) {
        h = source.length - 1;
        w = source[ 0 ].length - 1;
        target = deepCopy( source );
        if ( h == w ) {
            let c = w;
            for ( let a = 0; a <= w; a++ ) {
                for ( let b = 0; b <= w; b++ ) {
                    target[b][c] = source[a][b];
                }
                c--;
            }
        };
        return target;
    }
    if ( corner == 2 || corner == 180 ) {
        target = deepCopy( source );
        target.forEach(function(item, i, array) {
            item.reverse();
        });
        target.reverse();
        return target;
    }
    if ( corner == 3 || corner == 270 ) {
        h = source.length - 1;
        w = source[ 0 ].length - 1;
        target = deepCopy( source );
        if ( h == w ) {
            let c = w;
            for ( let a = 0; a <= w; a++ ) {
                for ( let b = 0; b <= w; b++ ) {
                    target[b][c] = source[a][b];
                }
                c--;
            }
        };
        target.forEach(function(item, i, array) {
            item.reverse();
        });
        target.reverse();
        return target;
    }
    else {
        return source;
    }
    
    
};

// Псевдослучайное число
function getRandomInt( max ) {
    return Math.floor( Math.random() * Math.floor( max ) );
};