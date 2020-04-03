from tkinter import *
from decimal import Decimal
import re
 
root = Tk()
root.title("Простой калькулятор на Python")
root.geometry("370x370")

frameTop = Frame(root, bg="#232323")
frameTop.pack(in_=root, side="top", expand=True, fill="both")

commandStr = StringVar()
commandStr.set("")

historyStr = StringVar()
historyStr.set("")

label1 = Label( textvariable=historyStr,
                padx="8",
                fg="#eee", 
                bg="#232323", 
                anchor="se", 
                font="Arial 13", 
                height="3")
label1.pack(in_=frameTop, expand=True, fill=BOTH)

label2 = Label( textvariable=commandStr,
                padx="8",
                fg="#eee", 
                bg="#232323", 
                anchor="e", 
                font="Arial 16", 
                height="1")
label2.pack(in_=frameTop, expand=True, fill=BOTH)

frameGrid = Frame(root, bg="#232323", padx="6", pady="8")
frameGrid.pack(in_=root, expand=True, fill=BOTH)

frameGrid.rowconfigure(0,  weight=1)
frameGrid.rowconfigure([1, 2, 3],  minsize=16)
frameGrid.columnconfigure(0, weight=1)
frameGrid.columnconfigure([1, 2, 3, 4], minsize=32)

textVar = ['0']
btnArr = ["1","2","3","<-","4","5","6","+","7","8","9","-","0",",","/","*"]
i = 0
for r in range(4):
    for c in range(4):
        text=btnArr[i]
        btn = Button(   text="{}".format(text), 
                        width=4,
                        font="Arial 11",
                        bg="#292b3c",
                        fg="#eee",
                        activebackground="#292b3c", 
                        activeforeground="#eee",
                        highlightcolor="#fff",
                        bd="1")

        btn.grid(   in_=frameGrid, 
                    row=r+1, 
                    column=c+1, 
                    ipadx=10, 
                    ipady=6, 
                    padx=4, 
                    pady=4, 
                    sticky='se')
        i+=1

btn = Button(   text="=", 
                width=37,
                font="Arial 11",
                bg="#292b3c",
                fg="#eee",
                activebackground="#292b3c", 
                activeforeground="#eee",
                highlightcolor="#fff",
                bd="1")

btn.grid(   in_=frameGrid, 
            row=5, 
            column=1, 
            columnspan=4,
            ipadx=10, 
            ipady=6, 
            padx=4, 
            pady=4, 
            sticky='se')

def click_button(event):
    textVar.append(event.widget['text'])

    if event.widget['text'] == "<-":
        textVar.clear()
        textVar.append('0')

    if event.widget['text'] == "=":
        pattern = re.compile("[0-9,=]")
        operation = "".join(textVar)
        operation = re.sub(pattern, " ", operation)
        operation = operation.split()

        pattern = re.compile("[-+/*]")
        operand = "".join(textVar)
        operand = operand.replace("=", "")
        operand = operand.replace(",", ".")
        operand = re.sub(pattern, "|", operand)
        operand = operand.split("|")

        print('operation -', operation)
        print('operand -', operand)

        stek = []
        i = 0
        stek.append(operand[i])
        for item in operation:
            stek.append(item)
            stek.append(operand[i+1])
            i+=1
        
        print('stek -', stek)

        try:
            def summation(one, two):
                return Decimal(one) + Decimal(two)
            def subtraction(one, two):
                return Decimal(one) - Decimal(two)
            def multiplication(one, two):
                return Decimal(one) * Decimal(two)
            def subdivision(one, two):
                return Decimal(one) / Decimal(two)

            w = 0
            acc = Decimal(operand[0])
            for item in operation:
                if item == "+":
                    continue
                elif item == "-":
                    continue
                elif item == "*":
                    i = stek.index("*")
                    if stek[i+1] == "": continue
                    acc = multiplication(stek[i-1], stek[i+1])
                    stek[i] = acc
                    stek.pop(i+1)
                    stek.pop(i-1)
                    print('stek -', stek)
                elif item == "/":
                    i = stek.index("/")
                    if stek[i+1] == "": continue
                    acc = subdivision(stek[i-1], stek[i+1])
                    stek[i] = acc
                    stek.pop(i+1)
                    stek.pop(i-1)
                    print('stek -', stek)
                else:
                    acc = " ? :)"
                    break
                w+=1

            w = 0
            for item in operation:
                if item == "+":
                    i = stek.index("+")
                    if stek[i+1] == "": continue
                    acc = summation(stek[i-1], stek[i+1])
                    stek[i] = acc
                    stek.pop(i+1)
                    stek.pop(i-1)
                    print('stek -', stek)
                elif item == "-":
                    i = stek.index("-")
                    if stek[i+1] == "": continue
                    acc = subtraction(stek[i-1], stek[i+1])
                    stek[i] = acc
                    stek.pop(i+1)
                    stek.pop(i-1)
                    print('stek -', stek)
                elif item == "*":
                    continue
                elif item == "/":
                    continue
                else:
                    acc = " ? :)"
                    break
                w+=1

        except ZeroDivisionError:
            textVar.clear()
            acc="Попытка деления числа на ноль"
        except Exception as e:
            textVar.clear()
            acc="Неизвесное исключение"

        textVar.append(" ")
        textVar.append(str(acc))

        string = "".join(textVar)
        string = string.replace("0","",1)
        commandStr.set(string)
        
        textVar.clear()
        textVar.append('0')

        history = historyStr.get()
        historyStr.set(history + "\n" + string)

        return

    string = "".join(textVar)
    string = string.replace("0","",1)
    commandStr.set(string)


root.bind_class('Button', '<1>', click_button)

root.resizable(False, False)
root.mainloop()