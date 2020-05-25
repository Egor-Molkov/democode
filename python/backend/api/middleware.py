# Base, 200(ok), 204(options), 400(bad), 401(unauth), 403(noforb), 404(notfound), 500(serv)
from aiohttp.web_exceptions import (
    HTTPException, HTTPOk, HTTPNoContent, HTTPBadRequest, HTTPUnauthorized,
    HTTPForbidden, HTTPNotFound, HTTPInternalServerError
)
from marshmallow import ValidationError

from aiohttp.web_middlewares import middleware
from aiohttp.web_request import Request
from aiohttp.web_urldispatcher import View
from aiohttp.web import json_response as Json

from jwt import JWT, jwk_from_dict
from datetime import datetime


@middleware
async def error_middleware( Request, handler ):
    try:
        # Нет ошибок, далее
        return await handler( Request )
    except HTTPException as ex:
        # Ошибки, протокола
        message = ex.reason
        status_ = ex.status
    except ValidationError as ex:
        # Ошибки, валидации входных данных
        message = ex.messages
        status_ = 400
    except Exception:
        # Какая-то беда, все упало
        #return await handler( Request ) #Developer
        message = "Server error"
        status_ = 500

    return Json({ 'error': message }, status=status_, headers={
                    'Access-Control-Allow-Origin': Request.headers.get('Origin') })


@middleware
async def auth_middleware( Request, handler ):
    # CORS предзапрос, ответим 204 слушаю и повинуюсь
    if Request.headers.get( 'Access-Control-Request-Headers' ):
        return HTTPNoContent( headers={
                "Access-Control-Allow-Origin":
                    Request.headers.get( 'Origin' ), 
                "Access-Control-Allow-Method":
                    Request.headers.get( 'Access-Control-Request-Method' ),
                "Access-Control-Allow-Headers":
                    Request.headers.get( 'Access-Control-Request-Headers' )
                })
    # Нет обработчика, кинем исключение 404 ( неправильный метод, вернет автоматом 405)
    if handler.__class__ != View.__class__:
        raise HTTPNotFound()
    # Обработчик открыт для всех 200
    if handler.ALLOW_ANONYMOUS:
        return await handler( Request )
    # В запросе нет заголовка авторизации 403
    if Request.headers.get( 'AUTHORIZATION' ) is None:
        raise HTTPForbidden()
    else:
        # Пробуем получить политики доступа пользователя
        politics = await _unpack_token( Request )
        # Проверяем есть-ли доступ к хандлеру
        for access in handler.AUTH:
            # Переберем список моих политик
            for role in politics:
                 # Доступ есть
                if role == access:
                    # При выходе из закрытого хандлера, добавим оригин
                    response = await handler( Request )
                    response.headers.add(
                        'Access-Control-Allow-Origin',
                        Request.headers.get( 'Origin' ))
                    return response
        # Доступа нет
        raise HTTPForbidden()


async def _unpack_token( Request ):
    try:
        JWT_ = JWT()
        SIGN_KEY = jwk_from_dict({ 'kty': 'oct', 'k': Request.app['jwt']['key'] })
        # Пробуем разобрать, что нам там прислали
        token_ = Request.headers.get('AUTHORIZATION').replace('Bearer ', '').strip(' ')
        claims = JWT_.decode( token_, SIGN_KEY )
        now_ = datetime.now()
        exp_ = datetime.fromisoformat( claims["date"] )
        ip_ = str( Request.remote )
        # Время истекло
        if  exp_ <= now_:
            # Намек на рефреш
            raise HTTPUnauthorized()
        # Какой-то левый ip
        if ip_ != claims["ip"]:
            raise HTTPForbidden()
        else:
            # Вернем список политик
            return claims["politics"]
    except HTTPUnauthorized:
        raise HTTPUnauthorized( reason="The access token provided is expired" )
    except HTTPForbidden:
        raise HTTPForbidden( reason="Invalid_token" )
    except Exception:
        raise HTTPForbidden( reason="Invalid_token" )
