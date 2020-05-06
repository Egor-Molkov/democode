import collections
import numpy.random as rand
import time

#import cProfile, pstats, io, tracemalloc

start = time.time()

int_rand, size = 1000000, 1000

arr_start = rand.randint( 0, int_rand, size, dtype="int32"  )
arr_end = rand.randint( 0, int_rand, size, dtype="int32"  )

for item in range( size ):
    if arr_start[item] > arr_end[item]:
        arr_start[item], arr_end[item] = arr_end[item], arr_start[item]

print( 'Время генерации массива, сек.', time.time()-start )

point = time.time()
'''
worki = cProfile.Profile()
tracemalloc.start()
worki.enable()
'''
avr_min = sum( arr_start )/size
avr_max = sum( arr_end )/size
avr_session = int( avr_min + avr_max / 2 )

print( 'Время подсчета окна, сек.', time.time()-point )

point = time.time()

session = dict()
for item in range( size ):
    if arr_start[item] <= avr_session and arr_end[item] >= avr_session:
        session[item] = ( arr_start[item], arr_end[item] )
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
print( 'Время распаковки ключей, сек.', time.time()-point )
print( 'Болше всего сессий было открыто:', avr_session )
print( 'Колличество одновременно открытых сессий:', len( session ))
print( 'Десять последних:' )
for item in list(session)[-10:]:
    print( item, session[item] )
