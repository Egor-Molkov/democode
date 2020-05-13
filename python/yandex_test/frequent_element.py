import collections
import numpy.random as rand
import time

#import cProfile, pstats, io, tracemalloc

start = time.time()

# Размерность входных данных ( элемента, кол-во элементов )
int_rand, size = 300000, 1000000
arr_ = rand.randint( 0, int_rand, size, dtype="int32"  )

print( 'Время генерации массива, сек.', time.time()-start )
print( 'В массиве {1} элементов, элемент от 0 до {0}'.format( int_rand, size ), arr_ )

point = time.time()
'''
worki = cProfile.Profile()
worki.enable()
tracemalloc.start()
'''
col_ = collections.Counter( arr_ )
keys, vals = [], []
for key, val in col_.most_common():
    keys.append( key )
    vals.append( val )
    if val < vals[0]:
        keys.pop()
        vals.pop()
        break

print( 'Максимальные ключи, встречается:', keys, vals )
key = sorted(keys, reverse=True)[0]
val = vals[0]
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
print( 'Время подсчета ключей, сек.', time.time()-point )
print( 'Наиболее распрастранненый, максимальный ключ, встречаеться раз', key, val )
