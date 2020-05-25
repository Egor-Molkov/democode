
async def result_to_list( resultProxy ):
    '''
    Вместо payload, переберет resultProxy в список объектов,
    который затем можно сериализовать обычным json.dumps
    '''
    items = list()
    if len( resultProxy ) == 0:
        return items
    for row in resultProxy:
        item = dict()
        for key, val in row.items():
            item[ key ] = val
        items.append( item )
    return items