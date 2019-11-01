// Заполнит матрицу нулями или боксы в зависимости от параметров
function getBox ( GRID, isHidden ) {
    let a = 0, b = 0, arr = [];
    while ( a <= GRID.HEIGHT ) {
        arr.push ( [ ] );
        while ( b <= GRID.WIDTH ) {
            if ( a >= 2 && a < 12 && b >= 4 && b < 14 && isHidden ) {
                arr[ a ].push( 2 );
            } else {
                arr[ a ].push( 0 );
            }
            b++;
        };
        b = 0;
        a++;
    };
    return arr;
};

// Добавит корабли в объект кораблей
function addCompShipsFormObjs( arr, obj ) {
    let int = 0, col = 0, delta = 0;
    arr.forEach( function( item, i, array ) {
        int = 0;
        delta = 0;
        let y = i;
        item.forEach( function( item, i, array ) {
            if ( item == 1 ) {
                int++;
            }
            if ( item == 2 || item == 0 || i == 9 ) {
                if ( int == 1 ) {
                    int = 0;
                    delta = 0;
                }
                if ( int > 1 ) {
                    if ( i == 9 ) { delta = 1 }
                    //console.log(int);
                    while ( int > 0 ) {
                        obj[ col ].push( [ y, i - int + delta ] );
                        int--;
                    }
                    col++;
                }
            }
        });
    });
    let arr2 = deepCopy( arr );
    arr2 = rotateMatrix( arr2, 270 );
    arr2 = rotateMatrix( arr2, -1 );
    int = 0;
    delta = 0;
    arr2.forEach( function( item, i, array ) {
        int = 0;
        delta = 0;
        let y = i;
        item.forEach( function( item, i, array ) {
            if ( item == 1 ) {
                int++;
            }
            if ( item == 2 || item == 0 || i == 9 ) {
                if ( int == 1 ) {
                    int = 0;
                }
                if ( int > 1 ) {
                    if ( i == 9 ) { delta = 1 }
                    //console.log(int);
                    while ( int > 0 ) {
                        
                        obj[ col ].push( [ i - int + delta, y ] );
                        int--;
                    }
                    col++;
                }
            }
        });
    });
    return obj;
};

// Установить четырех палубники в массив рандомно (int - кол-во)
function setFourShip ( arr, int, obj ) {
    let i = 0;
    let horizont, x, y, startX, startY, endX, endY;
    while ( int != 0 ) {
        horizont = getRandomInt( 2 );
        x = getRandomInt( 7 ), y = getRandomInt( 10 );
        startX = -1, startY = -1, endX = 5, endY = 2;
        if ( horizont > 0 ) {
            if ( arr[y][x] == 0 && arr[y][x+1] == 0 && arr[y][x+2] == 0 && arr[y][x+3] == 0 ) {
                arr[y][x] = 1;
                arr[y][x+1] = 1;
                arr[y][x+2] = 1;
                arr[y][x+3] = 1;
                obj[ 1 - int ].push( [ y,x ] );
                obj[ 1 - int ].push( [ y,x+1 ] );
                obj[ 1 - int ].push( [ y,x+2 ] );
                obj[ 1 - int ].push( [ y,x+3 ] );
                if ( x == 0 ) { startX++ }
                if ( x == 6 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 9 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        } 
        if ( horizont == 0 ) {
            x = getRandomInt( 10 ), y = getRandomInt( 7 );
            startX = -1, startY = -1, endX = 2, endY = 5;
            if ( arr[y][x] == 0 && arr[y+1][x] == 0 && arr[y+2][x] == 0 && arr[y+3][x] == 0 ) {
                arr[y][x] = 1;
                arr[y+1][x] = 1;
                arr[y+2][x] = 1;
                arr[y+3][x] = 1;
                obj[ 1 - int ].push( [ y,x ] );
                obj[ 1 - int ].push( [ y+1,x ] );
                obj[ 1 - int ].push( [ y+2,x ] );
                obj[ 1 - int ].push( [ y+3,x ] );
                if ( x == 0 ) { startX++ }
                if ( x == 9 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 6 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        }
        if ( i > 200 ) {
            console.log('Error: Нет места для установки четырехпалубного корабля');
            return -1;
        }
        i++;
    }
    return arr;
};

// Установить трех палубники в массив рандомно (int - кол-во)
function setThreeShip ( arr, int, obj ) {
    let i = 0;
    let horizont, x, y, startX, startY, endX, endY;
    while ( int != 0 ) {
        horizont = getRandomInt( 2 );
        x = getRandomInt( 8 ), y = getRandomInt( 10 );
        startX = -1, startY = -1, endX = 4, endY = 2;
        if ( horizont > 0 ) {
            if ( arr[y][x] == 0 && arr[y][x+1] == 0 && arr[y][x+2] == 0 ) {
                arr[y][x] = 1;
                arr[y][x+1] = 1;
                arr[y][x+2] = 1;
                obj[ 3 - int ].push( [ y,x ] );
                obj[ 3 - int ].push( [ y,x+1 ] );
                obj[ 3 - int ].push( [ y,x+2 ] );
                if ( x == 0 ) { startX++ }
                if ( x == 7 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 9 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        } 
        if ( horizont == 0 ) {
            x = getRandomInt( 10 ), y = getRandomInt( 8 );
            startX = -1, startY = -1, endX = 2, endY = 4;
            if ( arr[y][x] == 0 && arr[y+1][x] == 0 && arr[y+2][x] == 0 ) {
                arr[y][x] = 1;
                arr[y+1][x] = 1;
                arr[y+2][x] = 1;
                obj[ 3 - int ].push( [ y,x ] );
                obj[ 3 - int ].push( [ y+1,x ] );
                obj[ 3 - int ].push( [ y+2,x ] );
                if ( x == 0 ) { startX++ }
                if ( x == 9 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 7 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        }
        if ( i > 200 ) {
            console.log('Error: Нет места для установки трехпалубного корабля');
            return -1;
        }
        i++;
    }
    return arr;
};

// Установить двух палубники в массив рандомно (int - кол-во)
function setTwoShip ( arr, int, obj ) {
    let i = 0;
    let horizont, x, y, startX, startY, endX, endY;
    while ( int != 0 ) {
        horizont = getRandomInt( 2 );
        x = getRandomInt( 9 ), y = getRandomInt( 10 );
        startX = -1, startY = -1, endX = 3, endY = 2;
        if ( horizont > 0 ) {
            if ( arr[y][x] == 0 && arr[y][x+1] == 0 ) {
                arr[y][x] = 1;
                arr[y][x+1] = 1;
                obj[ 6 - int ].push( [ y,x ] );
                obj[ 6 - int ].push( [ y,x+1 ] );
                if ( x == 0 ) { startX++ }
                if ( x == 8 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 9 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        } 
        if ( horizont == 0 ) {
            x = getRandomInt( 10 ), y = getRandomInt( 9 );
            startX = -1, startY = -1, endX = 2, endY = 3;
            if ( arr[y][x] == 0 && arr[y+1][x] == 0 ) {
                arr[y][x] = 1;
                arr[y+1][x] = 1;
                obj[ 6 - int ].push( [ y,x ] );
                obj[ 6 - int ].push( [ y+1,x ] );
                if ( x == 0 ) { startX++ }
                if ( x == 9 ) { endX-- }
                if ( y == 0 ) { startY++ }
                if ( y == 8 ) { endY-- }
                for ( a = startX; a < endX; a++ ) {
                    for ( b = startY; b < endY; b++ ) {
                        if ( arr[ y + b ][ x + a ] == 0 ) {
                            arr[ y + b ][ x + a ] = 2;
                        };
                    }
                }
                int--;
            }
        }
        if ( i > 200 ) {
            console.log('Error: Нет места для установки двухпалубного корабля');
            return -1;
        }
        i++;
    }
    return arr;
};

// Установить одно палубники в массив рандомно (int - кол-во)
function setOneShip ( arr, int, obj ) {
    while ( int != 0 ) {
        let x = getRandomInt( 10 ), y = getRandomInt( 10 );
        let startX = -1, startY = -1, endX = 2, endY = 2;
        if ( arr[y][x] == 0 ) {
            arr[y][x] = 1;
            obj[ 10 - int ].push( [ y,x ] );
            if ( x == 0 ) { startX++ }
            if ( x == 9 ) { endX-- }
            if ( y == 0 ) { startY++ }
            if ( y == 9 ) { endY-- }
            for ( a = startX; a < endX; a++ ) {
                for ( b = startY; b < endY; b++ ) {
                    if ( arr[ y + b ][ x + a ] == 0 ) {
                        arr[ y + b ][ x + a ] = 2;
                    };
                }
            }
            int--;
        }
    }
    return arr;
};

// Проверит входит-ли корабль в массив
function isLooseBoxMy ( y, x, arr, ship, horizont ) {
    if ( !horizont ) {
        if ( ship == 4 ) {
            if ( x + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y][x+1] == 0 && 
                   arr[y][x+2] == 0 && 
                   arr[y][x+3] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 3 ) {
            if ( x + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y][x+1] == 0 && 
                   arr[y][x+2] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 2 ) {
            if ( x + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y][x+1] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 1 ) {
            if (   arr[y][x] == 0 ) {
                return true;
            } else { return false }
        }
    }
    if ( horizont ) {
        if ( ship == 4 ) {
            if ( y + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y+1][x] == 0 && 
                   arr[y+2][x] == 0 && 
                   arr[y+3][x] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 3 ) {
            if ( y + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y+1][x] == 0 && 
                   arr[y+2][x] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 2 ) {
            if ( y + ship > 10 ) { return false }
            if (   arr[y][x] == 0 && 
                   arr[y+1][x] == 0 ) {
                return true;
            } else { return false }
        }
        if ( ship == 1 ) {
            if (   arr[y][x] == 0 ) {
                return true;
            } else { return false }
        }
    }
};

// Установит корабль в массив
function setShipMyBox ( y, x, arr, ship, horizont, obj, len ) {
    let startX, startY, endX, endY;
    if ( !horizont ) {
        startX = -1, startY = -1, endX = 1+ship, endY = 2;
        if ( ship == 4 ) {
            arr[y][x] = 1;
            arr[y][x+1] = 1;
            arr[y][x+2] = 1;
            arr[y][x+3] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y,x+1 ] );
            obj[ 10 - len ].push( [ y,x+2 ] );
            obj[ 10 - len ].push( [ y,x+3 ] );
        }
        if ( ship == 3 ) {
            arr[y][x] = 1;
            arr[y][x+1] = 1;
            arr[y][x+2] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y,x+1 ] );
            obj[ 10 - len ].push( [ y,x+2 ] );
        }
        if ( ship == 2 ) {
            arr[y][x] = 1;
            arr[y][x+1] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y,x+1 ] );
        }
        if ( ship == 1 ) {
            arr[y][x] = 1;
            obj[ 10 - len ].push( [ y,x ] );
        }
        if ( x == 0 ) { startX++ }
        if ( x == 10-ship ) { endX-- }
        if ( y == 0 ) { startY++ }
        if ( y == 9 ) { endY-- }
        for ( a = startX; a < endX; a++ ) {
            for ( b = startY; b < endY; b++ ) {
                if ( arr[ y + b ][ x + a ] == 0 ) {
                    arr[ y + b ][ x + a ] = 2;
                };
            }
         }
                    
    }
    if ( horizont ) {
        startX = -1, startY = -1, endX = 2, endY = 1+ship;
        if ( ship == 4 ) {
            arr[y][x] = 1;
            arr[y+1][x] = 1;
            arr[y+2][x] = 1;
            arr[y+3][x] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y+1,x ] );
            obj[ 10 - len ].push( [ y+2,x ] );
            obj[ 10 - len ].push( [ y+3,x ] );
        }
        if ( ship == 3 ) {
            arr[y][x] = 1;
            arr[y+1][x] = 1;
            arr[y+2][x] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y+1,x ] );
            obj[ 10 - len ].push( [ y+2,x ] );
        }
        if ( ship == 2 ) {
            arr[y][x] = 1;
            arr[y+1][x] = 1;
            obj[ 10 - len ].push( [ y,x ] );
            obj[ 10 - len ].push( [ y+1,x ] );
        }
        if ( ship == 1 ) {
            arr[y][x] = 1;
            obj[ 10 - len ].push( [ y,x ] );
        }
        if ( x == 0 ) { startX++ }
        if ( x == 9 ) { endX-- }
        if ( y == 0 ) { startY++ }
        if ( y == 10-ship ) { endY-- }
        for ( a = startX; a < endX; a++ ) {
            for ( b = startY; b < endY; b++ ) {
                if ( arr[ y + b ][ x + a ] == 0 ) {
                    arr[ y + b ][ x + a ] = 2;
                };
            }
        }
                    
    }
    return arr;
};

// Даст выстрел, исходя из стратегии, сначала ищет четырех палубник, 
// ну или что попадется, затем простреливает варианты с тремя клетками, затем рандомно.
function getCompRandFire ( fildsStrategyFire, beforeFire, fildsFire, isStrategy ) {
    let x, y, fire, int = 0, deltaX, deltaY, alfaX, alfaY;

    if ( !beforeFire.lock ) {
        _getRandInt(); 
        fire = [ y, x ];
        return fire;
    }
    // Если ранили ищем продолжение
    if ( beforeFire.lock ) {
        if ( beforeFire.fire.length == 2 ) {
            y = beforeFire.fire[0];
            x = beforeFire.fire[1];

            function getTrend () {
                deltaX = getRandomInt( 3 );
                deltaY = getRandomInt( 3 );
                if ( deltaX == 1 && deltaY == 1 ) { getTrend () }
                if ( deltaX != 1 && deltaY != 1 ) { getTrend () }
                if (    x - 1 + deltaX < 0 || 
                        x - 1 + deltaX > 9 ||
                        y - 1 + deltaY < 0 || 
                        y - 1 + deltaY > 9 ) { getTrend () }
                fire = [  y - 1 + deltaY, x - 1 + deltaX ];
                if ( fildsFire[ fire[0] ][ fire[1] ] != 0 ) { getTrend () }
            }

            getTrend();
            return fire;
        }
        if ( beforeFire.fire.length > 2 ) {
            fire = [];
            x1 = beforeFire.fire[beforeFire.fire.length-4];
            y1 = beforeFire.fire[beforeFire.fire.length-3];
            x2 = beforeFire.fire[beforeFire.fire.length-2];
            y2 = beforeFire.fire[beforeFire.fire.length-1];

            function getTrends() {
                if ( y1 == y2 ) {
                    //console.log('по x');
                    function getTrendX () {
                        fire[ 1 ] = y1;
                        deltaX = getRandomInt( 3 );
                        alfaX = getRandomInt( beforeFire.fire.length/2 );
                        x = beforeFire.fire[ alfaX + alfaX ];
                        fire[ 0 ] = x - 1 + deltaX;
                    }
                    getTrendX();
                }
                if ( x1 == x2 ) {
                    //console.log('по y');
                    function getTrendY () {
                        fire[ 0 ] = x1;
                        deltaY = getRandomInt( 3 );
                        alfaY = getRandomInt( beforeFire.fire.length/2 );
                        y = beforeFire.fire[ alfaY + alfaY + 1 ];
                        fire[ 1 ] = y - 1 + deltaY;
                    }
                    getTrendY();
                }
                
                if ( fire[0] >= 0 && fire[0] <= 9 && fire[1] >= 0 && fire[1] <= 9 ) {
                    if ( fildsFire[ fire[0] ][ fire[1] ] != 0 ) { getTrends () }
                } else { getTrends () }
            }

            getTrends();
            return fire;
        }
    }

    function _getRandInt() {
        int++;
        if ( isStrategy ) { 
            x = getRandomInt(10);
            y = getRandomInt(10);
            
            if ( fildsFire[ y ][ x ] == 0 && int < 30 ) {
                if ( x != 0 && y != 0 && x != 9 && y != 9 ) {
                    if ( fildsFire[ y + 1 ][ x ] == 0 && fildsFire[ y - 1 ][ x ] == 0 ) {
                        int = 0;
                        return;
                    }
                    if ( fildsFire[ y ][ x + 1 ] == 0 && fildsFire[ y ][ x - 1 ] == 0 ) {
                        int = 0;
                        return;
                    }
                    else { _getRandInt() }
                } else { 
                    int = 0; 
                    return; 
                }
            }
            if ( fildsFire[ y ][ x ] == 0 && int < 300 ) {
                int = 0;
                return;
            }
            if ( int == 300 ) {
                console.log('Alert, long recursion!');
                int = 0;
                _getRandInt();
            }
            if ( fildsFire[ y ][ x ] != 0 ) {
                _getRandInt();
            }
        } else {
            x = getRandomInt(10);
            y = getRandomInt(10);
            if ( fildsStrategyFire[ y ][ x ] == 1 && fildsFire[ y ][ x ] == 0 ) {
                return;
            }
            if ( fildsStrategyFire[ y ][ x ] == 1 && fildsFire[ y ][ x ] > 9 ) {
                console.log('Alert, error strategy!');
                fildsStrategyFire[ y ][ x ] = 0;
                _getRandInt();
            }
            else {
                _getRandInt();
            }
        }
    }
};

// Вернет поле выстрелов с запретной зоной вокруг убитого корабля
function getNewFildFire( arr, y, x ) {
    let startX, startY, endX, endY;

    startX = -1, startY = -1, endX = 2, endY = 2;

    if ( x == 0 ) { startX++ }
    if ( x == 9 ) { endX-- }
    if ( y == 0 ) { startY++ }
    if ( y == 9 ) { endY-- }

    for ( a = startX; a < endX; a++ ) {
        for ( b = startY; b < endY; b++ ) {
            if ( arr[ y + b ][ x + a ] == 0 ) {
                arr[ y + b ][ x + a ] = 13;
            };
        }
    }
    return arr;
};