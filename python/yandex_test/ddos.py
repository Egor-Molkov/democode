import collections
import numpy.random as rand
import time

#import cProfile, pstats, io, tracemalloc

start = time.time()

# Размерность входных данных ( всего ip, глубина обнаружения, активность )
n, m, k = 1000000, 1000, 5
ip_base = 9
ip = ip_base**4 # Ограничу диапазон: 0.0.0.0 - 8.8.8.8
arr_ = rand.randint( 0, ip, n, dtype="int32" ) # ip4: 256^4

print( 'Время генерации массива, сек.', time.time()-start )

point = time.time()

ddos = dict()
page = int( n / m )
end = n%m

# Прочитает 2 страницы записей, первую страницу поместит 
# в словарь left_block (ключь-ip, значение-счетчик) что-бы не считать два раза,
# также поместит основную страницу в список left_block_arr, что-бы знать порядок ключей
# вторую страницу поместит в список right_block по ключу - ip, 
# если страницы кончились, поместит оставшиеся записи 
# в список end_block по ключу - ip
# фактически считываем массив по одной странице, 
# но итоговая сложность вычисления O( 2n ), по памяти page*3
def readPage( seek, ends=0 ):
    left_block = dict()
    left_block_arr = list()
    right_block = list()
    end_block = list()
    for item in range( m ):
        left_block_arr.append( arr_[ seek + item ])
        if left_block.get( arr_[ seek + item ]) == None:
            left_block[ arr_[ seek + item ]] = 0
        else:
            left_block[ arr_[ seek + item ]] += 1
        if  page - seek * m != 0 and ends == 0:
            right_block.append( arr_[ seek + m + item ])
    if ends > 0:
        for item in range( ends ):
            right_block.append( arr_[ seek + m + item ])
        end_block = collections.Counter( right_block )
    return left_block, left_block_arr, right_block, end_block

# Проверит нет ли атаки в основном словаре, если есть добавит в словарь обнаруженных
# Возьмет ip из второго списка и проверит не переполниться ли в первом, если добавить
# к первому, в конце проверим также не влезшие в страницу записи 
# например данно:
# страница - 3 элемента ( это глубина обнаружения ), если 2 упоминания, то ddos
# {0.0.0.0:1, 0.0.0.1:0} - основной словарь 
# ( на самом деле дамп: [ 0.0.0.0, 0.0.0.0, 0.0.0.1] )
# [ 0.0.0.4, 0.0.0.1, 0.0.0.3 ] - дополнительный список
# 0.0.0.0 - 2 упоминания в основном словаре (запомним как ddos с этим ip)
# 0.0.0.1 - 1 из основного, 1 из списка, 2 упоминания на глубину 3 элемента
# (т.е тоже ddos, запомним и этот ip)
def detector( left_block, left_block_arr, right_block, end_block ):
    for item, val in left_block.items():
        if val >= k - 1:
            if ddos.get( item ) == None:
                ddos[ item ] = 1
            else:
                ddos[ item ] += 1
    for i in range( len( right_block )):
        key = right_block[ i ]
        val = left_block.get( item )
        if val != None and val >= k - 2:
            left_block_arr = left_block_arr[ i+1: ]
            left_block_arr.append( key )
            counter = collections.Counter( left_block_arr )
            keys, val = counter.most_common(1)[0]
            if val >= k:
                if ddos.get( key ) == None:
                    ddos[ key ] = 1
                else:
                    ddos[ key ] += 1
    if len( end_block ) > 0:
        for key, val in end_block.items():
            if val >= k - 1:
                if ddos.get( key ) == None:
                    ddos[ key ] = 1
                else:
                    ddos[ key ] += 1

'''
worki = cProfile.Profile()
tracemalloc.start()
worki.enable()
'''
for i in range( page - 1 ):
    seek = i * m
    ends = 0
    l, la, r, c = readPage( seek, ends )
    detector( l, la, r, c ) 
    #print('page', i, 'seek', seek)
if end > 0:
    seek = ( page - 1 ) * m
    l, la, r, c = readPage( seek, end )
    detector( l, la, r, c )
    #print('seek', seek, 'end', end)
'''
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno', True)
for stat in top_stats[:5]:
    print(stat)
worki.disable()
streami = io.StringIO()
stat = pstats.Stats(worki, stream=streami).sort_stats('cumulative')
stat.print_stats()
print(streami.getvalue())
'''
print( 'Время обработки, сек.', time.time()-point )
print( 'Детектированны атаки:' )
for key in ddos:
    a = int(key/(ip_base**3))
    b = int((key-a*ip_base**3)/ip_base**2)
    c = int((key-a*ip_base**3-b*ip_base**2)/ip_base)
    d = key%ip_base
    print( 'ip: {0}.{1}.{2}.{3}'.format(a,b,c,d), 'попыток:', ddos[key] )

print( 'Всего зафиксировано:', sum(ddos.values()))
