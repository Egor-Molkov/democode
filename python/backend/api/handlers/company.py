
from aiohttp.web_exceptions import HTTPBadRequest, HTTPNotFound
from .base import BaseView
from aiohttp.web import json_response as Json

from models.company import *
from tools import result_to_list
from sqlalchemy.sql import select, insert, update, delete

from marshmallow import ValidationError

class CompanyList(BaseView):
    '''
    Вернет список компаний или компанию по id.
    '''
    AUTH = ['admin', 'user']
    URL_PATH = r'company/list'

    async def post(self):
        try:
            # Получим параметры запроса
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        # Интересует id 
        id = data.get("id")
        # Возьмем соединение из пулла
        async with self.mysql.acquire() as conn:
            # Строим запрос
            if id == None:
                s = select([ companys_table ])
            else:
                s = select([ companys_table ]).where( 
                    companys_table.c.id == int( id ))
            # Собираем sql билдером
            result = await conn.execute( s )
            # Получаем строки из базы 
            rows = await result.fetchall()
            # Собираем лист объектов из данных
            items = await result_to_list( rows )
            # Root элемент
            body = { 'items': items }
        # Вернем в json 
        return Json( body )


class CompanyUpdate(BaseView):
    '''
    Создаст или обновит по ид компанию.
    '''
    AUTH = ['user255']
    URL_PATH = r'company/update'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        try:
            company_ = Company().load( data )
            id_ = company_.get("id")
            name_ = company_.get("name")
        except ValidationError as err:
            raise err

        async with self.mysql.acquire() as conn:
            trans = await conn.begin()
            try:
                if id_ == None:
                    #print("Create", company_)
                    i = companys_table.insert().values( name=name_ )
                    result = await conn.execute( i )
                    item = result.rowcount
                else:
                    #print("Update", company_)
                    u = companys_table.update().where(
                        companys_table.c.id == id_ ).values( name=name_ )
                    result = await conn.execute( u )
                    item = result.rowcount
            except Exception:
                await trans.rollback()
                raise HTTPBadRequest( reason="Error transition" )
            else:
                await trans.commit()
            if item == 0:
                return HTTPBadRequest( reason="Not modified" )
            body = { 'items': company_ }
        
        return Json( body, status=201 )


class CompanyDelete(BaseView):
    '''
    Удалит компанию.
    '''
    AUTH = ['admin']
    URL_PATH = r'company/delete'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        try:
            company_ = Company().load( data )
            id_ = data.get("id")
            name_ = data.get("name")
        except ValidationError as err:
            raise err

        async with self.mysql.acquire() as conn:
            trans = await conn.begin()
            try:
                if id_ == None:
                    raise HTTPBadRequest( reason="No param company.id")
                else:
                    d = companys_table.delete().where(
                        companys_table.c.id == id_ )
                    result = await conn.execute( d )
                    item = result.rowcount
            except Exception:
                await trans.rollback()
                raise HTTPBadRequest(reason="Error transition")
            else:
                await trans.commit()
            if item == 0:
                return HTTPBadRequest( reason="Not modified" )
            body = { 'items': company_ }                    

        return Json( body, status=201 )
