import collections
import time
import json
"""
import cProfile, pstats, io, tracemalloc

worki = cProfile.Profile()
tracemalloc.start()
worki.enable()"""

str_ = '{ \
"a":{},"b":{},"c":[{},{"f":1},{}],"i":[[],[],[]], \
"d":"vh","e":true,"f":1,"g":{"h":[]},"t":{"j":[],"l":[]}, \
"a1":{},"b1":{},"c1":[{},{"f1":1},{}],"i1":[[],[],[]], \
"d1":"vh","e1":true,"f1":1,"g1":{"h1":[]},"t1":{"j1":[],"l1":[]}, \
"a2":{},"b2":{},"c2":[{},{"f2":1},{}],"i2":[[],[],[]], \
"d2":"vh","e2":true,"f2":1,"g2":{"h2":[]},"t2":{"j2":[],"l2":[]}, \
"a13":{},"b13":{},"c13":[{},{"f13":1},{}],"i13":[[],[],[]], \
"d13":"vh","e13":true,"f13":1,"g13":{"h13":[]},"t13":{"j13":[],"l13":[]}, \
"a6":{},"b6":{},"c6":[{},{"f6":1},{}],"i6":[[],[],[]], \
"d6":"vh","e6":true,"f6":1,"g6":{"h6":[]},"t6":{"j6":[],"l6":[]}, \
"a17":{},"b17":{},"c17":[{},{"f17":1},{}],"i17":[[],[],[]], \
"d17":"vh","e17":true,"f17":1,"g17":{"h17":[]},"t17":{"j17":[],"l17":[]}, \
"a28":{},"b28":{},"c28":[{},{"f28":1},{}],"i28":[[],[],[]], \
"d28":"vh","e28":true,"f28":1,"g28":{"h28":[]},"t28":{"j28":[],"l28":[]}, \
"a139":{},"b139":{},"c139":[{},{"f139":1},{}],"i139":[[],[],[]], \
"d139":"vh","e139":true,"f139":1,"g139":{"h139":[]},"t139":{"j99":[],"l139":[]} \
}'

#str_ = '[[[],[[[],[[],[]]],[]]],[[[[[[[[[[[[]]]]]]]]]]]],[[[[[[[[[[[[[]]]]]]]]]]]],[]]]'

print( 'Строка json:', str_ )

start = time.time()

obj_ = json.loads(str_)
array_ = 0
object_ = 0
count_ = collections.Counter()

def countLavel( obj_ ):
    global count_
    key = time.time()
    for item in obj_:
        if item.__class__ == {}.__class__ or \
        item.__class__ == [].__class__:
            if len(item) > 0:
                count_[key] +=1
                countLavel( item )
            else:
                count_[key] -=1
        elif obj_[item].__class__ == {}.__class__ or \
        obj_[item].__class__ == [].__class__:
            if len(obj_[item]) > 0:
                count_[key] +=1
                countLavel( obj_[item] )
            else:
                count_[key] -=1   

countLavel( obj_ )
count_ += collections.Counter()
valueCount = len(count_)+1

def cutObj( obj_ ):
    global object_
    global array_
    if obj_.__class__ == [].__class__:
        this = list.copy(obj_)
    elif obj_.__class__ == {}.__class__:
        this = dict.copy(obj_)
    else: 
        return obj_
    for item in this:
        if item.__class__ == {}.__class__:
            if len(item) == 0:
                obj_.remove(item)
                object_ += 1
            else:
                cutObj( item )
        elif item.__class__ == [].__class__:
            if len(item) == 0:
                obj_.remove(item)
                array_ += 1
            else:
                cutObj( item )            
        elif obj_[item].__class__ == {}.__class__:
            if len(obj_[item])==0:
                del obj_[item]
                object_ += 1
            else:
                cutObj( obj_[item] )
        elif obj_[item].__class__ == [].__class__:
            if len(obj_[item]) == 0:
                del obj_[item]
                array_ += 1
            else:
                cutObj( obj_[item] )
    return obj_

for _ in range( valueCount ):
    obj_ = cutObj( obj_ )

str_ = json.dumps( obj_ )

print( 'Строка json после обработки:', str_ )
print( 'Время обработки строки, сек.', time.time()-start )
print( 'Максимальная вложенность:', valueCount )
print( 'Массивов удалено:', array_ )
print( 'Объектов удалено', object_ )

"""
worki.disable()

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
print( top_stats[0] )

streami = io.StringIO()
stat = pstats.Stats(worki, stream=streami).sort_stats('cumulative')
stat.print_stats()
print(streami.getvalue())"""
