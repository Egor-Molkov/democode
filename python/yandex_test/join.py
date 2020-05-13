import collections
import time
import random

#import cProfile, pstats, io, tracemalloc

start = time.time()

T = collections.namedtuple('T', ['a', 'b', 'c'])

t1 = dict()
t2 = dict()

for i in range( 15000 ):
    rnda = random.randrange( 0, 1000, 1 )
    rnda = random.choice(( -1, -1, -1, rnda )) 
    rndb = random.randrange( 0, 1000, 1 )
    rndb = random.choice(( -1, -1, -1, rndb ))
    column = T( a = rnda, b = rndb, c = -1 )
    t1[i] = column

t1_len = len(t1)

for i in range( 10000 ):
    rnda = random.randrange( 0, 1000, 1 )
    rnda = random.choice(( -1, -1, -1, rnda ))
    rndc = random.randrange( 0, 1000, 1 )
    rndc = random.choice(( -1, -1, -1, rndc ))
    column = T( a = rnda, b = -1, c = rndc )
    t2[i+t1_len] = column

print( 'Время генерации массива, сек.', time.time()-start )

point = 0

def Join(t1, t2, metods='INNER'):
    global point
    point = time.time()

    t3 = collections.OrderedDict( t1 )
    t3.update( t2 )
    t3 = collections.OrderedDict( sorted( t3.items(), key=lambda acc: acc[1].a ))
    t3 = list( t3.values() )

    a1 = t3[0].a
    column, b, c = [], [], []
    for i in range(len( t3 )):
        a = t3[i].a
        if a == -1: continue
        if a > a1:
            val = [ a1, b, c ]
            a1 = a
            column.append( val )
            b, c = [], []
        b.append( t3[i].b )
        c.append( t3[i].c )

    xyz = []
    for line in column:
        for x in line[1]:
            for y in line[2]:
                if metods == 'INNER':
                    if x != -1 and y != -1:
                        xyz.append([line[0],x,y])
                if metods == 'LEFT':
                    if x != -1:
                        xyz.append([line[0],x,y])
                if metods == 'RIGHT':
                    if y != -1:
                        xyz.append([line[0],x,y])
                if metods == 'FULL':
                    if x != -1 or y != -1:
                        xyz.append([line[0],x,y])

    unic = set()
    for line in xyz:
        arr_ = []
        for item in line:
            arr_.append( str( item ))
        str_ = '$'.join( arr_ )
        unic.add( str_ )
    
    xyz = []
    for item in unic:
        xyz.append( item.split('$') )
    
    t3 = collections.OrderedDict()
    for i in range( len( xyz )):
        column = T( a = int( xyz[i][0] ), b = int( xyz[i][1] ), c = int( xyz[i][2] ))
        t3[i] = column
   
    return t3



'''
worki = cProfile.Profile()
worki.enable()
tracemalloc.start()
'''
t3 = Join( t1, t2 )
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
print( '\nВремя JOIN T1, T2, metods="INNER", сек.', time.time()-point )
print( 'Первые 10 записей, из {0}:'.format( len( t3 )))
t3 = collections.OrderedDict( sorted( t3.items(), key=lambda acc: acc[1].a ))
arr_ = list( t3.values() )
for i in range( 10 ):
    print( arr_[i] )



t3 = Join( t1, t2, metods='LEFT' )
print( '\nВремя JOIN T1, T2, metods="LEFT", сек.', time.time()-point )
print( 'Первые 10 записей, из {0}:'.format( len( t3 )))
t3 = collections.OrderedDict( sorted( t3.items(), key=lambda acc: acc[1].a ))
arr_ = list( t3.values() )
for i in range( 10 ):
    print( arr_[i] )



t3 = Join( t1, t2, metods='RIGHT' )
print( '\nВремя JOIN T1, T2, metods="RIGHT", сек.', time.time()-point )
print( 'Первые 10 записей, из {0}:'.format( len( t3 )))
t3 = collections.OrderedDict( sorted( t3.items(), key=lambda acc: acc[1].a ))
arr_ = list( t3.values() )
for i in range( 10 ):
    print( arr_[i] )



t3 = Join( t1, t2, metods='FULL' )
print( '\nВремя JOIN T1, T2, metods="FULL", сек.', time.time()-point )
print( 'Первые 10 записей, из {0}:'.format( len( t3 )))
t3 = collections.OrderedDict( sorted( t3.items(), key=lambda acc: acc[1].a ))
arr_ = list( t3.values() )
for i in range( 10 ):
    print( arr_[i] )
