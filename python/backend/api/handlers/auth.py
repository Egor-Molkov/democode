
from aiohttp.web_exceptions import ( 
    HTTPException, HTTPBadRequest, HTTPForbidden, HTTPNotFound
)
from .base import BaseView, AUTH_ALL
from aiohttp.web import json_response as Json

from models.account import *
from sqlalchemy.sql import select

from jwt import JWT, jwk_from_dict
from datetime import datetime, timedelta


class AuthTest(BaseView):
    '''
    Тестирование авторизации, если пользователь авторизован,
    для любой из политик, вернет User authorize( 200 )
    '''
    AUTH = AUTH_ALL
    URL_PATH = r'auth/test'

    async def get(self):
        return Json({ 'data': 'User authorize' })


class AuthLogin(BaseView):
    '''
    Bearer авторизация, если пользователь с login найден, и
    совпадает password, вернет json web token, временем актуальности
    указанном в настройках 
    '''
    ALLOW_ANONYMOUS = True
    URL_PATH = r'auth/login'

    async def post(self):
        try:
            data = await self.request.json()
        except Exception:
            raise HTTPBadRequest( reason="Bad param" )
        try:
            data["politics"] = "guest"
            account_ = Account().load( data )
            login_ = account_.get("login")
            password_ = account_.get("password")
        except ValidationError as err:
            raise err

        async with self.mysql.acquire() as conn:
            s = select([ accounts_table ]).where(
                        accounts_table.c.login == login_ )
            result = await conn.execute(s)
            items = await result.fetchall()
            if len( items ) == 0:
                raise HTTPForbidden( reason="Invalid username or password" )
            else:
                if items[0].password != password_:
                    raise HTTPForbidden( reason="Invalid username or password" )
                else:
                    token = await _get_token( self, items[0] )
        
        return Json({ 'data': token }, status=201, headers={
                'Access-Control-Allow-Origin': self.request.headers.get('Origin') })


class AuthRefresh(BaseView):
    '''
    Обновление токена, если время жизни токена истекло,
    можно попробовать обновить токен, сделав запрос в этот хандлер,
    он получит claims из Bearer, если ip в токене и ip из запрооса
    не совпадают, то пока-пока, потом заново ищет в базе пользователя
    по данным из claims, если все ок, отправляет новый токен
    '''
    ALLOW_ANONYMOUS = True
    URL_PATH = r'auth/refresh'

    async def get(self):
        claims = await _unpack_token( self )
        if claims["ip"] != str( self.request.remote ):
            raise HTTPForbidden()
        async with self.mysql.acquire() as conn:
            s = select([ accounts_table ]).where(
                        accounts_table.c.login == claims["login"] )
            result = await conn.execute(s)
            items = await result.fetchall()
            if len( items ) == 0:
                raise HTTPNotFound( reason="Invalid username or password" )
            else:
                if items[0].password != claims["password"]:
                    raise HTTPNotFound( reason="Invalid username or password" )
                else:
                    token = await _get_token( self, items[0] )
        
        return Json({ 'data': token }, status=201, headers={
                'Access-Control-Allow-Origin': self.request.headers.get('Origin') })


async def _get_token( self, items ):
    '''
    Соберет claims объект, и зашифрует его ключем
    '''
    politics = str( items.politics ).split(', ')
    delta_ = timedelta( minutes = self.request.app['jwt']['access_in_minute'] )
    access_time = datetime.now() + delta_
    claims = {
                "login": items.login,
                "password": items.password,
                "politics": politics,
                "date": str( access_time ),
                "ip": str( self.request.remote )}
    JWT_ = JWT()
    SIGN_KEY = jwk_from_dict({ 'kty': 'oct', 'k': self.request.app['jwt']['key'] })
    token = JWT_.encode( claims, SIGN_KEY )
    
    return token

async def _unpack_token( self ):
    '''
    Распакует Bearer строку в объект claims, используя ключ
    '''
    try:
        JWT_ = JWT()
        SIGN_KEY = jwk_from_dict({ 'kty': 'oct', 'k': self.request.app['jwt']['key'] })
        token_ = self.request.headers.get('AUTHORIZATION')
        token_ = token_.replace('Bearer ', '').strip(' ')
        claims = JWT_.decode( token_, SIGN_KEY )
        return claims
    except Exception:
        raise HTTPForbidden( reason="Invalid_token" )