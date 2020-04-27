
import sys

from decimal import Decimal as dec
from calc_core import (cleanCommand, cutBracets, getSumm)
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
        # Переменная для хранения актуальной командной строки
        self.textSelf = ""

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
        
        # Отлавливаем ввод скобок с клавиатуры
        self.command.textChanged.connect( self.textChangedEvent )
        # Отлавливаем окончание ввода (ентер)
        self.command.returnPressed.connect( self.textReturnEvent )

        self.setGeometry( 300,  150, 400, 400 )
        self.setWindowTitle( 'Простой калькулятор' )
        self.show()

    def keyPressEvent(self, e):
        """Метод вызывается для перехвата события нажатия ESC. """

        if e.key() == Qt.Key_Escape:
            self.close()

    def textChangedEvent( self, str_ ):
        """Метод вызывается для перехвата события ввода '(' и ')'. """

        char = str_.replace( self.textSelf, "" )
        if char == '(' or char == ')':
            # Предупреждение, если не закрыты скобки
            cleanBracetsInCommand = cutBracets( self.command.text() )
            if cleanBracetsInCommand != '':
                self.error_.setText( 'Внимание: Не закрыты скобки' )
            else:
                self.error_.setText( '' )
        self.textSelf = str_

    def textReturnEvent( self ):
        """Метод вызывается для перехвата события нажатия Enter. """

        # Что от нас хотят 
        self.cleanCommand = cleanCommand( self.command.text() )
        # Посчитаем
        result = getSumm( self.cleanCommand )
        if result == 'Error 1/0':
            self.error_.setText( "Деление на ноль" )
        if result == 'Error inf':
            self.error_.setText( "Неизвестное исключение" )
        history = self.history.toPlainText()
        if history != "":
            history += " ... "
        # Добавим в историю
        history += self.cleanCommand + " = " + result
        self.history.setHtml( history )
        # Прокрутим историю в конец
        cursor = self.history.textCursor()
        cursor.setPosition( len( history ) )
        self.history.setTextCursor( cursor )
        return
    

    def buttonClicked( self ):
        """Метод вызывается для обработки нажитий кнопок. """

        # Сбросим ошибки
        self.error_.setText( "" )

        # Что нажали
        char = self.sender().text()

        # Посчитать и добавить результат в память
        if char == "m+":
            self.cleanCommand = cleanCommand( self.command.text() )
            result = getSumm( self.cleanCommand )
            memory = dec( self.memory.text() )
            try:
                memory += dec( result )
            except:
                pass
            self.memory.setText( str( memory ))
            return

        # Посчитать и вычесть результат из памяти
        if char == "m-":
            self.cleanCommand = cleanCommand( self.command.text() )
            result = getSumm( self.cleanCommand )
            memory = dec( self.memory.text() )
            try:
                memory -= dec( result )
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

        # Удалить последний символ из командной строки
        if char == "<-":
            command = self.command.text()
            command = command[ :-1 ]
            self.command.setText( command )
            return

        # Очистить командную строку
        if char == "<--":
            self.command.setText( "" )
            return

        # Посчитать результат
        if char == "=":
            self.textReturnEvent()
            return

        # Иначе добавить символ к командной строке
        command = self.command.text()
        command += char
        self.command.setText( command )

        # Предупреждение, если не закрыты скобки
        cleanBracetsInCommand = cutBracets( self.command.text() )
        if cleanBracetsInCommand != '':
            self.error_.setText( "Внимание: Не закрыты скобки" )


if __name__ == '__main__':
    app = QApplication( sys.argv )
    ex = Window()
    sys.exit( app.exec_() )
