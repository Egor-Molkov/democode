
from aiohttp.web_app import Application
from aiomysql.sa import create_engine

async def setup_mysql(app, args):

    conf = args["db_"]
    conf_jwt = args["jwt"]

    # Выделяет пулл соединений с базой
    engine = await create_engine(user=conf["user"], db=conf["db"],
                                 host=conf["host"], password=conf["password"])

    # Внедряем пулл и ключи jwt в хандлеры
    app['mysql'] = engine
    app['jwt'] = conf_jwt

    async with engine.acquire() as conn:
        # если откликается, то подключились
        try:
            await conn.execute("SELECT 1")
        except Exception:
            raise Exception

    print('Connected to database: {0}'.format( conf["db"] ))

    try:
        yield
    finally:
        engine.close()
        await engine.wait_closed()
        print('\nDisconnected from database: {0}'.format( conf["db"] ))
