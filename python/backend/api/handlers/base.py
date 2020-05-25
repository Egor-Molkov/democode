
from aiohttp.web_urldispatcher import View

# Список всех возможных политик
AUTH_ALL = ['admin', 'user255', 'user']

class BaseView(View):
    # Точки по дефолту закрыты
    ALLOW_ANONYMOUS = False
    # По дефолту доступ только у админа
    AUTH = ['admin']
    # Точка входа в хандлер
    URL_PATH: str
    
    # Внедрение зависимости ( пул к базе )
    @property
    def mysql(self):
        return self.request.app['mysql']
