
from aiohttp.web_exceptions import HTTPBadRequest, HTTPNotFound
from .base import BaseView
from aiohttp.web import json_response as Json

from models import *
from tools import result_to_list
from sqlalchemy.sql import select, and_

from marshmallow import ValidationError


class ProductList(BaseView):
    '''
    Вернет список продуктов или продукт по id.
    '''
    AUTH = ['admin', 'user']
    URL_PATH = r'product/list'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        id = data.get("id")

        async with self.mysql.acquire() as conn:
            if id == None:
                s = select([ products_table.c.id, 
                             products_table.c.name,
                             products_table.c.companyid, 
                             companys_table.c.name.label('company')
                    ]).where( companys_table.c.id == products_table.c.companyid )
            else:
                s = select([ products_table.c.id, 
                             products_table.c.name,
                             products_table.c.companyid, 
                             companys_table.c.name.label('company')
                    ]).where( 
                        and_ (
                            products_table.c.id == int( id ),
                            companys_table.c.id == products_table.c.companyid )
                    )
            result = await conn.execute(s)
            rows = await result.fetchall()
            items = await result_to_list( rows )
            body = {'items': items }
        
        return Json( body )


class ProductUpdate(BaseView):
    '''
    Создаст или обновит по ид продукт.
    '''
    AUTH = ['user255']
    URL_PATH = r'product/update'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        try:
            product_ = Product().load( data)
            id_ = data.get("id")
            name_ = data.get("name")
            companyid_ = data.get("companyid")            
        except ValidationError as err:
            raise err

        async with self.mysql.acquire() as conn:
            trans = await conn.begin()
            try:
                if id_ == None:
                    #print("Create", product_)
                    i = products_table.insert().values( name=name_, companyid=companyid_ )
                    result = await conn.execute( i )
                    item = result.rowcount
                else:
                    #print("Update", product_)
                    u = products_table.update().where(
                        products_table.c.id == id_ ).values( 
                            name=name_, companyid=companyid_ )
                    result = await conn.execute( u )
                    item = result.rowcount
            except Exception:
                await trans.rollback()
                raise HTTPBadRequest(reason="Error transition")
            else:
                await trans.commit()
            if item == 0:
                return HTTPBadRequest( reason="Not modified" )
            body = { 'items': product_ }
        
        return Json( body, status=201 )


class ProductDelete(BaseView):
    '''
    Удалит продукт.
    '''
    AUTH = ['admin']
    URL_PATH = r'product/delete'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        try:
            product_ = Product().load( data )
            id_ = data.get("id")
            name_ = data.get("name")
            companyid_ = data.get("companyid")            
        except ValidationError as err:
            raise err

        async with self.mysql.acquire() as conn:
            trans = await conn.begin()
            try:
                if id_ == None:
                    raise HTTPBadRequest( reason="No param product.id")
                else:
                    d = products_table.delete().where(
                        products_table.c.id == id_ )
                    result = await conn.execute( d )
                    item = result.rowcount
            except Exception:
                await trans.rollback()
                raise HTTPBadRequest(reason="Error transition")
            else:
                await trans.commit()
            if item == 0:
                return HTTPBadRequest( reason="Not modified" )
            body = { 'items': product_ }                    

        return Json( body, status=201 )
