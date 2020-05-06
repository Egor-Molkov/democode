import collections
import numpy.random as rand
import time

#import cProfile, pstats, io, tracemalloc

start = time.time()

# Размерность входных данных ( элемента, кол-во элементов )
int_rand, size = 300000, 1000000
arr_ = rand.randint( 0, int_rand, size, dtype="int32"  )

print( 'Время генерации массива, сек.', time.time()-start )

point = time.time()
'''
worki = cProfile.Profile()
worki.enable()
tracemalloc.start()
'''
col_ = collections.Counter()
for int_ in arr_:
    col_[int_] += 1
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

print( 'В массиве {1} элементов, элемент от 0 до {0}'.format( int_rand, size ), arr_ )
print( 'Наименее распрастранненый ключ, встречаеться раз', col_.most_common()[:-1-1:-1])
print( 'Наиболее распрастранненый ключ, встречаеться раз', col_.most_common(1) )
