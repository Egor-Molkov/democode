
import re
from decimal import Decimal as dec


def cleanCommand( str_ ):
    """ Функция очищает строку от мусора. 

        Заменяет запятую, точкой и оставляет в строке только -
        0-9 . + - * / ( )

    >>> cleanCommand( '(н(е2+2хо-2чу,5)учиться*2хочу жен)/ить2ся' ) \t
    '((2+2-2.5)*2)/2'
    """
    str_ = str_.replace( ",", "." )
    pattern = re.compile( "[^0-9.+-/*\(\)]" )
    return re.sub( pattern, "", str_ )

def cleanNotBracets( str_ ):
    """ Функция вернет все скобки из строки.

        >>> cleanNotBracets( '(н(е2+2хо-2чу,5)учиться*2хочу жен)/ить2ся' ) \t
        '(())'
        >>> cleanNotBracets( '' ) \t
        ''
    """
    pattern = re.compile( "[^\(\)]" )
    return re.sub( pattern, "", str_ )

def cleanBracets( str_ ):
    """ Функция вернет строку команд без скобок.

        >>> cleanBracets( '(н(е2+2хо-2чу,5)учиться*2хочу жен)/ить2ся' ) \t
        '2+2-2,5*2/2'
        >>> cleanNotBracets( '' ) \t
        ''
    """
    pattern = re.compile( "[^0-9.+-/*]" )
    return re.sub( pattern, "", str_ )

def cutBracets( str_ ):
    """ Функция вернет пустую строку, если все в порядке
        иначе вернет лишние скобки.

        >>> cutBracets( ')(' ) \t
        ')('
        >>> cutBracets( '(()())' ) \t
        ''
        >>> cutBracets( ')()(()()()(((()(()(())()(()()(()(()())))((((())()()()())()(' ) \t
        ')(((((((('
        >>> cutBracets( '' ) \t
        ''
        >>> cutBracets( '(н(е2+2хо-2чу,5)учиться*2хочу жен)/ить2ся') \t
        ''
    """
    str_ = cleanNotBracets( str_ )
    pattern = re.compile( "\(\)" )
    for _ in range(len(str_)//2):
        str_ = re.sub( pattern, "", str_ )
    return str_

def splitGroup( str_ ):
    """ Функция берет строку и разбивает на группы по (). 

    >>> splitGroup( '(2+2)*2' ) \t
    ['', '(2+2)', '*2']
    >>> splitGroup( '(2+2*2' ) \t
    ['(2+2*2']
    >>> splitGroup( '2*2' ) \t
    ['2*2']
    >>> splitGroup( '' ) \t
    ['']
    >>> splitGroup( '((2+2)*(2-2))/(1+1)' ) \t
    ['(', '(2+2)', '*', '(2-2)', ')/', '(1+1)', '']
    """
    pattern = re.compile( "(\([0-9.+-/*]*\))" )
    return re.split( pattern, str_, re.M )

def joinGroup( arr_ ):
    """ Функция соберет строку из групп. 

    >>> joinGroup( ['', '4', '*2'] ) \t
    '4*2'
    >>> joinGroup( ['(', '4', '*', '0', ')/', '2', ''] ) \t
    '(4*0)/2'
    """
    return "".join( arr_ )

def getOperation( str_ ):
    """ Функция вернет все операции из строки. 

    >>> getOperation( '2+2-2*2/2/-2*-2///2***2*//2/**2--2---2++2+++2-+-2-++2' ) \t
    ['+', '-', '*', '/', '/-', '*-', '/', '*', '*', '/', '+', '-', '+', '+', '+', '-']
    >>> getOperation( '' ) \t
    []
    """

    pattern = re.compile( "[0-9.]" )
    operation = "".join( str_ )
    operation = re.sub( pattern, " ", operation )
    operation = operation.split()
    """ Операции могут быть длинные, например:
        -- это +
        --- это -
        +--- это -
        Исключения:
        /- это / на отрицательное число
        *- это * на отрицательное число
        Непонятные случаи:
        ***///**/ это по первому * то есть умножить
    """
    for i in range( len( operation )):
        item = operation[i]
        if len( item ) > 1:
            count = 0
            for char in item:
                if char == "-": 
                    count += 1
                if char == "*":
                    if operation[i] == "*-": continue
                    operation[i] = "*"
                    break
                if char == "/":
                    if operation[i] == "/-": continue
                    operation[i] = "/"
                    break
            if operation[i] =="*" or\
                operation[i] =="/" or\
                operation[i] =="*-" or\
                operation[i] =="/-":
                pass
            else:
                if count % 2 == 1:
                    operation[i] = "-"
                else:
                    operation[i] = "+"
    return operation
   
def getOperand( str_ ):
    """ Функция вернет все операнды (числа) из строки. 

    >>> getOperand( '-1+2+3.33+4.444.+5..5555' ) \t
    ['', '1', '2', '3.33', '4.444', '5.5555']
    >>> getOperand( '0-1+2+3.33+4.444.+5..5555' ) \t
    ['0', '1', '2', '3.33', '4.444', '5.5555']
    >>> getOperand( '' ) \t
    ['']
    """
    pattern = re.compile( "[-+/*]+" )
    operand = "".join( str_ )
    operand = re.sub( pattern, "|", operand )
    operand = operand.split( "|" )
    # Уберем лишние точки в числах
    for item in operand:
        i = operand.index( item )
        item = item.replace( ".", "_", 1 )
        pattern = re.compile( "[^0-9_*]" )
        item = re.sub( pattern, "", item )
        operand[i] = item.replace( "_","." )
    return operand

def summInString( str_ ):
    """ Функция посчитает сумму в строке.
    Не учитывает скобки!

    >>> summInString( '' ) \t
    '0'
    >>> summInString( '2+2' ) \t
    '4'
    >>> summInString( '(2/2)' ) \t
    '1'
    >>> summInString( '(2*2)2' ) \t
    '44'
    >>> summInString( '(2.4+2.4)*2.4' ) \t
    '8.16'
    >>> summInString( '4(2' ) \t
    '42'
    >>> summInString( '0/0' ) \t
    'Error inf'
    >>> summInString( '1/0' ) \t
    'Error 1/0'
    """

    str_ = cleanBracets( str_ )

    # Массив для операций: + - * /
    operation = getOperation( str_ )
    #print( operation )

    # Массив для чисел (операндов): 0-9 .
    operand = getOperand( str_ )
    #print( operand )
            
    # Общий стек операнд + операция
    stek = []
    if operand[0] == "":
        operand[0] = "0"
    stek.append( operand[0] )
    for i in range( len( operation )):
        stek.append( operation[i] )
        stek.append( operand[i+1] )  
    #print( stek )

    # Просуммируем стек
    try:
        def summation( one, two ):
            return dec( one ) + dec( two )
        def subtraction( one, two ):
            return dec( one ) - dec( two )
        def multiplication( one, two ):
            return dec( one ) * dec( two )
        def subdivision( one, two ):
            return dec( one ) / dec( two )
                
        acc = dec( operand[0] )
        # Первая интерация приоритет: *, /, /(-), *(-)
        for item in operation:
            if item == "+":
                continue
            elif item == "-":
                continue
            elif item == "*":
                i = stek.index( "*" )
                if stek[i+1] == "": continue
                acc = multiplication( stek[i-1], stek[i+1] )
                #print("*", str( acc ))
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
            elif item == "/":
                i = stek.index( "/" )
                if stek[i+1] == "": continue
                acc = subdivision( stek[i-1], stek[i+1] )
                #print("/", str( acc ))
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
            elif item == "*-":
                i = stek.index( "*-" )
                if stek[i+1] == "": continue
                acc = multiplication( stek[i-1], "-" + stek[i+1] )
                #print("*-", str( acc ))
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
            elif item == "/-":
                i = stek.index( "/-" )
                if stek[i+1] == "": continue
                acc = subdivision( stek[i-1], "-" + stek[i+1] )
                #print("/-", str( acc ))
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
        # Вторая интерация приоритет: +, -
        for item in operation:
            if item == "+":
                i = stek.index( "+" )
                if stek[i+1] == "": continue
                acc = summation( stek[i-1], stek[i+1] )
                #print("+", str( acc ))
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
            elif item == "-":
                i = stek.index( "-" )
                if stek[i+1] == "": continue
                acc = subtraction( stek[i-1], stek[i+1] )
                #print("-", str( acc ))                    
                stek[i] = acc
                stek.pop( i+1 )
                stek.pop( i-1 )
    except ZeroDivisionError:
        acc="Error 1/0"
    except Exception as e:
        #print(e)
        acc="Error inf"
    return str( acc )

def summGroup( arr_ ):
    """ Функция посчитает сумму для отдельных групп. 

    >>> summGroup(['', '(2+2)', '*2']) \t
    ['', '4', '*2']
    >>> summGroup(['(2*2)', '*', '(2+2)', '*2+2*2*', '(2+2*2)']) \t
    ['4', '*', '4', '*2+2*2*', '6']
    >>> summGroup(['']) \t
    ['']
    """            
    pattern = re.compile( "^\(.*\)$" )
    for i in range( len( arr_ )):
        # Если в скобках
        if re.search( pattern, arr_[i] ):
            arr_[i] = summInString( arr_[i] )
    return arr_

def getSumm( str_ ):
    """ Функция посчитает окончательный результат.

    >>> getSumm('2+2*2') \t
    '6'
    >>> getSumm('(2+2)*2') \t
    '8'
    >>> getSumm('(2*2)*(2+2)*2-2*2*(2+2*2)') \t
    '8'
    >>> getSumm('(2+2)2') \t
    '42'
    >>> getSumm('(0/0)2') \t
    'Error inf'
    >>> getSumm('') \t
    '0'
    """ 
    arr_ = splitGroup( str_ )
    while len( arr_ ) > 1:
        arr_ = summGroup( arr_ )
        for item in arr_:
            # Если ошибка в стеке 
            if item == 'Error 1/0' or item == 'Error inf':
                return item
        str_ = joinGroup( arr_ )
        arr_ = splitGroup( str_ )

    return str( summInString( arr_[0] ))


if __name__ == '__main__':
    import doctest
    doctest.testmod( verbose=2 )
