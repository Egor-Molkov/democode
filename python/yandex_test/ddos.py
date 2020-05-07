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

ddos = collections.Counter()
page = int( n / m )
end = n%m

# Прочитает 2 страницы записей, первую страницу поместит 
# в словарь left_block_counter (ключь-ip, значение-счетчик) что-бы не считать два раза,
# также поместит основную страницу в список left_block, что-бы знать порядок ключей
# вторую страницу поместит в список right_block по ключу - ip, 
# фактически считываем массив по одной странице, 
# но итоговая сложность вычисления O( ~1.5n ), по памяти page*3
def readPage( seek, ends=0 ):
    start = seek
    end = start + m

    start_r = end
    end_r = end + m

    right_block, end_block = 0, 0

    left_block = list( arr_[ start:end ])
    left_block_counter = collections.Counter( left_block )

    if  page - seek * m != 0 and ends == 0:
        right_block = list( arr_[ start_r:end_r ])
    if ends > 0:
        end_e = end + ends
        right_block = list( arr_[ start_r:end_e ])

    return left_block_counter, left_block, right_block

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
def detector( left_block_counter, left_block, right_block ):
    #print('iter', left_block, right_block)
    for item, val in left_block_counter.items():
        if val >= k:
            ddos.update( [item] )
            
    for index in range( len( right_block )):
        key = right_block[ index ]
        val = left_block_counter.get( key, 0 )
        # Подозрение на ддос ключ из правого блока + счетчик
        if val >= k-1:
            # Посчитаем ключи в срезе
            temp_counter = collections.Counter( left_block[ index: ])
            temp_counter.update( [key] )
            # И правда ддос
            for item, val in temp_counter.items():
                if val >= k:
                    ddos.update( [item] )

'''
worki = cProfile.Profile()
tracemalloc.start()
worki.enable()
'''
for i in range( page ):
    seek = i * m
    ends = 0
    if i == page: ends = end
    lc, l, r = readPage( seek, ends )
    detector( lc, l, r )
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
