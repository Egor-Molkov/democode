
import time
"""
import cProfile, pstats, io, tracemalloc

worki = cProfile.Profile()
tracemalloc.start()
worki.enable()"""

n, k = 1000, [0,1,2]

start = time.time()

def generate():
    z = []
    for x in range(n):
        if x<3: z.append( k[x] )
        else: z.append( z[x-1]+z[x-3] )
    return z

z = generate()

print( 'Время генерации массива, сек.', time.time()-start )
print( 'Три последних члена:')
for i in range( 3, 0, -1 ):
    print()
    print( z[ len( z ) - i ])

"""
worki.disable()

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
print( top_stats[0] )

streami = io.StringIO()
stat = pstats.Stats(worki, stream=streami).sort_stats('cumulative')
stat.print_stats()
print(streami.getvalue())"""