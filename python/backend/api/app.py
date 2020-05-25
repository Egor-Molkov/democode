
from functools import partial

from aiohttp.web_app import Application
from handlers import HANDLERS
from middleware import error_middleware, auth_middleware
from mysql import setup_mysql

def create_app( args ):
    PREFIX = args["api"]["prefix"]

    # регестрируем петли
    app = Application( middlewares = [ error_middleware, auth_middleware ])
    # стартуем базу
    app.cleanup_ctx.append( partial( setup_mysql, args = args ))

    # регестрируем обраотчики
    for handler in HANDLERS:
        print('Registering handler {0}'.format( PREFIX + handler.URL_PATH ))
        app.router.add_route( '*', PREFIX + handler.URL_PATH, handler )

    return app
