
import re
import time

#import cProfile, pstats, io, tracemalloc

str_ = "HGTA15BA5CDE3MNMNO3Y20LKREU4X100E200U300MNG4D34A30N67L90F700ACK"

start = time.time()
'''
worki = cProfile.Profile()
tracemalloc.start()
worki.enable()
'''
pattern = re.compile( "([A-Z]?[0-9]*)" )
arr_ = re.split( pattern, str_ )
pattern = re.compile( "^[A-Z]?$" )

print( '\nСтрока RLE:', str_ )

decode_arr = []
for item in arr_:
    if item == "": continue
    if pattern.search( item ): decode_arr.append( item )
    else: 
        char_ = item[:1]
        int_ = int( item[1:] )
        str_ = char_ * int_
        decode_arr.extend( str_ )
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
print( 'Длинна строки:', len( decode_arr ))
print( 'Время декодирования, сек.', time.time()-start )
print( 'Раскодированная строка:', ''.join( decode_arr[:20] ), '...', ''.join( decode_arr[-20:] ))
