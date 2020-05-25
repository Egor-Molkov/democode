
from aiohttp.web import run_app
from aiomisc import bind_socket
from app import create_app
from json import loads

def main():
    # Конфигурация сервера
    with open("./config.json", "r") as f:
            conf_serv = f.read()
    # Конфигурация токена
    with open("./jwt.json", "r") as f:
            conf_jwt = f.read()
            
    config = loads( conf_serv )
    config.update( loads( conf_jwt ) )
    socket = config["server"]

    sock = bind_socket( address=socket["address"], port=socket["port"], proto_name=socket["port"] )

    app = create_app( config )
    run_app( app, sock = sock )

if __name__ == '__main__':
    main()
