
import sys
import re
from decimal import Decimal as dec
from decimal import getcontext as context_
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QGridLayout,
    QLabel, QLineEdit, QTextEdit, QPushButton, QApplication)

class Window( QWidget ):

    def __init__( self ):
        """Конструктор класса. """

        super().__init__()
        self.initUI()

    def initUI( self ):
        """Иницилизация UI. """

        # Выравнивание центер-право для полей
        centerRight = Qt.Alignment( 130 )

        # Загрузим тему оформления для виджетов
        with open("./qcss/style.css", "r") as f:
            qcss = f.read()

        # Базовый бокс - 0 ур
        box_ = QVBoxLayout()
        box_.addStretch( 1 )
        self.setLayout( box_ )
        self.setStyleSheet( qcss )

        # Общий слой - 1 ур
        root_ = QGridLayout()
        box_.addLayout( root_ )

        # header: с полями - 2 ур
        header_ = QGridLayout()
        header_.setVerticalSpacing( 4 )
        root_.addLayout( header_, 0, 0 )

        # content: с кнопками - 2 ур
        button_ = QGridLayout()
        button_.setSpacing( 5 )
        button_.setVerticalSpacing( 6 )
        root_.addLayout( button_, 1, 0 )

        # footer: с информацией - 2 ур
        footer_ = QGridLayout()
        footer_.setSpacing( 5 )
        root_.addLayout( footer_, 2, 0 )

        # Поле: История
        self.history = QTextEdit()
        self.history.setReadOnly( True )
        header_.addWidget( self.history, 0, 0, 3, 0 )

        # Поле: Командная строка
        self.command = QLineEdit()
        self.command.setAlignment( centerRight )
        self.command.setStyleSheet( "font-size:20px;" )
        header_.addWidget( self.command, 3, 0, 1, 0 )

        # Переменная для хранения очищенной от мусора командной строки
        self.cleanCommand = ""

        # Cтрока состояния памяти и информации
        memoryLabel = QLabel( "memory:" )
        self.memory = QLabel( "0" )
        self.memory.setStyleSheet( "max-width:55px;" )
        self.error_ = QLabel( "" )
        footer_.addWidget( memoryLabel, 0, 0, 0, 0 )
        footer_.addWidget( self.memory, 0, 1, 0, 1 )
        footer_.addWidget( self.error_, 0, 2, 0, 3 )

        # Кнопки
        names = ['m+', 'm-', 'mr', 'mc', '<-',
                 '7', '8', '9', 'hc', '<--',
                 '4', '5', '6', '(', ')',
                 '1', '2', '3', '+', '*',
                 '0', '.', '000', '-', '/',
                 '', '', '', '', '=']

        positions = [( y, x ) for y in range( 6 ) for x in range( 5 )]

        for position, name in zip( positions, names ):

            # Пустые пропустим
            if name == '':
                continue

            # Равно растянем
            if name == '=':
                position = ( 5, 3, 5, 2 )

            # Кнопки плоские, без фокуса
            button = QPushButton( name )
            button.setFlat( True )
            button.setFocusPolicy( 0 )
            button_.addWidget( button, *position )

            # Обработка событий
            button.clicked.connect( self.buttonClicked )
        
        self.setGeometry( 300,  150, 400, 400 )
        self.setWindowTitle( 'Простой калькулятор' )
        self.show()

    def buttonClicked( self ):
        """Метод вызывается для обработки событий. """

        def cleanCommand( str_ ):
            """ Метод очищает строку от мусора. 

                Заменяет запятую, точкой и оставляет в строке только -
                0-9 . + - * / ( )

                cleanCommand("(не2+2хочу.5)учиться*2хочу жениться")
                - "(2+2.5)*2"
            """
            str_ = str_.replace( ",", "." )
            pattern = re.compile( "[^0-9.+-/*\(\)]" )
            return re.sub( pattern, "", str_ )
        
        def cleanBracets( str_ ):
            """ Метод проверит все ли впорядке со скобками. 

                не влияет на расчет, просто предупреждает,
                например (2+2)2) посчитает, как (4)2) -> 42
                cleanBracets(")(")
                - error_("Проблемма со скобкими")
                cleanBracets("(()())")
                - void (true)
            """
            pattern = re.compile( "[^\(\)]" )
            bracetsInCommand = re.sub( pattern, "", str_ )
            pattern = re.compile( "\(\)" )

            cleanBracetsInCommand = ""
            def clean( str_ ):
                """ Метод вернет пустую строку, если все в порядке
                    иначе вернет лишние скобки
                """
                global cleanBracetsInCommand 
                this = str_
                if len( str_ ) > 0:
                    str_ = re.sub( pattern, "", str_ )
                if this != str_:
                    clean( str_ )
                else:
                    cleanBracetsInCommand = this
                return cleanBracetsInCommand
            cleanBracetsInCommand = clean( bracetsInCommand )
            if cleanBracetsInCommand != "":
                self.error_.setText( "Внимание: Скобки!" )
            return

        # Сбросим ошибки
        self.error_.setText( "" )

        # Что нажали
        char = self.sender().text()

        # Посчитать и добавить результат в память
        if char == "m+":
            self.cleanCommand = cleanCommand( self.command.text() )
            cleanBracets( self.cleanCommand )
            memory = dec( self.memory.text() )
            try:
                memory += dec( self.getResult() )
            except:
                pass
            self.memory.setText( str( memory ))
            return

        # Посчитать и вычесть результат из памяти
        if char == "m-":
            self.cleanCommand = cleanCommand( self.command.text() )
            cleanBracets( self.cleanCommand )
            memory = dec( self.memory.text() )
            try:
                memory -= dec( self.getResult() )
            except:
                pass
            self.memory.setText( str( memory ))
            return

        # Очистить память
        if char == "mc":
            self.memory.setText( "0" )
            return
        
        # Вернуть число из памяти в произвольную позицию в командной строке
        if char == "mr":
            self.command.insert( self.memory.text() )
            return

        # Очистить историю
        if char == "hc":
            self.history.setHtml( "" )
            return

        # Удалить один символ из командной строки
        if char == "<-":
            command = self.command.text()
            command = command[ :-1 ]
            self.command.setText( command )
            return

        # Очистить командную строку
        if char == "<--":
            self.command.setText( "" )
            return

        # Посчитать результат (очищенной командной строки), записать в историю
        # и перемотать фрейм с историей в конец
        if char == "=":
            self.cleanCommand = cleanCommand( self.command.text() )
            cleanBracets( self.cleanCommand )
            history = self.history.toPlainText()
            if history != "":
                history += " ... "
            history += self.cleanCommand + " = " + self.getResult()
            self.history.setHtml( history )
            cursor = self.history.textCursor()
            cursor.setPosition( len( history ) )
            self.history.setTextCursor( cursor )
            return

        # Иначе добавить символ к командной строке
        command = self.command.text()
        command += char
        self.command.setText( command )

    def getResult( self ):
        """ Метод распарсит командную строку и посчитает результат.

            result = self.getResult()
            - command
            - "(2+2)*2"
            - result
            - decimal( 8 )
        """
        
        #context_().prec = 60

        def splitGroup( str_ ):
            """ Метод берет строку и разбивает на группы (). 

                splitGroup("(2+2)*2")
                - ['', '(2+2)', '*2']
            """
            pattern = re.compile( "(\([0-9.+-/*]*\))" )
            return re.split( pattern, str_, re.M )

        def joinGroup( arr_ ):
            """ Метод соберет строку из групп. 

                joinGroup(['', '4', '*2'])
                - "4*2"
            """
            return "".join( arr_ )

        def summInString( str_ ):
            """ Метод посчитает сумму в строке. 

                summInString("(2+2)")
                - str( decimal( 4 )) - "4"
            """
            # Здесь без скобок
            pattern = re.compile( "[^0-9.+-/*]" )
            str_ = re.sub( pattern, "", str_ )

            # Массив для операций: + - * /
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
            #print( operation )

            # Массив для чисел (операндов): 0-9 .
            pattern = re.compile( "[-+/*]+" )
            operand = "".join( str_ )
            operand = re.sub( pattern, "|", operand )
            operand = operand.split( "|" )
            #print( operand )
            
            # Общий стек операнд + операция
            stek = []
            if operand[0] == "":
                operand[0] = "0"
            stek.append( operand[0] )
            for i in range( len( operation )):
                stek.append( operation[i] )
                stek.append( operand[i+1] )  
            print( stek )

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
                self.error_.setText( "Попытка деления числа на ноль" )
                acc="Error"
            except Exception as e:
                #print(e)
                self.error_.setText( "Неизвесное исключение" )
                acc="Error"
            return str( acc )

        def summGroup( arr_ ):
            """ Метод посчитает сумму для отдельных групп. 

                resultGroup(['', '(2+2)', '*2'])
                - "['', '4', '*2']"
            """            
            pattern = re.compile( "^\(.*\)$" )
            for i in range( len( arr_ )):
                if re.search( pattern, arr_[i] ):
                    arr_[i] = summInString( arr_[i] )
            return arr_

        summ = ""
        def getSumm( str_ ):
            """ Метод вызывает методы выше что-бы посчитать результат. 
                TODO Рекурсивно, значение в глобал
            """ 
            global summ
            arr_ = splitGroup( str_ )
            if len( arr_ ) > 1:
                arr_ = summGroup( arr_ )
                getSumm( joinGroup( arr_ ))
            else:
                summ = str( summInString( arr_[0] ))
            return summ

        summ = getSumm( self.cleanCommand )
        return summ

if __name__ == '__main__':

    app = QApplication( sys.argv )
    ex = Window()
    sys.exit( app.exec_() )
